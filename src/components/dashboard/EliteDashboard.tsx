import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlan } from "@/context/PlanContext";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '@/hooks/use-auth';

const EliteDashboard = () => {
  const navigate = useNavigate();
  const { workoutPlan, mealPlan } = usePlan();
  const { user } = useAuth();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Welcome Card */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Welcome, User!
          </CardTitle>
          <Avatar>
            <AvatarFallback>AG</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Here's an overview of your progress and plans for today.
          </p>
        </CardContent>
      </Card>

      {/* Workout Plan Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Workout Plan</CardTitle>
          {workoutPlan ? (
            <Progress value={66} />
          ) : null}
        </CardHeader>
        <CardContent>
          {workoutPlan ? (
            <>
              <p className="text-sm text-muted-foreground">
                Your workout plan for today is ready.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/dashboard")}
              >
                View Full Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No workout plan available. Complete the onboarding process to generate your personalized workout plan.
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/onboarding")}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Meal Plan Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Meal Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {mealPlan ? (
            <>
              <p className="text-sm text-muted-foreground">
                Your meal plan for today is ready.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/dashboard")}
              >
                View Full Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No meal plan available. Complete the onboarding process to generate your personalized meal plan.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Progress Chart Card */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Progress Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <AreaChart width={500} height={200} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </CardContent>
      </Card>

      {/* Goals Overview Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Goals Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </CardContent>
      </Card>
    </div>
  );
};

export default EliteDashboard;
