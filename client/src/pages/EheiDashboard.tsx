import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, AlertCircle, CheckCircle, Info } from "lucide-react";

// Mock data for demonstration
const mockEheiData = {
  overallScore: 67,
  physicianInequality: 73,
  infrastructureInequality: 61,
  outcomeInequality: 58,
  recoveryInequality: 71,
  trend: 3,
};

const mockCountryMetrics = [
  { name: "Austria", physicians: 551, beds: 480, lifeExpectancy: 81.5, recovery: 2.1 },
  { name: "Italy", physicians: 535, beds: 420, lifeExpectancy: 83.2, recovery: 2.3 },
  { name: "Spain", physicians: 480, beds: 410, lifeExpectancy: 83.1, recovery: 2.2 },
  { name: "Germany", physicians: 466, beds: 520, lifeExpectancy: 81.3, recovery: 2.0 },
  { name: "France", physicians: 410, beds: 450, lifeExpectancy: 82.9, recovery: 2.1 },
  { name: "Greece", physicians: 618, beds: 480, lifeExpectancy: 81.8, recovery: 2.4 },
  { name: "Poland", physicians: 350, beds: 520, lifeExpectancy: 78.9, recovery: 2.8 },
  { name: "Romania", physicians: 280, beds: 580, lifeExpectancy: 76.2, recovery: 3.1 },
  { name: "Bulgaria", physicians: 290, beds: 600, lifeExpectancy: 75.8, recovery: 3.2 },
  { name: "Turkey", physicians: 206, beds: 280, lifeExpectancy: 77.6, recovery: 2.5 },
];

const inequalityComponents = [
  { name: "Physician Distribution", value: 73, weight: 40 },
  { name: "Infrastructure", value: 61, weight: 30 },
  { name: "Outcomes", value: 58, weight: 20 },
  { name: "COVID Recovery", value: 71, weight: 10 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function EheiDashboard() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const selectedData = mockCountryMetrics.find(c => c.name === selectedCountry);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                European Healthcare Equity Index
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Real-time analysis of healthcare system disparities across Europe
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-orange-600 dark:text-orange-400">
                {mockEheiData.overallScore}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Overall Score (0-100)</p>
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mt-2">
                Moderate Inequality
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="countries">Countries</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Physician Inequality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {mockEheiData.physicianInequality}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">40% weight</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Infrastructure Inequality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {mockEheiData.infrastructureInequality}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">30% weight</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Outcome Inequality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {mockEheiData.outcomeInequality}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">20% weight</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Recovery Inequality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {mockEheiData.recoveryInequality}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">10% weight</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Physician Density vs Life Expectancy</CardTitle>
                <CardDescription>
                  Correlation between healthcare workforce and health outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="physicians" name="Physicians per 100k" />
                    <YAxis dataKey="lifeExpectancy" name="Life Expectancy" />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter name="Countries" data={mockCountryMetrics} fill="#3b82f6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  Key Findings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Mediterranean Advantage</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Spain, Italy, and Greece show highest life expectancy (83+ years) with efficient physician distribution
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Physician Shortage Crisis</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Turkey (206/100k) and Eastern Europe show significant physician deficits compared to EU average (400+/100k)
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Infrastructure Paradox</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Countries with more hospital beds don't necessarily have better outcomes. Quality over quantity matters.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>EHEI Component Breakdown</CardTitle>
                <CardDescription>
                  Weighted contribution of each inequality metric to overall score
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={inequalityComponents}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, weight }) => `${name} (${weight}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {inequalityComponents.map((component, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {component.name}
                        </span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {component.weight}% weight
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                          style={{ width: `${component.value}%` }}
                        />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Score: {component.value}/100
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Countries Tab */}
          <TabsContent value="countries" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Country Metrics Comparison</CardTitle>
                <CardDescription>
                  Click on a country to view detailed metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
                  {mockCountryMetrics.map((country) => (
                    <Button
                      key={country.name}
                      variant={selectedCountry === country.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCountry(country.name)}
                      className="text-xs"
                    >
                      {country.name}
                    </Button>
                  ))}
                </div>

                {selectedData && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <Card className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                      <CardContent className="pt-6">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Physicians/100k</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {selectedData.physicians}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                      <CardContent className="pt-6">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Beds/100k</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {selectedData.beds}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                      <CardContent className="pt-6">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Life Expectancy</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {selectedData.lifeExpectancy}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                      <CardContent className="pt-6">
                        <p className="text-sm text-slate-600 dark:text-slate-400">COVID Recovery (yrs)</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {selectedData.recovery}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Inequality Trends</CardTitle>
                <CardDescription>
                  Historical EHEI scores and inequality trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { year: 2019, score: 64 },
                    { year: 2020, score: 65 },
                    { year: 2021, score: 66 },
                    { year: 2022, score: 66 },
                    { year: 2023, score: 67 },
                    { year: 2024, score: 67 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[60, 70]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#f59e0b"
                      name="EHEI Score"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
