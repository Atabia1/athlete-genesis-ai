
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Utensils, ChevronDown, ChevronUp, Coffee, Sun, Sunset } from 'lucide-react';
import { usePlan } from '@/context/PlanContext';

const MealPlanDisplay = () => {
  const { mealPlan } = usePlan();
  const [expandedMeal, setExpandedMeal] = useState<string | null>("Breakfast");

  if (!mealPlan) {
    return (
      <Card className="border-athleteGreen-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Your Meal Plan</CardTitle>
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

  const toggleMeal = (meal: string) => {
    setExpandedMeal(expandedMeal === meal ? null : meal);
  };

  const getMealIcon = (mealName: string) => {
    const lowerMeal = mealName.toLowerCase();
    if (lowerMeal.includes('breakfast')) return Coffee;
    if (lowerMeal.includes('lunch')) return Sun;
    if (lowerMeal.includes('dinner')) return Sunset;
    return Utensils;
  };

  return (
    <Card className="border-athleteGreen-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Utensils className="h-5 w-5 mr-2 text-athleteGreen-600" />
          Your Meal Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mealPlan" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mealPlan">Daily Meals</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mealPlan" className="mt-4">
            <div className="space-y-4">
              {mealPlan.mealPlan.map((meal: any) => {
                const MealIcon = getMealIcon(meal.meal);
                
                return (
                  <div key={meal.meal} className="border rounded-lg overflow-hidden">
                    <div 
                      className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
                      onClick={() => toggleMeal(meal.meal)}
                    >
                      <div className="flex items-center">
                        <div className="bg-athleteGreen-100 p-2 rounded-full mr-3">
                          <MealIcon className="h-4 w-4 text-athleteGreen-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{meal.meal}</h3>
                          <p className="text-xs text-gray-500">{meal.time}</p>
                        </div>
                      </div>
                      <div>
                        {expandedMeal === meal.meal ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {expandedMeal === meal.meal && (
                      <div className="p-4 border-t">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Options</h4>
                        <div className="space-y-4">
                          {meal.options.map((option: any, index: number) => (
                            <div key={index} className="border rounded-md p-3">
                              <h5 className="font-medium mb-2">{option.name}</h5>
                              
                              <div className="mt-2">
                                <h6 className="text-xs font-medium text-gray-500 mb-1">Ingredients:</h6>
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {option.ingredients.map((ingredient: string, i: number) => (
                                    <Badge key={i} variant="outline" className="bg-gray-50">
                                      {ingredient}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-4 gap-2 text-center mt-3">
                                <div className="bg-gray-50 rounded p-2">
                                  <p className="text-xs text-gray-500">Calories</p>
                                  <p className="font-medium">{option.macros.calories}</p>
                                </div>
                                <div className="bg-blue-50 rounded p-2">
                                  <p className="text-xs text-gray-500">Protein</p>
                                  <p className="font-medium">{option.macros.protein}</p>
                                </div>
                                <div className="bg-green-50 rounded p-2">
                                  <p className="text-xs text-gray-500">Carbs</p>
                                  <p className="font-medium">{option.macros.carbs}</p>
                                </div>
                                <div className="bg-yellow-50 rounded p-2">
                                  <p className="text-xs text-gray-500">Fats</p>
                                  <p className="font-medium">{option.macros.fats}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="nutrition" className="mt-4">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Daily Calories</h3>
                <p className="text-lg font-bold text-athleteGreen-700">{mealPlan.dailyCalories}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Macronutrient Breakdown</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Protein</p>
                    <p className="font-bold text-blue-700">{mealPlan.macroBreakdown.protein}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Carbs</p>
                    <p className="font-bold text-green-700">{mealPlan.macroBreakdown.carbs}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Fats</p>
                    <p className="font-bold text-yellow-700">{mealPlan.macroBreakdown.fats}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Hydration Guidelines</h3>
                <p className="text-sm text-gray-700">{mealPlan.hydrationGuidelines}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Supplement Recommendations</h3>
                <p className="text-sm text-gray-700">{mealPlan.supplementRecommendations}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MealPlanDisplay;
