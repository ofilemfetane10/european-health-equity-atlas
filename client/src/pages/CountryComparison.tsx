import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Plus, X } from "lucide-react";

// Mock country data
const countryDatabase = [
  { id: 1, name: "Austria", physicians: 551, beds: 480, lifeExpectancy: 81.5, healthyYears: 63, covidRecovery: 2.1, gdpHealth: 10.5 },
  { id: 2, name: "Belgium", physicians: 475, beds: 450, lifeExpectancy: 81.8, healthyYears: 62, covidRecovery: 2.0, gdpHealth: 10.2 },
  { id: 3, name: "Bulgaria", physicians: 290, beds: 600, lifeExpectancy: 75.8, healthyYears: 58, covidRecovery: 3.2, gdpHealth: 4.2 },
  { id: 4, name: "Croatia", physicians: 380, beds: 520, lifeExpectancy: 78.5, healthyYears: 60, covidRecovery: 2.8, gdpHealth: 6.1 },
  { id: 5, name: "Cyprus", physicians: 420, beds: 380, lifeExpectancy: 81.2, healthyYears: 62, covidRecovery: 2.2, gdpHealth: 7.8 },
  { id: 6, name: "Czechia", physicians: 410, beds: 580, lifeExpectancy: 79.3, healthyYears: 60, covidRecovery: 2.5, gdpHealth: 7.5 },
  { id: 7, name: "Denmark", physicians: 480, beds: 420, lifeExpectancy: 82.1, healthyYears: 63, covidRecovery: 1.9, gdpHealth: 10.8 },
  { id: 8, name: "Estonia", physicians: 380, beds: 490, lifeExpectancy: 78.8, healthyYears: 60, covidRecovery: 2.6, gdpHealth: 6.5 },
  { id: 9, name: "Finland", physicians: 520, beds: 440, lifeExpectancy: 82.0, healthyYears: 63, covidRecovery: 2.0, gdpHealth: 9.9 },
  { id: 10, name: "France", physicians: 410, beds: 450, lifeExpectancy: 82.9, healthyYears: 64, covidRecovery: 2.1, gdpHealth: 11.1 },
  { id: 11, name: "Germany", physicians: 466, beds: 520, lifeExpectancy: 81.3, healthyYears: 62, covidRecovery: 2.0, gdpHealth: 11.7 },
  { id: 12, name: "Greece", physicians: 618, beds: 480, lifeExpectancy: 81.8, healthyYears: 62, covidRecovery: 2.4, gdpHealth: 9.1 },
  { id: 13, name: "Hungary", physicians: 360, beds: 600, lifeExpectancy: 76.8, healthyYears: 57, covidRecovery: 3.0, gdpHealth: 6.8 },
  { id: 14, name: "Ireland", physicians: 420, beds: 380, lifeExpectancy: 82.4, healthyYears: 63, covidRecovery: 2.2, gdpHealth: 7.2 },
  { id: 15, name: "Italy", physicians: 535, beds: 420, lifeExpectancy: 83.2, healthyYears: 64, covidRecovery: 2.3, gdpHealth: 8.9 },
  { id: 16, name: "Latvia", physicians: 320, beds: 520, lifeExpectancy: 75.5, healthyYears: 57, covidRecovery: 3.1, gdpHealth: 6.0 },
  { id: 17, name: "Lithuania", physicians: 340, beds: 540, lifeExpectancy: 76.2, healthyYears: 58, covidRecovery: 3.0, gdpHealth: 6.3 },
  { id: 18, name: "Luxembourg", physicians: 480, beds: 400, lifeExpectancy: 82.5, healthyYears: 63, covidRecovery: 2.0, gdpHealth: 5.4 },
  { id: 19, name: "Malta", physicians: 410, beds: 360, lifeExpectancy: 82.8, healthyYears: 63, covidRecovery: 2.1, gdpHealth: 8.5 },
  { id: 20, name: "Netherlands", physicians: 490, beds: 410, lifeExpectancy: 82.2, healthyYears: 63, covidRecovery: 1.9, gdpHealth: 10.9 },
  { id: 21, name: "Poland", physicians: 350, beds: 520, lifeExpectancy: 78.9, healthyYears: 59, covidRecovery: 2.8, gdpHealth: 6.5 },
  { id: 22, name: "Portugal", physicians: 430, beds: 380, lifeExpectancy: 81.9, healthyYears: 62, covidRecovery: 2.2, gdpHealth: 9.3 },
  { id: 23, name: "Romania", physicians: 280, beds: 580, lifeExpectancy: 76.2, healthyYears: 57, covidRecovery: 3.1, gdpHealth: 5.2 },
  { id: 24, name: "Slovakia", physicians: 360, beds: 560, lifeExpectancy: 77.8, healthyYears: 58, covidRecovery: 2.9, gdpHealth: 6.9 },
  { id: 25, name: "Slovenia", physicians: 400, beds: 470, lifeExpectancy: 81.5, healthyYears: 62, covidRecovery: 2.3, gdpHealth: 8.8 },
  { id: 26, name: "Spain", physicians: 480, beds: 410, lifeExpectancy: 83.1, healthyYears: 64, covidRecovery: 2.2, gdpHealth: 9.1 },
  { id: 27, name: "Sweden", physicians: 510, beds: 400, lifeExpectancy: 82.8, healthyYears: 63, covidRecovery: 1.8, gdpHealth: 10.9 },
  { id: 28, name: "Turkey", physicians: 206, beds: 280, lifeExpectancy: 77.6, healthyYears: 60, covidRecovery: 2.5, gdpHealth: 4.3 },
];

export default function CountryComparison() {
  const [selectedCountries, setSelectedCountries] = useState<number[]>([1, 15, 26]); // Austria, Italy, Spain

  const selected = countryDatabase.filter((c) => selectedCountries.includes(c.id));

  const addCountry = (countryId: number) => {
    if (!selectedCountries.includes(countryId) && selectedCountries.length < 5) {
      setSelectedCountries([...selectedCountries, countryId]);
    }
  };

  const removeCountry = (countryId: number) => {
    setSelectedCountries(selectedCountries.filter((id) => id !== countryId));
  };

  const efficiency = selected.map((c) => ({
    name: c.name,
    efficiency: (c.lifeExpectancy / (c.gdpHealth * 10)) * 100,
    lifeExpectancy: c.lifeExpectancy,
    gdpHealth: c.gdpHealth,
  }));

  const radarData = selected.map((c) => ({
    metric: c.name,
    physicians: (c.physicians / 6) * 10,
    lifeExpectancy: c.lifeExpectancy - 70,
    healthyYears: c.healthyYears - 50,
    efficiency: (c.lifeExpectancy / (c.gdpHealth * 10)) * 100,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Country Comparison Tool</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Analyze and compare healthcare systems across European countries
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Country Selector */}
          <Card className="border-slate-200 dark:border-slate-800 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Select Countries</CardTitle>
              <CardDescription>Choose up to 5 countries</CardDescription>
            </CardHeader>
            <CardContent className="max-h-96 space-y-2 overflow-y-auto">
              {countryDatabase.map((country) => (
                <button
                  key={country.id}
                  onClick={() => addCountry(country.id)}
                  disabled={selectedCountries.includes(country.id) || selectedCountries.length >= 5}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    selectedCountries.includes(country.id)
                      ? "bg-blue-100 font-semibold text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  } ${
                    selectedCountries.length >= 5 && !selectedCountries.includes(country.id)
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >
                  {country.name}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Comparison Data */}
          <div className="space-y-6 lg:col-span-3">
            {/* Selected Countries Pills */}
            <div className="flex flex-wrap gap-2">
              {selected.map((country) => (
                <div
                  key={country.id}
                  className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                >
                  {country.name}
                  <button
                    onClick={() => removeCountry(country.id)}
                    className="rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
                    aria-label={`Remove ${country.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Metrics Table */}
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Key Metrics Comparison</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="px-3 py-2 text-left font-semibold text-slate-900 dark:text-white">Country</th>
                      <th className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white">Physicians/100k</th>
                      <th className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white">Hospital Beds/100k</th>
                      <th className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white">Life Expectancy</th>
                      <th className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white">Healthy Years</th>
                      <th className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white">COVID Recovery</th>
                      <th className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white">Health % GDP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.map((country) => (
                      <tr
                        key={country.id}
                        className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                      >
                        <td className="px-3 py-2 font-semibold text-slate-900 dark:text-white">{country.name}</td>
                        <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">{country.physicians}</td>
                        <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">{country.beds}</td>
                        <td className="px-3 py-2 text-right font-semibold text-blue-600 dark:text-blue-400">
                          {country.lifeExpectancy}
                        </td>
                        <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">{country.healthyYears}</td>
                        <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">{country.covidRecovery}y</td>
                        <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">{country.gdpHealth}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Visualizations */}
        <Tabs defaultValue="efficiency" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-3">
            <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
            <TabsTrigger value="comparison">Metrics</TabsTrigger>
            <TabsTrigger value="radar">Radar</TabsTrigger>
          </TabsList>

          {/* Efficiency Tab */}
          <TabsContent value="efficiency" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Healthcare Efficiency Index</CardTitle>
                <CardDescription>Life expectancy per percentage of GDP spent on healthcare</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={efficiency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="efficiency" name="Efficiency Index" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Life Expectancy Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={selected}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[70, 85]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="lifeExpectancy" name="Life Expectancy" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Physician Density Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={selected}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="physicians" name="Physicians per 100k" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Radar Tab */}
          <TabsContent value="radar" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Multi-Dimensional Comparison</CardTitle>
                <CardDescription>Healthcare system profile across multiple metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      dataKey="physicians"
                      name="Physicians (normalized)"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.25}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
