/**
 * Anomaly Alert Component
 * 
 * This component displays alerts for detected anomalies in health data.
 * It provides different visual styles based on the severity of the anomaly.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Alert, 
  AlertTitle, 
  AlertDescription 
} from '@/components/ui/alert';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Calendar, 
  X 
} from 'lucide-react';
import { 
  Anomaly, 
  AnomalySeverity, 
  AnomalyType 
} from '@/utils/anomaly-detection';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

// Props interface
interface AnomalyAlertProps {
  /** The detected anomaly */
  anomaly: Anomaly;
  /** Whether to show the dismiss button */
  dismissable?: boolean;
  /** Callback when the anomaly is dismissed */
  onDismiss?: (anomaly: Anomaly) => void;
  /** Additional CSS class */
  className?: string;
  /** Whether to show the timestamp */
  showTimestamp?: boolean;
  /** Whether to show detailed information */
  showDetails?: boolean;
  /** Whether to show recommendations */
  showRecommendations?: boolean;
}

/**
 * Format a date as a readable string
 * @param date Date to format
 * @returns Formatted string
 */
const formatDate = (date: Date): string => {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get a recommendation based on the anomaly type
 * @param anomaly The anomaly
 * @returns Recommendation text
 */
const getRecommendation = (anomaly: Anomaly): string => {
  switch (anomaly.type) {
    case AnomalyType.SPIKE:
      return 'Consider checking if this spike is related to a specific activity or event. If it persists, consult with your healthcare provider.';
    case AnomalyType.DROP:
      return 'Monitor this metric closely. If the drop continues or is accompanied by other symptoms, consult with your healthcare provider.';
    case AnomalyType.TREND_CHANGE:
      return 'A significant change in trend has been detected. Consider reviewing your recent lifestyle changes or activities.';
    case AnomalyType.PATTERN_BREAK:
      return 'Your usual pattern has changed. This could be due to changes in routine, diet, or other factors.';
    case AnomalyType.MISSING_DATA:
      return 'There appears to be missing data. Consider checking your device connectivity or wearing habits.';
    default:
      return 'Monitor this anomaly and consult with your healthcare provider if concerned.';
  }
};

/**
 * Get the icon for an anomaly type
 * @param type Anomaly type
 * @returns React element with the appropriate icon
 */
const getAnomalyIcon = (type: AnomalyType) => {
  switch (type) {
    case AnomalyType.SPIKE:
      return <TrendingUp className="h-4 w-4" />;
    case AnomalyType.DROP:
      return <TrendingDown className="h-4 w-4" />;
    case AnomalyType.TREND_CHANGE:
      return <Activity className="h-4 w-4" />;
    case AnomalyType.PATTERN_BREAK:
      return <AlertCircle className="h-4 w-4" />;
    case AnomalyType.MISSING_DATA:
      return <Calendar className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

/**
 * Get the alert variant based on severity
 * @param severity Anomaly severity
 * @returns Alert variant
 */
const getAlertVariant = (severity: AnomalySeverity): 'default' | 'destructive' | 'warning' => {
  switch (severity) {
    case AnomalySeverity.HIGH:
      return 'destructive';
    case AnomalySeverity.MEDIUM:
      return 'warning';
    default:
      return 'default';
  }
};

/**
 * Anomaly Alert Component
 */
const AnomalyAlert: React.FC<AnomalyAlertProps> = ({
  anomaly,
  dismissable = true,
  onDismiss,
  className = '',
  showTimestamp = true,
  showDetails = false,
  showRecommendations = false,
}) => {
  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss(anomaly);
    }
  };
  
  return (
    <Alert 
      variant={getAlertVariant(anomaly.severity)}
      className={cn("relative", className)}
    >
      <div className="flex items-start">
        {anomaly.severity === AnomalySeverity.HIGH ? (
          <AlertTriangle className="h-4 w-4 mr-2 mt-0.5" />
        ) : (
          getAnomalyIcon(anomaly.type)
        )}
        <div className="flex-1">
          <AlertTitle className="text-sm font-medium">
            {anomaly.description}
          </AlertTitle>
          
          {showTimestamp && (
            <div className="text-xs text-muted-foreground mt-1">
              Detected at {formatDate(anomaly.timestamp)}
            </div>
          )}
          
          {showDetails && (
            <AlertDescription className="mt-2 text-sm">
              <div className="space-y-1">
                <div>
                  <span className="font-medium">Value:</span> {anomaly.value.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Expected:</span> {anomaly.expectedValue.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Deviation:</span> {anomaly.deviation.toFixed(2)} 
                  ({(anomaly.deviation / anomaly.expectedValue * 100).toFixed(1)}%)
                </div>
              </div>
            </AlertDescription>
          )}
          
          {showRecommendations && (
            <AlertDescription className="mt-2 text-sm">
              <div className="font-medium mb-1">Recommendation:</div>
              <div>{getRecommendation(anomaly)}</div>
            </AlertDescription>
          )}
        </div>
      </div>
      
      {dismissable && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={handleDismiss}
                aria-label="Dismiss alert"
              >
                <X className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Dismiss alert</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </Alert>
  );
};

export default AnomalyAlert;
