/**
 * Environment Test Component
 *
 * This component displays the current environment configuration.
 * It's used to verify that the environment configuration is working correctly.
 */

import React from 'react';
import { config } from '@/utils/env-config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function EnvTest() {
  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Environment Configuration</CardTitle>
        <CardDescription>
          This component displays the current environment configuration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="font-semibold">API Base URL:</div>
          <div>{config.API_BASE_URL}</div>
          
          <div className="font-semibold">Environment:</div>
          <div>{config.NODE_ENV}</div>
          
          <div className="font-semibold">Offline Mode Enabled:</div>
          <div>{config.ENABLE_OFFLINE_MODE ? 'Yes' : 'No'}</div>
          
          <div className="font-semibold">Analytics Enabled:</div>
          <div>{config.ENABLE_ANALYTICS ? 'Yes' : 'No'}</div>
          
          <div className="font-semibold">Supabase URL:</div>
          <div>{config.SUPABASE_URL || 'Not configured'}</div>
          
          <div className="font-semibold">Paystack Public Key:</div>
          <div>{config.PAYSTACK_PUBLIC_KEY ? 'Configured' : 'Not configured'}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default EnvTest;
