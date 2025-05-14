import React from 'react';
import { useDashboardCustomization, WidgetType } from '@/context/DashboardCustomizationContext';

interface DashboardWidgetProps {
  /** Widget type */
  widgetType: WidgetType;
  /** Widget content */
  children: React.ReactNode;
  /** Optional className for styling */
  className?: string;
}

/**
 * Dashboard Widget
 * 
 * A wrapper component for dashboard widgets that respects the dashboard customization settings.
 * It will only render the widget if it's visible according to the dashboard customization.
 */
const DashboardWidget: React.FC<DashboardWidgetProps> = ({ 
  widgetType, 
  children, 
  className = '' 
}) => {
  const { isWidgetVisible, customization } = useDashboardCustomization();
  
  // Check if the widget is visible
  if (!isWidgetVisible(widgetType)) {
    return null;
  }
  
  // Apply layout-specific styling
  let layoutClass = '';
  
  switch (customization.layout) {
    case 'compact':
      layoutClass = 'max-h-[400px] overflow-auto';
      break;
    case 'expanded':
      layoutClass = 'min-h-[500px]';
      break;
    case 'focus':
      // In focus mode, only show essential widgets
      const essentialWidgets: WidgetType[] = ['healthScore', 'activity', 'workouts'];
      if (!essentialWidgets.includes(widgetType)) {
        return null;
      }
      break;
    default:
      // Default layout, no special styling
      break;
  }
  
  return (
    <div className={`${className} ${layoutClass}`}>
      {children}
    </div>
  );
};

export default DashboardWidget;
