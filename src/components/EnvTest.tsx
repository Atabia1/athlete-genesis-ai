
// Simple component to test environment variables
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EnvTest = () => {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    const vars: Record<string, string> = {};
    // Get all environment variables that start with VITE_
    Object.keys(import.meta.env).forEach(key => {
      if (key.startsWith('VITE_')) {
        vars[key] = import.meta.env[key];
      }
    });
    setEnvVars(vars);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {Object.keys(envVars).length === 0 ? (
            <p>No environment variables found starting with VITE_</p>
          ) : (
            Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium">{key}:</span>
                <span>{value}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnvTest;
