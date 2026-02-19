/**
 * European Healthcare Equity Index (EHEI) Calculation Engine
 * 
 * The EHEI is a composite metric that quantifies healthcare access inequality
 * across European countries on a scale of 0-100, where:
 * - 0 = Perfect equality (all countries identical)
 * - 100 = Maximum inequality (huge gaps)
 * 
 * Components and weights:
 * - Physician distribution inequality: 40%
 * - Infrastructure inequality: 30%
 * - Outcome inequality: 20%
 * - Recovery inequality: 10%
 */

import type { HealthcareMetrics } from "../drizzle/schema";

export interface MetricsWithCountry extends HealthcareMetrics {
  countryName: string;
}

export interface InequalityMetrics {
  physicianInequality: number;
  infrastructureInequality: number;
  outcomeInequality: number;
  recoveryInequality: number;
  overallScore: number;
}

/**
 * Calculate coefficient of variation (standard deviation / mean)
 * Used as the basis for inequality measurement
 */
function calculateCoefficientOfVariation(values: number[]): number {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return 0;
  
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  return stdDev / mean;
}

/**
 * Normalize coefficient of variation to 0-100 scale
 * CV is typically 0-1 for our data, we scale to 0-100
 */
function normalizeToScore(cv: number): number {
  // Cap at 2.0 to avoid extreme outliers
  const capped = Math.min(cv, 2.0);
  return Math.round((capped / 2.0) * 100);
}

/**
 * Calculate physician distribution inequality
 * Based on physician density per 100,000 inhabitants
 */
export function calculatePhysicianInequality(metrics: MetricsWithCountry[]): number {
  const validMetrics = metrics.filter(m => m.physicianDensity && m.physicianDensity > 0);
  if (validMetrics.length < 2) return 0;
  
  const physicianDensities = validMetrics.map(m => m.physicianDensity!);
  const cv = calculateCoefficientOfVariation(physicianDensities);
  
  return normalizeToScore(cv);
}

/**
 * Calculate infrastructure inequality
 * Based on hospital beds per 100,000 inhabitants
 */
export function calculateInfrastructureInequality(metrics: MetricsWithCountry[]): number {
  const validMetrics = metrics.filter(m => m.hospitalBeds && m.hospitalBeds > 0);
  if (validMetrics.length < 2) return 0;
  
  const bedDensities = validMetrics.map(m => m.hospitalBeds!);
  const cv = calculateCoefficientOfVariation(bedDensities);
  
  return normalizeToScore(cv);
}

/**
 * Calculate outcome inequality
 * Based on life expectancy differences
 */
export function calculateOutcomeInequality(metrics: MetricsWithCountry[]): number {
  const validMetrics = metrics.filter(m => m.lifeExpectancy && m.lifeExpectancy > 0);
  if (validMetrics.length < 2) return 0;
  
  // Convert to decimal life expectancy for calculation
  const lifeExpectancies = validMetrics.map(m => {
    const base = m.lifeExpectancy || 0;
    const decimal = (m.lifeExpectancyDecimal || 0) / 10;
    return base + decimal;
  });
  
  const cv = calculateCoefficientOfVariation(lifeExpectancies);
  
  // Life expectancy is more stable, so we scale differently
  // A CV of 0.05 (5%) is considered high inequality for life expectancy
  return normalizeToScore(cv * 2);
}

/**
 * Calculate recovery inequality
 * Based on COVID recovery years (2021-2024)
 */
export function calculateRecoveryInequality(metrics: MetricsWithCountry[]): number {
  const validMetrics = metrics.filter(m => m.covidRecoveryYears && m.covidRecoveryYears > 0);
  if (validMetrics.length < 2) return 0;
  
  const recoveryYears = validMetrics.map(m => m.covidRecoveryYears!);
  const cv = calculateCoefficientOfVariation(recoveryYears);
  
  return normalizeToScore(cv);
}

/**
 * Calculate overall EHEI score
 * Weighted average of all inequality components
 */
export function calculateEHEI(metrics: MetricsWithCountry[]): InequalityMetrics {
  const physicianInequality = calculatePhysicianInequality(metrics);
  const infrastructureInequality = calculateInfrastructureInequality(metrics);
  const outcomeInequality = calculateOutcomeInequality(metrics);
  const recoveryInequality = calculateRecoveryInequality(metrics);
  
  // Weighted average: 40% + 30% + 20% + 10% = 100%
  const overallScore = Math.round(
    (physicianInequality * 0.4) +
    (infrastructureInequality * 0.3) +
    (outcomeInequality * 0.2) +
    (recoveryInequality * 0.1)
  );
  
  return {
    physicianInequality,
    infrastructureInequality,
    outcomeInequality,
    recoveryInequality,
    overallScore,
  };
}

/**
 * Get interpretation of EHEI score
 */
export function getEHEIInterpretation(score: number): {
  level: string;
  description: string;
  color: string;
} {
  if (score < 20) {
    return {
      level: "Very Low Inequality",
      description: "European healthcare systems are highly equitable with minimal disparities.",
      color: "green",
    };
  } else if (score < 40) {
    return {
      level: "Low Inequality",
      description: "Healthcare systems show good equity with manageable disparities.",
      color: "lightgreen",
    };
  } else if (score < 60) {
    return {
      level: "Moderate Inequality",
      description: "Healthcare systems show moderate disparities requiring policy attention.",
      color: "yellow",
    };
  } else if (score < 80) {
    return {
      level: "High Inequality",
      description: "Significant healthcare disparities exist across European countries.",
      color: "orange",
    };
  } else {
    return {
      level: "Very High Inequality",
      description: "Severe healthcare disparities require urgent policy intervention.",
      color: "red",
    };
  }
}

/**
 * Identify countries contributing most to inequality
 */
export function identifyOutliers(metrics: MetricsWithCountry[]): {
  highPerformers: MetricsWithCountry[];
  lowPerformers: MetricsWithCountry[];
  outliers: MetricsWithCountry[];
} {
  const validMetrics = metrics.filter(m => m.physicianDensity && m.physicianDensity > 0);
  
  if (validMetrics.length === 0) {
    return { highPerformers: [], lowPerformers: [], outliers: [] };
  }
  
  // Sort by physician density
  const sorted = [...validMetrics].sort((a, b) => (b.physicianDensity || 0) - (a.physicianDensity || 0));
  
  const top25Percent = Math.ceil(sorted.length * 0.25);
  const highPerformers = sorted.slice(0, top25Percent);
  const lowPerformers = sorted.slice(-top25Percent);
  
  // Calculate mean and std dev for outlier detection
  const densities = validMetrics.map(m => m.physicianDensity!);
  const mean = densities.reduce((a, b) => a + b, 0) / densities.length;
  const variance = densities.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / densities.length;
  const stdDev = Math.sqrt(variance);
  
  // Outliers are > 1.5 standard deviations from mean
  const outliers = validMetrics.filter(m => {
    const density = m.physicianDensity!;
    return Math.abs(density - mean) > 1.5 * stdDev;
  });
  
  return { highPerformers, lowPerformers, outliers };
}
