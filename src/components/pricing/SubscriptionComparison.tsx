
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

const SubscriptionComparison = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      features: [
        { name: 'Basic workout plans', included: true },
        { name: 'Basic nutrition tracking', included: true },
        { name: 'Community access', included: true },
        { name: 'AI coaching', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Custom meal plans', included: false },
      ],
      popular: false,
    },
    {
      name: 'Pro Athlete',
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'For serious fitness enthusiasts',
      features: [
        { name: 'Advanced workout plans', included: true },
        { name: 'Personalized nutrition', included: true },
        { name: 'AI coaching chat', included: true },
        { name: 'Progress analytics', included: true },
        { name: 'Offline access', included: true },
        { name: 'Team features', included: false },
      ],
      popular: true,
    },
    {
      name: 'Coach Pro',
      price: { monthly: 19.99, yearly: 199.99 },
      description: 'For coaches and trainers',
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Team management', included: true },
        { name: 'Athlete monitoring', included: true },
        { name: 'Custom branding', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Priority support', included: true },
      ],
      popular: false,
    },
    {
      name: 'Elite AI',
      price: { monthly: 49.99, yearly: 499.99 },
      description: 'Ultimate AI-powered experience',
      features: [
        { name: 'Everything in Coach Pro', included: true },
        { name: 'AI form analysis', included: true },
        { name: 'Predictive analytics', included: true },
        { name: 'Real-time adaptation', included: true },
        { name: 'Unlimited AI chats', included: true },
        { name: 'White-label solution', included: true },
      ],
      popular: false,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-gray-600 mb-6">
          Select the perfect plan for your fitness journey
        </p>
        
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingPeriod === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingPeriod === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
            <Badge variant="secondary" className="ml-2">Save 20%</Badge>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  ${plan.price[billingPeriod]}
                </span>
                <span className="text-gray-600 ml-1">
                  /{billingPeriod === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-500 mr-3" />
                    ) : (
                      <X className="h-4 w-4 text-gray-300 mr-3" />
                    )}
                    <span className={feature.included ? '' : 'text-gray-400'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${plan.popular ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.name === 'Free' ? 'Get Started' : 'Choose Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionComparison;
