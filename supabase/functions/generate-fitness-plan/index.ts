
/**
 * Supabase Edge Function: Generate Fitness Plan
 *
 * This Edge Function generates personalized workout and meal plans based on user profiles.
 * It uses OpenAI's GPT-4o model to create highly customized fitness and nutrition plans
 * tailored to the user's specific goals, experience level, and available equipment.
 *
 * The function takes a user profile as input and returns workout and meal plans as JSON.
 * It includes fallback mechanisms and detailed error handling for production reliability.
 *
 * @requires OPENAI_API_KEY - Environment variable for OpenAI API authentication
 */

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/**
 * Get the OpenAI API key from environment variables
 * This key is required for making requests to the OpenAI API
 */
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Check if OpenAI API key is set
if (!openAIApiKey) {
  console.error('OPENAI_API_KEY environment variable is not set');
}

/**
 * CORS headers configuration
 * These headers allow cross-origin requests to the Edge Function
 * Required for frontend applications to communicate with this API
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',                // Allow requests from any origin
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allow specific HTTP methods
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', // Allow specific headers
  'Access-Control-Max-Age': '86400',                 // Cache preflight requests for 24 hours
};

/**
 * Main Edge Function handler
 * Processes incoming HTTP requests and generates fitness plans
 *
 * @param {Request} req - The incoming HTTP request
 * @returns {Response} - JSON response with workout and meal plans or error details
 */
serve(async (req) => {
  /**
   * Handle CORS preflight requests (OPTIONS method)
   * Required for browsers to verify if the actual request is allowed
   */
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    /**
     * Parse the request body to get the user profile data
     * This contains all the information needed to generate personalized plans
     *
     * @type {Object} userProfile - User's fitness profile and preferences
     */
    const userProfile = await req.json();

    /**
     * System message for workout plan generation
     * This provides context and instructions to the AI model
     * Customized based on the user's sport, goals, and experience level
     */
    let workoutSystemMessage = `
      As an expert sports scientist and strength & conditioning coach with expertise in ${userProfile.sportActivity || 'general fitness'},
      your task is to create a highly personalized training program. Utilize evidence-based training principles
      including progressive overload, specificity, periodization, and recovery optimization.
      For ${userProfile.experienceLevel || 'intermediate'} level athletes/individuals, focus on their goals of ${userProfile.fitnessGoals?.join(', ') || 'general fitness'}.
      Design exercises that specifically transfer to improved performance in ${userProfile.sportActivity || 'daily activities'}.
      Include appropriate training volumes, intensities, and frequencies based on exercise science research.
      Ensure that the workout schedule matches their available ${userProfile.frequency || '3-4'} days per week training frequency.
    `;

    // Add role-specific modifications to the system message
    if (userProfile.userType === 'athlete') {
      workoutSystemMessage += `
        As this plan is for a competitive athlete focusing on ${userProfile.sportActivity},
        include sport-specific drills and exercises that directly enhance performance metrics.
        Consider competition cycles and periodization to peak at the right times.
        Include mobility work specifically needed for their sport and position.
        Address common injury risks in ${userProfile.sportActivity} with preventative exercises.
      `;
    } else if (userProfile.userType === 'individual') {
      workoutSystemMessage += `
        As this plan is for a fitness enthusiast, balance training efficiency with enjoyment to promote adherence.
        Include exercise variations to keep workouts interesting and motivating.
        Address functional fitness for daily life activities alongside specific goals.
        Provide modifications for exercises based on equipment availability and time constraints.
      `;
    } else if (userProfile.userType === 'coach') {
      workoutSystemMessage += `
        As this plan will be used by a coach, include coaching cues and technique points for each exercise.
        Provide options for scaling exercises up or down based on individual athlete abilities.
        Include assessment metrics to track progress objectively.
        Suggest group training formats where relevant that could be implemented with teams.
      `;
    }

    /**
     * System message for nutrition plan generation
     * This provides context and instructions to the AI model for creating meal plans
     * Customized based on the user's sport, goals, and training schedule
     */
    let nutritionSystemMessage = `
      As a sports nutrition specialist with expertise in ${userProfile.sportActivity || 'general fitness'} nutrition,
      your task is to create a personalized nutrition plan. Utilize evidence-based nutritional science
      including energy balance, macronutrient timing, meal frequency, and recovery nutrition principles.
      For ${userProfile.experienceLevel || 'intermediate'} level athletes/individuals pursuing ${userProfile.fitnessGoals?.join(', ') || 'general fitness'},
      design meal plans that support both performance and recovery.
      Focus on practical, sustainable eating patterns with specific attention to nutrient timing around training.
      Include hydration strategies appropriate for ${userProfile.sportActivity || 'general fitness'} activities.
      Account for their training frequency of ${userProfile.frequency || '3-4'} days per week and session duration of ${userProfile.duration || '45-60'} minutes.
    `;

    /**
     * Add role-specific modifications to the nutrition system message
     * Different user types (athlete, individual, coach) get specialized nutrition guidance
     */
    if (userProfile.userType === 'athlete') {
      nutritionSystemMessage += `
        This nutrition plan is for a competitive athlete in ${userProfile.sportActivity}.
        Include nutrition protocols for competition days vs. training days.
        Address pre-competition nutrition timing and composition in detail.
        Include recovery nutrition strategies for high-intensity training sessions.
        Provide specific guidance on appropriate supplement use if relevant to their sport.
      `;
    } else if (userProfile.userType === 'individual') {
      nutritionSystemMessage += `
        This nutrition plan is for a fitness enthusiast focused on ${userProfile.fitnessGoals?.join(', ') || 'general fitness'}.
        Emphasize sustainable dietary patterns that work within their lifestyle.
        Provide practical meal prep strategies and time-saving tips.
        Include guidance on eating out while staying on track with fitness goals.
        Focus on long-term dietary adherence rather than short-term aggressive approaches.
      `;
    } else if (userProfile.userType === 'coach') {
      nutritionSystemMessage += `
        This nutrition plan will be used by a coach working with athletes.
        Include educational components that can be shared with athletes.
        Provide team nutrition strategies for training camps or competition days.
        Include assessment tools to identify nutritional issues in athletes.
        Address common nutritional misconceptions in sports and fitness.
      `;
    }

    /**
     * Create a detailed prompt for the workout plan generation
     * This prompt includes the user's profile information and specifies the expected JSON format
     * It provides clear instructions to the AI about what to include in the workout plan
     */
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

    /**
     * Create a detailed prompt for the meal plan generation
     * This prompt includes the user's profile information and specifies the expected JSON format
     * It provides clear instructions to the AI about what to include in the nutrition plan
     */
    const mealPrompt = `
      Create a detailed meal plan based on the following user profile:
      - User Type: ${userProfile.userType}
      - Fitness Goals: ${userProfile.fitnessGoals.join(', ')}
      - Sport/Activity: ${userProfile.sportActivity}
      - Experience Level: ${userProfile.experienceLevel}
      - Training Frequency: ${userProfile.frequency} days per week
      - Session Duration: ${userProfile.duration}
      - Preferred Time: ${userProfile.timeOfDay} (for timing nutrition around workouts)

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

    /**
     * Log received profile data for debugging purposes
     * This helps with troubleshooting by showing the key user profile data being processed
     */
    console.log("Generating plans for profile:", {
      type: userProfile.userType,
      sport: userProfile.sportActivity,
      goals: userProfile.fitnessGoals,
      level: userProfile.experienceLevel
    });

    /**
     * Verify OpenAI API key is available before making API calls
     * This prevents unnecessary API calls and provides a clear error message
     */
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not set. Please configure the OPENAI_API_KEY environment variable.');
    }

    /**
     * Make API call to OpenAI to generate the workout plan
     * Uses GPT-4o model for higher quality, more detailed workout plans
     *
     * @returns {Promise<Response>} - Response from OpenAI API containing the workout plan
     */
    const workoutResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: workoutSystemMessage
          },
          { role: 'user', content: workoutPrompt }
        ],
        temperature: 0.7, // Controls randomness: lower is more deterministic
      }),
    });

    /**
     * Parse the OpenAI API response for the workout plan
     * @type {any} - The parsed JSON response from OpenAI
     */
    const workoutData = await workoutResponse.json();
    console.log("Workout API Response received");

    /**
     * Validate the OpenAI API response contains the expected data structure
     * This prevents errors when trying to access undefined properties
     */
    if (!workoutData.choices || !workoutData.choices[0]) {
      console.error("Invalid workout response:", workoutData);
      throw new Error("Failed to generate workout plan: Invalid API response");
    }

    /**
     * Extract and parse the JSON workout plan from the OpenAI response
     * @type {any} - The parsed workout plan object
     */
    let workoutPlan: any;
    try {
      workoutPlan = JSON.parse(extractJSON(workoutData.choices[0].message.content));
      console.log("Workout plan successfully parsed");
    } catch (error) {
      console.error("Error parsing workout plan:", error);
      console.error("Raw workout response:", workoutData.choices[0].message.content);
      throw new Error("Failed to parse workout plan");
    }

    /**
     * Make API call to OpenAI to generate the meal plan
     * Uses GPT-4o model for higher quality, more detailed nutrition plans
     *
     * @returns {Promise<Response>} - Response from OpenAI API containing the meal plan
     */
    const mealResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: nutritionSystemMessage
          },
          { role: 'user', content: mealPrompt }
        ],
        temperature: 0.7, // Controls randomness: lower is more deterministic
      }),
    });

    /**
     * Parse the OpenAI API response for the meal plan
     */
    const mealData = await mealResponse.json();
    console.log("Meal API Response received");

    /**
     * Validate the OpenAI API response contains the expected data structure
     * This prevents errors when trying to access undefined properties
     */
    if (!mealData.choices || !mealData.choices[0]) {
      console.error("Invalid meal response:", mealData);
      throw new Error("Failed to generate meal plan: Invalid API response");
    }

    /**
     * Extract and parse the JSON meal plan from the OpenAI response
     * @type {any} - The parsed meal plan object
     */
    let mealPlan: any;
    try {
      mealPlan = JSON.parse(extractJSON(mealData.choices[0].message.content));
      console.log("Meal plan successfully parsed");
    } catch (error) {
      console.error("Error parsing meal plan:", error);
      console.error("Raw meal response:", mealData.choices[0].message.content);
      throw new Error("Failed to parse meal plan");
    }

    /**
     * Log success for debugging purposes
     * This helps track successful API calls in the logs
     */
    console.log("Successfully generated workout and meal plans");

    /**
     * Return the combined plans as a JSON response
     * Includes both workout and meal plans in a single response object
     * Sets appropriate CORS headers for cross-origin access
     */
    return new Response(JSON.stringify({
      workoutPlan,
      mealPlan
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    /**
     * Handle and log any errors that occur during plan generation
     * Returns a structured error response with appropriate status code
     */
    console.error('Error generating fitness plan:', error);

    return new Response(JSON.stringify({
      error: 'Failed to generate fitness plan. Please try again.',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

/**
 * Helper function to extract JSON from the response text
 *
 * OpenAI sometimes returns JSON embedded in markdown code blocks or with additional text.
 * This function attempts to extract valid JSON using multiple strategies:
 * 1. First tries to find a standard JSON object using regex
 * 2. If that fails, looks for JSON in markdown code blocks
 * 3. Validates that extracted content is valid JSON before returning
 * 4. Returns empty object as fallback to prevent crashes
 *
 * @param {string} text - The text containing JSON, possibly wrapped in markdown
 * @returns {string} - The extracted JSON string or empty object if no valid JSON found
 */
function extractJSON(text: string): string {
  // First try to find a JSON object with standard regex
  const jsonRegex = /{[\s\S]*}/;
  const match = text.match(jsonRegex);

  if (match) {
    try {
      // Validate that it's parseable JSON before returning
      JSON.parse(match[0]);
      return match[0];
    } catch (e) {
      console.warn("Found JSON-like text but it's not valid JSON:", e);
    }
  }

  // If standard regex fails, try a more aggressive approach with markdown code blocks
  const markdownMatch = text.match(/```(?:json)?([\s\S]*?)```/);
  if (markdownMatch) {
    const potentialJson = markdownMatch[1].trim();
    try {
      // Check if the content of the code block is valid JSON
      JSON.parse(potentialJson);
      return potentialJson;
    } catch (e) {
      console.warn("Found code block but content is not valid JSON:", e);
    }
  }

  // If all else fails, return empty object to prevent crashes
  console.error("Could not extract valid JSON from:", text);
  return '{}';
}
