
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TodayView from '@/pages/TodayView';
import SubscriptionManagement from '@/pages/SubscriptionManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Simple placeholder components for dashboard routes
const DashboardHome = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Today's Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You have 1 workout scheduled for today.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You're 75% towards your weekly goal.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Nutrition</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Log your meals to track your progress.</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

const TrainingPlans = () => (
  <div>
    <h1 className="text-3xl font-bold mb-6">Training Plans</h1>
    <Card>
      <CardContent className="p-6">
        <p>Your training plans will appear here.</p>
      </CardContent>
    </Card>
  </div>
);

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="today" element={<TodayView />} />
        <Route path="training-plans" element={<TrainingPlans />} />
        <Route path="subscription" element={<SubscriptionManagement />} />
      </Routes>
    </DashboardLayout>
  );
}
