import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, publicProcedure } from "./_core/trpc";
import * as db from "./db";
import { reportsRouter } from "./routers-reports";

/**
 * WHO-grade API surface:
 * - Public analytics queries
 * - Explicit data provenance + last refresh info
 * - Optional sync endpoints (token protected)
 */

/** Token guard: if SYNC_TOKEN missing => sync disabled */
const syncTokenGuard = z
  .object({ token: z.string().min(8) })
  .refine(
    v => {
      const expected = process.env.SYNC_TOKEN;
      return Boolean(expected) && v.token === expected;
    },
    { message: "Sync not enabled or invalid token" },
  );

const eurostatSyncInput = z.object({
  token: z.string().min(8),
  year: z.number().int().min(1990).max(2100),
});

export const appRouter = router({
  healthcare: router({
    countries: publicProcedure.query(() => db.getCountries()),

    metrics: publicProcedure
      .input(z.object({ countryId: z.number(), year: z.number() }))
      .query(({ input }) => db.getHealthcareMetrics(input.countryId, input.year)),

    allMetricsForYear: publicProcedure
      .input(z.object({ year: z.number() }))
      .query(({ input }) => db.getAllMetricsForYear(input.year)),

    eheiScore: publicProcedure
      .input(z.object({ year: z.number() }))
      .query(({ input }) => db.getEheiScore(input.year)),

    /** WHO-grade: expose provenance + refresh status */
    syncStatus: publicProcedure.query(() => db.getAllSyncStatus()),
  }),

  /**
   * Optional sync endpoints.
   * These are token-protected and can be triggered by:
   * - GitHub Actions schedule
   * - cron job on your server
   */
  sync: router({
    eurostat: publicProcedure.input(eurostatSyncInput).mutation(async ({ input }) => {
      // Validate token (tRPC-friendly)
      const ok = syncTokenGuard.safeParse({ token: input.token }).success;
      if (!ok) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Sync not enabled or invalid token",
        });
      }

      const { syncEurostatYear } = await import("./sync/eurostat");
      return syncEurostatYear(input.year);
    }),
  }),

  reports: reportsRouter,
});

export type AppRouter = typeof appRouter;
