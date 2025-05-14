/**
 * Disabled Feature Component
 * 
 * This component displays a message for disabled features.
 * It's used as a fallback for feature-flagged content.
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DisabledFeatureProps {
  /** The name of the disabled feature */
  name: string;
  
  /** Optional description of the feature */
  description?: string;
  
  /** Optional message to display */
  message?: string;
  
  /** Optional variant for the alert */
  variant?: 'default' | 'destructive' | 'info';
}

/**
 * Displays a message for disabled features
 */
export function DisabledFeature({
  name,
  description,
  message = 'This feature is currently disabled.',
  variant = 'info',
}: DisabledFeatureProps) {
  return (
    <Alert variant={variant} className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="ml-2">{name} Unavailable</AlertTitle>
      {description && (
        <AlertDescription className="mt-2 text-sm text-muted-foreground">
          {description}
        </AlertDescription>
      )}
      <AlertDescription className="mt-2">
        {message}
      </AlertDescription>
    </Alert>
  );
}

/**
 * Example usage:
 * 
 * <DisabledFeature 
 *   name="Analytics Dashboard" 
 *   description="View detailed analytics about your workouts and progress."
 *   message="Analytics are only available in the premium version."
 * />
 */
