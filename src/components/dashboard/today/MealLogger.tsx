
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Camera, Plus } from "lucide-react";

interface MealLoggerProps {
  mealPlan: any[];
}

interface MealLog {
  meal: string;
  consumed: boolean;
  alternateFood: string;
  notes: string;
  water: number;
}

const MealLogger = ({ mealPlan }: MealLoggerProps) => {
  const [mealLogs, setMealLogs] = useState<MealLog[]>(
    mealPlan.map((meal: any) => ({
      meal: meal.meal,
      consumed: false,
      alternateFood: "",
      notes: "",
      water: 0
    }))
  );
  
  const [waterIntake, setWaterIntake] = useState(0);
  const [overallNotes, setOverallNotes] = useState("");
  
  const updateMealLog = (index: number, field: keyof MealLog, value: any) => {
    setMealLogs(prev => {
      const newLogs = [...prev];
      newLogs[index] = {
        ...newLogs[index],
        [field]: value
      };
      return newLogs;
    });
  };
  
  const handleSubmit = () => {
    // Here you would send the data to your backend or context
    console.log({
      meals: mealLogs,
      totalWaterIntake: waterIntake,
      overallNotes,
      date: new Date().toISOString()
    });
    
    toast({
      title: "Meals logged successfully!",
      description: "Your food intake has been saved.",
    });
  };
  
  const getMealTime = (mealName: string) => {
    const meal = mealPlan.find(m => m.meal === mealName);
    return meal ? meal.time : "";
  };
  
  return (
    <div className="py-4">
      <div className="space-y-6">
        <Tabs defaultValue="meals">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="meals">Meals</TabsTrigger>
            <TabsTrigger value="hydration">Hydration & Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="meals" className="space-y-4 mt-4">
            {mealLogs.map((log, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-medium">{log.meal}</h4>
                    <p className="text-xs text-muted-foreground">{getMealTime(log.meal)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`consumed-${index}`}
                      checked={log.consumed}
                      onCheckedChange={value => updateMealLog(index, 'consumed', Boolean(value))}
                    />
                    <Label htmlFor={`consumed-${index}`} className="text-sm">Consumed as planned</Label>
                  </div>
                </div>
                
                {!log.consumed && (
                  <div className="mb-3">
                    <Label htmlFor={`alternate-${index}`}>Alternate food consumed</Label>
                    <Input 
                      id={`alternate-${index}`}
                      placeholder="What did you eat instead?"
                      value={log.alternateFood}
                      onChange={e => updateMealLog(index, 'alternateFood', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor={`notes-${index}`}>Notes</Label>
                  <Textarea 
                    id={`notes-${index}`}
                    placeholder="How did you feel after this meal?"
                    value={log.notes}
                    onChange={e => updateMealLog(index, 'notes', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full mt-2"
                  >
                    <Camera className="h-4 w-4 mr-1" /> Add Photo
                  </Button>
                </div>
              </Card>
            ))}
            
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-1" /> Add Unplanned Meal/Snack
            </Button>
          </TabsContent>
          
          <TabsContent value="hydration" className="space-y-4 mt-4">
            <Card className="p-4">
              <div className="mb-4">
                <Label htmlFor="water-intake">Water Intake (glasses)</Label>
                <div className="flex items-center mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setWaterIntake(prev => Math.max(0, prev - 1))}
                    disabled={waterIntake <= 0}
                  >
                    -
                  </Button>
                  <div className="mx-4 min-w-[30px] text-center">{waterIntake}</div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setWaterIntake(prev => prev + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="overall-notes">Overall Notes</Label>
                <Textarea 
                  id="overall-notes"
                  placeholder="How was your nutrition overall today? Any cravings or issues?"
                  value={overallNotes}
                  onChange={e => setOverallNotes(e.target.value)}
                  className="mt-1"
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Button 
          className="w-full"
          onClick={handleSubmit}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Save Nutrition Log
        </Button>
      </div>
    </div>
  );
};

export default MealLogger;
