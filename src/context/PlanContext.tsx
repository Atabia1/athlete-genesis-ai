import React, { createContext, useContext, useState, ReactNode } from 'react';

// User type definitions
export type UserType = 'individual' | 'athlete' | 'coach' | null;

// Subscription tier type
export type SubscriptionTier = 'free' | 'pro' | 'coach' | 'elite';

// Fitness goals type definitions - simplified to string union
export type FitnessGoal = 'performance' | 'strength' | 'weight' | 'health' | 'endurance' | 'recovery';

// Sports/activities type definitions
export interface SportActivity {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

// Experience level type definitions
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite' | null;

// Time & Equipment type definitions
export type FrequencyOption = '1-2' | '3-4' | '5-6' | '7+' | null;
export type DurationOption = '<30' | '30-45' | '45-60' | '60-90' | '90+' | null;
export type TimeOfDayOption = 'morning' | 'afternoon' | 'evening' | 'variable' | null;
export type EquipmentOption = 'bodyweight' | 'basic-home' | 'full-home' | 'commercial-gym' | 'other';

export interface TimeEquipment {
  sessionsPerWeek: number;
  minutesPerSession: number;
  hasGym: boolean;
  hasWeights: boolean;
  hasCardioEquipment: boolean;
  outdoorAccess: boolean;
}

// Medical status type definitions - add missing notes property
export interface MedicalStatus {
  conditions: string[];
  injuries: string[];
  medications: string[];
  medicalClearance: boolean;
  notes?: string;
}

// Workout plan type definitions
export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  schedule: WorkoutSchedule[];
  nutrition: NutritionPlan;
}

export interface WorkoutSchedule {
  day: string;
  workouts: Workout[];
  nutrition: DailyNutrition;
}

export interface Workout {
  id: string;
  name: string;
  type: string;
  exercises: Exercise[];
  duration: number;
  caloriesBurned: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restPeriod: number;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface NutritionPlan {
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
}

export interface DailyNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  };
}

// Meal plan type for storing generated meal plans
export interface MealPlan {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  days: MealPlanDay[];
}

export interface MealPlanDay {
  dayNumber: number;
  meals: MealPlanMeal[];
}

export interface MealPlanMeal {
  type: string;
  title: string;
  description: string;
  nutrients: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
}

// Plan context interface
interface PlanContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  
  fitnessGoals: FitnessGoal[];
  setFitnessGoals: (goals: FitnessGoal[]) => void;
  
  sportActivities: SportActivity[];
  setSportActivities: (activities: SportActivity[]) => void;
  
  // Add sport and setSport properties
  sport: string | null;
  setSport: (sport: string | null) => void;
  
  experienceLevel: ExperienceLevel;
  setExperienceLevel: (level: ExperienceLevel) => void;
  
  timeEquipment: TimeEquipment;
  setTimeEquipment: (data: TimeEquipment) => void;

  // Add the time and equipment specific properties
  frequency: FrequencyOption;
  setFrequency: (freq: FrequencyOption) => void;
  
  duration: DurationOption;
  setDuration: (dur: DurationOption) => void;
  
  timeOfDay: TimeOfDayOption;  
  setTimeOfDay: (time: TimeOfDayOption) => void;
  
  equipment: EquipmentOption[];
  setEquipment: (equip: EquipmentOption[]) => void;
  
  otherEquipment: string;
  setOtherEquipment: (other: string) => void;
  
  medicalStatus: MedicalStatus;
  setMedicalStatus: (status: MedicalStatus) => void;
  
  workoutPlan: WorkoutPlan | null;
  setWorkoutPlan: (plan: WorkoutPlan | null) => void;
  
  mealPlan: MealPlan | null;
  setMealPlan: (plan: MealPlan | null) => void;

  // Add subscription tier - keep the existing property name for consistency
  subscriptionTier: SubscriptionTier | null;
  setSubscriptionTier: (tier: SubscriptionTier | null) => void;
}

// Create the context with default values
const PlanContext = createContext<PlanContextType>({
  userType: null,
  setUserType: () => {},
  fitnessGoals: [],
  setFitnessGoals: () => {},
  sportActivities: [],
  setSportActivities: () => {},
  sport: null,
  setSport: () => {},
  experienceLevel: null,
  setExperienceLevel: () => {},
  timeEquipment: {
    sessionsPerWeek: 3,
    minutesPerSession: 45,
    hasGym: false,
    hasWeights: false,
    hasCardioEquipment: false,
    outdoorAccess: true
  },
  setTimeEquipment: () => {},
  // Initialize the new properties
  frequency: null,
  setFrequency: () => {},
  duration: null,
  setDuration: () => {},
  timeOfDay: null,
  setTimeOfDay: () => {},
  equipment: [],
  setEquipment: () => {},
  otherEquipment: '',
  setOtherEquipment: () => {},
  medicalStatus: {
    conditions: [],
    injuries: [],
    medications: [],
    medicalClearance: true
  },
  setMedicalStatus: () => {},
  workoutPlan: null,
  setWorkoutPlan: () => {},
  mealPlan: null,
  setMealPlan: () => {},
  subscriptionTier: null,
  setSubscriptionTier: () => {}
});

// Provider component
export const PlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoal[]>([]);
  
  const [sportActivities, setSportActivities] = useState<SportActivity[]>([
    { id: '1', name: 'Running', icon: '🏃', selected: false },
    { id: '2', name: 'Weightlifting', icon: '🏋️', selected: false },
    { id: '3', name: 'Basketball', icon: '🏀', selected: false },
    { id: '4', name: 'Soccer', icon: '⚽', selected: false },
    { id: '5', name: 'Swimming', icon: '🏊', selected: false },
    { id: '6', name: 'Cycling', icon: '🚴', selected: false },
    { id: '7', name: 'Tennis', icon: '🎾', selected: false },
    { id: '8', name: 'Yoga', icon: '🧘', selected: false },
    { id: '9', name: 'HIIT', icon: '⚡', selected: false },
    { id: '10', name: 'CrossFit', icon: '💪', selected: false }
  ]);
  
  const [sport, setSport] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(null);
  
  const [timeEquipment, setTimeEquipment] = useState<TimeEquipment>({
    sessionsPerWeek: 3,
    minutesPerSession: 45,
    hasGym: false,
    hasWeights: false,
    hasCardioEquipment: false,
    outdoorAccess: true
  });

  // Add the new state variables
  const [frequency, setFrequency] = useState<FrequencyOption>(null);
  const [duration, setDuration] = useState<DurationOption>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDayOption>(null);
  const [equipment, setEquipment] = useState<EquipmentOption[]>([]);
  const [otherEquipment, setOtherEquipment] = useState('');
  
  const [medicalStatus, setMedicalStatus] = useState<MedicalStatus>({
    conditions: [],
    injuries: [],
    medications: [],
    medicalClearance: true
  });
  
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier | null>(null);

  return (
    <PlanContext.Provider
      value={{
        userType,
        setUserType,
        fitnessGoals,
        setFitnessGoals,
        sportActivities,
        setSportActivities,
        sport,
        setSport,
        experienceLevel,
        setExperienceLevel,
        timeEquipment,
        setTimeEquipment,
        // Include the new state variables in the context value
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
        workoutPlan,
        setWorkoutPlan,
        mealPlan,
        setMealPlan,
        subscriptionTier,
        setSubscriptionTier
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

// Custom hook for using the context
export const usePlan = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};

export default PlanContext;
