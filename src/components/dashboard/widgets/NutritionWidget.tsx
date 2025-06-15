import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlusCircle, Utensils } from "lucide-react";

const NutritionWidget = () => {
  // Mock data for nutrition tracking
  const dailyCalories = {
    target: 2200,
    consumed: 1650,
    remaining: 550
  };

  const macros = {
    protein: { current: 85, target: 150 },
    carbs: { current: 180, target: 250 },
    fats: { current: 65, target: 75 }
  };

  const recentMeals = [
    { name: "Breakfast", calories: 420, time: "8:30 AM" },
    { name: "Lunch", calories: 680, time: "12:45 PM" },
    { name: "Snack", calories: 180, time: "3:20 PM" },
  ];

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Nutrition</CardTitle>
          <Button variant="ghost" size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Meal
          </Button>
        </div>
        <CardDescription>Track your daily nutrition intake</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-sm font-medium">Daily Calories</h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Consumed: {dailyCalories.consumed}</span>
            <span>Remaining: {dailyCalories.remaining}</span>
            <span>Target: {dailyCalories.target}</span>
          </div>
          <Progress value={(dailyCalories.consumed / dailyCalories.target) * 100} />
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Macros</h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="text-xs font-medium">Protein</div>
              <Progress value={(macros.protein.current / macros.protein.target) * 100} />
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                <span>{macros.protein.current}g</span>
                <span>{macros.protein.target}g</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium">Carbs</div>
              <Progress value={(macros.carbs.current / macros.carbs.target) * 100} />
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                <span>{macros.carbs.current}g</span>
                <span>{macros.carbs.target}g</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium">Fats</div>
              <Progress value={(macros.fats.current / macros.fats.target) * 100} />
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                <span>{macros.fats.current}g</span>
                <span>{macros.fats.target}g</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Recent Meals</h3>
          <ul className="space-y-3">
            {recentMeals.map((meal, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Utensils className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{meal.name}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {meal.calories} cal - {meal.time}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionWidget;
