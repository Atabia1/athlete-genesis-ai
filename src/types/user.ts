
export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
  user_type: 'individual' | 'coach' | 'team';
  fitness_goals?: string[];
  sport?: string;
  experience_level?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
}

export interface UserStats {
  totalWorkouts: number;
  totalCalories: number;
  totalDistance: number;
  currentStreak: number;
}
