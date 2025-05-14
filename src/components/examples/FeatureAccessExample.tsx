/**
 * Feature Access Example Component
 * 
 * This component demonstrates how to use the feature access system
 * to gate features based on subscription tier and owner status.
 */

import { useFeatureAccess } from '@/context/FeatureAccessContext';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Feature } from '@/utils/feature-access';
import { Lock, Unlock, Crown, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Feature Access Example Component
 */
const FeatureAccessExample = () => {
  const { user } = useAuth();
  const { 
    hasFeatureAccess, 
    getAvailableFeatures, 
    isOwner 
  } = useFeatureAccess();
  
  // Example premium features to check
  const premiumFeatures: Feature[] = [
    'workout_advanced',
    'nutrition_advanced',
    'analytics_advanced',
    'ai_basic_chat',
    'wellbeing_advanced',
    'offline_nutrition'
  ];
  
  // Example elite features to check
  const eliteFeatures: Feature[] = [
    'workout_ai_adaptation',
    'nutrition_ai_recommendations',
    'analytics_predictive',
    'ai_form_check',
    'customization_dashboard'
  ];
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Feature Access Example
          {isOwner && (
            <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
              <Crown className="h-3 w-3 mr-1" />
              Owner
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          This example shows how feature access is controlled based on subscription tier and owner status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!user ? (
          <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Not logged in</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>You need to log in to see your feature access.</p>
                  <div className="mt-4">
                    <Link to="/login">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
                        Log In
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="text-lg font-medium mb-2">Your Access Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">User</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subscription</p>
                  <p className="font-medium capitalize">{user.subscriptionTier || 'Free'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Owner Status</p>
                  <p className="font-medium">{isOwner ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Features Available</p>
                  <p className="font-medium">{getAvailableFeatures().length}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Premium Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {premiumFeatures.map((feature) => (
                  <div 
                    key={feature}
                    className={`p-3 rounded-md border ${
                      hasFeatureAccess(feature) 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center">
                      {hasFeatureAccess(feature) ? (
                        <Unlock className="h-4 w-4 text-green-600 mr-2" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400 mr-2" />
                      )}
                      <span className={hasFeatureAccess(feature) ? 'text-green-800' : 'text-gray-500'}>
                        {feature.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Elite Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eliteFeatures.map((feature) => (
                  <div 
                    key={feature}
                    className={`p-3 rounded-md border ${
                      hasFeatureAccess(feature) 
                        ? 'bg-purple-50 border-purple-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center">
                      {hasFeatureAccess(feature) ? (
                        <Unlock className="h-4 w-4 text-purple-600 mr-2" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400 mr-2" />
                      )}
                      <span className={hasFeatureAccess(feature) ? 'text-purple-800' : 'text-gray-500'}>
                        {feature.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
        {user && !isOwner && (
          <Link to="/admin/owner-settings">
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
              <Crown className="h-4 w-4 mr-2" />
              Owner Settings
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default FeatureAccessExample;
