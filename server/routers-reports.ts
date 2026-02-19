import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { generateEHEIReportData, generateComparisonReportData, generateEHEIReportHTML, generateComparisonReportHTML } from "./reports";
import { calculateEHEI } from "./ehei";

/**
 * Report generation procedures
 */
export const reportsRouter = router({
  /**
   * Generate EHEI analysis report
   */
  generateEHEIReport: publicProcedure
    .input(
      z.object({
        countryIds: z.array(z.number()).optional(),
        year: z.number().optional(),
      })
    )
    .query(({ input }) => {
      // Mock data - in production, fetch from database
      const mockMetrics = [
        {
          countryName: "Austria",
          physicianDensity: 551,
          hospitalBeds: 480,
          lifeExpectancy: 81.5,
          healthyLifeYears: 63,
          covidRecoveryYears: 2.1,
        },
        {
          countryName: "Belgium",
          physicianDensity: 475,
          hospitalBeds: 450,
          lifeExpectancy: 81.8,
          healthyLifeYears: 62,
          covidRecoveryYears: 2.0,
        },
        {
          countryName: "Spain",
          physicianDensity: 480,
          hospitalBeds: 410,
          lifeExpectancy: 83.1,
          healthyLifeYears: 64,
          covidRecoveryYears: 2.2,
        },
        {
          countryName: "Italy",
          physicianDensity: 535,
          hospitalBeds: 420,
          lifeExpectancy: 83.2,
          healthyLifeYears: 64,
          covidRecoveryYears: 2.3,
        },
        {
          countryName: "Germany",
          physicianDensity: 466,
          hospitalBeds: 520,
          lifeExpectancy: 81.3,
          healthyLifeYears: 62,
          covidRecoveryYears: 2.0,
        },
        {
          countryName: "France",
          physicianDensity: 410,
          hospitalBeds: 450,
          lifeExpectancy: 82.9,
          healthyLifeYears: 64,
          covidRecoveryYears: 2.1,
        },
        {
          countryName: "Greece",
          physicianDensity: 618,
          hospitalBeds: 480,
          lifeExpectancy: 81.8,
          healthyLifeYears: 62,
          covidRecoveryYears: 2.4,
        },
        {
          countryName: "Sweden",
          physicianDensity: 510,
          hospitalBeds: 400,
          lifeExpectancy: 82.8,
          healthyLifeYears: 63,
          covidRecoveryYears: 1.8,
        },
        {
          countryName: "Netherlands",
          physicianDensity: 490,
          hospitalBeds: 410,
          lifeExpectancy: 82.2,
          healthyLifeYears: 63,
          covidRecoveryYears: 1.9,
        },
        {
          countryName: "Poland",
          physicianDensity: 350,
          hospitalBeds: 520,
          lifeExpectancy: 78.9,
          healthyLifeYears: 59,
          covidRecoveryYears: 2.8,
        },
      ];

      const reportData = generateEHEIReportData(
        mockMetrics as any,
        "European Healthcare Equity Index Analysis",
        input.year || 2024
      );

      const htmlContent = generateEHEIReportHTML(reportData);

      return {
        success: true,
        reportData,
        htmlContent,
        downloadUrl: `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`,
      };
    }),

  /**
   * Generate country comparison report
   */
  generateComparisonReport: publicProcedure
    .input(
      z.object({
        countryNames: z.array(z.string()),
      })
    )
    .query(({ input }) => {
      // Mock data - in production, fetch from database
      const allCountries = [
        {
          countryName: "Austria",
          physicianDensity: 551,
          hospitalBeds: 480,
          lifeExpectancy: 81.5,
          healthyLifeYears: 63,
          covidRecoveryYears: 2.1,
        },
        {
          countryName: "Belgium",
          physicianDensity: 475,
          hospitalBeds: 450,
          lifeExpectancy: 81.8,
          healthyLifeYears: 62,
          covidRecoveryYears: 2.0,
        },
        {
          countryName: "Spain",
          physicianDensity: 480,
          hospitalBeds: 410,
          lifeExpectancy: 83.1,
          healthyLifeYears: 64,
          covidRecoveryYears: 2.2,
        },
        {
          countryName: "Italy",
          physicianDensity: 535,
          hospitalBeds: 420,
          lifeExpectancy: 83.2,
          healthyLifeYears: 64,
          covidRecoveryYears: 2.3,
        },
        {
          countryName: "Germany",
          physicianDensity: 466,
          hospitalBeds: 520,
          lifeExpectancy: 81.3,
          healthyLifeYears: 62,
          covidRecoveryYears: 2.0,
        },
        {
          countryName: "France",
          physicianDensity: 410,
          hospitalBeds: 450,
          lifeExpectancy: 82.9,
          healthyLifeYears: 64,
          covidRecoveryYears: 2.1,
        },
      ];

      const selectedCountries = allCountries.filter(c =>
        input.countryNames.includes(c.countryName)
      );

      if (selectedCountries.length === 0) {
        return {
          success: false,
          error: "No countries found",
        };
      }

      const reportData = generateComparisonReportData(
        selectedCountries as any,
        "Healthcare System Comparison Report"
      );

      const htmlContent = generateComparisonReportHTML(reportData);

      return {
        success: true,
        reportData,
        htmlContent,
        downloadUrl: `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`,
      };
    }),
});
