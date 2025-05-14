/**
 * Error Fallback Component
 * 
 * This component is displayed when an error occurs in a component tree.
 * It provides a user-friendly error message and options to recover.
 */

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { getUserFriendlyMessage } from '@/shared/utils/error-handling';
import { useNavigate } from 'react-router-dom';

interface ErrorFallbackProps {
  error: Error;
  resetError?: () => void;
  title?: string;
  showHomeButton?: boolean;
  showResetButton?: boolean;
  className?: string;
}

export function ErrorFallback({
  error,
  resetError,
  title = 'Something went wrong',
  showHomeButton = true,
  showResetButton = true,
  className = '',
}: ErrorFallbackProps) {
  const navigate = useNavigate();
  const errorMessage = getUserFriendlyMessage(error);
  
  const handleReset = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  return (
    <div className={`flex items-center justify-center p-6 min-h-[400px] ${className}`}>
      <Card className="w-full max-w-md shadow-lg border-red-200">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <CardTitle className="text-xl text-red-700">{title}</CardTitle>
          </div>
          <CardDescription className="text-gray-600">
            We're sorry, but an error occurred while trying to display this content.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="bg-red-50 p-4 rounded-md border border-red-100 text-red-800">
            <p className="font-medium mb-2">Error details:</p>
            <p className="text-sm">{errorMessage}</p>
            
            {process.env.NODE_ENV !== 'production' && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium">Technical details</summary>
                <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-[200px]">
                  {error.stack || error.message}
                </pre>
              </details>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2 pt-2">
          {showHomeButton && (
            <Button
              variant="outline"
              onClick={handleGoHome}
              className="flex items-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
          )}
          
          {showResetButton && (
            <Button
              onClick={handleReset}
              className="flex items-center bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
