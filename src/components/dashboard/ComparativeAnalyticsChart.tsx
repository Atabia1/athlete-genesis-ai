import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart2, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Activity, 
  Heart, 
  Scale, 
  Users,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
  Download,
  Share2,
  ChevronDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Area,
  ReferenceLine,
  ReferenceArea,
  Scatter,
  ScatterChart,
  ZAxis,
  Brush
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HealthData } from '@/integrations/health-apps/types';

interface ComparativeAnalyticsChartProps {
  /** Health data to visualize */
  healthData: HealthData;
  /** Optional className for styling */
  className?: string;
  /** Whether to enable export functionality */
  enableExport?: boolean;
  /** Whether to enable sharing functionality */
  enableSharing?: boolean;
}

/**
 * Comparative Analytics Chart Component
 * 
 * Provides advanced comparative analytics for health and fitness data:
 * - Before/after comparisons
 * - Benchmark comparisons with population averages
 * - Peer group comparisons
 * - Historical trend comparisons
 */
const ComparativeAnalyticsChart = ({ 
  healthData, 
  className = '',
  enableExport = false,
  enableSharing = false
}: ComparativeAnalyticsChartProps) => {
  const [activeTab, setActiveTab] = useState('before-after');
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [beforeAfterData, setBeforeAfterData] = useState<any[]>([]);
  const [benchmarkData, setBenchmarkData] = useState<any[]>([]);
  const [peerGroupData, setPeerGroupData] = useState<any[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [comparisonPeriod, setComparisonPeriod] = useState<'1month' | '3months' | '6months' | '1year'>('3months');
  
  // Generate mock data for visualization
  useEffect(() => {
    generateComparativeData();
  }, [healthData, selectedMetric, comparisonPeriod]);
  
  // Generate comparative data for visualization
  const generateComparativeData = () => {
    // In a real app, this would process actual health data
    // For demo purposes, we'll generate mock data
    
    // Generate before/after data
    generateBeforeAfterData();
    
    // Generate benchmark data
    generateBenchmarkData();
    
    // Generate peer group data
    generatePeerGroupData();
    
    // Generate historical data
    generateHistoricalData();
  };
  
  // Generate before/after data
  const generateBeforeAfterData = () => {
    const beforeAfterData = [];
    
    // Determine time periods based on comparison period
    let beforePeriodStart: Date;
    let beforePeriodEnd: Date;
    let afterPeriodStart: Date;
    let afterPeriodEnd = new Date(); // Today
    
    switch (comparisonPeriod) {
      case '1month':
        beforePeriodStart = new Date(afterPeriodEnd);
        beforePeriodStart.setMonth(beforePeriodStart.getMonth() - 2);
        beforePeriodEnd = new Date(afterPeriodEnd);
        beforePeriodEnd.setMonth(beforePeriodEnd.getMonth() - 1);
        afterPeriodStart = new Date(beforePeriodEnd);
        break;
      case '3months':
        beforePeriodStart = new Date(afterPeriodEnd);
        beforePeriodStart.setMonth(beforePeriodStart.getMonth() - 6);
        beforePeriodEnd = new Date(afterPeriodEnd);
        beforePeriodEnd.setMonth(beforePeriodEnd.getMonth() - 3);
        afterPeriodStart = new Date(beforePeriodEnd);
        break;
      case '6months':
        beforePeriodStart = new Date(afterPeriodEnd);
        beforePeriodStart.setMonth(beforePeriodStart.getMonth() - 12);
        beforePeriodEnd = new Date(afterPeriodEnd);
        beforePeriodEnd.setMonth(beforePeriodEnd.getMonth() - 6);
        afterPeriodStart = new Date(beforePeriodEnd);
        break;
      case '1year':
        beforePeriodStart = new Date(afterPeriodEnd);
        beforePeriodStart.setFullYear(beforePeriodStart.getFullYear() - 2);
        beforePeriodEnd = new Date(afterPeriodEnd);
        beforePeriodEnd.setFullYear(beforePeriodEnd.getFullYear() - 1);
        afterPeriodStart = new Date(beforePeriodEnd);
        break;
    }
    
    // Generate data based on selected metric
    let beforeValue = 0;
    let afterValue = 0;
    let unit = '';
    let improvement = 0;
    
    switch (selectedMetric) {
      case 'weight':
        beforeValue = 82;
        afterValue = 78;
        unit = 'kg';
        improvement = ((beforeValue - afterValue) / beforeValue) * 100;
        break;
      case 'restingHeartRate':
        beforeValue = 72;
        afterValue = 65;
        unit = 'bpm';
        improvement = ((beforeValue - afterValue) / beforeValue) * 100;
        break;
      case 'steps':
        beforeValue = 7500;
        afterValue = 9200;
        unit = 'steps/day';
        improvement = ((afterValue - beforeValue) / beforeValue) * 100;
        break;
      case 'sleep':
        beforeValue = 6.5;
        afterValue = 7.2;
        unit = 'hours/night';
        improvement = ((afterValue - beforeValue) / beforeValue) * 100;
        break;
    }
    
    // Add to before/after data
    beforeAfterData.push(
      {
        period: 'Before',
        value: beforeValue,
        date: formatDateRange(beforePeriodStart, beforePeriodEnd)
      },
      {
        period: 'After',
        value: afterValue,
        date: formatDateRange(afterPeriodStart, afterPeriodEnd)
      }
    );
    
    setBeforeAfterData(beforeAfterData);
  };
  
  // Generate benchmark data
  const generateBenchmarkData = () => {
    const benchmarkData = [];
    
    // Generate data based on selected metric
    let yourValue = 0;
    let averageValue = 0;
    let topValue = 0;
    let unit = '';
    
    switch (selectedMetric) {
      case 'weight':
        yourValue = 78;
        averageValue = 80;
        topValue = 75;
        unit = 'kg';
        break;
      case 'restingHeartRate':
        yourValue = 65;
        averageValue = 70;
        topValue = 60;
        unit = 'bpm';
        break;
      case 'steps':
        yourValue = 9200;
        averageValue = 8000;
        topValue = 12000;
        unit = 'steps/day';
        break;
      case 'sleep':
        yourValue = 7.2;
        averageValue = 6.8;
        topValue = 8.0;
        unit = 'hours/night';
        break;
    }
    
    // Add to benchmark data
    benchmarkData.push(
      {
        category: 'You',
        value: yourValue,
        fill: '#3b82f6'
      },
      {
        category: 'Average',
        value: averageValue,
        fill: '#94a3b8'
      },
      {
        category: 'Top 10%',
        value: topValue,
        fill: '#10b981'
      }
    );
    
    setBenchmarkData(benchmarkData);
  };
  
  // Generate peer group data
  const generatePeerGroupData = () => {
    const peerGroupData = [];
    
    // Generate 20 peer data points
    for (let i = 0; i < 20; i++) {
      let value = 0;
      let performance = 0;
      
      switch (selectedMetric) {
        case 'weight':
          value = 70 + Math.random() * 20;
          performance = 50 + Math.random() * 50;
          break;
        case 'restingHeartRate':
          value = 55 + Math.random() * 25;
          performance = 50 + Math.random() * 50;
          break;
        case 'steps':
          value = 6000 + Math.random() * 8000;
          performance = 50 + Math.random() * 50;
          break;
        case 'sleep':
          value = 5.5 + Math.random() * 3;
          performance = 50 + Math.random() * 50;
          break;
      }
      
      peerGroupData.push({
        id: i,
        value,
        performance,
        name: `Peer ${i + 1}`
      });
    }
    
    // Add your data point
    let yourValue = 0;
    let yourPerformance = 75;
    
    switch (selectedMetric) {
      case 'weight':
        yourValue = 78;
        break;
      case 'restingHeartRate':
        yourValue = 65;
        break;
      case 'steps':
        yourValue = 9200;
        break;
      case 'sleep':
        yourValue = 7.2;
        break;
    }
    
    peerGroupData.push({
      id: 'you',
      value: yourValue,
      performance: yourPerformance,
      name: 'You'
    });
    
    setPeerGroupData(peerGroupData);
  };
  
  // Generate historical data
  const generateHistoricalData = () => {
    const historicalData = [];
    
    // Generate 12 months of data
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(today.getMonth() - i);
      
      let currentValue = 0;
      let previousYearValue = 0;
      
      switch (selectedMetric) {
        case 'weight':
          // Current year: downward trend
          currentValue = 85 - (i * 0.6) + (Math.random() * 2 - 1);
          // Previous year: slight downward trend
          previousYearValue = 87 - (i * 0.2) + (Math.random() * 2 - 1);
          break;
        case 'restingHeartRate':
          // Current year: downward trend (good)
          currentValue = 75 - (i * 0.8) + (Math.random() * 4 - 2);
          // Previous year: stable
          previousYearValue = 74 + (Math.random() * 4 - 2);
          break;
        case 'steps':
          // Current year: upward trend
          currentValue = 7000 + (i * 200) + (Math.random() * 1000 - 500);
          // Previous year: stable
          previousYearValue = 7500 + (Math.random() * 1000 - 500);
          break;
        case 'sleep':
          // Current year: upward trend
          currentValue = 6.5 + (i * 0.06) + (Math.random() * 0.4 - 0.2);
          // Previous year: stable
          previousYearValue = 6.7 + (Math.random() * 0.4 - 0.2);
          break;
      }
      
      historicalData.push({
        date: date.toLocaleDateString([], { month: 'short' }),
        current: currentValue,
        previous: previousYearValue
      });
    }
    
    setHistoricalData(historicalData);
  };
  
  // Format date range for display
  const formatDateRange = (start: Date, end: Date) => {
    const startStr = start.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return `${startStr} - ${endStr}`;
  };
  
  // Get metric label
  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'weight':
        return 'Weight (kg)';
      case 'restingHeartRate':
        return 'Resting Heart Rate (bpm)';
      case 'steps':
        return 'Daily Steps';
      case 'sleep':
        return 'Sleep Duration (hours)';
      default:
        return 'Value';
    }
  };
  
  // Get improvement text
  const getImprovementText = () => {
    if (beforeAfterData.length < 2) return '';
    
    const before = beforeAfterData[0].value;
    const after = beforeAfterData[1].value;
    let improvement = 0;
    let isPositive = true;
    
    switch (selectedMetric) {
      case 'weight':
      case 'restingHeartRate':
        // Lower is better
        improvement = ((before - after) / before) * 100;
        isPositive = improvement > 0;
        break;
      case 'steps':
      case 'sleep':
        // Higher is better
        improvement = ((after - before) / before) * 100;
        isPositive = improvement > 0;
        break;
    }
    
    return {
      value: Math.abs(improvement).toFixed(1),
      isPositive
    };
  };
  
  // Handle export
  const handleExport = () => {
    // In a real app, this would export the data to CSV or PDF
    console.log('Exporting comparative analytics data...');
    alert('Comparative analytics data exported!');
  };
  
  // Handle sharing
  const handleShare = () => {
    // In a real app, this would open a sharing dialog
    console.log('Sharing comparative analytics data...');
    alert('Comparative analytics data shared!');
  };
  
  // Get improvement data
  const improvement = getImprovementText();
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-slate-50 dark:bg-slate-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-indigo-600" />
            <CardTitle className="text-xl">Comparative Analytics</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight">Weight</SelectItem>
                <SelectItem value="restingHeartRate">Heart Rate</SelectItem>
                <SelectItem value="steps">Steps</SelectItem>
                <SelectItem value="sleep">Sleep</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={comparisonPeriod} onValueChange={(value: any) => setComparisonPeriod(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">1 Month</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardDescription>
          Compare your health metrics across time periods and benchmarks
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger 
              value="before-after" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Before & After
            </TabsTrigger>
            <TabsTrigger 
              value="benchmarks" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Benchmarks
            </TabsTrigger>
            <TabsTrigger 
              value="peer-group" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Peer Group
            </TabsTrigger>
            <TabsTrigger 
              value="historical" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Year-over-Year
            </TabsTrigger>
          </TabsList>
          
          {/* Before & After Tab */}
          <TabsContent value="before-after" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Before</div>
                <div className="text-2xl font-bold">
                  {beforeAfterData.length > 0 ? beforeAfterData[0].value : 'N/A'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {beforeAfterData.length > 0 ? beforeAfterData[0].date : ''}
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">After</div>
                <div className="text-2xl font-bold">
                  {beforeAfterData.length > 1 ? beforeAfterData[1].value : 'N/A'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {beforeAfterData.length > 1 ? beforeAfterData[1].date : ''}
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Improvement</div>
                <div className={`text-2xl font-bold ${improvement.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {improvement.isPositive ? '+' : '-'}{improvement.value}%
                </div>
                <div className="flex items-center mt-1">
                  {improvement.isPositive ? (
                    <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1 text-red-500" />
                  )}
                  <span className="text-xs text-gray-500">
                    {improvement.isPositive ? 'Improvement' : 'Decline'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="h-[300px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={beforeAfterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis label={{ value: getMetricLabel(), angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value}`, getMetricLabel()]} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      {(enableExport || enableSharing) && (
        <CardFooter className="bg-slate-50 dark:bg-slate-800 border-t p-4">
          <div className="flex justify-end space-x-2 w-full">
            {enableExport && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            )}
            {enableSharing && (
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ComparativeAnalyticsChart;
