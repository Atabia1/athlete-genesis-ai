# Fine-Tuning Guide for Athlete GPT

This guide will walk you through the process of fine-tuning OpenAI models for your Athlete GPT application to improve the quality and consistency of AI-generated workout and nutrition plans.

## Why Fine-Tune?

Fine-tuning provides several benefits:

1. **Consistent Output Format**: Ensures workout and meal plans follow your exact JSON structure
2. **Domain-Specific Knowledge**: Improves understanding of fitness terminology and concepts
3. **Reduced Costs**: Fine-tuned models often require fewer tokens to generate good responses
4. **Better Personalization**: More accurate responses based on user profiles

## Prerequisites

1. An OpenAI API key with access to fine-tuning capabilities
2. Training data in JSONL format (examples provided below)
3. Access to the OpenAI platform (https://platform.openai.com)

## Step 1: Prepare Training Data

Create two separate JSONL files:

1. `workout_training_data.jsonl` - For workout plan generation
2. `nutrition_training_data.jsonl` - For meal plan generation

Each file should contain examples of conversations with system messages, user inputs, and ideal assistant responses.

### Example Format for Training Data

```jsonl
{"messages": [{"role": "system", "content": "You are an expert sports scientist and strength & conditioning coach specializing in personalized training programs."}, {"role": "user", "content": "Create a workout plan for me. I'm a basketball player, intermediate level, looking to improve performance and strength. I can train 4 days a week for 60 minutes. I have access to a gym with basic equipment."}, {"role": "assistant", "content": "{\n  \"id\": \"wp-basketball-intermediate\",\n  \"name\": \"Basketball Performance Enhancement Plan\",\n  \"description\": \"A 4-day training program designed to improve basketball-specific performance, focusing on strength, power, agility, and conditioning for intermediate players.\",\n  \"level\": \"intermediate\",\n  \"goals\": [\"performance\", \"strength\"],\n  \"equipment\": [\"barbell\", \"dumbbell\", \"bench\", \"resistance bands\"],\n  \"weeklyPlan\": [...]}"}]}
```

### Creating Diverse Training Examples

For best results, create 10-20 examples for each model covering different:

- User types (athletes, coaches, individuals)
- Fitness goals (strength, endurance, weight loss, etc.)
- Experience levels (beginner, intermediate, advanced)
- Equipment availability
- Time constraints
- Special considerations (injuries, dietary restrictions)

## Step 2: Upload and Fine-Tune Models

### For Workout Plans

1. Go to https://platform.openai.com/finetune
2. Click "Create" button
3. Upload your `workout_training_data.jsonl` file
4. Select base model (gpt-4o-mini recommended for cost-effectiveness)
5. Set suffix name: "athlete-gpt:workout"
6. Start fine-tuning process

### For Nutrition Plans

1. Go to https://platform.openai.com/finetune
2. Click "Create" button
3. Upload your `nutrition_training_data.jsonl` file
4. Select base model (gpt-4o-mini recommended for cost-effectiveness)
5. Set suffix name: "athlete-gpt:nutrition"
6. Start fine-tuning process

## Step 3: Update Your Code

The OpenAI service in your application has already been updated to use fine-tuned models. Once your fine-tuning jobs are complete, update the model IDs in `src/services/api/openai-service.ts`:

```typescript
// OpenAI models
export enum OpenAIModel {
  // ...other models...
  
  // Update these with your actual fine-tuned model IDs
  ATHLETE_GPT_WORKOUT = 'ft:gpt-4o-mini:athlete-gpt:workout:your-version-id',
  ATHLETE_GPT_NUTRITION = 'ft:gpt-4o-mini:athlete-gpt:nutrition:your-version-id'
}
```

## Step 4: Testing Your Fine-Tuned Models

After updating the model IDs, test your application to ensure the fine-tuned models are working correctly:

1. Navigate to the AI Features page
2. Try generating workout and meal plans with different user profiles
3. Verify that the outputs match your expected format and quality

## Step 5: Monitoring and Improving

Monitor the performance of your fine-tuned models and collect user feedback. If needed, you can:

1. Create more training examples based on edge cases or common requests
2. Fine-tune new versions of your models with expanded training data
3. Adjust system prompts to further guide the model's responses

## Example Training Data

Here's a starter example for workout plan training data:

```jsonl
{"messages": [{"role": "system", "content": "You are an expert sports scientist and strength & conditioning coach specializing in personalized training programs."}, {"role": "user", "content": "Create a workout plan for me. I'm a beginner with weight loss goals. I can only train 3 days a week for 30 minutes. I only have dumbbells and resistance bands at home."}, {"role": "assistant", "content": "{\n  \"id\": \"wp-beginner-weight-loss\",\n  \"name\": \"Home Weight Loss Program for Beginners\",\n  \"description\": \"A 3-day home workout program designed for beginners focusing on weight loss, using minimal equipment while maximizing calorie burn and building foundational strength.\",\n  \"level\": \"beginner\",\n  \"goals\": [\"weight\", \"health\"],\n  \"equipment\": [\"dumbbells\", \"resistance bands\"],\n  \"weeklyPlan\": [...]}"}]}
```

## Resources

- [OpenAI Fine-tuning Documentation](https://platform.openai.com/docs/guides/fine-tuning)
- [Best Practices for Fine-tuning](https://platform.openai.com/docs/guides/fine-tuning/best-practices)
- [OpenAI Cookbook](https://github.com/openai/openai-cookbook)

## Support

If you encounter any issues with fine-tuning or implementing the fine-tuned models, please contact the development team for assistance.
