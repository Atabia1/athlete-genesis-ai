import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define notification preferences type
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

// Define gender type
export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | null;

// Define height unit type
export type HeightUnit = 'cm' | 'ft';

// Define weight unit type
export type WeightUnit = 'kg' | 'lb';

// Define activity level type
export type ActivityLevel = 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extremely-active' | null;

/**
 * User Profile Interface
 * Contains all user personal and physical information
 */
export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  gender?: Gender;
  country?: string;
  height?: number;
  weight?: number;
  heightUnit: HeightUnit;
  weightUnit: WeightUnit;
  activityLevel?: ActivityLevel;
  sleepHours?: number;
  notificationPreferences: NotificationPreferences;
  createdAt: string;
  lastUpdated: string;
}

/**
 * User Context Interface
 * Contains the user profile and methods to update it
 */
interface UserContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  isProfileComplete: boolean;
  clearUserProfile: () => void;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * UserProvider Component
 * Provides the user context to the application
 */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Initialize user profile from localStorage if available
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch (error) {
        console.error('Error parsing user profile from localStorage:', error);
        return null;
      }
    }
    return null;
  });

  // Calculate if profile is complete
  const isProfileComplete = Boolean(
    userProfile &&
    userProfile.firstName &&
    userProfile.lastName &&
    userProfile.email
  );

  // Update localStorage when userProfile changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  // Set the entire user profile
  const setUserProfile = (profile: UserProfile) => {
    const now = new Date().toISOString();
    const updatedProfile = {
      ...profile,
      lastUpdated: now,
      createdAt: profile.createdAt || now
    };
    setUserProfileState(updatedProfile);
  };

  // Update specific fields in the user profile
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (userProfile) {
      const now = new Date().toISOString();
      setUserProfileState({
        ...userProfile,
        ...updates,
        lastUpdated: now
      });
    }
  };

  // Clear the user profile
  const clearUserProfile = () => {
    localStorage.removeItem('userProfile');
    setUserProfileState(null);
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        setUserProfile,
        updateUserProfile,
        isProfileComplete,
        clearUserProfile
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

/**
 * useUser Hook
 * Custom hook to use the user context
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
