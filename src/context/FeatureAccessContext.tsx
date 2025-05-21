
import React, { createContext, useContext, useState } from 'react';

// Define the available features
export type Feature = 'coach_management' | 'team_management' | 'ai_features' | 'export_data' | 'premium_analytics';

interface FeatureAccessContextType {
  hasFeatureAccess: (feature: Feature) => boolean;
  grantFeatureAccess: (feature: Feature) => void;
  revokeFeatureAccess: (feature: Feature) => void;
  isOwner?: boolean; // Added isOwner property
  setIsOwner?: (value: boolean) => void; // Method to set owner status
}

const FeatureAccessContext = createContext<FeatureAccessContextType | undefined>(undefined);

export const useFeatureAccess = () => {
  const context = useContext(FeatureAccessContext);
  if (context === undefined) {
    throw new Error('useFeatureAccess must be used within a FeatureAccessProvider');
  }
  return context;
};

export const FeatureAccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessibleFeatures, setAccessibleFeatures] = useState<Feature[]>([
    'coach_management',
    'team_management'
  ]);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const hasFeatureAccess = (feature: Feature) => {
    return accessibleFeatures.includes(feature);
  };

  const grantFeatureAccess = (feature: Feature) => {
    if (!accessibleFeatures.includes(feature)) {
      setAccessibleFeatures([...accessibleFeatures, feature]);
    }
  };

  const revokeFeatureAccess = (feature: Feature) => {
    setAccessibleFeatures(accessibleFeatures.filter(f => f !== feature));
  };

  return (
    <FeatureAccessContext.Provider value={{ 
      hasFeatureAccess, 
      grantFeatureAccess, 
      revokeFeatureAccess,
      isOwner,
      setIsOwner
    }}>
      {children}
    </FeatureAccessContext.Provider>
  );
};
