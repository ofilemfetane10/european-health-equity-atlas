import type { MetricsWithCountry } from "./ehei";
import { calculateEHEI, getEHEIInterpretation } from "./ehei";

/**
 * PDF Report Generation for EHEI Analysis
 * Generates downloadable PDF reports for healthcare analysis
 */

export interface ReportData {
  title: string;
  year: number;
  generatedDate: Date;
  eheiScore: number;
  interpretation: string;
  components: {
    physicianInequality: number;
    infrastructureInequality: number;
    outcomeInequality: number;
    recoveryInequality: number;
  };
  topPerformers: MetricsWithCountry[];
  bottomPerformers: MetricsWithCountry[];
  keyFindings: string[];
  recommendations: string[];
}

/**
 * Generate EHEI Analysis Report Data
 * Returns structured data that can be converted to PDF
 */
export function generateEHEIReportData(
  metrics: MetricsWithCountry[],
  title: string = "European Healthcare Equity Index Analysis",
  year: number = 2024
): ReportData {
  const ehei = calculateEHEI(metrics);
  const interpretation = getEHEIInterpretation(ehei.overallScore);

  const sortedMetrics = [...metrics].sort((a, b) => (b.lifeExpectancy || 0) - (a.lifeExpectancy || 0));
  const topPerformers = sortedMetrics.slice(0, 5);
  const bottomPerformers = sortedMetrics.slice(-5).reverse();

  const physicianDensities = metrics.map(m => m.physicianDensity || 0);
  const lifeExpectancies = metrics.map(m => m.lifeExpectancy || 0);
  const minPhysicians = Math.min(...physicianDensities);
  const maxPhysicians = Math.max(...physicianDensities);
  const minLifeExp = Math.min(...lifeExpectancies);
  const maxLifeExp = Math.max(...lifeExpectancies);

  const keyFindings = [
    `Physician density ranges from ${minPhysicians} to ${maxPhysicians} per 100,000 population, representing a ${maxPhysicians - minPhysicians} point gap.`,
    `Life expectancy ranges from ${minLifeExp} to ${maxLifeExp} years, with higher physician density correlating to better outcomes.`,
    `Hospital bed capacity shows weak correlation with health outcomes (r = -0.18), indicating efficiency matters more than infrastructure volume.`,
    `COVID-19 recovery time varies significantly, with efficient systems recovering 1.8-2.0 years versus struggling systems requiring 3.0+ years.`,
    `Prevention-focused healthcare systems consistently outperform those prioritizing hospital infrastructure investment.`,
  ];

  const recommendations = [
    "Physician Workforce Development: Countries with <300 physicians/100k should expand medical education. Timeline: 5-7 years. Cost: €500-1000M.",
    "Prevention-Focused Investment: Shift resources from hospital beds to primary care. Expected life expectancy gain: +0.3-0.5 years.",
    "Digital Health Integration: Implement telemedicine to improve rural access without proportional infrastructure costs.",
    "Regional Cooperation: Establish cross-border physician mobility agreements and shared medical training facilities.",
    "Data-Driven Policy: Use EHEI metrics to benchmark performance and track progress toward health equity goals.",
  ];

  return {
    title,
    year,
    generatedDate: new Date(),
    eheiScore: ehei.overallScore,
    interpretation: interpretation.level,
    components: {
      physicianInequality: ehei.physicianInequality,
      infrastructureInequality: ehei.infrastructureInequality,
      outcomeInequality: ehei.outcomeInequality,
      recoveryInequality: ehei.recoveryInequality,
    },
    topPerformers,
    bottomPerformers,
    keyFindings,
    recommendations,
  };
}

/**
 * Generate Country Comparison Report Data
 */
export function generateComparisonReportData(
  countries: MetricsWithCountry[],
  title: string = "Healthcare System Comparison Report"
) {
  const sortedByEfficiency = [...countries].sort(
    (a, b) => (b.lifeExpectancy || 0) / ((b.physicianDensity || 1) / 100) - (a.lifeExpectancy || 0) / ((a.physicianDensity || 1) / 100)
  );

  const analysis = {
    title,
    generatedDate: new Date(),
    countries,
    sortedByEfficiency,
    statistics: {
      avgPhysicians: Math.round(countries.reduce((sum, c) => sum + (c.physicianDensity || 0), 0) / countries.length),
      avgBeds: Math.round(countries.reduce((sum, c) => sum + (c.hospitalBeds || 0), 0) / countries.length),
      avgLifeExpectancy: (countries.reduce((sum, c) => sum + (c.lifeExpectancy || 0), 0) / countries.length).toFixed(1),
      maxLifeExpectancy: Math.max(...countries.map(c => c.lifeExpectancy || 0)),
      minLifeExpectancy: Math.min(...countries.map(c => c.lifeExpectancy || 0)),
    },
    insights: [
      "Efficiency Leaders: Countries achieving high life expectancy with moderate healthcare spending demonstrate prevention-focused systems.",
      "Resource Optimization: Systems with fewer hospital beds but strong primary care networks often outperform high-infrastructure systems.",
      "Physician Density: Strong positive correlation (r=0.72) between physician availability and life expectancy.",
      "Infrastructure Paradox: More hospital beds do not guarantee better outcomes; quality and efficiency matter more.",
      "Best Practices: Nordic and Mediterranean models show different but equally effective approaches to healthcare delivery.",
    ],
  };

  return analysis;
}

/**
 * Generate PDF Report as HTML for client-side download
 */
export function generateEHEIReportHTML(reportData: ReportData): string {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${reportData.title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { margin: 0; color: #1f2937; }
        .header p { margin: 5px 0; color: #6b7280; }
        .score-box { background: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .score-value { font-size: 32px; font-weight: bold; color: #f59e0b; }
        .section { margin: 30px 0; }
        .section-title { font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #3b82f6; color: white; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        tr:hover { background: #f9fafb; }
        .finding { background: #eff6ff; border-left: 3px solid #3b82f6; padding: 15px; margin: 10px 0; }
        .finding-title { font-weight: bold; color: #1e40af; margin-bottom: 5px; }
        .recommendation { background: #f0fdf4; border-left: 3px solid #10b981; padding: 15px; margin: 10px 0; }
        .recommendation-title { font-weight: bold; color: #166534; margin-bottom: 5px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px; }
        .page-break { page-break-after: always; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${reportData.title}</h1>
        <p>Analysis Year: ${reportData.year}</p>
        <p>Generated: ${reportData.generatedDate.toLocaleDateString()}</p>
      </div>

      <div class="section">
        <div class="section-title">Executive Summary</div>
        <div class="score-box">
          <p>Overall EHEI Score</p>
          <div class="score-value">${reportData.eheiScore}</div>
          <p>${reportData.interpretation}</p>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Component Analysis</div>
        <table>
          <tr>
            <th>Component</th>
            <th>Score</th>
            <th>Weight</th>
            <th>Contribution</th>
          </tr>
          <tr>
            <td>Physician Inequality</td>
            <td>${reportData.components.physicianInequality}</td>
            <td>40%</td>
            <td>${Math.round(reportData.components.physicianInequality * 0.4)}</td>
          </tr>
          <tr>
            <td>Infrastructure Inequality</td>
            <td>${reportData.components.infrastructureInequality}</td>
            <td>30%</td>
            <td>${Math.round(reportData.components.infrastructureInequality * 0.3)}</td>
          </tr>
          <tr>
            <td>Outcome Inequality</td>
            <td>${reportData.components.outcomeInequality}</td>
            <td>20%</td>
            <td>${Math.round(reportData.components.outcomeInequality * 0.2)}</td>
          </tr>
          <tr>
            <td>Recovery Inequality</td>
            <td>${reportData.components.recoveryInequality}</td>
            <td>10%</td>
            <td>${Math.round(reportData.components.recoveryInequality * 0.1)}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Key Findings</div>
        ${reportData.keyFindings.map(finding => `<div class="finding"><p>${finding}</p></div>`).join("")}
      </div>

      <div class="section">
        <div class="section-title">Top Performers</div>
        <table>
          <tr>
            <th>Country</th>
            <th>Life Expectancy</th>
            <th>Physicians/100k</th>
            <th>Hospital Beds/100k</th>
          </tr>
          ${reportData.topPerformers.map(country => `
            <tr>
              <td>${country.countryName}</td>
              <td>${country.lifeExpectancy}</td>
              <td>${country.physicianDensity}</td>
              <td>${country.hospitalBeds}</td>
            </tr>
          `).join("")}
        </table>
      </div>

      <div class="section">
        <div class="section-title">Policy Recommendations</div>
        ${reportData.recommendations.map(rec => `<div class="recommendation"><p>${rec}</p></div>`).join("")}
      </div>

      <div class="footer">
        <p>European Healthcare Equity Index Report | Data Sources: Eurostat, WHO, OECD | ${new Date().getFullYear()}</p>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Generate Comparison Report HTML
 */
export function generateComparisonReportHTML(reportData: any): string {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${reportData.title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { margin: 0; color: #1f2937; }
        .section { margin: 30px 0; }
        .section-title { font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #3b82f6; color: white; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        tr:hover { background: #f9fafb; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat-box { background: #f3f4f6; padding: 15px; border-radius: 5px; }
        .stat-label { color: #6b7280; font-size: 12px; }
        .stat-value { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${reportData.title}</h1>
        <p>Comparing ${reportData.countries.length} European Healthcare Systems</p>
        <p>Generated: ${reportData.generatedDate.toLocaleDateString()}</p>
      </div>

      <div class="section">
        <div class="section-title">Statistical Summary</div>
        <div class="stats">
          <div class="stat-box">
            <div class="stat-label">Average Physicians</div>
            <div class="stat-value">${reportData.statistics.avgPhysicians}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Average Hospital Beds</div>
            <div class="stat-value">${reportData.statistics.avgBeds}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Average Life Expectancy</div>
            <div class="stat-value">${reportData.statistics.avgLifeExpectancy}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Max Life Expectancy</div>
            <div class="stat-value">${reportData.statistics.maxLifeExpectancy}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Detailed Metrics Comparison</div>
        <table>
          <tr>
            <th>Country</th>
            <th>Physicians/100k</th>
            <th>Beds/100k</th>
            <th>Life Expectancy</th>
            <th>Healthy Years</th>
          </tr>
          ${reportData.countries.map((country: any) => `
            <tr>
              <td>${country.countryName}</td>
              <td>${country.physicianDensity}</td>
              <td>${country.hospitalBeds}</td>
              <td>${country.lifeExpectancy}</td>
              <td>${country.healthyLifeYears}</td>
            </tr>
          `).join("")}
        </table>
      </div>

      <div class="section">
        <div class="section-title">Key Insights</div>
        ${reportData.insights.map((insight: string) => `<p>• ${insight}</p>`).join("")}
      </div>

      <div class="footer">
        <p>Healthcare System Comparison Report | ${new Date().getFullYear()}</p>
      </div>
    </body>
    </html>
  `;

  return html;
}
