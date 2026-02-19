import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Healthcare countries and metrics
export const countries = mysqlTable("countries", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 3 }).notNull().unique(), // ISO 3166-1 alpha-3
  name: varchar("name", { length: 100 }).notNull().unique(),
  region: varchar("region", { length: 50 }).notNull(), // Nordic, Mediterranean, Eastern European, Other
  population: int("population"), // 2024 estimate
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Country = typeof countries.$inferSelect;
export type InsertCountry = typeof countries.$inferInsert;

// Healthcare metrics per country
export const healthcareMetrics = mysqlTable("healthcare_metrics", {
  id: int("id").autoincrement().primaryKey(),
  countryId: int("countryId").notNull().references(() => countries.id),
  year: int("year").notNull(), // 2023, 2024, 2025
  physicianDensity: int("physicianDensity"), // per 100,000 inhabitants
  hospitalBeds: int("hospitalBeds"), // per 100,000 inhabitants
  lifeExpectancy: int("lifeExpectancy"), // in years (stored as integer, e.g., 81 for 81.7)
  lifeExpectancyDecimal: int("lifeExpectancyDecimal"), // decimal part (e.g., 7 for .7)
  healthyLifeYears: int("healthyLifeYears"), // in years
  covidRecoveryYears: int("covidRecoveryYears"), // years gained 2021-2024
  generalPractitioners: int("generalPractitioners"), // per 100,000
  medicalSpecialists: int("medicalSpecialists"), // per 100,000
  surgicalSpecialists: int("surgicalSpecialists"), // per 100,000
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HealthcareMetrics = typeof healthcareMetrics.$inferSelect;
export type InsertHealthcareMetrics = typeof healthcareMetrics.$inferInsert;

// EHEI (European Healthcare Equity Index) scores
export const eheiScores = mysqlTable("ehei_scores", {
  id: int("id").autoincrement().primaryKey(),
  year: int("year").notNull(),
  overallScore: int("overallScore"), // 0-100
  physicianInequality: int("physicianInequality"), // 0-100 (40% weight)
  infrastructureInequality: int("infrastructureInequality"), // 0-100 (30% weight)
  outcomeInequality: int("outcomeInequality"), // 0-100 (20% weight)
  recoveryInequality: int("recoveryInequality"), // 0-100 (10% weight)
  trend: int("trend"), // +/- points from previous year
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EheiScore = typeof eheiScores.$inferSelect;
export type InsertEheiScore = typeof eheiScores.$inferInsert;

/**
 * Sync status table
 * WHO-grade requirement: data provenance + refresh transparency.
 */
export const syncStatus = mysqlTable("sync_status", {
  id: int("id").autoincrement().primaryKey(),
  source: varchar("source", { length: 32 }).notNull().unique(), // e.g. "eurostat"
  lastAttemptAt: timestamp("lastAttemptAt"),
  lastSuccessAt: timestamp("lastSuccessAt"),
  status: mysqlEnum("status", ["ok", "failed", "never"]).default("never").notNull(),
  latestYearLoaded: int("latestYearLoaded"),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SyncStatus = typeof syncStatus.$inferSelect;
export type InsertSyncStatus = typeof syncStatus.$inferInsert;