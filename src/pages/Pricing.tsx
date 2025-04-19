
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      tagline: "For casual users and beginners",
      price: "0",
      period: "forever",
      description: "Basic features to get started with your fitness journey",
      buttonText: "Get Started",
      buttonAction: () => navigate("/onboarding"),
      isFeatured: false,
      features: [
        { name: "Basic AI-generated workout & meal plans", included: true },
        { name: "Access to 10 core sports", included: true },
        { name: "Manual workout and meal logging", included: true },
        { name: "Limited well-being tracking (3 metrics)", included: true },
        { name: "Basic progress charts", included: true },
        { name: "Advanced AI Plans", included: false },
        { name: "Wearable device sync", included: false },
        { name: "AI Chat assistance", included: false },
      ],
    },
    {
      name: "Pro Athlete",
      tagline: "For serious athletes wanting structured plans",
      price: "9.99",
      period: "month",
      yearlyPrice: "99",
      description: "Advanced plans and tracking for the dedicated athlete",
      buttonText: "Start Pro Trial",
      buttonAction: () => navigate("/onboarding"),
      isFeatured: false,
      features: [
        { name: "Everything in Free, plus:", included: true },
        { name: "Sport-specific plans for 50+ sports", included: true },
        { name: "Equipment-aware workout customization", included: true },
        { name: "Sync with 1 wearable device", included: true },
        { name: "Track 10+ well-being metrics", included: true },
        { name: "Basic AI Chat (pre-set queries)", included: true },
        { name: "Team management tools", included: false },
        { name: "Real-time AI assistance", included: false },
      ],
    },
    {
      name: "Coach Pro",
      tagline: "For coaches managing teams",
      price: "19.99",
      period: "month",
      yearlyPrice: "199",
      description: "Team management tools and advanced analytics",
      buttonText: "Start Coach Trial",
      buttonAction: () => navigate("/onboarding"),
      isFeatured: false,
      features: [
        { name: "Everything in Pro Athlete, plus:", included: true },
        { name: "Monitor up to 20 athletes", included: true },
        { name: "Team analytics and benchmarks", included: true },
        { name: "AI-Generated Drill Libraries", included: true },
        { name: "Live collaboration tools", included: true },
        { name: "Priority support (24-hour response)", included: true },
        { name: "AI Form Check analysis", included: false },
        { name: "Real-time AI assistance", included: false },
      ],
    },
    {
      name: "Elite AI",
      tagline: "For users with complex, ever-changing needs",
      price: "49.99",
      period: "month",
      yearlyPrice: "499",
      description: "Ultra-specific personalization with real-time AI assistance",
      buttonText: "Start Elite Trial",
      buttonAction: () => navigate("/onboarding"),
      isFeatured: true,
      features: [
        { name: "Everything in Coach Pro, plus:", included: true },
        { name: "Instant AI Chat (Athlete GPT)", included: true },
        { name: "Ultra-specific plan personalization", included: true },
        { name: "Dynamic plan editing via chat", included: true },
        { name: "AI-Powered Form Check", included: true },
        { name: "24/7 Recovery Optimization", included: true },
        { name: "Live Q&A sessions with pros", included: true },
        { name: "Early access to new features", included: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container px-4 py-16 mx-auto flex-grow">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600 mb-6">
            Pick the perfect plan for your fitness journey
          </p>
          
          <div className="inline-flex items-center rounded-full border border-gray-200 p-1 mb-8">
            <Button variant="ghost" className="rounded-full px-6">
              Monthly
            </Button>
            <Button variant="default" className="rounded-full px-6">
              Yearly (Save 20%)
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`flex flex-col ${
                plan.isFeatured 
                  ? "border-athleteBlue-500 shadow-lg relative" 
                  : "border-gray-200"
              }`}
            >
              {plan.isFeatured && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-athleteBlue-600">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500 ml-2">/{plan.period}</span>
                  {plan.yearlyPrice && (
                    <div className="text-sm text-gray-500 mt-1">
                      or ${plan.yearlyPrice}/year
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-6">{plan.description}</p>
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? "text-gray-700" : "text-gray-400"}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={plan.buttonAction} 
                  className={`w-full ${
                    plan.isFeatured 
                      ? "bg-athleteBlue-600 hover:bg-athleteBlue-700" 
                      : plan.name === "Free" 
                        ? "bg-gray-200 hover:bg-gray-300 text-gray-800" 
                        : "bg-gray-800 hover:bg-gray-900"
                  }`}
                  variant={plan.name === "Free" ? "outline" : "default"}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Special Team Packages</h2>
          <p className="text-center mb-6">
            Coaches can manage up to 10 athletes for just $99/month
          </p>
          <div className="flex justify-center">
            <Button 
              className="bg-athleteBlue-600 hover:bg-athleteBlue-700" 
              onClick={() => navigate("/onboarding")}
            >
              Contact for Team Pricing
            </Button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-12 text-center">
          <h3 className="text-xl font-medium mb-3">Try Elite AI for 7 days</h3>
          <p className="text-gray-600 mb-6">
            Experience our most powerful AI features with our risk-free 7-day trial
          </p>
          <Button 
            size="lg" 
            className="bg-athleteBlue-600 hover:bg-athleteBlue-700"
            onClick={() => navigate("/onboarding")}
          >
            Start Your 7-Day Free Trial
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
