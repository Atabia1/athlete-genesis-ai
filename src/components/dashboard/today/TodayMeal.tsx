
import { useState } from "react";
import { usePlan } from "@/context/PlanContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Check, Coffee, Sun, Sunset, PenLine, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MealLogger from "./MealLogger";
import { useNavigate } from "react-router-dom";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import { OfflineContentBadge } from "@/components/ui/offline-content-badge";

const TodayMeal = () => {
  const { mealPlan } = usePlan();
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();
  const [completedMeals, setCompletedMeals] = useState<string[]>([]);

  if (!mealPlan) {
    return (
      <Card className="border-athleteGreen-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Utensils className="h-5 w-5 mr-2 text-athleteGreen-600" />
            Today's Meals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Utensils className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No Meal Plan Available</h3>
            <p className="text-gray-500 mt-2">Complete the onboarding process to generate your personalized meal plan.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const toggleMealCompletion = (mealName: string) => {
    setCompletedMeals(prev => {
      if (prev.includes(mealName)) {
        return prev.filter(name => name !== mealName);
      } else {
        return [...prev, mealName];
      }
    });
  };

  const getMealIcon = (mealName: string) => {
    const lowerMeal = mealName.toLowerCase();
    if (lowerMeal.includes('breakfast')) return Coffee;
    if (lowerMeal.includes('lunch')) return Sun;
    if (lowerMeal.includes('dinner')) return Sunset;
    return Utensils;
  };

  return (
    <Card className="border-athleteGreen-200 shadow-sm relative">
      {!isOnline && <OfflineContentBadge contentType="meal plan" position="top-right" />}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Utensils className="h-5 w-5 mr-2 text-athleteGreen-600" />
            Today's Meals
          </CardTitle>
          {!isOnline && (
            <OfflineIndicator
              variant="badge"
              featureSpecific={true}
              featureName="This meal plan"
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mealPlan.mealPlan.map((meal: any, index: number) => {
            const MealIcon = getMealIcon(meal.meal);

            return (
              <div
                key={index}
                className={`flex items-start p-4 rounded-md border ${
                  completedMeals.includes(meal.meal)
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full mr-3 p-1 ${
                    completedMeals.includes(meal.meal)
                      ? 'text-green-600 hover:text-green-700 hover:bg-green-100'
                      : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                  }`}
                  onClick={() => toggleMealCompletion(meal.meal)}
                >
                  <Check className="h-4 w-4" />
                </Button>

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium flex items-center">
                      <div className="bg-athleteGreen-100 p-1.5 rounded-full mr-2">
                        <MealIcon className="h-3.5 w-3.5 text-athleteGreen-600" />
                      </div>
                      {meal.meal}
                    </h4>
                    <span className="text-xs text-gray-500">{meal.time}</span>
                  </div>

                  <div className="mt-3">
                    {meal.options.map((option: any, optionIndex: number) => (
                      <div key={optionIndex} className="mt-2 ml-2 text-sm">
                        <p className="font-medium">{option.name}</p>
                        <div className="mt-1">
                          <div className="flex flex-wrap gap-1 text-xs">
                            {option.ingredients.slice(0, 3).map((ingredient: string, i: number) => (
                              <Badge key={i} variant="outline" className="bg-gray-50">
                                {ingredient}
                              </Badge>
                            ))}
                            {option.ingredients.length > 3 && (
                              <Badge variant="outline" className="bg-gray-50">
                                +{option.ingredients.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="border-athleteGreen-200 text-athleteGreen-700 hover:bg-athleteGreen-50 hover:text-athleteGreen-800"
            >
              <PenLine className="mr-2 h-4 w-4" />
              Log Meals
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Log Your Meals</SheetTitle>
            </SheetHeader>
            <MealLogger mealPlan={mealPlan.mealPlan} />
          </SheetContent>
        </Sheet>

        <Button
          variant="ghost"
          className="text-gray-500"
          onClick={() => navigate("/dashboard")}
        >
          View Full Plan
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TodayMeal;
