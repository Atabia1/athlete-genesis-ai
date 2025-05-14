import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Users, Trophy, Brain, Target } from 'lucide-react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { usePlan } from '@/context/PlanContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

/**
 * Coaching Philosophy Step for Coaches
 * 
 * This is the first step in the custom onboarding flow for coaches.
 * It collects information about coaching style, philosophy, and approach.
 */

// Define coaching philosophy types
interface CoachingPhilosophy {
  coachingStyle: string;
  primaryFocus: string[];
  coachingValues: string[];
  personalPhilosophy: string;
  yearsExperience: string;
  certifications: string;
}

const coachingStyleOptions = [
  { id: 'authoritative', label: 'Authoritative (Clear direction, structured approach)' },
  { id: 'democratic', label: 'Democratic (Collaborative, team input valued)' },
  { id: 'holistic', label: 'Holistic (Whole-person development focus)' },
  { id: 'analytical', label: 'Analytical (Data-driven, evidence-based)' },
  { id: 'mentoring', label: 'Mentoring (Relationship-focused, guidance-oriented)' },
];

const focusAreaOptions = [
  { id: 'performance', label: 'Performance Optimization' },
  { id: 'technique', label: 'Technical Skill Development' },
  { id: 'strength', label: 'Strength & Conditioning' },
  { id: 'team', label: 'Team Cohesion & Culture' },
  { id: 'mental', label: 'Mental Performance' },
  { id: 'injury', label: 'Injury Prevention & Recovery' },
  { id: 'youth', label: 'Youth Development' },
  { id: 'elite', label: 'Elite Athlete Development' },
];

const coachingValueOptions = [
  { id: 'discipline', label: 'Discipline & Work Ethic' },
  { id: 'creativity', label: 'Creativity & Innovation' },
  { id: 'teamwork', label: 'Teamwork & Collaboration' },
  { id: 'resilience', label: 'Resilience & Mental Toughness' },
  { id: 'integrity', label: 'Integrity & Sportsmanship' },
  { id: 'growth', label: 'Growth Mindset' },
  { id: 'balance', label: 'Life Balance & Wellbeing' },
  { id: 'excellence', label: 'Pursuit of Excellence' },
  { id: 'fun', label: 'Enjoyment & Fun' },
  { id: 'respect', label: 'Respect & Inclusivity' },
];

const experienceOptions = [
  { id: 'new', label: 'New Coach (0-2 years)' },
  { id: 'developing', label: 'Developing Coach (3-5 years)' },
  { id: 'experienced', label: 'Experienced Coach (6-10 years)' },
  { id: 'veteran', label: 'Veteran Coach (10+ years)' },
];

const CoachingPhilosophy = () => {
  const navigate = useNavigate();
  const { userType } = usePlan();
  
  // Redirect if not a coach
  if (userType !== 'coach') {
    navigate('/onboarding');
    return null;
  }

  // Initialize coaching philosophy state
  const [coachingPhilosophy, setCoachingPhilosophy] = useState<CoachingPhilosophy>({
    coachingStyle: '',
    primaryFocus: [],
    coachingValues: [],
    personalPhilosophy: '',
    yearsExperience: '',
    certifications: '',
  });

  // Toggle selection in array
  const toggleSelection = (field: 'primaryFocus' | 'coachingValues', value: string) => {
    if (coachingPhilosophy[field].includes(value)) {
      setCoachingPhilosophy({
        ...coachingPhilosophy,
        [field]: coachingPhilosophy[field].filter(item => item !== value)
      });
    } else {
      setCoachingPhilosophy({
        ...coachingPhilosophy,
        [field]: [...coachingPhilosophy[field], value]
      });
    }
  };

  // Update coaching philosophy
  const updatePhilosophy = (key: keyof CoachingPhilosophy, value: any) => {
    setCoachingPhilosophy({
      ...coachingPhilosophy,
      [key]: value
    });
  };

  // Handle navigation
  const handleBack = () => {
    navigate('/onboarding');
  };

  const handleContinue = () => {
    // Save coaching philosophy to context or local storage
    localStorage.setItem('coachingPhilosophy', JSON.stringify(coachingPhilosophy));
    
    // Navigate to next step
    navigate('/onboarding/coach/team-setup');
  };

  // Check if form is complete enough to continue
  const isFormValid = () => {
    return (
      coachingPhilosophy.coachingStyle !== '' &&
      coachingPhilosophy.primaryFocus.length > 0 &&
      coachingPhilosophy.yearsExperience !== ''
    );
  };

  return (
    <OnboardingLayout 
      step={1} 
      totalSteps={5} 
      title="Your Coaching Philosophy"
      subtitle="Tell us about your approach to coaching and athlete development"
    >
      <div className="space-y-6 mb-8">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-100">
          <div className="flex items-start">
            <Trophy className="h-5 w-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-orange-700 mb-1">Why This Matters</h3>
              <p className="text-sm text-gray-600">
                Your coaching philosophy shapes how we'll build your team management tools and training resources.
                This helps us create a system that aligns with your values and approach.
              </p>
            </div>
          </div>
        </div>

        {/* Coaching Style */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <Users className="h-4 w-4 mr-2 text-orange-600" />
            Your Coaching Style
          </Label>
          
          <RadioGroup
            value={coachingPhilosophy.coachingStyle}
            onValueChange={(value) => updatePhilosophy('coachingStyle', value)}
          >
            {coachingStyleOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`style-${option.id}`} />
                <Label htmlFor={`style-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Primary Focus Areas */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <Target className="h-4 w-4 mr-2 text-orange-600" />
            Primary Focus Areas
          </Label>
          <p className="text-sm text-gray-500">Select up to 3 areas that best describe your coaching focus</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {focusAreaOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`focus-${option.id}`} 
                  checked={coachingPhilosophy.primaryFocus.includes(option.id)}
                  onCheckedChange={() => toggleSelection('primaryFocus', option.id)}
                  disabled={coachingPhilosophy.primaryFocus.length >= 3 && !coachingPhilosophy.primaryFocus.includes(option.id)}
                />
                <Label htmlFor={`focus-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Core Coaching Values */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <Brain className="h-4 w-4 mr-2 text-orange-600" />
            Core Coaching Values
          </Label>
          <p className="text-sm text-gray-500">Select the values that are most important in your coaching approach</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {coachingValueOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`value-${option.id}`} 
                  checked={coachingPhilosophy.coachingValues.includes(option.id)}
                  onCheckedChange={() => toggleSelection('coachingValues', option.id)}
                />
                <Label htmlFor={`value-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Coaching Philosophy */}
        <div className="space-y-3">
          <Label htmlFor="philosophy" className="text-base font-medium flex items-center">
            <Brain className="h-4 w-4 mr-2 text-orange-600" />
            Personal Coaching Philosophy
          </Label>
          <p className="text-sm text-gray-500">Briefly describe your coaching philosophy in your own words (Optional)</p>
          
          <Textarea
            id="philosophy"
            placeholder="e.g., 'I believe in developing the whole athlete through a balance of technical skills and mental resilience...'"
            value={coachingPhilosophy.personalPhilosophy}
            onChange={(e) => updatePhilosophy('personalPhilosophy', e.target.value)}
          />
        </div>

        {/* Coaching Experience */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <Trophy className="h-4 w-4 mr-2 text-orange-600" />
            Coaching Experience
          </Label>
          
          <RadioGroup
            value={coachingPhilosophy.yearsExperience}
            onValueChange={(value) => updatePhilosophy('yearsExperience', value)}
          >
            {experienceOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`exp-${option.id}`} />
                <Label htmlFor={`exp-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Certifications */}
        <div className="space-y-3">
          <Label htmlFor="certifications" className="text-base font-medium flex items-center">
            <Trophy className="h-4 w-4 mr-2 text-orange-600" />
            Certifications & Qualifications
          </Label>
          <p className="text-sm text-gray-500">List any relevant coaching certifications or qualifications (Optional)</p>
          
          <Textarea
            id="certifications"
            placeholder="e.g., 'NSCA CSCS, USA Basketball Gold License, NASM CPT...'"
            value={coachingPhilosophy.certifications}
            onChange={(e) => updatePhilosophy('certifications', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!isFormValid()}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default CoachingPhilosophy;
