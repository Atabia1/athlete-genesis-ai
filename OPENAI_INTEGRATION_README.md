# OpenAI Integration for Athlete GPT

This document provides a comprehensive guide to the OpenAI integration in the Athlete GPT application.

## Overview

The OpenAI integration enables AI-powered features in the Athlete GPT application, including:

1. **Personalized Workout Plans**: Generate customized workout plans based on user profiles, goals, and equipment availability.
2. **Nutrition Plans**: Create personalized meal plans tailored to dietary preferences and fitness goals.
3. **AI Coach Chat**: Provide real-time coaching advice and answers to fitness-related questions.

## Setup

### 1. OpenAI API Key

To use the OpenAI integration, you need an OpenAI API key:

1. Sign up for an account at [OpenAI](https://platform.openai.com/)
2. Navigate to the API section and create an API key
3. Add the API key to your environment variables:

```
# .env file
VITE_OPENAI_API_KEY=your-api-key-here
```

### 2. Fine-Tuning (Optional but Recommended)

For optimal results, fine-tune the OpenAI models using the provided training data:

1. Use the `workout_training_data.jsonl` and `nutrition_training_data.jsonl` files as starting points
2. Follow the instructions in `FINE_TUNING_GUIDE.md` to create and deploy fine-tuned models
3. Update the model IDs in `src/services/api/openai-service.ts`

## Architecture

The OpenAI integration consists of the following components:

### OpenAI Service

The `OpenAIService` in `src/services/api/openai-service.ts` provides a clean interface for interacting with the OpenAI API:

```typescript
// Example usage
const workoutPlan = await services.openAI.generateWorkoutPlan(userProfile);
const mealPlan = await services.openAI.generateMealPlan(userProfile);
```

### Model Selection

The service automatically selects the appropriate model based on availability:

1. Fine-tuned models (if available)
2. Standard models (GPT-4o, GPT-4o-mini, etc.)

### Error Handling

The service includes robust error handling to gracefully handle API issues:

1. API key validation
2. Rate limit handling
3. Fallback to mock data when necessary

## Features

### 1. Workout Plan Generation

Generate personalized workout plans based on user profiles:

```typescript
const userProfile = {
  userType: 'athlete',
  sportActivity: 'basketball',
  fitnessGoals: ['performance', 'strength'],
  experienceLevel: 'intermediate',
  frequency: '4 times per week',
  duration: '60 minutes',
  equipment: ['barbell', 'dumbbell', 'bench'],
  injuries: []
};

const workoutPlan = await services.openAI.generateWorkoutPlan(userProfile);
```

### 2. Meal Plan Generation

Create personalized meal plans based on user profiles:

```typescript
const userProfile = {
  userType: 'athlete',
  sportActivity: 'basketball',
  fitnessGoals: ['performance', 'strength'],
  experienceLevel: 'intermediate',
  dietaryRestrictions: ['vegetarian']
};

const mealPlan = await services.openAI.generateMealPlan(userProfile);
```

### 3. AI Coach Chat

Provide real-time coaching advice through the AI Coach Chat component:

```tsx
// Example usage in a React component
<AICoachChat hasAccess={true} />
```

## Offline Support

The OpenAI integration works seamlessly with the application's offline functionality:

1. Generated workout and meal plans are automatically saved to IndexedDB
2. Plans can be accessed and viewed when offline
3. New requests are queued when offline and processed when back online

## Cost Optimization

To optimize API usage costs:

1. Use fine-tuned models which typically require fewer tokens
2. Cache responses when appropriate
3. Use GPT-4o-mini for most features (good balance of performance and cost)
4. Reserve GPT-4o for complex queries or premium features

## Troubleshooting

Common issues and solutions:

1. **API Key Issues**: Ensure the API key is correctly set in environment variables
2. **Rate Limits**: Implement exponential backoff for retries
3. **Model Availability**: Check OpenAI status page for service disruptions
4. **Response Format**: Use fine-tuned models to ensure consistent output format

## Security Considerations

1. **API Key Protection**: Never expose the API key in client-side code
2. **User Data**: Be mindful of what user data is sent to the OpenAI API
3. **Content Filtering**: Implement content filtering for user inputs

## Future Enhancements

Potential enhancements to the OpenAI integration:

1. **Streaming Responses**: Implement streaming for real-time response generation
2. **Multi-Modal Support**: Add support for image analysis (form checking, etc.)
3. **Embeddings**: Use embeddings for semantic search of workout and nutrition content
4. **Assistants API**: Explore OpenAI's Assistants API for more complex interactions

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Fine-Tuning Guide](FINE_TUNING_GUIDE.md)
- [Sample Training Data](workout_training_data.jsonl)
