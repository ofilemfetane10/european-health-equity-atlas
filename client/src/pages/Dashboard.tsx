import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, BarChart3, BookOpen, RefreshCw } from "lucide-react";
import { Link } from "wouter";

function formatDate(d?: Date | string | null) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

export default function Dashboard() {
  const sync = trpc.healthcare.syncStatus.useQuery();
  const eurostat = sync.data?.find(s => s.source === "eurostat");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                European Health Equity Atlas
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
                A WHO-grade analytics demo: transparent sources, reproducible refresh, and an equity index (EHEI)
                to quantify access gaps.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <RefreshCw className="h-4 w-4" />
                <span>
                  Source: <span className="font-medium text-slate-900 dark:text-white">Eurostat</span>
                </span>
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                Last updated: {sync.isLoading ? "Loading…" : formatDate(eurostat?.lastSuccessAt)}
                {eurostat?.latestYearLoaded ? ` · Coverage year: ${eurostat.latestYearLoaded}` : ""}
              </div>
              {eurostat?.status === "failed" && (
                <div className="mt-1 text-xs text-red-600 dark:text-red-400">
                  Sync failed: {eurostat.details ?? "Unknown error"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Explore EHEI
              </CardTitle>
              <CardDescription>
                See inequality scores and the drivers behind them across Europe.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/ehei">
                <Button className="w-full">Open EHEI Dashboard</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Compare Countries
              </CardTitle>
              <CardDescription>
                Side-by-side indicators (physicians, beds, life expectancy, healthy life years).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/comparison">
                <Button variant="secondary" className="w-full">
                  Open Comparison
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Methodology
              </CardTitle>
              <CardDescription>
                Definitions, weighting, missingness rules, and reproducibility notes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/methodology">
                <Button variant="outline" className="w-full">
                  Read Methodology
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">WHO-grade checklist</h2>
          <ul className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
            <li>• Data provenance exposed (source + last updated + coverage year)</li>
            <li>• Refresh pipeline (token-protected sync endpoint + idempotent upsert)</li>
            <li>• Reproducible indicator definitions (single config in server/sync/eurostat.ts)</li>
            <li>• Transparent methodology page (weights, normalization, missing data rules)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
