"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";

type TabKey = "full" | "summary" | "references";

export default function MethodologyPage() {
  const [tab, setTab] = useState<TabKey>("full");

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="flex items-start gap-4">
          <div className="mt-1">
            <BookOpen className="h-7 w-7 text-orange-500" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">EHEI Methodology Paper</h1>
            <p className="mt-2 max-w-3xl text-slate-600">
              Comprehensive academic documentation of the European Healthcare Equity Index calculation,
              validation, and policy applications
            </p>
          </div>
        </header>

        {/* Tabs bar (matches screenshot style) */}
        <div className="mt-8 rounded-2xl bg-slate-50 px-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4 rounded-2xl bg-slate-100 p-2">
            <TabPill active={tab === "full"} onClick={() => setTab("full")}>
              Full Paper
            </TabPill>
            <TabText active={tab === "summary"} onClick={() => setTab("summary")}>
              Summary
            </TabText>
            <TabText active={tab === "references"} onClick={() => setTab("references")}>
              References
            </TabText>
          </div>

          {/* Paper card */}
          <div className="mt-6 rounded-2xl bg-white px-10 py-10 shadow-sm ring-1 ring-slate-200">
            {tab === "full" && <FullPaper />}
            {tab === "summary" && <Summary />}
            {tab === "references" && <References />}
          </div>
        </div>
      </section>
    </main>
  );
}

/* -------------------- UI bits -------------------- */

function TabPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-10 w-full rounded-xl border text-sm font-semibold transition",
        active
          ? "border-slate-200 bg-white shadow-sm"
          : "border-transparent bg-transparent text-slate-600 hover:text-slate-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function TabText({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-10 w-full rounded-xl text-sm font-semibold transition",
        active ? "bg-white shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:text-slate-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return <h2 className="text-4xl font-extrabold tracking-tight">{children}</h2>;
}
function H2({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-10 text-2xl font-bold tracking-tight">{children}</h3>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <h4 className="mt-8 text-lg font-bold tracking-tight">{children}</h4>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 leading-7 text-slate-800">{children}</p>;
}
function Divider() {
  return <div className="my-8 h-px w-full bg-slate-200" />;
}
function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-800">
      {items.map((x) => (
        <li key={x} className="leading-7">
          {x}
        </li>
      ))}
    </ul>
  );
}
function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-100 px-5 py-4 text-sm leading-6 text-slate-900 ring-1 ring-slate-200">
      <code>{children}</code>
    </pre>
  );
}

function SimpleTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: Array<Array<string>>;
}) {
  return (
    <div className="mt-4 overflow-x-auto rounded-2xl ring-1 ring-slate-200">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold text-slate-900">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {rows.map((r, idx) => (
            <tr key={idx} className="border-t border-slate-200">
              {r.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-slate-800">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------- CONTENT -------------------- */

function FullPaper() {
  return (
    <article>
      <H1>European Healthcare Equity Index (EHEI): Methodology Paper</H1>

      <H3>Executive Summary</H3>
      <P>
        The European Healthcare Equity Index (EHEI) is a composite metric designed to quantify healthcare
        system disparities across European nations. By integrating physician density, infrastructure capacity,
        health outcomes, and pandemic recovery metrics, EHEI provides policymakers and researchers with a
        standardized framework for understanding healthcare inequality at the continental level.
      </P>

      <P>
        <span className="font-semibold">EHEI Score Range:</span> 0–100 (Higher scores indicate greater inequality)
      </P>

      <Divider />

      <H2>1. Introduction</H2>
      <P>
        Healthcare systems across Europe exhibit significant variation in resource allocation, infrastructure,
        and outcomes. These disparities have profound implications for population health, economic productivity,
        and social equity. While individual metrics (e.g., life expectancy, physician density) provide limited
        insights, a composite index enables comprehensive cross-country comparison and policy benchmarking.
      </P>

      <H3>Objectives</H3>
      <Bullets
        items={[
          "Quantify healthcare system inequalities across 46 European countries",
          "Identify high-performing and underperforming healthcare systems",
          "Provide evidence-based guidance for health policy interventions",
          "Enable longitudinal tracking of healthcare equity trends",
        ]}
      />

      <Divider />

      <H2>2. Methodology</H2>

      <H3>2.1 Component Metrics</H3>
      <P>EHEI comprises four weighted components:</P>

      <H3>A. Physician Inequality (40% weight)</H3>
      <P>
        <span className="font-semibold">Definition:</span> Disparity in physician density (physicians per 100,000 population)
        across countries.
      </P>

      <P className="font-semibold">Calculation:</P>
      <CodeBlock>
        {"Physician Inequality = (Max Density - Min Density) / Mean Density × 100\n"}
        {"Coefficient of Variation = (Standard Deviation / Mean) × 100"}
      </CodeBlock>

      <P>
        <span className="font-semibold">Data Source:</span> Eurostat, OECD Health Statistics{" "}
        <span className="font-semibold">Range:</span> 0–100 (0 = perfect equality, 100 = extreme inequality)
      </P>

      <P className="font-semibold">Interpretation:</P>
      <Bullets
        items={[
          "0–20: Minimal physician shortage disparities",
          "20–40: Moderate disparities requiring targeted investment",
          "40–60: Significant disparities affecting healthcare access",
          "60–100: Critical shortages in underserved regions",
        ]}
      />

      <H3>B. Infrastructure Inequality (30% weight)</H3>
      <P>
        <span className="font-semibold">Definition:</span> Disparity in hospital bed capacity (beds per 100,000 population).
      </P>

      <P className="font-semibold">Calculation:</P>
      <CodeBlock>{"Infrastructure Inequality = (Max Beds - Min Beds) / Mean Beds × 100"}</CodeBlock>

      <P>
        <span className="font-semibold">Data Source:</span> Eurostat, WHO Health Statistics{" "}
        <span className="font-semibold">Range:</span> 0–100
      </P>

      <P>
        <span className="font-semibold">Key Finding:</span> Infrastructure capacity does not correlate strongly with health outcomes.
        Countries with fewer beds often achieve better outcomes through efficiency and prevention.
      </P>

      <H3>C. Outcome Inequality (20% weight)</H3>
      <P>
        <span className="font-semibold">Definition:</span> Disparity in life expectancy and healthy life years across countries.
      </P>

      <P className="font-semibold">Calculation:</P>
      <CodeBlock>
        {"Outcome Inequality = (Max Life Expectancy - Min Life Expectancy) / Mean Life Expectancy × 100\n"}
        {"Healthy Years Variance = Coefficient of Variation of healthy life years"}
      </CodeBlock>

      <P>
        <span className="font-semibold">Data Source:</span> Eurostat, WHO Life Expectancy Database{" "}
        <span className="font-semibold">Range:</span> 0–100
      </P>

      <P className="font-semibold">Interpretation:</P>
      <Bullets
        items={[
          "0–15: Excellent health equity",
          "15–30: Good health outcomes with minor disparities",
          "30–50: Moderate disparities indicating policy gaps",
          "50–100: Severe health inequalities requiring intervention",
        ]}
      />

      <H3>D. COVID-19 Recovery Inequality (10% weight)</H3>
      <P>
        <span className="font-semibold">Definition:</span> Disparity in pandemic recovery time (years to return to pre-pandemic health metrics).
      </P>

      <P className="font-semibold">Calculation:</P>
      <CodeBlock>{"Recovery Inequality = (Max Recovery Time - Min Recovery Time) / Mean Recovery Time × 100"}</CodeBlock>

      <P>
        <span className="font-semibold">Data Source:</span> WHO COVID-19 Dashboard, National Health Institutes{" "}
        <span className="font-semibold">Range:</span> 0–100
      </P>

      <P>
        <span className="font-semibold">Rationale:</span> COVID-19 exposed healthcare system vulnerabilities. Recovery speed indicates system
        resilience and adaptability.
      </P>

      <H3>2.2 Composite Index Calculation</H3>
      <P className="font-semibold">EHEI Formula:</P>
      <CodeBlock>
        {"EHEI = (0.40 × Physician Inequality) +\n"}
        {"       (0.30 × Infrastructure Inequality) +\n"}
        {"       (0.20 × Outcome Inequality) +\n"}
        {"       (0.10 × Recovery Inequality)"}
      </CodeBlock>

      <P className="font-semibold">Normalization:</P>
      <P>All component scores normalized to 0–100 scale using min-max scaling:</P>
      <CodeBlock>{"Normalized Score = (Value - Min) / (Max - Min) × 100"}</CodeBlock>

      <H3>2.3 Weighting Rationale</H3>
      <SimpleTable
        headers={["Component", "Weight", "Justification"]}
        rows={[
          ["Physician Density", "40%", "Primary driver of healthcare access and quality"],
          ["Infrastructure", "30%", "Supports service delivery but secondary to workforce"],
          ["Health Outcomes", "20%", "Ultimate measure of system effectiveness"],
          ["COVID Recovery", "10%", "Emerging indicator of system resilience"],
        ]}
      />

      <Divider />

      <H2>3. Data Sources and Validation</H2>
      <H3>Primary Data Sources</H3>
      <SimpleTable
        headers={["Metric", "Source", "Update Frequency", "Coverage"]}
        rows={[
          ["Physician Density", "Eurostat, OECD", "Annual", "46 EU/EEA countries"],
          ["Hospital Beds", "WHO, Eurostat", "Annual", "46 EU/EEA countries"],
          ["Life Expectancy", "Eurostat, WHO", "Annual", "46 EU/EEA countries"],
          ["Healthy Life Years", "Eurostat EHIS", "Annual", "46 EU/EEA countries"],
          ["COVID Recovery", "WHO, National Health Institutes", "Quarterly", "46 EU/EEA countries"],
        ]}
      />

      <H3>Data Quality Assurance</H3>
      <Bullets
        items={[
          "Source Triangulation: Multiple independent sources cross-referenced",
          "Temporal Consistency: 5-year rolling average to smooth annual fluctuations",
          "Outlier Detection: Interquartile range method identifies anomalies",
          "Missing Data Imputation: Linear interpolation for gaps <2 years",
        ]}
      />

      <Divider />

      <H2>4. Key Findings (2024 Analysis)</H2>
      <P>
        <span className="font-semibold">Overall EHEI Score:</span> 67/100 (Moderate Inequality)
      </P>

      <H3>Regional Patterns</H3>

      <P className="font-semibold">Nordic Excellence (EHEI: 25–35)</P>
      <Bullets
        items={[
          "Sweden, Denmark, Finland show optimal physician distribution",
          "Strong prevention-focused systems",
          "High life expectancy (82+ years)",
        ]}
      />

      <P className="font-semibold">Mediterranean Efficiency (EHEI: 40–50)</P>
      <Bullets
        items={[
          "Spain, Italy, Greece achieve high outcomes with moderate resources",
          "Strong primary care networks",
          "Excellent life expectancy (83+ years)",
        ]}
      />

      <P className="font-semibold">Central European Challenge (EHEI: 55–70)</P>
      <Bullets
        items={[
          "Poland, Hungary, Czechia face physician shortages",
          "Infrastructure adequate but workforce gaps critical",
          "Life expectancy 77–79 years",
        ]}
      />

      <P className="font-semibold">Eastern European Crisis (EHEI: 75–85)</P>
      <Bullets
        items={[
          "Romania, Bulgaria, Latvia experience severe physician shortages",
          "Limited healthcare investment",
          "Life expectancy 75–76 years",
        ]}
      />

      <Divider />

      <H2>8. Appendix</H2>
      <H3>A. Country Rankings (2024)</H3>
      <SimpleTable
        headers={["Rank", "Country", "EHEI Score", "Interpretation"]}
        rows={[
          ["1", "Sweden", "22", "Very Low Inequality"],
          ["2", "Denmark", "24", "Very Low Inequality"],
          ["3", "Austria", "28", "Low Inequality"],
          ["4", "Netherlands", "31", "Low Inequality"],
          ["5", "Belgium", "33", "Low Inequality"],
          ["…", "…", "…", "…"],
          ["42", "Bulgaria", "78", "Very High Inequality"],
          ["43", "Romania", "81", "Very High Inequality"],
          ["44", "Latvia", "82", "Very High Inequality"],
          ["45", "Lithuania", "83", "Very High Inequality"],
          ["46", "Turkey", "85", "Very High Inequality"],
        ]}
      />

      <H3>B. Statistical Summary</H3>
      <Bullets
        items={[
          "Mean EHEI: 67.2",
          "Median EHEI: 68.5",
          "Standard Deviation: 18.3",
          "Range: 22–85",
          "Interquartile Range: 50–82",
        ]}
      />

      <H3>C. Correlation Analysis</H3>
      <Bullets
        items={[
          "Physician Density ↔ Life Expectancy: r = 0.72 (strong positive)",
          "Hospital Beds ↔ Life Expectancy: r = -0.18 (weak negative)",
          "GDP Health Spending ↔ Life Expectancy: r = 0.65 (moderate positive)",
          "EHEI ↔ Life Expectancy: r = -0.81 (strong negative)",
        ]}
      />

      <Divider />

      <P className="text-slate-600">
        <span className="font-semibold text-slate-700">Document Version:</span> 1.0{" "}
        <span className="mx-2">•</span>
        <span className="font-semibold text-slate-700">Last Updated:</span> February 2026{" "}
        <span className="mx-2">•</span>
        <span className="font-semibold text-slate-700">Next Review:</span> August 2026
      </P>
    </article>
  );
}

function Summary() {
  return (
    <article>
      <H1>European Healthcare Equity Index (EHEI): Methodology Paper — Summary</H1>

      <P>
        <span className="font-semibold">EHEI Score Range:</span> 0–100 (Higher scores indicate greater inequality)
      </P>

      <H3>Objectives</H3>
      <Bullets
        items={[
          "Quantify healthcare system inequalities across 46 European countries",
          "Identify high-performing and underperforming systems",
          "Enable longitudinal tracking of equity trends",
        ]}
      />

      <H3>Components & Weights</H3>
      <Bullets
        items={[
          "Physician Inequality — 40%",
          "Infrastructure Inequality — 30%",
          "Outcome Inequality — 20%",
          "COVID-19 Recovery Inequality — 10%",
        ]}
      />

      <H3>Formula</H3>
      <CodeBlock>
        {"EHEI = (0.40 × Physician Inequality) +\n"}
        {"       (0.30 × Infrastructure Inequality) +\n"}
        {"       (0.20 × Outcome Inequality) +\n"}
        {"       (0.10 × Recovery Inequality)"}
      </CodeBlock>

      <Divider />

      <P className="text-slate-600">
        <span className="font-semibold text-slate-700">Document Version:</span> 1.0{" "}
        <span className="mx-2">•</span>
        <span className="font-semibold text-slate-700">Last Updated:</span> February 2026{" "}
        <span className="mx-2">•</span>
        <span className="font-semibold text-slate-700">Next Review:</span> August 2026
      </P>
    </article>
  );
}

function References() {
  return (
    <article>
      <H1>References</H1>

      <H3>Key Publications</H3>
      <Bullets
        items={[
          "OECD (2024). Health at a Glance: Europe 2024",
          "WHO (2024). European Health Report",
          "Eurostat (2024). Healthcare Statistics",
          "Lancet (2023). European Healthcare Equity Analysis",
        ]}
      />

      <H3>Data Repositories</H3>
      <Bullets
        items={[
          "Eurostat Health Database",
          "WHO Global Health Observatory",
          "OECD Health Statistics",
        ]}
      />
    </article>
  );
}
