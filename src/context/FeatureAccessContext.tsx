
import React, { createContext, useContext, useState } from 'react';
import { SubscriptionTier } from './PlanContext';
import { Feature, getAvailableFeatures as utilsGetAvailableFeatures, hasFeatureAccess as utilsHasFeatureAccess } from '@/utils/feature-access';

interface FeatureAccessContextType {
  hasFeatureAccess: (feature: Feature) => boolean;
  grantFeatureAccess: (feature: Feature) => void;
  revokeFeatureAccess: (feature: Feature) => void;
  getAvailableFeatures: () => Feature[];
  isOwner?: boolean;
  setIsOwner?: (value: boolean) => void;
}

const FeatureAccessContext = createContext<FeatureAccessContextType | undefined>(undefined);

export const useFeatureAccess = () => {
  const context = useContext(FeatureAccessContext);
  if (context === undefined) {
    throw new Error('useFeatureAccess must be used within a FeatureAccessProvider');
  }
  return context;
};

export const FeatureAccessProvider: React.FC<{ 
  children: React.ReactNode; 
  userTier?: SubscriptionTier | null;
}> = ({ children, userTier = null }) => {
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const hasFeatureAccess = (feature: Feature) => {
    return utilsHasFeatureAccess(feature, userTier, isOwner);
  };

  const grantFeatureAccess = (feature: Feature) => {
    // This is now handled by the subscription tier logic
    console.log(`Feature ${feature} access controlled by subscription tier`);
  };

  const revokeFeatureAccess = (feature: Feature) => {
    // This is now handled by the subscription tier logic
    console.log(`Feature ${feature} access controlled by subscription tier`);
  };

  const getAvailableFeatures = () => {
    return utilsGetAvailableFeatures(userTier, isOwner);
  };

  return (
    <FeatureAccessContext.Provider value={{ 
      hasFeatureAccess, 
      grantFeatureAccess, 
      revokeFeatureAccess,
      getAvailableFeatures,
      isOwner,
      setIsOwner
    }}>
      {children}
    </FeatureAccessContext.Provider>
  );
};
