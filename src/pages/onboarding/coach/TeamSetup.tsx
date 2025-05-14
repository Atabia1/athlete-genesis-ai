import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Users, Plus, Trash2, UserPlus } from 'lucide-react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { usePlan } from '@/context/PlanContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

/**
 * Team Setup Step for Coaches
 * 
 * This is the second step in the custom onboarding flow for coaches.
 * It collects information about the team structure, athletes, and organization.
 */

// Define team setup types
interface TeamSetup {
  teamName: string;
  sportType: string;
  teamSize: string;
  ageGroup: string;
  competitionLevel: string;
  seasonPhase: string;
  athletes: Athlete[];
  teamDescription: string;
}

interface Athlete {
  id: string;
  name: string;
  position: string;
  experienceLevel: string;
}

const sportOptions = [
  'Basketball', 'Football', 'Soccer', 'Baseball', 'Volleyball', 
  'Tennis', 'Swimming', 'Track & Field', 'CrossFit', 'Weightlifting',
  'Hockey', 'Rugby', 'Cricket', 'Golf', 'Martial Arts', 'Other'
];

const teamSizeOptions = [
  { id: 'individual', label: 'Individual Athletes (1-5)' },
  { id: 'small', label: 'Small Team (6-15)' },
  { id: 'medium', label: 'Medium Team (16-30)' },
  { id: 'large', label: 'Large Team (31+)' },
];

const ageGroupOptions = [
  { id: 'youth', label: 'Youth (Under 13)' },
  { id: 'teen', label: 'Teenagers (13-18)' },
  { id: 'college', label: 'College/University' },
  { id: 'adult', label: 'Adult (18+)' },
  { id: 'masters', label: 'Masters/Senior' },
  { id: 'mixed', label: 'Mixed Ages' },
];

const competitionLevelOptions = [
  { id: 'recreational', label: 'Recreational/Club' },
  { id: 'school', label: 'School/Intramural' },
  { id: 'competitive', label: 'Competitive Local/Regional' },
  { id: 'elite', label: 'Elite/National' },
  { id: 'professional', label: 'Professional' },
];

const seasonPhaseOptions = [
  { id: 'offseason', label: 'Off-Season' },
  { id: 'preseason', label: 'Pre-Season' },
  { id: 'inseason', label: 'In-Season' },
  { id: 'postseason', label: 'Post-Season/Playoffs' },
  { id: 'transition', label: 'Transition Period' },
];

const experienceLevelOptions = [
  'Beginner', 'Intermediate', 'Advanced', 'Elite'
];

const TeamSetup = () => {
  const navigate = useNavigate();
  const { userType } = usePlan();
  
  // Redirect if not a coach
  if (userType !== 'coach') {
    navigate('/onboarding');
    return null;
  }

  // Initialize team setup state
  const [teamSetup, setTeamSetup] = useState<TeamSetup>({
    teamName: '',
    sportType: '',
    teamSize: '',
    ageGroup: '',
    competitionLevel: '',
    seasonPhase: '',
    athletes: [],
    teamDescription: '',
  });

  // New athlete form state
  const [newAthlete, setNewAthlete] = useState<Omit<Athlete, 'id'>>({
    name: '',
    position: '',
    experienceLevel: 'Intermediate',
  });

  // Update team setup
  const updateTeamSetup = (key: keyof TeamSetup, value: any) => {
    setTeamSetup({
      ...teamSetup,
      [key]: value
    });
  };

  // Update new athlete form
  const updateNewAthlete = (key: keyof Omit<Athlete, 'id'>, value: string) => {
    setNewAthlete({
      ...newAthlete,
      [key]: value
    });
  };

  // Add athlete to team
  const addAthlete = () => {
    if (newAthlete.name.trim() === '') return;
    
    const athlete: Athlete = {
      id: `athlete-${Date.now()}`,
      ...newAthlete
    };
    
    updateTeamSetup('athletes', [...teamSetup.athletes, athlete]);
    
    // Reset form
    setNewAthlete({
      name: '',
      position: '',
      experienceLevel: 'Intermediate',
    });
  };

  // Remove athlete from team
  const removeAthlete = (id: string) => {
    updateTeamSetup('athletes', teamSetup.athletes.filter(athlete => athlete.id !== id));
  };

  // Handle navigation
  const handleBack = () => {
    navigate('/onboarding/coach/philosophy');
  };

  const handleContinue = () => {
    // Save team setup to context or local storage
    localStorage.setItem('teamSetup', JSON.stringify(teamSetup));
    
    // Navigate to next step
    navigate('/onboarding/coach/training-approach');
  };

  // Check if form is complete enough to continue
  const isFormValid = () => {
    return (
      teamSetup.teamName.trim() !== '' &&
      teamSetup.sportType !== '' &&
      teamSetup.teamSize !== '' &&
      teamSetup.ageGroup !== '' &&
      teamSetup.competitionLevel !== ''
    );
  };

  return (
    <OnboardingLayout 
      step={2} 
      totalSteps={5} 
      title="Team Setup"
      subtitle="Tell us about your team and athletes"
    >
      <div className="space-y-6 mb-8">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-100">
          <div className="flex items-start">
            <Users className="h-5 w-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-orange-700 mb-1">Team Information</h3>
              <p className="text-sm text-gray-600">
                This information helps us set up your team management dashboard and create appropriate
                training templates for your athletes.
              </p>
            </div>
          </div>
        </div>

        {/* Team Name */}
        <div className="space-y-2">
          <Label htmlFor="team-name" className="text-base font-medium">Team Name</Label>
          <Input
            id="team-name"
            placeholder="Enter your team name"
            value={teamSetup.teamName}
            onChange={(e) => updateTeamSetup('teamName', e.target.value)}
          />
        </div>

        {/* Sport Type */}
        <div className="space-y-2">
          <Label htmlFor="sport-type" className="text-base font-medium">Sport/Activity</Label>
          <Select
            value={teamSetup.sportType}
            onValueChange={(value) => updateTeamSetup('sportType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sport or activity" />
            </SelectTrigger>
            <SelectContent>
              {sportOptions.map((sport) => (
                <SelectItem key={sport} value={sport}>{sport}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Team Size */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Team Size</Label>
          
          <RadioGroup
            value={teamSetup.teamSize}
            onValueChange={(value) => updateTeamSetup('teamSize', value)}
          >
            {teamSizeOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`size-${option.id}`} />
                <Label htmlFor={`size-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Age Group */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Age Group</Label>
          
          <RadioGroup
            value={teamSetup.ageGroup}
            onValueChange={(value) => updateTeamSetup('ageGroup', value)}
          >
            {ageGroupOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`age-${option.id}`} />
                <Label htmlFor={`age-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Competition Level */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Competition Level</Label>
          
          <RadioGroup
            value={teamSetup.competitionLevel}
            onValueChange={(value) => updateTeamSetup('competitionLevel', value)}
          >
            {competitionLevelOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`level-${option.id}`} />
                <Label htmlFor={`level-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Season Phase */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Current Season Phase</Label>
          
          <RadioGroup
            value={teamSetup.seasonPhase}
            onValueChange={(value) => updateTeamSetup('seasonPhase', value)}
          >
            {seasonPhaseOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`phase-${option.id}`} />
                <Label htmlFor={`phase-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Add Key Athletes (Optional) */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Key Athletes (Optional)</Label>
            <span className="text-sm text-gray-500">Add up to 5 key athletes</span>
          </div>
          
          <div className="space-y-4">
            {/* Athlete List */}
            {teamSetup.athletes.length > 0 && (
              <div className="space-y-2">
                {teamSetup.athletes.map((athlete) => (
                  <div key={athlete.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">{athlete.name}</p>
                      <p className="text-sm text-gray-500">{athlete.position} • {athlete.experienceLevel}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAthlete(athlete.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Athlete Form */}
            {teamSetup.athletes.length < 5 && (
              <div className="space-y-3 p-4 border rounded-md">
                <h4 className="font-medium flex items-center">
                  <UserPlus className="h-4 w-4 mr-2 text-orange-600" />
                  Add Athlete
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="athlete-name">Name</Label>
                    <Input
                      id="athlete-name"
                      placeholder="Athlete name"
                      value={newAthlete.name}
                      onChange={(e) => updateNewAthlete('name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="athlete-position">Position/Role</Label>
                    <Input
                      id="athlete-position"
                      placeholder="e.g., Point Guard, Striker"
                      value={newAthlete.position}
                      onChange={(e) => updateNewAthlete('position', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="athlete-level">Experience Level</Label>
                  <Select
                    value={newAthlete.experienceLevel}
                    onValueChange={(value) => updateNewAthlete('experienceLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevelOptions.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={addAthlete}
                  disabled={!newAthlete.name.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Athlete
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Team Description */}
        <div className="space-y-2">
          <Label htmlFor="team-description" className="text-base font-medium">Team Description (Optional)</Label>
          <Textarea
            id="team-description"
            placeholder="Tell us more about your team, goals, or any specific challenges"
            value={teamSetup.teamDescription}
            onChange={(e) => updateTeamSetup('teamDescription', e.target.value)}
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

export default TeamSetup;
