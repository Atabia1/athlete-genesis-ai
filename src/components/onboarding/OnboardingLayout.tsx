
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface OnboardingLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  children: ReactNode;
}

const OnboardingLayout = ({ step, totalSteps, title, children }: OnboardingLayoutProps) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-bold bg-gradient-to-r from-athleteBlue-600 to-athleteGreen-600 bg-clip-text text-transparent">
              Athlete GPT
            </span>
          </Link>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-500">
                  Step {step} of {totalSteps}
                </span>
                <span className="text-sm font-medium text-athleteBlue-600">
                  {Math.round((step / totalSteps) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-athleteBlue-600 to-athleteGreen-600 h-2 rounded-full" 
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-6">{title}</h1>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
