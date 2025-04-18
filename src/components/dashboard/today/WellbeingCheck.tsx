
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Save, ArrowRight } from "lucide-react";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const wellbeingSchema = z.object({
  sleepHours: z.string().min(1, "Please enter sleep hours"),
  sleepQuality: z.number().min(1).max(10),
  energyLevel: z.number().min(1).max(10),
  stressLevel: z.number().min(1).max(10),
  soreness: z.number().min(1).max(10),
  mood: z.number().min(1).max(10),
  notes: z.string().optional(),
});

type WellbeingFormValues = z.infer<typeof wellbeingSchema>;

const WellbeingCheck = () => {
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm<WellbeingFormValues>({
    resolver: zodResolver(wellbeingSchema),
    defaultValues: {
      sleepHours: "",
      sleepQuality: 5,
      energyLevel: 5,
      stressLevel: 5,
      soreness: 5,
      mood: 5,
      notes: "",
    },
  });
  
  const onSubmit = (data: WellbeingFormValues) => {
    // Here you would send the data to your backend or context
    console.log({
      ...data,
      date: new Date().toISOString(),
    });
    
    toast({
      title: "Wellbeing check-in logged!",
      description: "Your wellbeing data has been saved.",
    });
    
    setSubmitted(true);
  };
  
  const resetForm = () => {
    form.reset();
    setSubmitted(false);
  };

  return (
    <Card className="border-purple-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Moon className="h-5 w-5 mr-2 text-purple-600" />
          Wellbeing Check-in
        </CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="py-6 text-center">
            <svg 
              className="w-12 h-12 text-green-500 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-700">Wellbeing Check-in Complete</h3>
            <p className="text-gray-500 mt-2">Thanks for logging your wellbeing data today!</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={resetForm}
            >
              Log Again
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="sleepHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sleep Duration (hours)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sleepQuality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sleep Quality ({field.value}/10)</FormLabel>
                    <FormControl>
                      <Slider 
                        min={1} 
                        max={10} 
                        step={1} 
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="energyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Energy Level ({field.value}/10)</FormLabel>
                    <FormControl>
                      <Slider 
                        min={1} 
                        max={10} 
                        step={1} 
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stressLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stress Level ({field.value}/10)</FormLabel>
                    <FormControl>
                      <Slider 
                        min={1} 
                        max={10} 
                        step={1} 
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="soreness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Muscle Soreness ({field.value}/10)</FormLabel>
                    <FormControl>
                      <Slider 
                        min={1} 
                        max={10} 
                        step={1} 
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>None</span>
                      <span>Severe</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overall Mood ({field.value}/10)</FormLabel>
                    <FormControl>
                      <Slider 
                        min={1} 
                        max={10} 
                        step={1} 
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="How are you feeling overall? Any injuries or concerns?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Check-in
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default WellbeingCheck;
