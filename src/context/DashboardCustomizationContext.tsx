import React, { createContext, useContext, useState, useEffect } from 'react';

// Dashboard widget types
export type WidgetType =
  | 'healthScore'
  | 'goals'
  | 'activity'
  | 'workouts'
  | 'workoutPerformance'
  | 'sleep'
  | 'bodyComposition'
  | 'nutrition'
  | 'comparative'
  | 'insights'
  | 'trends'
  | 'export'
  | 'recommendations'
  | 'achievements'
  | 'community'
  | 'coachSharing';

// Widget visibility state
export interface WidgetVisibility {
  [key: string]: boolean;
}

// Dashboard layout options
export type DashboardLayout = 'default' | 'compact' | 'expanded' | 'focus';

// Dashboard theme options
export type DashboardTheme = 'light' | 'dark' | 'system';

// Dashboard customization state
export interface DashboardCustomization {
  layout: DashboardLayout;
  widgetVisibility: WidgetVisibility;
  theme: DashboardTheme;
  widgetOrder: WidgetType[];
}

// Dashboard customization context interface
interface DashboardCustomizationContextType {
  customization: DashboardCustomization;
  updateLayout: (layout: DashboardLayout) => void;
  updateWidgetVisibility: (widget: WidgetType, isVisible: boolean) => void;
  updateTheme: (theme: DashboardTheme) => void;
  updateWidgetOrder: (order: WidgetType[]) => void;
  resetCustomization: () => void;
  isWidgetVisible: (widget: WidgetType) => boolean;
}

// Default widget visibility
const defaultWidgetVisibility: WidgetVisibility = {
  healthScore: true,
  goals: true,
  activity: true,
  workouts: true,
  workoutPerformance: true,
  sleep: true,
  bodyComposition: true,
  nutrition: true,
  comparative: true,
  insights: true,
  trends: true,
  export: true,
  recommendations: true,
  achievements: true,
  community: true,
  coachSharing: true,
};

// Default widget order
const defaultWidgetOrder: WidgetType[] = [
  'healthScore',
  'goals',
  'recommendations',
  'activity',
  'workouts',
  'workoutPerformance',
  'sleep',
  'bodyComposition',
  'nutrition',
  'comparative',
  'insights',
  'trends',
  'achievements',
  'community',
  'coachSharing',
  'export',
];

// Default dashboard customization
const defaultCustomization: DashboardCustomization = {
  layout: 'default',
  widgetVisibility: defaultWidgetVisibility,
  theme: 'system',
  widgetOrder: defaultWidgetOrder,
};

// Create context
const DashboardCustomizationContext = createContext<DashboardCustomizationContextType | undefined>(undefined);

/**
 * Dashboard Customization Provider
 *
 * Provides dashboard customization state and functions to update it.
 */
export const DashboardCustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [customization, setCustomization] = useState<DashboardCustomization>(() => {
    // Try to get saved customization from localStorage
    const savedCustomization = localStorage.getItem('dashboardCustomization');
    if (savedCustomization) {
      try {
        return JSON.parse(savedCustomization);
      } catch (error) {
        console.error('Failed to parse saved dashboard customization:', error);
      }
    }
    return defaultCustomization;
  });

  // Save customization to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dashboardCustomization', JSON.stringify(customization));
  }, [customization]);

  // Update layout
  const updateLayout = (layout: DashboardLayout) => {
    setCustomization(prev => ({
      ...prev,
      layout,
    }));
  };

  // Update widget visibility
  const updateWidgetVisibility = (widget: WidgetType, isVisible: boolean) => {
    setCustomization(prev => ({
      ...prev,
      widgetVisibility: {
        ...prev.widgetVisibility,
        [widget]: isVisible,
      },
    }));
  };

  // Update theme
  const updateTheme = (theme: DashboardTheme) => {
    setCustomization(prev => ({
      ...prev,
      theme,
    }));
  };

  // Update widget order
  const updateWidgetOrder = (order: WidgetType[]) => {
    setCustomization(prev => ({
      ...prev,
      widgetOrder: order,
    }));
  };

  // Reset customization to defaults
  const resetCustomization = () => {
    setCustomization(defaultCustomization);
  };

  // Check if a widget is visible
  const isWidgetVisible = (widget: WidgetType) => {
    return customization.widgetVisibility[widget] ?? true;
  };

  // Context value
  const value = {
    customization,
    updateLayout,
    updateWidgetVisibility,
    updateTheme,
    updateWidgetOrder,
    resetCustomization,
    isWidgetVisible,
  };

  return (
    <DashboardCustomizationContext.Provider value={value}>
      {children}
    </DashboardCustomizationContext.Provider>
  );
};

/**
 * Use Dashboard Customization Hook
 *
 * Hook to access dashboard customization context.
 */
export const useDashboardCustomization = (): DashboardCustomizationContextType => {
  const context = useContext(DashboardCustomizationContext);
  if (context === undefined) {
    throw new Error('useDashboardCustomization must be used within a DashboardCustomizationProvider');
  }
  return context;
};
