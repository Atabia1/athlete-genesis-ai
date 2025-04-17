
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WelcomeWidget from '@/components/dashboard/widgets/WelcomeWidget';
import WorkoutWidget from '@/components/dashboard/widgets/WorkoutWidget';
import NutritionWidget from '@/components/dashboard/widgets/NutritionWidget';
import ProgressWidget from '@/components/dashboard/widgets/ProgressWidget';

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 gap-6">
        <WelcomeWidget />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WorkoutWidget />
          <NutritionWidget />
        </div>
        
        <ProgressWidget />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
