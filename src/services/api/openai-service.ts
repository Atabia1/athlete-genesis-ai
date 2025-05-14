/**
 * OpenAI Service
 *
 * This service provides a wrapper around the OpenAI API for generating
 * workout plans, meal plans, and other AI-powered features.
 *
 * It handles authentication, request formatting, and error handling.
 */

import { getOpenAIConfig } from '@/utils/env-config';
import { logError } from '@/shared/utils/error-handling';
import { WorkoutPlan, MealPlan } from '@/types/workout';
import { standardizeWorkoutPlan } from '@/utils/workout-normalizer';

// OpenAI API endpoints
const OPENAI_API_URL = 'https://api.openai.com/v1';

// OpenAI models
export enum OpenAIModel {
  GPT_4O = 'gpt-4o',
  GPT_4O_MINI = 'gpt-4o-mini',
  GPT_4 = 'gpt-4',
  GPT_3_5_TURBO = 'gpt-3.5-turbo',
  // Fine-tuned models - update this with your actual fine-tuned model ID after creating it
  ATHLETE_GPT_WORKOUT = 'ft:gpt-4o-mini:athlete-gpt:workout:latest',
  ATHLETE_GPT_NUTRITION = 'ft:gpt-4o-mini:athlete-gpt:nutrition:latest'
}

// OpenAI chat message role
export type MessageRole = 'system' | 'user' | 'assistant';

// OpenAI chat message
export interface ChatMessage {
  role: MessageRole;
  content: string;
}

// OpenAI chat completion request
export interface ChatCompletionRequest {
  model: OpenAIModel;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

// OpenAI chat completion response
export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// User profile for generating fitness plans
export interface UserProfile {
  userType: 'athlete' | 'coach' | 'individual';
  sportActivity?: string;
  fitnessGoals?: string[];
  experienceLevel?: string;
  frequency?: string;
  duration?: string;
  equipment?: string[];
  injuries?: string[];
  dietaryRestrictions?: string[];
  [key: string]: any;
}

// Fitness plan response
export interface FitnessPlanResponse {
  workoutPlan: WorkoutPlan;
  mealPlan: MealPlan;
}

/**
 * OpenAI service interface
 */
export interface OpenAIService {
  /**
   * Generate a chat completion
   * @param request The chat completion request
   * @returns The chat completion response
   */
  generateChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;

  /**
   * Generate a fitness plan
   * @param userProfile The user profile
   * @returns The fitness plan response
   */
  generateFitnessPlan(userProfile: UserProfile): Promise<FitnessPlanResponse>;

  /**
   * Generate a workout plan
   * @param userProfile The user profile
   * @returns The workout plan
   */
  generateWorkoutPlan(userProfile: UserProfile): Promise<WorkoutPlan>;

  /**
   * Generate a meal plan
   * @param userProfile The user profile
   * @returns The meal plan
   */
  generateMealPlan(userProfile: UserProfile): Promise<MealPlan>;

  /**
   * Check if the OpenAI API is available
   * @returns True if the API is available, false otherwise
   */
  isAvailable(): boolean;
}

/**
 * OpenAI service implementation
 */
export class OpenAIServiceImpl implements OpenAIService {
  private apiKey: string | null = null;

  constructor() {
    // Get OpenAI API key from environment
    const { apiKey } = getOpenAIConfig();
    this.apiKey = apiKey;

    if (!this.apiKey) {
      console.warn('OpenAI API key is not set. AI features will not be available.');
    }
  }

  /**
   * Check if the OpenAI API is available
   * @returns True if the API is available, false otherwise
   */
  isAvailable(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get the appropriate model to use based on availability
   * @param preferredModel The preferred model to use
   * @param fallbackModel The fallback model to use if the preferred model is not available
   * @returns The model to use
   */
  private getModelToUse(preferredModel: OpenAIModel, fallbackModel: OpenAIModel = OpenAIModel.GPT_4O): OpenAIModel {
    // For fine-tuned models, we need to check if they're actually available
    // This is a simplified check - in production, you might want to validate against the OpenAI API
    const isFineTunedModel = preferredModel.startsWith('ft:');

    // If it's not a fine-tuned model or we're in production, use the preferred model
    if (!isFineTunedModel || import.meta.env.PROD) {
      return preferredModel;
    }

    // In development, check if we have a specific env var to enable fine-tuned models
    const useFineTunedModels = import.meta.env.VITE_USE_FINE_TUNED_MODELS === 'true';

    return useFineTunedModels ? preferredModel : fallbackModel;
  }

  /**
   * Generate a chat completion
   * @param request The chat completion request
   * @returns The chat completion response
   */
  async generateChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not set');
    }

    try {
      const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logError(error, 'OpenAIService.generateChatCompletion');
      throw error;
    }
  }

  /**
   * Generate a fitness plan
   * @param userProfile The user profile
   * @returns The fitness plan response
   */
  async generateFitnessPlan(userProfile: UserProfile): Promise<FitnessPlanResponse> {
    try {
      // Generate workout plan
      const workoutPlan = await this.generateWorkoutPlan(userProfile);

      // Generate meal plan
      const mealPlan = await this.generateMealPlan(userProfile);

      return {
        workoutPlan,
        mealPlan,
      };
    } catch (error) {
      logError(error, 'OpenAIService.generateFitnessPlan');
      throw error;
    }
  }

  /**
   * Generate a workout plan
   * @param userProfile The user profile
   * @returns The workout plan
   */
  async generateWorkoutPlan(userProfile: UserProfile): Promise<WorkoutPlan> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not set');
    }

    try {
      // Create system message based on user profile
      const systemMessage = `
        As an expert sports scientist and strength & conditioning coach with expertise in ${userProfile.sportActivity || 'general fitness'},
        your task is to create a highly personalized training program. Utilize evidence-based training principles
        including progressive overload, specificity, periodization, and recovery optimization.
        For ${userProfile.experienceLevel || 'intermediate'} level athletes/individuals, focus on their goals of ${userProfile.fitnessGoals?.join(', ') || 'general fitness'}.

        Consider their available equipment: ${userProfile.equipment?.join(', ') || 'basic home equipment'}.
        Account for any injuries or limitations: ${userProfile.injuries?.join(', ') || 'none'}.

        Create a structured workout plan with the following format:
        {
          "id": "unique-id-string",
          "name": "Name of the workout plan",
          "description": "Detailed description of the workout plan",
          "level": "${userProfile.experienceLevel || 'intermediate'}",
          "goals": ["goal1", "goal2"],
          "equipment": ["equipment1", "equipment2"],
          "weeklyPlan": [
            {
              "day": "Day 1",
              "focus": "Main focus of this workout",
              "duration": "Estimated duration",
              "warmup": "Detailed warmup instructions",
              "exercises": [
                {
                  "name": "Exercise name",
                  "sets": "Number of sets",
                  "reps": "Number of reps",
                  "rest": "Rest period",
                  "notes": "Additional notes"
                }
              ],
              "cooldown": "Detailed cooldown instructions"
            }
          ]
        }
      `;

      // Create user prompt
      const userPrompt = `
        Please create a personalized workout plan for me with the following details:

        User type: ${userProfile.userType}
        Sport/Activity: ${userProfile.sportActivity || 'General fitness'}
        Fitness goals: ${userProfile.fitnessGoals?.join(', ') || 'Overall fitness'}
        Experience level: ${userProfile.experienceLevel || 'Intermediate'}
        Workout frequency: ${userProfile.frequency || '3-4 times per week'}
        Session duration: ${userProfile.duration || '45-60 minutes'}
        Available equipment: ${userProfile.equipment?.join(', ') || 'Basic home equipment'}
        Injuries/limitations: ${userProfile.injuries?.join(', ') || 'None'}

        Please provide the workout plan in a valid JSON format as specified.
      `;

      // Get the appropriate model to use
      const modelToUse = this.getModelToUse(OpenAIModel.ATHLETE_GPT_WORKOUT);

      // Generate completion using selected model
      const completion = await this.generateChatCompletion({
        model: modelToUse,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt }
        ],
        // Use lower temperature for fine-tuned models
        temperature: modelToUse.startsWith('ft:') ? 0.5 : 0.7,
      });

      // Extract and parse the JSON workout plan
      const content = completion.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from OpenAI response');
      }

      const workoutPlan = JSON.parse(jsonMatch[0]);

      // Standardize the workout plan
      return standardizeWorkoutPlan({
        ...workoutPlan,
        id: workoutPlan.id || `wp-${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      logError(error, 'OpenAIService.generateWorkoutPlan');
      throw error;
    }
  }

  /**
   * Generate a meal plan
   * @param userProfile The user profile
   * @returns The meal plan
   */
  async generateMealPlan(userProfile: UserProfile): Promise<MealPlan> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not set');
    }

    try {
      // Create system message based on user profile
      const systemMessage = `
        As an expert nutritionist and sports dietitian with expertise in ${userProfile.sportActivity || 'general fitness'},
        your task is to create a highly personalized meal plan. Utilize evidence-based nutrition principles
        including proper macronutrient distribution, meal timing, and food quality.
        For ${userProfile.experienceLevel || 'intermediate'} level athletes/individuals, focus on their goals of ${userProfile.fitnessGoals?.join(', ') || 'general fitness'}.

        Consider their dietary restrictions: ${userProfile.dietaryRestrictions?.join(', ') || 'none'}.

        Create a structured meal plan with the following format:
        {
          "id": "unique-id-string",
          "name": "Name of the meal plan",
          "description": "Detailed description of the meal plan",
          "dailyPlans": [
            {
              "day": "Day 1",
              "meals": [
                {
                  "name": "Breakfast",
                  "time": "8:00 AM",
                  "foods": [
                    {
                      "name": "Food name",
                      "servingSize": "Serving size",
                      "calories": 300,
                      "protein": 20,
                      "carbs": 30,
                      "fat": 10,
                      "notes": "Additional notes"
                    }
                  ],
                  "totalCalories": 500,
                  "totalProtein": 30,
                  "totalCarbs": 50,
                  "totalFat": 15
                }
              ],
              "totalCalories": 2000,
              "totalProtein": 150,
              "totalCarbs": 200,
              "totalFat": 70,
              "notes": "Additional notes for the day"
            }
          ],
          "calorieTarget": 2000,
          "macroSplit": {
            "protein": 30,
            "carbs": 40,
            "fat": 30
          }
        }
      `;

      // Create user prompt
      const userPrompt = `
        Please create a personalized meal plan for me with the following details:

        User type: ${userProfile.userType}
        Sport/Activity: ${userProfile.sportActivity || 'General fitness'}
        Fitness goals: ${userProfile.fitnessGoals?.join(', ') || 'Overall fitness'}
        Experience level: ${userProfile.experienceLevel || 'Intermediate'}
        Dietary restrictions: ${userProfile.dietaryRestrictions?.join(', ') || 'None'}

        Please provide the meal plan in a valid JSON format as specified.
      `;

      // Get the appropriate model to use
      const modelToUse = this.getModelToUse(OpenAIModel.ATHLETE_GPT_NUTRITION);

      // Generate completion using selected model
      const completion = await this.generateChatCompletion({
        model: modelToUse,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt }
        ],
        // Use lower temperature for fine-tuned models
        temperature: modelToUse.startsWith('ft:') ? 0.5 : 0.7,
      });

      // Extract and parse the JSON meal plan
      const content = completion.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from OpenAI response');
      }

      const mealPlan = JSON.parse(jsonMatch[0]);

      // Add missing fields
      return {
        ...mealPlan,
        id: mealPlan.id || `mp-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      logError(error, 'OpenAIService.generateMealPlan');
      throw error;
    }
  }
}

// Create and export a singleton instance
export const openAIService = new OpenAIServiceImpl();
