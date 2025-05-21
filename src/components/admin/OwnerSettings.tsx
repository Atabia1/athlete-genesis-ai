/**
 * Owner Settings Component
 *
 * This is a hidden component that allows the app owner to set their account
 * as the owner, which grants access to all features without payment.
 *
 * This component should not be linked from the main UI and should only be
 * accessible by directly navigating to the URL.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useFeatureAccess } from '@/context/FeatureAccessContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, AlertTriangle, CheckCircle2, Tag, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Owner Settings Component
 */
const OwnerSettings = () => {
  const { user, refreshUser } = useAuth();
  const { isOwner } = useFeatureAccess();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ownerStatus, setOwnerStatus] = useState(isOwner);

  // Update owner status when isOwner changes
  useEffect(() => {
    setOwnerStatus(isOwner);
  }, [isOwner]);

  /**
   * Set the current user as the owner
   */
  const setAsOwner = async () => {
    if (!user) {
      setError('You must be logged in to set owner status');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Update the user's profile in Supabase using a custom field
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          is_owner: true // Using a direct field instead of metadata
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Refresh the user to get the updated profile
      await refreshUser();

      setSuccess(true);
      setOwnerStatus(true);
    } catch (err) {
      console.error('Error setting owner status:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while setting owner status');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove owner status from the current user
   */
  const removeOwnerStatus = async () => {
    if (!user) {
      setError('You must be logged in to remove owner status');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Update the user's profile in Supabase using a direct field
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          is_owner: false // Using a direct field instead of metadata
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Refresh the user to get the updated profile
      await refreshUser();

      setSuccess(true);
      setOwnerStatus(false);
    } catch (err) {
      console.error('Error removing owner status:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while removing owner status');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle owner status
   */
  const toggleOwnerStatus = async () => {
    if (ownerStatus) {
      await removeOwnerStatus();
    } else {
      await setAsOwner();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <CardTitle>Owner Settings</CardTitle>
            </div>
            <CardDescription>
              Set your account as the owner to access all features without payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  {ownerStatus
                    ? 'Your account has been set as the owner. You now have access to all features.'
                    : 'Owner status has been removed from your account.'}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="owner-status">Owner Status</Label>
                <p className="text-sm text-gray-500">
                  {ownerStatus
                    ? 'You currently have owner access to all features'
                    : 'Enable to get access to all features'}
                </p>
              </div>
              <Switch
                id="owner-status"
                checked={ownerStatus}
                onCheckedChange={toggleOwnerStatus}
                disabled={loading}
              />
            </div>

            <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Important Note</h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      This page is for app owners only. Setting yourself as the owner bypasses
                      all subscription checks and grants access to all premium features without payment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
              <Button
                variant={ownerStatus ? "destructive" : "default"}
                onClick={toggleOwnerStatus}
                disabled={loading}
                className={ownerStatus ? "" : "bg-blue-600 hover:bg-blue-700"}
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-white rounded-full"></span>
                    Processing...
                  </span>
                ) : ownerStatus ? (
                  'Remove Owner Status'
                ) : (
                  'Set as Owner'
                )}
              </Button>
            </div>

            {ownerStatus && (
              <div className="w-full pt-2 border-t">
                <p className="text-sm text-gray-500 mb-2">Owner Tools:</p>
                <div className="flex flex-wrap gap-2">
                  <Link to="/admin/discount-codes">
                    <Button variant="outline" size="sm" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                      <Tag className="h-4 w-4 mr-2" />
                      Manage Discount Codes
                    </Button>
                  </Link>
                  <Link to="/dashboard/subscription">
                    <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Subscription Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OwnerSettings;
