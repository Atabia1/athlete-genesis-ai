import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Lock,
  Zap,
  ArrowRight,
  CheckCircle,
  Brain,
  Users,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { usePlan, SubscriptionTier } from '@/context/PlanContext';
import {
  Feature,
  hasFeatureAccess,
  getMinimumTierForFeature,
  featureDescriptions
} from '@/utils/feature-access';
import {
  trackFeatureUsage,
  EventAction,
  trackEvent,
  EventCategory
} from '@/utils/analytics';
import { cn } from '@/lib/utils';

/**
 * FeatureGate: Component for restricting access to premium features
 *
 * This component wraps premium features and shows an upgrade prompt
 * when a user tries to access a feature they don't have access to.
 *
 * Usage:
 * <FeatureGate feature="ai_advanced_chat">
 *   <PremiumFeatureComponent />
 * </FeatureGate>
 */

interface FeatureGateProps {
  /** The feature to check access for */
  feature: Feature;
  /** The content to render if the user has access */
  children: ReactNode;
  /** Optional fallback content to render if the user doesn't have access */
  fallback?: ReactNode;
  /** Whether to show a minimal prompt instead of the full card */
  minimal?: boolean;
}

export const FeatureGate = ({
  feature,
  children,
  fallback,
  minimal = false
}: FeatureGateProps) => {
  const { subscriptionTier } = usePlan();
  const navigate = useNavigate();

  // Check if the user has access to the feature
  const hasAccess = hasFeatureAccess(feature, subscriptionTier, true);

  // Track feature access attempt
  useEffect(() => {
    if (!hasAccess) {
      trackFeatureUsage(feature, EventAction.FEATURE_LOCKED, {
        current_tier: subscriptionTier,
        required_tier: getMinimumTierForFeature(feature)
      });
    }
  }, [feature, hasAccess, subscriptionTier]);

  // If the user has access, render the children
  if (hasAccess) {
    return <>{children}</>;
  }

  // Get the minimum tier required for the feature
  const requiredTier = getMinimumTierForFeature(feature);

  // If minimal mode is enabled, show a simple prompt
  if (minimal) {
    return (
      <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="h-4 w-4 text-amber-500" />
          <h4 className="font-medium">Premium Feature</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {featureDescriptions[feature]} requires a {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} subscription.
        </p>
        <Button
          size="sm"
          onClick={() => navigate('/dashboard/subscription')}
          className="w-full"
        >
          Upgrade Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  // If fallback is provided, render it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Otherwise, render the upgrade prompt
  return (
    <Card className="border-amber-200 shadow-md">
      <CardHeader className="bg-amber-50 border-b border-amber-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-500" />
            Premium Feature
          </CardTitle>
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} Plan Required
          </Badge>
        </div>
        <CardDescription>
          This feature requires a higher subscription tier
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Alert className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Feature Locked</AlertTitle>
          <AlertDescription>
            {featureDescriptions[feature]} is available with the {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} plan.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h4 className="font-medium">What you'll get with {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">{featureDescriptions[feature]}</p>
                <p className="text-sm text-muted-foreground">Unlock this feature</p>
              </div>
            </div>

            {requiredTier === 'pro' && (
              <>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Sport-specific plans</p>
                    <p className="text-sm text-muted-foreground">For 50+ sports</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Advanced analytics</p>
                    <p className="text-sm text-muted-foreground">Track your progress in detail</p>
                  </div>
                </div>
              </>
            )}

            {requiredTier === 'coach' && (
              <>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Team management</p>
                    <p className="text-sm text-muted-foreground">For up to 20 athletes</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Team analytics</p>
                    <p className="text-sm text-muted-foreground">Performance benchmarks</p>
                  </div>
                </div>
              </>
            )}

            {requiredTier === 'elite' && (
              <>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">AI Coach Chat</p>
                    <p className="text-sm text-muted-foreground">Get instant answers</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Dynamic plan editing</p>
                    <p className="text-sm text-muted-foreground">Modify plans on the fly</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t pt-4">
        <Button
          onClick={() => navigate('/dashboard/subscription')}
          className={cn(
            "w-full",
            requiredTier === 'pro' ? "bg-blue-600 hover:bg-blue-700" :
            requiredTier === 'coach' ? "bg-orange-600 hover:bg-orange-700" :
            "bg-purple-600 hover:bg-purple-700"
          )}
        >
          <Zap className="mr-2 h-4 w-4" />
          Upgrade to {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}
        </Button>
      </CardFooter>
    </Card>
  );
};

/**
 * UpgradePrompt: Component for showing an upgrade prompt
 *
 * This component shows a dialog with information about upgrading
 * to a higher subscription tier.
 */

interface UpgradePromptProps {
  /** The target subscription tier to upgrade to */
  targetTier: SubscriptionTier;
  /** The trigger element that opens the dialog */
  trigger: ReactNode;
  /** Optional title for the dialog */
  title?: string;
  /** Optional description for the dialog */
  description?: string;
  /** Optional features to highlight */
  features?: Feature[];
}

export const UpgradePrompt = ({
  targetTier,
  trigger,
  title,
  description,
  features = []
}: UpgradePromptProps) => {
  const navigate = useNavigate();
  const { subscriptionTier } = usePlan();

  // Track dialog open
  const handleDialogOpen = (open: boolean) => {
    if (open) {
      trackEvent(
        EventCategory.SUBSCRIPTION,
        EventAction.SUBSCRIPTION_VIEWED,
        `upgrade_prompt_${targetTier}`,
        undefined,
        {
          current_tier: subscriptionTier,
          target_tier: targetTier,
          features: features
        }
      );
    }
  };

  // Track upgrade click
  const handleUpgradeClick = () => {
    trackEvent(
      EventCategory.SUBSCRIPTION,
      EventAction.SUBSCRIPTION_STARTED,
      `upgrade_to_${targetTier}`,
      undefined,
      {
        current_tier: subscriptionTier,
        target_tier: targetTier,
        features: features
      }
    );

    navigate('/dashboard/subscription');
  };

  const getTierIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'pro':
        return <Zap className="h-5 w-5 text-blue-600" />;
      case 'coach':
        return <Users className="h-5 w-5 text-orange-600" />;
      case 'elite':
        return <Brain className="h-5 w-5 text-purple-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <Dialog onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTierIcon(targetTier)}
            {title || `Upgrade to ${targetTier.charAt(0).toUpperCase() + targetTier.slice(1)}`}
          </DialogTitle>
          <DialogDescription>
            {description || `Unlock premium features with the ${targetTier.charAt(0).toUpperCase() + targetTier.slice(1)} plan.`}
          </DialogDescription>
        </DialogHeader>

        {features.length > 0 && (
          <div className="space-y-4 py-4">
            <h4 className="font-medium">Features you'll unlock:</h4>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>{featureDescriptions[feature]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <DialogTrigger asChild>
            <Button variant="outline">Maybe Later</Button>
          </DialogTrigger>
          <Button
            onClick={handleUpgradeClick}
            className={cn(
              targetTier === 'pro' ? "bg-blue-600 hover:bg-blue-700" :
              targetTier === 'coach' ? "bg-orange-600 hover:bg-orange-700" :
              "bg-purple-600 hover:bg-purple-700"
            )}
          >
            <Zap className="mr-2 h-4 w-4" />
            View Plans
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
