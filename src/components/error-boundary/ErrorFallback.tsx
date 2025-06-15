import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-md border-red-500 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center justify-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Oops! Something went wrong.
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            We've encountered an error. Please try again or contact support.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-red-700 font-bold mb-4">
            {error.message}
          </p>
          <p className="text-sm text-gray-600">
            {error.stack?.substring(0, 300)}...
          </p>
        </CardContent>
        <div className="flex justify-center space-x-4 p-4">
          <Button variant="outline" onClick={resetError}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button variant="secondary" asChild>
            <a href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </a>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ErrorFallback;
