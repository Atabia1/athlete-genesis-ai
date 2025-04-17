
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserType = 'athlete' | 'individual' | 'coach' | null;
export type FitnessGoal = 'performance' | 'strength' | 'weight' | 'health' | 'endurance' | 'recovery';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';
export type FrequencyOption = '1-2' | '3-4' | '5-6' | '7+';
export type DurationOption = '<30' | '30-45' | '45-60' | '60-90' | '90+';
export type TimeOfDayOption = 'morning' | 'afternoon' | 'evening' | 'variable';
export type EquipmentOption = 'bodyweight' | 'basic-home' | 'full-home' | 'commercial-gym' | 'other';

interface PlanContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
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
  generatingPlan: boolean;
  setGeneratingPlan: (loading: boolean) => void;
  workoutPlan: any | null;
  setWorkoutPlan: (plan: any) => void;
  mealPlan: any | null;
  setMealPlan: (plan: any) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoal[]>([]);
  const [sportActivity, setSportActivity] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [frequency, setFrequency] = useState<FrequencyOption | null>(null);
  const [duration, setDuration] = useState<DurationOption | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDayOption | null>(null);
  const [equipment, setEquipment] = useState<EquipmentOption[]>([]);
  const [otherEquipment, setOtherEquipment] = useState('');
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<any | null>(null);
  const [mealPlan, setMealPlan] = useState<any | null>(null);

  return (
    <PlanContext.Provider
      value={{
        userType,
        setUserType,
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

export const usePlan = (): PlanContextType => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};
