
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Zap, Sparkles, Brain, Shield, Users } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import DynamicPlanDemo from "@/components/pricing/DynamicPlanDemo";
import SubscriptionComparison from "@/components/pricing/SubscriptionComparison";

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
      buttonAction: () => navigate("/signup"),
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
      buttonAction: () => navigate("/signup"),
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
      buttonAction: () => navigate("/signup"),
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
      buttonAction: () => navigate("/signup"),
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
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">Choose Your Plan</h1>
          <p className="text-lg text-gray-600 mb-6">
            Pick the perfect plan for your fitness journey
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <SubscriptionComparison />
        </div>

        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Premium Features Showcase</h2>
          <DynamicPlanDemo />
        </div>

        <div className="max-w-3xl mx-auto mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Special Team Packages</h2>
          <p className="text-center mb-6">
            Coaches can manage up to 10 athletes for just $99/month
          </p>
          <div className="flex justify-center">
            <Button
              className="bg-athleteBlue-600 hover:bg-athleteBlue-700"
              onClick={() => navigate("/signup")}
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
            onClick={() => navigate("/signup")}
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
