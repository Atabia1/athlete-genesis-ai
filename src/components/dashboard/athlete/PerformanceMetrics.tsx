import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useTheme } from "@/context/UserPreferencesContext";
import { useAccessibilitySettings } from "@/context/UserPreferencesContext";

interface PerformanceMetricsProps {
  visible: boolean;
  isLoading: boolean;
  performanceData: Array<{ day: string; value: number }>;
}

/**
 * PerformanceMetrics component for the Athlete Dashboard
 * 
 * Displays performance metrics in various chart formats with tabs for different metrics
 */
const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ visible, isLoading, performanceData }) => {
  const { resolvedTheme } = useTheme();
  const { accessibilitySettings } = useAccessibilitySettings();

  // Personalized color scheme based on theme
  const getChartColors = () => {
    const isDark = resolvedTheme === 'dark';
    return {
      performance: {
        stroke: isDark ? '#60a5fa' : '#3b82f6',
        fill: isDark ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.1)',
        grid: isDark ? '#374151' : '#f1f5f9',
        text: isDark ? '#94a3b8' : '#64748b'
      },
      strength: {
        stroke: isDark ? '#a78bfa' : '#8b5cf6',
        fill: isDark ? 'rgba(167, 139, 250, 0.2)' : 'rgba(139, 92, 246, 0.1)',
        grid: isDark ? '#374151' : '#f1f5f9',
        text: isDark ? '#94a3b8' : '#64748b'
      },
      endurance: {
        stroke: isDark ? '#34d399' : '#10b981',
        fill: isDark ? 'rgba(52, 211, 153, 0.2)' : 'rgba(16, 185, 129, 0.1)',
        grid: isDark ? '#374151' : '#f1f5f9',
        text: isDark ? '#94a3b8' : '#64748b'
      }
    };
  };

  if (!visible) return null;

  return (
    <Card className="md:col-span-2 shadow-lg border border-gray-200/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-3">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-md text-blue-600 mr-3">
            <BarChart2 className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Performance Metrics</CardTitle>
            <CardDescription>Track your key performance indicators</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-lg">Loading your personalized metrics...</span>
          </div>
        ) : (
          <Tabs
            defaultValue="performance"
            className="mb-4"
          >
            <TabsList className="grid grid-cols-3 p-1 bg-gray-100/80 dark:bg-gray-800/50">
              <TabsTrigger
                value="performance"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-md"
                aria-label="Performance metrics tab"
              >
                Performance
              </TabsTrigger>
              <TabsTrigger
                value="strength"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-md"
                aria-label="Strength metrics tab"
              >
                Strength
              </TabsTrigger>
              <TabsTrigger
                value="endurance"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400 data-[state=active]:shadow-md"
                aria-label="Endurance metrics tab"
              >
                Endurance
              </TabsTrigger>
            </TabsList>
            <TabsContent value="performance" className="mt-6">
              <div className="h-[320px] p-2" aria-label="Performance metrics chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={getChartColors().performance.stroke} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={getChartColors().performance.stroke} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={getChartColors().performance.grid} />
                    <XAxis
                      dataKey="day"
                      stroke={getChartColors().performance.text}
                      tick={{ fontSize: accessibilitySettings.largeText ? 14 : 12 }}
                    />
                    <YAxis
                      stroke={getChartColors().performance.text}
                      tick={{ fontSize: accessibilitySettings.largeText ? 14 : 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: resolvedTheme === 'dark' ? "#1f2937" : "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        border: "none",
                        fontSize: accessibilitySettings.largeText ? '1.1rem' : '1rem',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={getChartColors().performance.stroke}
                      strokeWidth={accessibilitySettings.highContrast ? 4 : 3}
                      dot={{
                        r: accessibilitySettings.highContrast ? 5 : 4,
                        fill: getChartColors().performance.stroke,
                        strokeWidth: 2,
                        stroke: resolvedTheme === 'dark' ? "#1f2937" : "white"
                      }}
                      activeDot={{
                        r: accessibilitySettings.highContrast ? 8 : 7,
                        fill: getChartColors().performance.stroke,
                        strokeWidth: 2,
                        stroke: resolvedTheme === 'dark' ? "#1f2937" : "white"
                      }}
                      fillOpacity={1}
                      fill="url(#colorPerformance)"
                      animationDuration={accessibilitySettings.reduceMotion ? 0 : 1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="strength" className="mt-6">
              <div className="h-[320px] p-2" aria-label="Strength metrics chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="colorStrength" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={getChartColors().strength.stroke} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={getChartColors().strength.stroke} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={getChartColors().strength.grid} />
                    <XAxis
                      dataKey="day"
                      stroke={getChartColors().strength.text}
                      tick={{ fontSize: accessibilitySettings.largeText ? 14 : 12 }}
                    />
                    <YAxis
                      stroke={getChartColors().strength.text}
                      tick={{ fontSize: accessibilitySettings.largeText ? 14 : 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: resolvedTheme === 'dark' ? "#1f2937" : "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        border: "none",
                        fontSize: accessibilitySettings.largeText ? '1.1rem' : '1rem',
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#colorStrength)"
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                      animationDuration={accessibilitySettings.reduceMotion ? 0 : 1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="endurance" className="mt-6">
              <div className="h-[320px] p-2" aria-label="Endurance metrics chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="colorEndurance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={getChartColors().endurance.stroke} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={getChartColors().endurance.stroke} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={getChartColors().endurance.grid} />
                    <XAxis
                      dataKey="day"
                      stroke={getChartColors().endurance.text}
                      tick={{ fontSize: accessibilitySettings.largeText ? 14 : 12 }}
                    />
                    <YAxis
                      stroke={getChartColors().endurance.text}
                      tick={{ fontSize: accessibilitySettings.largeText ? 14 : 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: resolvedTheme === 'dark' ? "#1f2937" : "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        border: "none",
                        fontSize: accessibilitySettings.largeText ? '1.1rem' : '1rem',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={getChartColors().endurance.stroke}
                      strokeWidth={accessibilitySettings.highContrast ? 4 : 3}
                      dot={{
                        r: accessibilitySettings.highContrast ? 5 : 4,
                        fill: getChartColors().endurance.stroke,
                        strokeWidth: 2,
                        stroke: resolvedTheme === 'dark' ? "#1f2937" : "white"
                      }}
                      activeDot={{
                        r: accessibilitySettings.highContrast ? 8 : 7,
                        fill: getChartColors().endurance.stroke,
                        strokeWidth: 2,
                        stroke: resolvedTheme === 'dark' ? "#1f2937" : "white"
                      }}
                      fillOpacity={1}
                      fill="url(#colorEndurance)"
                      animationDuration={accessibilitySettings.reduceMotion ? 0 : 1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
