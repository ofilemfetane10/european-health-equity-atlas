import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  countries,
  healthcareMetrics,
  eheiScores,
  syncStatus,
  type InsertHealthcareMetrics,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Healthcare data queries
export async function getCountries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(countries);
}

export async function getCountryById(countryId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(countries).where(eq(countries.id, countryId)).limit(1);
  return result[0];
}

export async function getHealthcareMetrics(countryId: number, year: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(healthcareMetrics)
    .where(and(eq(healthcareMetrics.countryId, countryId), eq(healthcareMetrics.year, year)))
    .limit(1);
  return result[0];
}

export async function getAllMetricsForYear(year: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(healthcareMetrics)
    .innerJoin(countries, eq(healthcareMetrics.countryId, countries.id))
    .where(eq(healthcareMetrics.year, year));
}

export async function getEheiScore(year: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(eheiScores).where(eq(eheiScores.year, year)).limit(1);
  return result[0];
}

// --- WHO-grade: sync status + upserts ---

export async function getAllSyncStatus() {
  const dbi = await getDb();
  if (!dbi) return [];
  return dbi.select().from(syncStatus);
}

export async function upsertSyncStatus(input: {
  source: string;
  status: "ok" | "failed" | "never";
  lastAttemptAt?: Date;
  lastSuccessAt?: Date;
  latestYearLoaded?: number;
  details?: string | null;
}) {
  const dbi = await getDb();
  if (!dbi) return;

  await dbi
    .insert(syncStatus)
    .values({
      source: input.source,
      status: input.status,
      lastAttemptAt: input.lastAttemptAt ?? null,
      lastSuccessAt: input.lastSuccessAt ?? null,
      latestYearLoaded: input.latestYearLoaded ?? null,
      details: input.details ?? null,
    })
    .onDuplicateKeyUpdate({
      set: {
        status: input.status,
        lastAttemptAt: input.lastAttemptAt ?? null,
        lastSuccessAt: input.lastSuccessAt ?? null,
        latestYearLoaded: input.latestYearLoaded ?? null,
        details: input.details ?? null,
      },
    });
}

export async function upsertHealthcareMetricsRow(row: InsertHealthcareMetrics) {
  const dbi = await getDb();
  if (!dbi) return;

  // Note: add a UNIQUE KEY (countryId, year) in your DB for true idempotent upserts.
  // Drizzle migrations included in README.
  await dbi
    .insert(healthcareMetrics)
    .values(row)
    .onDuplicateKeyUpdate({
      set: {
        physicianDensity: row.physicianDensity ?? null,
        hospitalBeds: row.hospitalBeds ?? null,
        lifeExpectancy: row.lifeExpectancy ?? null,
        lifeExpectancyDecimal: row.lifeExpectancyDecimal ?? null,
        healthyLifeYears: row.healthyLifeYears ?? null,
        covidRecoveryYears: row.covidRecoveryYears ?? null,
        generalPractitioners: row.generalPractitioners ?? null,
        medicalSpecialists: row.medicalSpecialists ?? null,
        surgicalSpecialists: row.surgicalSpecialists ?? null,
      },
    });
}
 


