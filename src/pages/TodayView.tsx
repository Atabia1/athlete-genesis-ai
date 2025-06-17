
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import TodayWorkout from '@/components/dashboard/today/TodayWorkout';
import TodayMeal from '@/components/dashboard/today/TodayMeal';
import WellbeingCheck from '@/components/dashboard/today/WellbeingCheck';

export default function TodayView() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <TodayWorkout />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <TodayMeal />
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <WellbeingCheck />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
