
import UserTypeStep from '@/components/onboarding/UserTypeStep';

/**
 * Onboarding: Entry point for the user onboarding flow
 *
 * This component initiates the multi-step onboarding process where users:
 * 1. Select their user type (athlete, individual, coach)
 * 2. Define fitness goals
 * 3. Specify sport/activity preferences
 * 4. Indicate experience level
 * 5. Set time availability and equipment access
 * 6. Generate personalized workout and meal plans
 *
 * The onboarding flow is managed through a series of step components,
 * starting with UserTypeStep which handles navigation to subsequent steps.
 */

const Onboarding = () => {
  return <UserTypeStep />;
};

export default Onboarding;
