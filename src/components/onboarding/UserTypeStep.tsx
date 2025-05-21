
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Check, User, Users, Trophy } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';
import { usePlan } from '@/context/PlanContext';

/**
 * User Type Selection Step
 * 
 * This component allows users to select their account type during onboarding:
 * - Individual (personal use)
 * - Athlete (serious training)
 * - Coach (managing athletes)
 */
const UserTypeStep = () => {
  const navigate = useNavigate();
  const { setUserType } = usePlan();
  const [selectedType, setSelectedType] = useState<'individual' | 'athlete' | 'coach' | null>(null);

  const handleNext = () => {
    if (selectedType) {
      setUserType(selectedType);
      navigate('/onboarding/fitness-goals');
    }
  };

  return (
    <OnboardingLayout
      step={1}
      totalSteps={6}
      title="Welcome to Athlete GPT"
      subtitle="Let's start by understanding how you'll use the platform"
      nextDisabled={!selectedType}
      onNext={handleNext}
      showPrev={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <TypeCard
          title="Individual"
          description="Personal fitness tracking and simple workout plans"
          icon={<User size={36} />}
          isSelected={selectedType === 'individual'}
          onClick={() => setSelectedType('individual')}
          features={[
            'Basic workout plans',
            'Simple progress tracking',
            'General fitness recommendations'
          ]}
          color="from-blue-500 to-blue-600"
        />
        
        <TypeCard
          title="Athlete"
          description="Serious training programs for competitive goals"
          icon={<Trophy size={36} />}
          isSelected={selectedType === 'athlete'}
          onClick={() => setSelectedType('athlete')}
          features={[
            'Sport-specific training',
            'Performance analytics',
            'Recovery optimization',
            'Nutrition planning'
          ]}
          color="from-green-500 to-green-600" 
          recommended
        />
        
        <TypeCard
          title="Coach"
          description="Manage multiple athletes and team performance"
          icon={<Users size={36} />}
          isSelected={selectedType === 'coach'}
          onClick={() => setSelectedType('coach')}
          features={[
            'Team management',
            'Multi-athlete planning',
            'Performance comparisons',
            'Training templates'
          ]}
          color="from-purple-500 to-purple-600"
        />
      </div>
    </OnboardingLayout>
  );
};

// Card component for user types
interface TypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  features: string[];
  color: string;
  recommended?: boolean;
}

const TypeCard: React.FC<TypeCardProps> = ({
  title,
  description,
  icon,
  isSelected,
  onClick,
  features,
  color,
  recommended = false
}) => {
  return (
    <Card
      className={`relative cursor-pointer transition-all duration-200 p-6 ${
        isSelected
          ? 'border-4 border-athleteBlue-500 shadow-lg shadow-athleteBlue-100 dark:shadow-athleteBlue-900/30 scale-105'
          : 'border border-gray-200 dark:border-gray-700 hover:border-athleteBlue-300 dark:hover:border-athleteBlue-700'
      } rounded-xl overflow-hidden`}
      onClick={onClick}
    >
      {recommended && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-r from-athleteBlue-500 to-athleteBlue-600 text-white text-xs font-bold px-3 py-1 transform rotate-0 translate-x-2 -translate-y-0 shadow-md">
            RECOMMENDED
          </div>
        </div>
      )}
      
      <div className={`flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-r ${color} text-white`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-athleteBlue-800 dark:text-athleteBlue-200">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-athleteBlue-500 mr-2 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      
      {isSelected && (
        <div className="absolute top-3 right-3 bg-athleteBlue-100 dark:bg-athleteBlue-900 p-1 rounded-full">
          <Check className="h-5 w-5 text-athleteBlue-600 dark:text-athleteBlue-300" />
        </div>
      )}
    </Card>
  );
};

export default UserTypeStep;
