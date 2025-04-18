
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const userProfile = await req.json();

    // Create a detailed prompt for the workout plan
    const workoutPrompt = `
      Create a detailed workout plan based on the following user profile:
      - User Type: ${userProfile.userType}
      - Fitness Goals: ${userProfile.fitnessGoals.join(', ')}
      - Sport/Activity: ${userProfile.sportActivity}
      - Experience Level: ${userProfile.experienceLevel}
      - Training Frequency: ${userProfile.frequency} days per week
      - Session Duration: ${userProfile.duration}
      - Preferred Time: ${userProfile.timeOfDay}
      - Available Equipment: ${userProfile.equipment.join(', ')}
      ${userProfile.otherEquipment ? `- Other Equipment: ${userProfile.otherEquipment}` : ''}

      Format the response as a JSON object with the following structure:
      {
        "weeklyPlan": [
          {
            "day": "Day 1",
            "focus": "Main focus of the day",
            "exercises": [
              {
                "name": "Exercise name",
                "sets": "Number of sets",
                "reps": "Number of reps",
                "rest": "Rest period",
                "notes": "Any specific technique notes"
              }
            ],
            "warmup": "Warmup instructions",
            "cooldown": "Cooldown instructions",
            "duration": "Estimated duration"
          }
        ],
        "periodization": "Brief explanation of how the plan progresses over time",
        "progressionStrategy": "How to progress when exercises become too easy",
        "adaptationGuidelines": "How the plan should adapt based on user feedback (e.g., if they report excessive soreness or plateaus)"
      }

      Make the plan extremely detailed and specific to the user's sport, goals, and equipment availability. Include appropriate intensity levels (RPE or %1RM if applicable). Design the workout schedule to match their available frequency.
      
      Focus on exercises that transfer well to their specific sport or activity. For example, if they're a basketball player, emphasize exercises that improve vertical jump, lateral movement, and upper body control.
    `;

    // Create a detailed prompt for the meal plan
    const mealPrompt = `
      Create a detailed meal plan based on the following user profile:
      - User Type: ${userProfile.userType}
      - Fitness Goals: ${userProfile.fitnessGoals.join(', ')}
      - Sport/Activity: ${userProfile.sportActivity}
      - Experience Level: ${userProfile.experienceLevel}
      - Training Frequency: ${userProfile.frequency} days per week

      Format the response as a JSON object with the following structure:
      {
        "dailyCalories": "Estimated daily caloric needs",
        "macroBreakdown": {
          "protein": "Protein recommendation in grams and percentage",
          "carbs": "Carbohydrate recommendation in grams and percentage",
          "fats": "Fat recommendation in grams and percentage"
        },
        "mealPlan": [
          {
            "meal": "Meal name (e.g., Breakfast)",
            "time": "Suggested timing",
            "options": [
              {
                "name": "Meal option name",
                "ingredients": ["List of ingredients"],
                "macros": {
                  "calories": "Calorie count",
                  "protein": "Protein in grams",
                  "carbs": "Carbs in grams",
                  "fats": "Fats in grams"
                }
              }
            ]
          }
        ],
        "hydrationGuidelines": "Hydration recommendations",
        "supplementRecommendations": "Any supplement suggestions",
        "nutrientTimingStrategies": "Recommendations for nutrient timing around workouts",
        "adaptationGuidelines": "How nutrition should be adjusted based on training load, recovery needs, and progress"
      }

      Make the meal plan extremely detailed and tailored to support the user's training regimen and specific sport requirements. For example, if they're an endurance athlete, emphasize carbohydrate timing strategies.
    `;

    // First, get the workout plan
    const workoutResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional fitness coach and sports scientist specialized in creating personalized workout plans. Provide detailed, evidence-based workout plans tailored to the individual\'s specific needs, goals, and constraints. Your plans should be specific to their sport or activity and focused on optimal performance and safety.' 
          },
          { role: 'user', content: workoutPrompt }
        ],
        temperature: 0.7,
      }),
    });

    const workoutData = await workoutResponse.json();
    const workoutPlan = JSON.parse(extractJSON(workoutData.choices[0].message.content));

    // Next, get the meal plan
    const mealResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional nutritionist specialized in sports nutrition and fitness. Provide detailed, evidence-based meal plans tailored to support athletic performance and fitness goals. Your nutrition advice should be specific to their sport\'s energy demands and recovery needs.' 
          },
          { role: 'user', content: mealPrompt }
        ],
        temperature: 0.7,
      }),
    });

    const mealData = await mealResponse.json();
    const mealPlan = JSON.parse(extractJSON(mealData.choices[0].message.content));

    // Log success for debugging purposes
    console.log("Successfully generated workout and meal plans");

    return new Response(JSON.stringify({ 
      workoutPlan, 
      mealPlan 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating fitness plan:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to generate fitness plan. Please try again.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to extract JSON from the response
function extractJSON(text: string): string {
  const jsonRegex = /{[\s\S]*}/;
  const match = text.match(jsonRegex);
  return match ? match[0] : '{}';
}
