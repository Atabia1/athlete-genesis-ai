import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Brain, 
  Users, 
  Activity, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Dumbbell,
  BarChart2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FeatureDemo from '@/components/pricing/FeatureDemo';
import { usePlan, SubscriptionTier } from '@/context/PlanContext';
import { cn } from '@/lib/utils';

/**
 * FeatureDemos: Page for showcasing interactive demos of premium features
 * 
 * This page allows users to explore and test premium features
 * without subscribing. It includes demos for each subscription tier.
 */

const FeatureDemos = () => {
  const [activeTier, setActiveTier] = useState<SubscriptionTier>('pro');
  const navigate = useNavigate();
  const { subscriptionTier } = usePlan();
  
  // Get tier-specific colors and icons
  const getTierColor = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'pro':
        return 'blue';
      case 'coach':
        return 'orange';
      case 'elite':
        return 'purple';
      default:
        return 'gray';
    }
  };
  
  const getTierIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'pro':
        return <Zap className="h-5 w-5" />;
      case 'coach':
        return <Users className="h-5 w-5" />;
      case 'elite':
        return <Brain className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };
  
  // Check if the user already has this tier
  const hasTier = (tier: SubscriptionTier) => {
    return subscriptionTier === tier || 
      (tier === 'pro' && subscriptionTier === 'coach') || 
      (tier === 'pro' && subscriptionTier === 'elite') || 
      (tier === 'coach' && subscriptionTier === 'elite');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container px-4 py-16 mx-auto flex-grow">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
            Try Premium Features
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Experience the power of our premium features before you subscribe
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {(['pro', 'coach', 'elite'] as SubscriptionTier[]).map((tier) => (
              <Button
                key={tier}
                onClick={() => setActiveTier(tier)}
                variant={activeTier === tier ? 'default' : 'outline'}
                className={cn(
                  "flex items-center gap-2",
                  activeTier === tier && `bg-${getTierColor(tier)}-600 hover:bg-${getTierColor(tier)}-700`
                )}
              >
                {getTierIcon(tier)}
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
                {hasTier(tier) && (
                  <Badge className="ml-1 bg-green-100 text-green-800">
                    Owned
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <FeatureDemo tier={activeTier} />
        </div>
        
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Key Features Comparison</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              tier="pro"
              title="Pro Athlete"
              description="For serious athletes wanting structured plans"
              features={[
                "Sport-specific plans for 50+ sports",
                "Equipment-aware customization",
                "Advanced analytics dashboard",
                "Wearable device sync",
                "Track 10+ well-being metrics"
              ]}
              icon={<Zap className="h-5 w-5 text-blue-600" />}
              color="blue"
              onClick={() => setActiveTier('pro')}
              isActive={activeTier === 'pro'}
              isOwned={hasTier('pro')}
            />
            
            <FeatureCard 
              tier="coach"
              title="Coach Pro"
              description="For coaches managing teams"
              features={[
                "Team management (up to 20 athletes)",
                "Team analytics and benchmarks",
                "AI-Generated Drill Libraries",
                "Live collaboration tools",
                "Priority support"
              ]}
              icon={<Users className="h-5 w-5 text-orange-600" />}
              color="orange"
              onClick={() => setActiveTier('coach')}
              isActive={activeTier === 'coach'}
              isOwned={hasTier('coach')}
            />
            
            <FeatureCard 
              tier="elite"
              title="Elite AI"
              description="For users with complex, ever-changing needs"
              features={[
                "Instant AI Chat (Athlete GPT)",
                "Dynamic plan editing via chat",
                "AI-Powered Form Check",
                "24/7 Recovery Optimization",
                "Predictive performance modeling"
              ]}
              icon={<Brain className="h-5 w-5 text-purple-600" />}
              color="purple"
              onClick={() => setActiveTier('elite')}
              isActive={activeTier === 'elite'}
              isOwned={hasTier('elite')}
            />
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <h3 className="text-xl font-medium mb-3">Ready to upgrade?</h3>
          <p className="text-gray-600 mb-6">
            Choose the perfect plan for your fitness journey
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/pricing')}
              className="flex items-center"
            >
              View All Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              onClick={() => navigate('/dashboard/subscription')}
              className="bg-purple-600 hover:bg-purple-700 flex items-center"
            >
              <Zap className="mr-2 h-4 w-4" />
              Manage Subscription
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Feature card component
interface FeatureCardProps {
  tier: SubscriptionTier;
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  isActive: boolean;
  isOwned: boolean;
}

const FeatureCard = ({
  tier,
  title,
  description,
  features,
  icon,
  color,
  onClick,
  isActive,
  isOwned
}: FeatureCardProps) => (
  <Card 
    className={cn(
      "transition-all",
      isActive ? `border-${color}-400 shadow-lg` : "hover:border-gray-300 hover:shadow-md"
    )}
  >
    <CardHeader className={cn(
      "pb-3",
      isActive && `bg-${color}-50`
    )}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-full bg-${color}-100`}>
          {icon}
        </div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>
      {isOwned && (
        <Badge className="bg-green-100 text-green-800 self-start">
          Current Plan
        </Badge>
      )}
    </CardHeader>
    <CardContent className="pt-4">
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Sparkles className={`h-4 w-4 text-${color}-500 mt-0.5`} />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button 
        onClick={onClick}
        className={cn(
          "w-full",
          isActive 
            ? `bg-${color}-600 hover:bg-${color}-700` 
            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
        )}
        variant={isActive ? 'default' : 'outline'}
      >
        {isActive ? 'Currently Viewing' : 'View Demo'}
      </Button>
    </CardFooter>
  </Card>
);

export default FeatureDemos;
