# European Health Equity Atlas  
*A policy-grade analytics platform for measuring structural healthcare inequality across Europe*

## Overview

The European Health Equity Atlas is a full-stack analytics platform designed to quantify structural disparities across European healthcare systems using publicly available statistical data.

At its core is the **European Healthcare Equity Index (EHEI)** — a composite index built from Eurostat indicators that captures inequality across:

- Physician distribution  
- Infrastructure capacity  
- Health outcomes  
- COVID recovery performance  

The platform transforms raw statistical infrastructure into a structured, interpretable equity framework suitable for research, policy exploration, and advanced analytics portfolios.

## The European Healthcare Equity Index (EHEI)

The EHEI is a weighted composite index (0–100 scale) designed to measure relative inequality across European healthcare systems.

**Higher scores indicate greater structural disparity.**

### Index Components

| Component                  | Weight |
|---------------------------|--------|
| Physician Distribution     | 40%    |
| Infrastructure Capacity    | 30%    |
| Health Outcomes            | 20%    |
| COVID Recovery             | 10%    |

All indicators are normalized prior to aggregation.  
Weighting logic and transformation methodology are documented in the platform’s Methodology section.


## Platform Capabilities

The Atlas provides:

- Composite equity scoring (EHEI)
- Country-level breakdowns
- Side-by-side country comparison
- Multi-dimensional radar visualization
- Outcome-to-expenditure efficiency metrics
- Trend analysis over time
- Public data refresh status
- Transparent methodology documentation

The objective is not only visualization, but structured transparency.


## Data Sources

Primary data source:

- **Eurostat Dissemination API**

Indicator selection, dataset codes, and parameter slices are documented within the synchronization module.

The system records:

- Last refresh attempt
- Last successful refresh
- Year loaded
- Sync status
- Source provenance

This ensures reproducibility and refresh traceability.

## Architecture

The project follows a modular full-stack architecture:

- **Frontend:** React + TypeScript
- **Backend:** Node.js API layer
- **Database:** Structured metric storage with idempotent upserts
- **Sync Module:** Eurostat ingestion pipeline

Data synchronization is designed to be scheduled via cron jobs or CI pipelines.

---

## Environment Variables

Create a `.env` file (or configure via deployment platform):

