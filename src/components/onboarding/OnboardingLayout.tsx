
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface OnboardingLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  nextPath?: string;
  prevPath?: string;
  nextLabel?: string;
  prevLabel?: string;
  showNext?: boolean;
  showPrev?: boolean;
  nextDisabled?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
}

/**
 * Onboarding Layout Component
 * 
 * This component provides a consistent layout for all onboarding steps.
 * It handles navigation between steps and displays a progress bar.
 */
const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  nextPath,
  prevPath,
  nextLabel = 'Next',
  prevLabel = 'Back',
  showNext = true,
  showPrev = true,
  nextDisabled = false,
  onNext,
  onPrev
}) => {
  const navigate = useNavigate();
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (nextPath) {
      navigate(nextPath);
    }
  };

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    } else if (prevPath) {
      navigate(prevPath);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-athleteBlue-50 to-white dark:from-athleteBlue-900 dark:to-gray-900 dark:text-white">
      {/* Header */}
      <header className="p-6 md:p-8 max-w-4xl mx-auto w-full">
        <div className="mb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-athleteBlue-600 dark:text-athleteBlue-300 font-medium">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-athleteBlue-600 dark:text-athleteBlue-300 font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200 dark:bg-gray-700" indicatorClassName="bg-gradient-to-r from-athleteBlue-500 to-athleteGreen-500" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container max-w-4xl mx-auto px-6 md:px-8 pb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in">
          <div className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-athleteBlue-800 dark:text-athleteBlue-200 mb-2">{title}</h1>
            {subtitle && <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>}
          </div>

          {/* Children content */}
          <div className="mt-6">{children}</div>

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            {showPrev ? (
              <Button variant="outline" onClick={handlePrev} className="flex items-center border-athleteBlue-200 text-athleteBlue-600 hover:bg-athleteBlue-50 dark:border-athleteBlue-700 dark:text-athleteBlue-300 dark:hover:bg-athleteBlue-900/50">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {prevLabel}
              </Button>
            ) : (
              <div></div>
            )}

            {showNext && (
              <Button 
                onClick={handleNext} 
                disabled={nextDisabled}
                className="flex items-center bg-gradient-to-r from-athleteBlue-600 to-athleteBlue-700 hover:from-athleteBlue-700 hover:to-athleteBlue-800 text-white"
              >
                {nextLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Athlete GPT • All rights reserved.</p>
      </footer>
    </div>
  );
};

export default OnboardingLayout;
