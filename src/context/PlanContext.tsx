
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WorkoutPlan, MealPlan } from '@/types/workout';
import { standardizeWorkoutPlan, standardizeMealPlan } from '@/utils/workout-normalizer';

/**
 * PlanContext: Core state management for the Athlete Genesis AI application
 *
 * This context manages all user preferences and generated plans throughout the application.
 * It stores data collected during the onboarding process and makes it available to all components.
 * The context is used by the plan generation algorithm to create personalized workout and meal plans.
 */

/**
 * User type determines the dashboard experience and available features
 * - athlete: Sport-specific training with advanced features
 * - individual: General fitness enthusiast with standard features
 * - coach: Team management and athlete monitoring capabilities
 */
export type UserType = 'athlete' | 'individual' | 'coach' | null;

/**
 * Subscription tier determines available features and dashboard experience
 * - free: Basic features for casual users
 * - pro: Advanced features for serious athletes
 * - coach: Team management features for coaches
 * - elite: Premium AI-powered features with real-time assistance
 */
export type SubscriptionTier = 'free' | 'pro' | 'coach' | 'elite' | null;

/**
 * Fitness goals that guide plan generation and exercise selection
 */
export type FitnessGoal = 'performance' | 'strength' | 'weight' | 'health' | 'endurance' | 'recovery';

/**
 * Experience level affects exercise difficulty and progression rate
 */
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

/**
 * Weekly training frequency (days per week)
 */
export type FrequencyOption = '1-2' | '3-4' | '5-6' | '7+';

/**
 * Workout duration in minutes per session
 */
export type DurationOption = '<30' | '30-45' | '45-60' | '60-90' | '90+';

/**
 * Preferred time of day for workouts
 */
export type TimeOfDayOption = 'morning' | 'afternoon' | 'evening' | 'variable';

/**
 * Available equipment that determines exercise selection
 */
export type EquipmentOption = 'bodyweight' | 'basic-home' | 'full-home' | 'commercial-gym' | 'other';

/**
 * Medical status information for personalized training
 */
export interface MedicalStatus {
  healthConditions: string[];
  otherConditions: string;
  medications: string;
  allergies: string[];
  otherAllergies: string;
  injuries: string[];
  otherInjuries: string;
  medicalClearance: string | null;
  additionalNotes: string;
}

/**
 * Complete interface for the Plan Context
 * Contains all user preferences and generated plans
 */
interface PlanContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  subscriptionTier: SubscriptionTier;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  fitnessGoals: FitnessGoal[];
  setFitnessGoals: (goals: FitnessGoal[]) => void;
  sportActivity: string | null;
  setSportActivity: (sport: string | null) => void;
  experienceLevel: ExperienceLevel | null;
  setExperienceLevel: (level: ExperienceLevel | null) => void;
  frequency: FrequencyOption | null;
  setFrequency: (freq: FrequencyOption | null) => void;
  duration: DurationOption | null;
  setDuration: (dur: DurationOption | null) => void;
  timeOfDay: TimeOfDayOption | null;
  setTimeOfDay: (time: TimeOfDayOption | null) => void;
  equipment: EquipmentOption[];
  setEquipment: (equip: EquipmentOption[]) => void;
  otherEquipment: string;
  setOtherEquipment: (other: string) => void;
  medicalStatus: MedicalStatus | null;
  setMedicalStatus: (status: MedicalStatus | null) => void;
  generatingPlan: boolean;
  setGeneratingPlan: (loading: boolean) => void;
  workoutPlan: WorkoutPlan | null;
  setWorkoutPlan: (plan: WorkoutPlan | null | any) => void;
  mealPlan: MealPlan | null;
  setMealPlan: (plan: MealPlan | null | any) => void;
}

// Create the context with undefined default value
const PlanContext = createContext<PlanContextType | undefined>(undefined);

/**
 * PlanProvider: Context provider component that wraps the application
 * Manages all state related to user preferences and generated plans
 * @param children - Child components that will have access to the context
 */
export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(() => {
    // Initialize from localStorage if available
    const savedTier = localStorage.getItem('subscriptionTier');
    if (savedTier && ['free', 'pro', 'coach', 'elite'].includes(savedTier)) {
      return savedTier as SubscriptionTier;
    }
    return 'free'; // Default to free tier
  });
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoal[]>([]);
  const [sportActivity, setSportActivity] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [frequency, setFrequency] = useState<FrequencyOption | null>(null);
  const [duration, setDuration] = useState<DurationOption | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDayOption | null>(null);
  const [equipment, setEquipment] = useState<EquipmentOption[]>([]);
  const [otherEquipment, setOtherEquipment] = useState('');
  const [medicalStatus, setMedicalStatus] = useState<MedicalStatus | null>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [workoutPlan, setWorkoutPlanInternal] = useState<WorkoutPlan | null>(null);
  const [mealPlan, setMealPlanInternal] = useState<MealPlan | null>(null);

  /**
   * Set workout plan with standardization
   */
  const setWorkoutPlan = (plan: WorkoutPlan | null | any) => {
    if (plan === null) {
      setWorkoutPlanInternal(null);
      return;
    }

    const standardizedPlan = standardizeWorkoutPlan(plan);
    setWorkoutPlanInternal(standardizedPlan);
  };

  /**
   * Set meal plan with standardization
   */
  const setMealPlan = (plan: MealPlan | null | any) => {
    if (plan === null) {
      setMealPlanInternal(null);
      return;
    }

    const standardizedPlan = standardizeMealPlan(plan);
    setMealPlanInternal(standardizedPlan);
  };

  // Custom setter for subscription tier that also updates localStorage
  const handleSetSubscriptionTier = (tier: SubscriptionTier) => {
    setSubscriptionTier(tier);
    if (tier) {
      localStorage.setItem('subscriptionTier', tier);
    } else {
      localStorage.removeItem('subscriptionTier');
    }
  };

  return (
    <PlanContext.Provider
      value={{
        userType,
        setUserType,
        subscriptionTier,
        setSubscriptionTier: handleSetSubscriptionTier,
        fitnessGoals,
        setFitnessGoals,
        sportActivity,
        setSportActivity,
        experienceLevel,
        setExperienceLevel,
        frequency,
        setFrequency,
        duration,
        setDuration,
        timeOfDay,
        setTimeOfDay,
        equipment,
        setEquipment,
        otherEquipment,
        setOtherEquipment,
        medicalStatus,
        setMedicalStatus,
        generatingPlan,
        setGeneratingPlan,
        workoutPlan,
        setWorkoutPlan,
        mealPlan,
        setMealPlan
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

/**
 * Custom hook to access the PlanContext
 * Use this hook in components that need access to user preferences or plans
 * @returns The complete PlanContext object with all values and setters
 */
export const usePlan = (): PlanContextType => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};
