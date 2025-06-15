import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Smile, Frown, Meh, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const WellbeingCheck = () => {
  const { toast } = useToast();
  const [mood, setMood] = useState<"happy" | "neutral" | "sad">("neutral");
  const [energyLevel, setEnergyLevel] = useState(50);
  const [sleepQuality, setSleepQuality] = useState(50);
  const [notes, setNotes] = useState("");

  const handleMoodChange = (newMood: "happy" | "neutral" | "sad") => {
    setMood(newMood);
  };

  const handleSubmit = () => {
    // Here you would send the data to your backend or context
    // For now, let's just show a toast notification
    console.log({
      mood,
      energyLevel,
      sleepQuality,
      notes,
      date: new Date().toISOString()
    });

    toast({
      title: "Wellbeing check-in saved!",
      description: "Your wellbeing data has been recorded.",
    });
  };

  return (
    <Card className="border-yellow-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="h-5 w-5 mr-2 text-yellow-600" />
          Wellbeing Check-in
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">How are you feeling today?</h3>
          <div className="flex justify-between">
            <Button
              variant="ghost"
              className={`rounded-full ${mood === "sad" ? "bg-red-100 text-red-700" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
              onClick={() => handleMoodChange("sad")}
            >
              <Frown className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className={`rounded-full ${mood === "neutral" ? "bg-yellow-100 text-yellow-700" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
              onClick={() => handleMoodChange("neutral")}
            >
              <Meh className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className={`rounded-full ${mood === "happy" ? "bg-green-100 text-green-700" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
              onClick={() => handleMoodChange("happy")}
            >
              <Smile className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Energy Level (1-100)</h3>
          <div className="flex items-center">
            <Minus className="h-4 w-4 mr-2 text-gray-500" />
            <Slider
              defaultValue={[energyLevel]}
              max={100}
              step={1}
              onValueChange={(value) => setEnergyLevel(value[0])}
            />
            <Plus className="h-4 w-4 ml-2 text-gray-500" />
          </div>
          <Badge variant="secondary" className="mt-1">{energyLevel}</Badge>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Sleep Quality (1-100)</h3>
          <div className="flex items-center">
            <Minus className="h-4 w-4 mr-2 text-gray-500" />
            <Slider
              defaultValue={[sleepQuality]}
              max={100}
              step={1}
              onValueChange={(value) => setSleepQuality(value[0])}
            />
            <Plus className="h-4 w-4 ml-2 text-gray-500" />
          </div>
          <Badge variant="secondary" className="mt-1">{sleepQuality}</Badge>
        </div>

        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Anything else you'd like to note?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button className="w-full" onClick={handleSubmit}>
          Save Check-in
        </Button>
      </CardContent>
    </Card>
  );
};

export default WellbeingCheck;
