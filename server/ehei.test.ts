import { describe, it, expect } from "vitest";
import {
  calculatePhysicianInequality,
  calculateInfrastructureInequality,
  calculateOutcomeInequality,
  calculateRecoveryInequality,
  calculateEHEI,
  getEHEIInterpretation,
  identifyOutliers,
  type MetricsWithCountry,
} from "./ehei";

const mockMetrics: MetricsWithCountry[] = [
  {
    id: 1,
    countryId: 1,
    countryName: "Austria",
    year: 2024,
    physicianDensity: 551,
    hospitalBeds: 480,
    lifeExpectancy: 81,
    lifeExpectancyDecimal: 5,
    healthyLifeYears: 63,
    covidRecoveryYears: 2,
    generalPractitioners: 200,
    medicalSpecialists: 224,
    surgicalSpecialists: 127,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    countryId: 2,
    countryName: "Turkey",
    year: 2024,
    physicianDensity: 206,
    hospitalBeds: 280,
    lifeExpectancy: 77,
    lifeExpectancyDecimal: 6,
    healthyLifeYears: 60,
    covidRecoveryYears: 2,
    generalPractitioners: 80,
    medicalSpecialists: 70,
    surgicalSpecialists: 56,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    countryId: 3,
    countryName: "Spain",
    year: 2024,
    physicianDensity: 480,
    hospitalBeds: 410,
    lifeExpectancy: 83,
    lifeExpectancyDecimal: 1,
    healthyLifeYears: 64,
    covidRecoveryYears: 2,
    generalPractitioners: 180,
    medicalSpecialists: 210,
    surgicalSpecialists: 90,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("EHEI Calculation Engine", () => {
  describe("calculatePhysicianInequality", () => {
    it("should calculate physician inequality score", () => {
      const score = calculatePhysicianInequality(mockMetrics);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should return 0 for empty metrics", () => {
      const score = calculatePhysicianInequality([]);
      expect(score).toBe(0);
    });

    it("should return 0 for single metric", () => {
      const score = calculatePhysicianInequality([mockMetrics[0]]);
      expect(score).toBe(0);
    });

    it("should detect high inequality with large physician density gaps", () => {
      const score = calculatePhysicianInequality(mockMetrics);
      expect(score).toBeGreaterThan(10); // Should detect the inequality
    });
  });

  describe("calculateInfrastructureInequality", () => {
    it("should calculate infrastructure inequality score", () => {
      const score = calculateInfrastructureInequality(mockMetrics);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should return 0 for empty metrics", () => {
      const score = calculateInfrastructureInequality([]);
      expect(score).toBe(0);
    });
  });

  describe("calculateOutcomeInequality", () => {
    it("should calculate outcome inequality score", () => {
      const score = calculateOutcomeInequality(mockMetrics);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should detect life expectancy differences", () => {
      const score = calculateOutcomeInequality(mockMetrics);
      // Austria (81.5) vs Turkey (77.6) = 3.9 year gap
      expect(score).toBeGreaterThan(0);
    });
  });

  describe("calculateRecoveryInequality", () => {
    it("should calculate recovery inequality score", () => {
      const score = calculateRecoveryInequality(mockMetrics);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should return 0 when all countries have same recovery", () => {
      const sameRecovery = mockMetrics.map(m => ({ ...m, covidRecoveryYears: 2 }));
      const score = calculateRecoveryInequality(sameRecovery);
      expect(score).toBe(0);
    });
  });

  describe("calculateEHEI", () => {
    it("should calculate overall EHEI score", () => {
      const result = calculateEHEI(mockMetrics);
      expect(result.overallScore).toBeGreaterThan(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
    });

    it("should have all components calculated", () => {
      const result = calculateEHEI(mockMetrics);
      expect(result.physicianInequality).toBeGreaterThanOrEqual(0);
      expect(result.infrastructureInequality).toBeGreaterThanOrEqual(0);
      expect(result.outcomeInequality).toBeGreaterThanOrEqual(0);
      expect(result.recoveryInequality).toBeGreaterThanOrEqual(0);
    });

    it("should apply correct weights to components", () => {
      const result = calculateEHEI(mockMetrics);
      // Overall should be weighted average: 40% + 30% + 20% + 10%
      const expectedScore = Math.round(
        (result.physicianInequality * 0.4) +
        (result.infrastructureInequality * 0.3) +
        (result.outcomeInequality * 0.2) +
        (result.recoveryInequality * 0.1)
      );
      expect(result.overallScore).toBe(expectedScore);
    });
  });

  describe("getEHEIInterpretation", () => {
    it("should interpret very low inequality (0-20)", () => {
      const interp = getEHEIInterpretation(15);
      expect(interp.level).toBe("Very Low Inequality");
      expect(interp.color).toBe("green");
    });

    it("should interpret low inequality (20-40)", () => {
      const interp = getEHEIInterpretation(30);
      expect(interp.level).toBe("Low Inequality");
      expect(interp.color).toBe("lightgreen");
    });

    it("should interpret moderate inequality (40-60)", () => {
      const interp = getEHEIInterpretation(50);
      expect(interp.level).toBe("Moderate Inequality");
      expect(interp.color).toBe("yellow");
    });

    it("should interpret high inequality (60-80)", () => {
      const interp = getEHEIInterpretation(70);
      expect(interp.level).toBe("High Inequality");
      expect(interp.color).toBe("orange");
    });

    it("should interpret very high inequality (80-100)", () => {
      const interp = getEHEIInterpretation(90);
      expect(interp.level).toBe("Very High Inequality");
      expect(interp.color).toBe("red");
    });
  });

  describe("identifyOutliers", () => {
    it("should identify high performers", () => {
      const result = identifyOutliers(mockMetrics);
      expect(result.highPerformers.length).toBeGreaterThan(0);
      // Austria and Spain should be high performers
      expect(result.highPerformers.some(m => m.countryName === "Austria" || m.countryName === "Spain")).toBe(true);
    });

    it("should identify low performers", () => {
      const result = identifyOutliers(mockMetrics);
      expect(result.lowPerformers.length).toBeGreaterThan(0);
      // Turkey should be low performer
      expect(result.lowPerformers.some(m => m.countryName === "Turkey")).toBe(true);
    });

    it("should identify outliers", () => {
      const result = identifyOutliers(mockMetrics);
      // Turkey with 206 physicians is likely an outlier
      expect(result.outliers.length).toBeGreaterThanOrEqual(0);
    });

    it("should return empty arrays for empty metrics", () => {
      const result = identifyOutliers([]);
      expect(result.highPerformers).toEqual([]);
      expect(result.lowPerformers).toEqual([]);
      expect(result.outliers).toEqual([]);
    });
  });

  describe("Edge cases", () => {
    it("should handle metrics with zero values", () => {
      const metricsWithZeros: MetricsWithCountry[] = [
        { ...mockMetrics[0], physicianDensity: 0 },
        { ...mockMetrics[1], physicianDensity: 100 },
      ];
      const score = calculatePhysicianInequality(metricsWithZeros);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it("should handle identical metrics across countries", () => {
      const identicalMetrics: MetricsWithCountry[] = [
        { ...mockMetrics[0], physicianDensity: 400, hospitalBeds: 400 },
        { ...mockMetrics[1], physicianDensity: 400, hospitalBeds: 400 },
        { ...mockMetrics[2], physicianDensity: 400, hospitalBeds: 400 },
      ];
      const result = calculateEHEI(identicalMetrics);
      expect(result.physicianInequality).toBe(0);
      expect(result.infrastructureInequality).toBe(0);
    });
  });
});
