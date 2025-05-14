/**
 * Environment Debug Component
 * 
 * This component displays the environment configuration for debugging purposes.
 * It should only be used in development mode.
 */

import React, { useState } from 'react';
import { config, isFeatureEnabled } from '@/utils/env-config';

/**
 * Environment Debug Component
 */
export function EnvDebug() {
  const [showSecrets, setShowSecrets] = useState(false);

  // Don't render in production
  if (config.IS_PRODUCTION) {
    return null;
  }

  // Mask sensitive values
  const maskedConfig = { ...config };
  
  if (!showSecrets) {
    // Mask API keys and tokens
    if (maskedConfig.SUPABASE_ANON_KEY) {
      maskedConfig.SUPABASE_ANON_KEY = maskString(maskedConfig.SUPABASE_ANON_KEY);
    }
    
    if (maskedConfig.PAYSTACK_PUBLIC_KEY) {
      maskedConfig.PAYSTACK_PUBLIC_KEY = maskString(maskedConfig.PAYSTACK_PUBLIC_KEY);
    }
    
    if (maskedConfig.OPENAI_API_KEY) {
      maskedConfig.OPENAI_API_KEY = maskString(maskedConfig.OPENAI_API_KEY);
    }
    
    if (maskedConfig.FIREBASE_API_KEY) {
      maskedConfig.FIREBASE_API_KEY = maskString(maskedConfig.FIREBASE_API_KEY);
    }
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Environment Configuration</h2>
        <button
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setShowSecrets(!showSecrets)}
        >
          {showSecrets ? 'Hide Secrets' : 'Show Secrets'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium mb-2">API Configuration</h3>
          <ConfigItem label="API Base URL" value={maskedConfig.API_BASE_URL} />
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Authentication</h3>
          <ConfigItem label="Supabase URL" value={maskedConfig.SUPABASE_URL} />
          <ConfigItem label="Supabase Anon Key" value={maskedConfig.SUPABASE_ANON_KEY} />
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Payment</h3>
          <ConfigItem label="Paystack Public Key" value={maskedConfig.PAYSTACK_PUBLIC_KEY} />
        </div>
        
        <div>
          <h3 className="font-medium mb-2">External Services</h3>
          <ConfigItem label="OpenAI API Key" value={maskedConfig.OPENAI_API_KEY} />
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Firebase</h3>
          <ConfigItem label="API Key" value={maskedConfig.FIREBASE_API_KEY} />
          <ConfigItem label="Auth Domain" value={maskedConfig.FIREBASE_AUTH_DOMAIN} />
          <ConfigItem label="Project ID" value={maskedConfig.FIREBASE_PROJECT_ID} />
          <ConfigItem label="Storage Bucket" value={maskedConfig.FIREBASE_STORAGE_BUCKET} />
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Feature Flags</h3>
          <ConfigItem
            label="Offline Mode"
            value={isFeatureEnabled('OFFLINE_MODE') ? 'Enabled' : 'Disabled'}
          />
          <ConfigItem
            label="Analytics"
            value={isFeatureEnabled('ANALYTICS') ? 'Enabled' : 'Disabled'}
          />
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Environment</h3>
          <ConfigItem label="Node Env" value={maskedConfig.NODE_ENV} />
          <ConfigItem
            label="Production"
            value={maskedConfig.IS_PRODUCTION ? 'Yes' : 'No'}
          />
          <ConfigItem
            label="Development"
            value={maskedConfig.IS_DEVELOPMENT ? 'Yes' : 'No'}
          />
          <ConfigItem
            label="Test"
            value={maskedConfig.IS_TEST ? 'Yes' : 'No'}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Config Item Component
 */
function ConfigItem({ label, value }: { label: string; value?: string | boolean | null }) {
  if (value === undefined || value === null) {
    return null;
  }
  
  return (
    <div className="mb-1">
      <span className="font-medium">{label}:</span>{' '}
      <span className="font-mono text-sm">{String(value)}</span>
    </div>
  );
}

/**
 * Mask a string for display
 */
function maskString(str: string): string {
  if (!str) return '';
  
  // If the string is short, mask all but the first and last character
  if (str.length <= 8) {
    return `${str.charAt(0)}${'*'.repeat(str.length - 2)}${str.charAt(str.length - 1)}`;
  }
  
  // For longer strings, show first 4 and last 4 characters
  return `${str.substring(0, 4)}${'*'.repeat(8)}${str.substring(str.length - 4)}`;
}

export default EnvDebug;
