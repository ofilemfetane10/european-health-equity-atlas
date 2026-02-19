# European Health Equity Atlas (WHO‑grade demo)

This project is a **public healthcare analytics suite** focused on Europe:
- **EHEI (European Healthcare Equity Index)** dashboards
- Country comparisons
- Reproducible reporting
- **WHO‑grade transparency**: clear provenance + refresh status + documented indicator slices

## What you removed (as requested)
- ✅ Healthcare “game/simulator” tables + UI (it was incomplete and causing build breakage)
- ✅ Anything “manus” in app logic (only harmless `pnpm-lock.yaml` mentions remain)

## Does the data update automatically?
**Not by itself.**

Right now, the UI will **show the last successful refresh** (or “—” if never synced).

To get regular updates, you must run the sync pipeline on a schedule (cron / GitHub Actions / server cron).

## How updates work (WHO‑grade)
### 1) Source + provenance
- `sync_status` table records `lastAttemptAt`, `lastSuccessAt`, `status`, `latestYearLoaded`, and a short `details` string.
- The dashboard calls `healthcare.syncStatus` and displays this publicly.

### 2) Refresh pipeline
A Eurostat sync module lives here:
- `server/sync/eurostat.ts`

It pulls selected indicators from Eurostat’s dissemination API (dataset codes are documented inline).

### 3) Triggering sync (recommended)
A simple REST endpoint is included for cron jobs:

**POST** `/api/sync/eurostat`
- Header: `x-sync-token: <SYNC_TOKEN>`
- Body: `{ "year": 2024 }`

Example:
```bash
curl -X POST "http://localhost:3000/api/sync/eurostat" \
  -H "Content-Type: application/json" \
  -H "x-sync-token: $SYNC_TOKEN" \
  -d '{"year": 2023}'
```

## Environment variables
Create `.env` (or set in your deployment platform):

```bash
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=healthcare

# Optional: change Eurostat base
EUROSTAT_BASE_URL=https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data

# Required for sync endpoints
SYNC_TOKEN=your-long-random-token
```

## Database notes (important)
The sync uses **idempotent upserts**, which require a **unique key** on `(countryId, year)`.

Run this once:

```sql
ALTER TABLE healthcare_metrics
  ADD UNIQUE KEY uk_metrics_country_year (countryId, year);

CREATE TABLE IF NOT EXISTS sync_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source VARCHAR(32) NOT NULL UNIQUE,
  lastAttemptAt TIMESTAMP NULL,
  lastSuccessAt TIMESTAMP NULL,
  status ENUM('ok','failed','never') NOT NULL DEFAULT 'never',
  latestYearLoaded INT NULL,
  details TEXT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Running locally
```bash
pnpm install
pnpm dev
```

Then open:
- `/` Home
- `/dashboard` Overview + provenance
- `/ehei` EHEI dashboard
- `/comparison` Country comparison
- `/methodology` Methodology

## WHO‑grade checklist (what this gives you)
- **Traceability**: dataset codes + parameter slices are in one place (`server/sync/eurostat.ts`).
- **Freshness visibility**: dashboard shows last refresh and failure reason.
- **Reproducible refresh**: one endpoint to re-run sync for a given year.
- **Extensible**: you can add more sources (WHO Gateway, OECD) as separate sync modules and record each in `sync_status`.

