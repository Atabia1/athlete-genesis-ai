
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CreditCard, 
  Star, 
  Zap, 
  Settings
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { usePlan } from '@/context/PlanContext';

type SubscriptionTier = 'free' | 'pro' | 'coach' | 'elite';

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiryDate: string;
  isDefault: boolean;
}

export default function SubscriptionManagement() {
  const { subscriptionTier, setSubscriptionTier } = usePlan();
  const [autoRenewal, setAutoRenewal] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedUpgradeTier, setSelectedUpgradeTier] = useState<SubscriptionTier>('pro');

  // Mock data
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'Visa',
      last4: '4242',
      expiryDate: '12/25',
      isDefault: true,
    },
  ]);

  const currentPlan: Record<SubscriptionTier, { name: string; price: number; features: string[] }> = {
    free: {
      name: 'Free',
      price: 0,
      features: ['Basic workouts', 'Limited analytics', 'Community access'],
    },
    pro: {
      name: 'Pro',
      price: 19.99,
      features: ['Unlimited workouts', 'Advanced analytics', 'AI coaching', 'Priority support'],
    },
    coach: {
      name: 'Coach',
      price: 39.99,
      features: ['Team management', 'Advanced analytics', 'Custom training plans', 'Priority support'],
    },
    elite: {
      name: 'Elite',
      price: 49.99,
      features: ['Everything in Pro', 'Personal trainer sessions', 'Custom meal plans', 'Injury prevention'],
    },
  };

  const currentTier = subscriptionTier || 'free';
  const currentPlanData = currentPlan[currentTier];

  const availableUpgrades = currentTier === 'free' 
    ? ['pro', 'coach', 'elite'] 
    : currentTier === 'pro' 
      ? ['coach', 'elite'] 
      : currentTier === 'coach'
        ? ['elite']
        : [];

  const handleConfirmUpgrade = () => {
    setSubscriptionTier(selectedUpgradeTier);
    setShowUpgradeDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-gray-600 mt-2">Manage your subscription, billing, and account preferences.</p>
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Current Plan
            </CardTitle>
            <CardDescription>Your active subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{currentPlanData.name} Plan</h3>
                <p className="text-gray-600">
                  ${currentPlanData.price}/month
                </p>
                <ul className="mt-2 space-y-1">
                  {currentPlanData.features.map((feature: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600">• {feature}</li>
                  ))}
                </ul>
              </div>
              <div className="text-right">
                <Badge className="mb-2">Active</Badge>
                {availableUpgrades.length > 0 && (
                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        setSelectedUpgradeTier('pro');
                        setShowUpgradeDialog(true);
                      }}
                      className="w-full"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Upgrade Plan
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Billing Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-renewal">Auto-renewal</Label>
                <p className="text-sm text-gray-600">Automatically renew your subscription</p>
              </div>
              <Switch
                id="auto-renewal"
                checked={autoRenewal}
                onCheckedChange={setAutoRenewal}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email notifications</Label>
                <p className="text-sm text-gray-600">Receive billing and subscription updates</p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{method.type} ending in {method.last4}</p>
                      <p className="text-sm text-gray-600">Expires {method.expiryDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Dialog */}
        <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upgrade Subscription</DialogTitle>
              <DialogDescription>
                Choose your new subscription plan to unlock additional features.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p>You're about to upgrade to the {selectedUpgradeTier.charAt(0).toUpperCase() + selectedUpgradeTier.slice(1)} plan.</p>
              <div className="flex gap-2">
                <Button onClick={handleConfirmUpgrade} className="flex-1">
                  Confirm Upgrade
                </Button>
                <Button variant="outline" onClick={() => setShowUpgradeDialog(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
