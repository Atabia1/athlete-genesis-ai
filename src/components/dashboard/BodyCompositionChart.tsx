import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BodyCompositionData {
  date: string;
  weight: number;
  bodyFat: number;
  muscleMass: number;
  visceralFat: number;
}

const BodyCompositionChart = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Sample data
  const data: BodyCompositionData[] = [
    { date: '2024-01-01', weight: 70.5, bodyFat: 15.2, muscleMass: 32.1, visceralFat: 4.5 },
    { date: '2024-01-08', weight: 70.2, bodyFat: 14.8, muscleMass: 32.3, visceralFat: 4.3 },
    { date: '2024-01-15', weight: 69.8, bodyFat: 14.5, muscleMass: 32.5, visceralFat: 4.2 },
    { date: '2024-01-22', weight: 69.5, bodyFat: 14.2, muscleMass: 32.8, visceralFat: 4.0 },
    { date: '2024-01-29', weight: 69.2, bodyFat: 13.9, muscleMass: 33.0, visceralFat: 3.8 },
  ];

  const currentData = data[data.length - 1];
  const previousData = data[data.length - 2];

  const calculateChange = (current: number, previous: number) => {
    const change = current - previous;
    const percentage = (change / previous) * 100;
    return { change, percentage };
  };

  const weightChange = calculateChange(currentData.weight, previousData.weight);
  const bodyFatChange = calculateChange(currentData.bodyFat, previousData.bodyFat);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Body Composition
              </CardTitle>
              <CardDescription>Track your body metrics over time</CardDescription>
            </div>
            <div className="flex gap-2">
              {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{currentData.weight.toFixed(1)} kg</div>
              <div className="text-sm text-muted-foreground">Weight</div>
              <div className={`flex items-center justify-center gap-1 text-xs ${
                weightChange.change < 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {weightChange.change < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                {Math.abs(weightChange.change).toFixed(1)} kg
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">{currentData.bodyFat.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Body Fat</div>
              <div className={`flex items-center justify-center gap-1 text-xs ${
                bodyFatChange.change < 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {bodyFatChange.change < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                {Math.abs(bodyFatChange.change).toFixed(1)}%
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">{currentData.muscleMass.toFixed(1)} kg</div>
              <div className="text-sm text-muted-foreground">Muscle Mass</div>
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.2 kg
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">{currentData.visceralFat.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Visceral Fat</div>
              <Badge variant="outline" className="text-xs">
                <TrendingDown className="h-3 w-3 mr-1" />
                -0.2
              </Badge>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Weight (kg)"
                />
                <Line 
                  type="monotone" 
                  dataKey="bodyFat" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  name="Body Fat (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BodyCompositionChart;
