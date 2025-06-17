
export interface UserProfile {
  id: string;
  user_type: 'individual' | 'coach' | 'athlete';
  full_name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  fitness_goals?: string[];
  medical_conditions?: string[];
  preferred_language?: string;
  created_at?: string;
  updated_at?: string;
}
