
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const progressData = [
  { name: "Week 1", value: 65 },
  { name: "Week 2", value: 72 },
  { name: "Week 3", value: 78 },
  { name: "Week 4", value: 74 },
  { name: "Week 5", value: 80 },
  { name: "Week 6", value: 85 }
];

const ProgressWidget = () => {
  return (
    <Card className="border-athleteBlue-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Training Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={progressData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  border: "none"
                }}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Bar 
                dataKey="value" 
                name="Performance Score"
                fill="url(#colorGradient)" 
                radius={[4, 4, 0, 0]} 
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3a56ff" />
                  <stop offset="100%" stopColor="#86e9bc" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressWidget;
