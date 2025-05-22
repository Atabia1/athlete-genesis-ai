
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="hero-gradient text-white">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in">
              Your AI-Powered <br /> 
              Personal Coach
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-md animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Hyper-personalized workout and meal plans adapted to your goals, sport, and lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Link to="/onboarding">
                <Button className="bg-white text-athleteBlue-600 hover:bg-gray-100 font-semibold px-6 py-6 w-full sm:w-auto">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="border-green text-black hover:bg-white/10 font-semibold px-6 py-6 w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-4 -left-4 w-full h-full bg-athleteGreen-500 rounded-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-athleteBlue-400 rounded-xl"></div>
              <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop" 
                  alt="Athlete training with AI assistance" 
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
