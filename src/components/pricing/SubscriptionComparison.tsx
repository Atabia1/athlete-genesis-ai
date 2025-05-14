import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles, Zap, Shield, Users, Brain, MessageSquare, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { usePlan, SubscriptionTier } from "@/context/PlanContext";
import {
  trackSubscription,
  EventAction,
  trackEvent,
  EventCategory
} from '@/utils/analytics';
import { SubscriptionPeriod } from '@/utils/paystack';

/**
 * SubscriptionComparison: Visual comparison of subscription tiers
 *
 * This component provides an interactive, visually appealing comparison
 * of all subscription tiers with their features and benefits.
 *
 * Features:
 * - Toggle between monthly and yearly pricing
 * - Visual indicators for feature availability
 * - Highlight recommended plan
 * - Interactive UI with hover effects
 */

interface Feature {
  name: string;
  free: boolean;
  pro: boolean;
  coach: boolean;
  elite: boolean;
  icon?: React.ReactNode;
  isNew?: boolean;
}

interface PlanProps {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  tagline: string;
  isPopular?: boolean;
  color: string;
  icon: React.ReactNode;
}

const SubscriptionComparison = () => {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();

  const plans: PlanProps[] = [
    {
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      tagline: "For casual users and beginners",
      color: "gray",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      name: "Pro Athlete",
      monthlyPrice: 9.99,
      yearlyPrice: 99,
      tagline: "For serious athletes wanting structured plans",
      color: "blue",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      name: "Coach Pro",
      monthlyPrice: 19.99,
      yearlyPrice: 199,
      tagline: "For coaches managing multiple athletes",
      color: "orange",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Elite AI",
      monthlyPrice: 49.99,
      yearlyPrice: 499,
      tagline: "For users with complex, ever-changing needs",
      isPopular: true,
      color: "purple",
      icon: <Brain className="h-5 w-5" />,
    }
  ];

  const features: Feature[] = [
    {
      name: "AI-generated workout plans",
      free: true,
      pro: true,
      coach: true,
      elite: true,
      icon: <Activity className="h-4 w-4" />
    },
    {
      name: "Basic progress tracking",
      free: true,
      pro: true,
      coach: true,
      elite: true
    },
    {
      name: "Access to 10 core sports",
      free: true,
      pro: true,
      coach: true,
      elite: true
    },
    {
      name: "Manual workout logging",
      free: true,
      pro: true,
      coach: true,
      elite: true
    },
    {
      name: "Sport-specific plans (50+ sports)",
      free: false,
      pro: true,
      coach: true,
      elite: true,
      icon: <Zap className="h-4 w-4" />
    },
    {
      name: "Equipment-aware customization",
      free: false,
      pro: true,
      coach: true,
      elite: true
    },
    {
      name: "Wearable device sync",
      free: false,
      pro: true,
      coach: true,
      elite: true
    },
    {
      name: "Advanced analytics dashboard",
      free: false,
      pro: true,
      coach: true,
      elite: true
    },
    {
      name: "Team management (up to 20 athletes)",
      free: false,
      pro: false,
      coach: true,
      elite: true,
      icon: <Users className="h-4 w-4" />
    },
    {
      name: "Team analytics and benchmarks",
      free: false,
      pro: false,
      coach: true,
      elite: true
    },
    {
      name: "AI-Generated Drill Libraries",
      free: false,
      pro: false,
      coach: true,
      elite: true
    },
    {
      name: "Priority support (24-hour response)",
      free: false,
      pro: false,
      coach: true,
      elite: true
    },
    {
      name: "Instant AI Chat (Athlete GPT)",
      free: false,
      pro: false,
      coach: false,
      elite: true,
      icon: <MessageSquare className="h-4 w-4" />,
      isNew: true
    },
    {
      name: "Ultra-specific plan personalization",
      free: false,
      pro: false,
      coach: false,
      elite: true,
      isNew: true
    },
    {
      name: "Dynamic plan editing via chat",
      free: false,
      pro: false,
      coach: false,
      elite: true,
      isNew: true
    },
    {
      name: "AI-Powered Form Check",
      free: false,
      pro: false,
      coach: false,
      elite: true,
      isNew: true
    },
    {
      name: "24/7 Recovery Optimization",
      free: false,
      pro: false,
      coach: false,
      elite: true,
      icon: <Brain className="h-4 w-4" />,
      isNew: true
    }
  ];

  const { setSubscriptionTier } = usePlan();

  const handleSubscribe = (planName: string) => {
    // Convert plan name to subscription tier
    let tier: SubscriptionTier = 'free';

    switch (planName.toLowerCase()) {
      case 'pro athlete':
        tier = 'pro';
        break;
      case 'coach pro':
        tier = 'coach';
        break;
      case 'elite ai':
        tier = 'elite';
        break;
      default:
        tier = 'free';
    }

    // Track subscription selection
    trackSubscription(
      tier,
      EventAction.SUBSCRIPTION_STARTED,
      {
        billing_period: isYearly ? 'yearly' : 'monthly',
        source: 'pricing_page'
      }
    );

    if (tier === 'free') {
      // Update subscription tier in context (which also updates localStorage)
      setSubscriptionTier(tier);

      // Navigate to onboarding
      navigate('/onboarding');
    } else {
      // Store selected plan and period in localStorage
      localStorage.setItem('selectedPlan', tier);
      localStorage.setItem('subscriptionPeriod', isYearly ? 'yearly' : 'monthly');

      // Navigate to payment page
      navigate(`/payment?tier=${tier}&period=${isYearly ? 'yearly' : 'monthly'}`);
    }
  };

  const getColorClass = (color: string, element: 'bg' | 'text' | 'border' | 'hover', intensity?: number) => {
    const i = intensity || 500;
    return `${element}-${color}-${i}`;
  };

  return (
    <div className="w-full">
      {/* Pricing toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-full inline-flex">
          <button
            onClick={() => setIsYearly(false)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              !isYearly ? "bg-white shadow-sm text-gray-900" : "text-gray-600"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center",
              isYearly ? "bg-white shadow-sm text-gray-900" : "text-gray-600"
            )}
          >
            Yearly
            <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">Save 20%</Badge>
          </button>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative overflow-hidden transition-all hover:shadow-lg",
              plan.isPopular && `border-${plan.color}-400`
            )}
          >
            {plan.isPopular && (
              <div className={`absolute top-0 right-0 w-24 h-24 ${getColorClass(plan.color, 'bg', 500)} rotate-45 translate-x-8 -translate-y-8`}>
                <span className="absolute bottom-4 right-1 transform rotate-45 text-white text-xs font-bold">
                  POPULAR
                </span>
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-full ${getColorClass(plan.color, 'bg', 100)} ${getColorClass(plan.color, 'text', 600)} mr-3`}>
                  {plan.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <p className="text-sm text-gray-500">{plan.tagline}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-end">
                  <span className="text-3xl font-bold">
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-gray-500 ml-2">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  )}
                </div>
                {isYearly && plan.monthlyPrice > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    Save ${(plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(2)} per year
                  </p>
                )}
              </div>

              <Button
                className={cn(
                  "w-full mb-6",
                  plan.name === "Free"
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    : `${getColorClass(plan.color, 'bg')} ${getColorClass(plan.color, 'hover', 600)} text-white`
                )}
                onClick={() => handleSubscribe(plan.name)}
              >
                {plan.name === "Free" ? "Get Started" : `Subscribe to ${plan.name}`}
              </Button>

              <div className="space-y-3">
                {features.slice(0, 6).map((feature, index) => {
                  const isIncluded =
                    (plan.name === "Free" && feature.free) ||
                    (plan.name === "Pro Athlete" && feature.pro) ||
                    (plan.name === "Coach Pro" && feature.coach) ||
                    (plan.name === "Elite AI" && feature.elite);

                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start",
                        !isIncluded && "opacity-50"
                      )}
                    >
                      {isIncluded ? (
                        <Check className={`h-5 w-5 ${getColorClass(plan.color, 'text')} mr-2 shrink-0`} />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 mr-2 shrink-0" />
                      )}
                      <span className="text-sm">
                        {feature.name}
                        {feature.isNew && (
                          <Badge className="ml-2 bg-purple-100 text-purple-800">New</Badge>
                        )}
                      </span>
                    </div>
                  );
                })}
                {features.length > 6 && (
                  <Button
                    variant="link"
                    className={`text-sm p-0 h-auto ${getColorClass(plan.color, 'text')}`}
                    onClick={() => navigate('/pricing')}
                  >
                    View all features
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionComparison;
