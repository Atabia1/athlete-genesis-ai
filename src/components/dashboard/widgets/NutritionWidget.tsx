
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, Coffee, Beef } from "lucide-react";

const mealPlan = [
  {
    time: "7:30 AM",
    meal: "Breakfast",
    description: "Greek yogurt with berries and honey, 2 eggs",
    icon: Coffee
  },
  {
    time: "10:30 AM",
    meal: "Snack",
    description: "Apple with almond butter",
    icon: Apple
  },
  {
    time: "12:30 PM",
    meal: "Lunch",
    description: "Chicken salad with mixed greens and olive oil dressing",
    icon: Beef
  }
];

const NutritionWidget = () => {
  return (
    <Card className="border-athleteBlue-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Nutrition Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mealPlan.map((meal, index) => (
            <div key={index} className="flex items-start">
              <div className="bg-athleteGreen-100 p-2 rounded-full mr-3 text-athleteGreen-600">
                <meal.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500">{meal.time}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="font-medium">{meal.meal}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{meal.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionWidget;
