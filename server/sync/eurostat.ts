/*
  Eurostat sync (WHO-grade)
  -------------------------
  - Pulls selected indicators from Eurostat dissemination API
  - Upserts into healthcare_metrics
  - Updates sync_status (last attempt/success, latest year, details)

  IMPORTANT:
  - Eurostat datasets have multiple dimensions. We pin a minimal selection for each indicator.
  - If you want to change the exact slice (e.g., total beds vs curative beds), edit EUROSTAT_SERIES.

  Docs:
  - https://ec.europa.eu/eurostat/web/json-and-unicode-web-services
  - API base used here: https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/
*/

import * as db from "../db";

type Series = {
  /** dataset code */
  dataset: string;
  /** fixed dimension selections */
  params: Record<string, string>;
  /** maps a returned numeric value onto our DB row */
  apply: (val: number, row: Record<string, any>) => void;
};

const EUROSTAT_BASE =
  process.env.EUROSTAT_BASE_URL ??
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data";

// WHO-grade: explicit, editable indicator definitions.
// Verified dataset codes (Eurostat databrowser):
// - demo_mlexpec (life expectancy) citeturn0search2
// - hlth_hlye (healthy life years) citeturn0search3
// - hlth_rs_physcat (physicians by category) citeturn1search3
// - hlth_rs_bds1 (hospital beds by function/type of care) citeturn0search1
// - tps00044 (practising physicians) citeturn1search0
// Note: we keep selections conservative (TOTAL / BOTH SEXES / AT BIRTH).

const EUROSTAT_SERIES: Series[] = [
  // Practising physicians (per 100k)
  {
    dataset: "tps00044",
    params: {
      unit: "P_HTHAB", // per hundred thousand inhabitants
    },
    apply: (val, row) => {
      row.physicianDensity = Math.round(val);
    },
  },

  // Physicians by category (GPs, medical specialists, surgical specialists)
  {
    dataset: "hlth_rs_physcat",
    params: {
      unit: "P_HTHAB",
      med_spec: "GEN_PRAC",
    },
    apply: (val, row) => {
      row.generalPractitioners = Math.round(val);
    },
  },
  {
    dataset: "hlth_rs_physcat",
    params: {
      unit: "P_HTHAB",
      med_spec: "MED_SPEC",
    },
    apply: (val, row) => {
      row.medicalSpecialists = Math.round(val);
    },
  },
  {
    dataset: "hlth_rs_physcat",
    params: {
      unit: "P_HTHAB",
      med_spec: "SURG_SPEC",
    },
    apply: (val, row) => {
      row.surgicalSpecialists = Math.round(val);
    },
  },

  // Hospital beds per 100k.
  // NOTE: hlth_rs_bds1 has extra dimensions (care, unit, etc). We default to TOTAL beds.
  // If your results look off, adjust the params below in one place.
  {
    dataset: "hlth_rs_bds1",
    params: {
      unit: "P_HTHAB",
      // Common Eurostat dim labels include: "care" and/or "facility".
      // We use the safest total selection if present; the fetch helper will try without if not supported.
      care: "TOTAL",
    },
    apply: (val, row) => {
      row.hospitalBeds = Math.round(val);
    },
  },

  // Life expectancy at birth (years). demo_mlexpec is in years; store integer + decimal.
  {
    dataset: "demo_mlexpec",
    params: {
      age: "Y_LT0",
      sex: "T",
      unit: "Y", // years
    },
    apply: (val, row) => {
      const intPart = Math.floor(val);
      const dec = Math.round((val - intPart) * 10);
      row.lifeExpectancy = intPart;
      row.lifeExpectancyDecimal = dec;
    },
  },

  // Healthy life years at birth.
  {
    dataset: "hlth_hlye",
    params: {
      sex: "T",
      unit: "Y",
      age: "Y_LT0",
    },
    apply: (val, row) => {
      row.healthyLifeYears = Math.round(val);
    },
  },
];

async function eurostatFetch(
  dataset: string,
  query: Record<string, string | number>,
): Promise<any> {
  const url = new URL(`${EUROSTAT_BASE}/${encodeURIComponent(dataset)}`);
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, String(v));

  const res = await fetch(url.toString(), {
    headers: {
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Eurostat ${dataset} HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }

  return res.json();
}

function pickValueForGeo(payload: any, geo: string): number | null {
  // Eurostat API returns:
  // - dimension.geo.category.index mapping geo -> position
  // - value object with numeric keys (flat index) -> number
  // We assume query pins *all* dims except geo/time, so each geo has at most one value.

  const geoDim = payload?.dimension?.geo;
  const timeDim = payload?.dimension?.time;
  const values = payload?.value;
  if (!geoDim || !values) return null;

  const geoIndex = geoDim?.category?.index?.[geo];
  if (geoIndex === undefined) return null;

  // If time is still a dimension, flattening is: (geoIndex * timeSize) + timeIndex
  const timeSize = timeDim?.category?.index ? Object.keys(timeDim.category.index).length : 1;

  // Prefer latest time index if multiple returned.
  let bestTimeIndex = 0;
  if (timeDim?.category?.index) {
    const times = Object.entries(timeDim.category.index) as Array<[string, number]>;
    // pick max numeric index (usually latest)
    bestTimeIndex = times.reduce((m, [, idx]) => (idx > m ? idx : m), 0);
  }

  const flatKey = String(geoIndex * timeSize + bestTimeIndex);
  const val = values?.[flatKey];
  if (val === undefined || val === null) return null;
  const num = Number(val);
  return Number.isFinite(num) ? num : null;
}

async function fetchSeriesForYear(series: Series, year: number) {
  // We request all geos at once to reduce calls.
  // Some datasets require explicit geo list; Eurostat supports geo=... repeated.
  // We'll omit geo so it returns all available.

  const query: Record<string, string | number> = {
    time: year,
    ...series.params,
  };

  // Some datasets don't accept certain params (e.g. unit) depending on dataset.
  // WHO-grade robustness: try progressively removing optional params.
  const paramEntries = Object.entries(query);

  const attempts: Array<Record<string, string | number>> = [];
  attempts.push(query);

  // drop known tricky keys if the first attempt fails
  const droppable = ["care", "unit"];
  let current = { ...query };
  for (const key of droppable) {
    if (key in current) {
      const next = { ...current };
      delete next[key];
      attempts.push(next);
      current = next;
    }
  }

  let lastErr: any = null;
  for (const q of attempts) {
    try {
      return await eurostatFetch(series.dataset, q);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export async function syncEurostatYear(year: number) {
  const started = new Date();
  await db.upsertSyncStatus({
    source: "eurostat",
    status: "never",
    lastAttemptAt: started,
    details: "sync started",
  });

  try {
    const countries = await db.getCountries();
    if (!countries.length) {
      throw new Error(
        "No countries found. Seed the countries table before syncing (see README WHO-grade section).",
      );
    }

    // build row map keyed by countryId
    const rows = new Map<number, Record<string, any>>();
    for (const c of countries) {
      rows.set(c.id, {
        countryId: c.id,
        year,
      });
    }

    for (const series of EUROSTAT_SERIES) {
      const payload = await fetchSeriesForYear(series, year);

      for (const c of countries) {
        const v = pickValueForGeo(payload, c.code);
        if (v === null) continue;

        const row = rows.get(c.id)!;
        series.apply(v, row);
      }
    }

    // upsert rows
    for (const row of rows.values()) {
      await db.upsertHealthcareMetricsRow(row as any);
    }

    await db.upsertSyncStatus({
      source: "eurostat",
      status: "ok",
      lastAttemptAt: started,
      lastSuccessAt: new Date(),
      latestYearLoaded: year,
      details: "sync succeeded",
    });

    return {
      ok: true,
      source: "eurostat",
      year,
      countries: countries.length,
    } as const;
  } catch (err: any) {
    await db.upsertSyncStatus({
      source: "eurostat",
      status: "failed",
      lastAttemptAt: started,
      details: String(err?.message ?? err),
    });

    return {
      ok: false,
      source: "eurostat",
      year,
      error: String(err?.message ?? err),
    } as const;
  }
}
