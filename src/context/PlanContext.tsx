
import React, { createContext, useContext, useState, ReactNode } from 'react';

// User type definitions
export type UserType = 'individual' | 'athlete' | 'coach' | null;

// Fitness goals type definitions
export interface FitnessGoal {
  id: string;
  name: string;
  selected: boolean;
}

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
export interface TimeEquipment {
  sessionsPerWeek: number;
  minutesPerSession: number;
  hasGym: boolean;
  hasWeights: boolean;
  hasCardioEquipment: boolean;
  outdoorAccess: boolean;
}

// Medical status type definitions
export interface MedicalStatus {
  conditions: string[];
  injuries: string[];
  medications: string[];
  medicalClearance: boolean;
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

// Plan context interface
interface PlanContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  
  fitnessGoals: FitnessGoal[];
  setFitnessGoals: (goals: FitnessGoal[]) => void;
  
  sportActivities: SportActivity[];
  setSportActivities: (activities: SportActivity[]) => void;
  
  experienceLevel: ExperienceLevel;
  setExperienceLevel: (level: ExperienceLevel) => void;
  
  timeEquipment: TimeEquipment;
  setTimeEquipment: (data: TimeEquipment) => void;
  
  medicalStatus: MedicalStatus;
  setMedicalStatus: (status: MedicalStatus) => void;
  
  workoutPlan: WorkoutPlan | null;
  setWorkoutPlan: (plan: WorkoutPlan | null) => void;
}

// Create the context with default values
const PlanContext = createContext<PlanContextType>({
  userType: null,
  setUserType: () => {},
  fitnessGoals: [],
  setFitnessGoals: () => {},
  sportActivities: [],
  setSportActivities: () => {},
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
  medicalStatus: {
    conditions: [],
    injuries: [],
    medications: [],
    medicalClearance: true
  },
  setMedicalStatus: () => {},
  workoutPlan: null,
  setWorkoutPlan: () => {}
});

// Provider component
export const PlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoal[]>([
    { id: '1', name: 'Lose Weight', selected: false },
    { id: '2', name: 'Build Muscle', selected: false },
    { id: '3', name: 'Improve Endurance', selected: false },
    { id: '4', name: 'Increase Strength', selected: false },
    { id: '5', name: 'Enhance Sports Performance', selected: false },
    { id: '6', name: 'Improve Mobility/Flexibility', selected: false },
    { id: '7', name: 'General Fitness', selected: false },
    { id: '8', name: 'Rehabilitation', selected: false }
  ]);
  
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
  
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(null);
  
  const [timeEquipment, setTimeEquipment] = useState<TimeEquipment>({
    sessionsPerWeek: 3,
    minutesPerSession: 45,
    hasGym: false,
    hasWeights: false,
    hasCardioEquipment: false,
    outdoorAccess: true
  });
  
  const [medicalStatus, setMedicalStatus] = useState<MedicalStatus>({
    conditions: [],
    injuries: [],
    medications: [],
    medicalClearance: true
  });
  
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);

  return (
    <PlanContext.Provider
      value={{
        userType,
        setUserType,
        fitnessGoals,
        setFitnessGoals,
        sportActivities,
        setSportActivities,
        experienceLevel,
        setExperienceLevel,
        timeEquipment,
        setTimeEquipment,
        medicalStatus,
        setMedicalStatus,
        workoutPlan,
        setWorkoutPlan
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
