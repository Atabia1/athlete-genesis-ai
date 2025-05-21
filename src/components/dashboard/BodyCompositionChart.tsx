
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Scale, ChevronRight } from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// Sample body composition data
const bodyCompData = [
  { date: '2023-01-01', weight: 82, bodyFat: 24, muscle: 58, water: 55 },
  { date: '2023-02-01', weight: 81, bodyFat: 23, muscle: 58.5, water: 55.5 },
  { date: '2023-03-01', weight: 80, bodyFat: 22.5, muscle: 59, water: 56 },
  { date: '2023-04-01', weight: 78.5, bodyFat: 21.5, muscle: 59.5, water: 56.5 },
  { date: '2023-05-01', weight: 77, bodyFat: 20, muscle: 60, water: 57 },
  { date: '2023-06-01', weight: 76.5, bodyFat: 19, muscle: 60.5, water: 57.5 }
];

// Sample body composition breakdown for current date
const currentBreakdown = [
  { name: 'Body Fat', value: 19, color: '#f97316' },
  { name: 'Muscle Mass', value: 45, color: '#3b82f6' },
  { name: 'Water', value: 31, color: '#06b6d4' },
  { name: 'Other', value: 5, color: '#94a3b8' }
];

// Define dataset for the charts
const datasets = [
  { label: 'Weight (kg)', key: 'weight', color: '#6366f1' },
  { label: 'Body Fat (%)', key: 'bodyFat', color: '#f97316' },
  { label: 'Muscle Mass (kg)', key: 'muscle', color: '#3b82f6' },
  { label: 'Water (%)', key: 'water', color: '#06b6d4' }
];

/**
 * BodyCompositionChart Component
 * 
 * Visualizes user's body composition data over time
 */
const BodyCompositionChart = ({ className = '' }) => {
  const [timeRange, setTimeRange] = useState('6months');
  const [activeTab, setActiveTab] = useState('trends');
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  // Get starting values for comparisons
  const startValues = bodyCompData[0];
  const currentValues = bodyCompData[bodyCompData.length - 1];
  
  // Calculate changes
  const calculateChange = (metric: keyof typeof startValues) => {
    const change = currentValues[metric] - startValues[metric];
    return {
      value: Math.abs(change).toFixed(1),
      direction: change >= 0 ? 'increase' : 'decrease'
    };
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Scale className="mr-2 h-5 w-5 text-blue-500" />
          Body Composition
        </CardTitle>
        <CardDescription>Track changes in your body composition over time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="composition">Composition</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="ml-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="trends" className="space-y-8">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={bodyCompData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => formatDate(date)}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    const dataset = datasets.find(d => d.key === name);
                    return [value, dataset?.label || name];
                  }}
                  labelFormatter={(label) => formatDate(String(label))}
                />
                <Legend />
                {datasets.map(dataset => (
                  <Line 
                    key={dataset.key}
                    type="monotone"
                    dataKey={dataset.key}
                    stroke={dataset.color}
                    name={dataset.key}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {datasets.map(dataset => {
              const change = calculateChange(dataset.key as keyof typeof startValues);
              return (
                <div key={dataset.key} className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">{dataset.label}</div>
                  <div className="flex justify-between items-end">
                    <div className="text-2xl font-bold">
                      {currentValues[dataset.key as keyof typeof currentValues]}
                    </div>
                    <div className={`flex items-center text-sm ${
                      dataset.key === 'weight' || dataset.key === 'bodyFat' 
                        ? change.direction === 'decrease' ? 'text-green-600' : 'text-red-600'
                        : change.direction === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <ChevronRight className={`h-4 w-4 ${
                        change.direction === 'increase' ? 'rotate-90' : '-rotate-90'
                      }`} />
                      {change.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="composition" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-2">Current Composition</div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={currentBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {currentBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Detailed Breakdown</div>
              
              <div className="space-y-4">
                {currentBreakdown.map(item => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{ 
                          width: `${item.value}%`,
                          backgroundColor: item.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-3 bg-blue-50 text-blue-800 rounded-lg">
                <div className="text-sm font-medium">Smart Analysis</div>
                <ul className="mt-1 space-y-1 text-xs">
                  <li className="flex">
                    <span className="mr-1">•</span>
                    <span>Your muscle mass has increased by 2.5kg in the last 6 months</span>
                  </li>
                  <li className="flex">
                    <span className="mr-1">•</span>
                    <span>Body fat percentage has decreased by 5% since tracking began</span>
                  </li>
                  <li className="flex">
                    <span className="mr-1">•</span>
                    <span>Water percentage is within the optimal range</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default BodyCompositionChart;
