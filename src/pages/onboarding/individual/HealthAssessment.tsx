import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Heart, Activity, Scale, Ruler, Smartphone } from 'lucide-react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { usePlan } from '@/context/PlanContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import HealthAppConnect from '@/components/features/HealthAppConnect';
import { healthSyncService } from '@/services/health-sync-service';
import { HealthData } from '@/integrations/health-apps/types';

/**
 * Health Assessment Step for Fitness Enthusiasts
 *
 * This is the first step in the custom onboarding flow for fitness enthusiasts.
 * It collects basic health metrics and self-assessment data to create a personalized plan.
 */

// Define health metrics types
interface HealthMetrics {
  height?: number;
  weight?: number;
  restingHeartRate?: number;
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent' | null;
  stressLevel: number;
  energyLevel: number;
}

const HealthAssessment = () => {
  const navigate = useNavigate();
  const { userType } = usePlan();

  // Redirect if not a fitness enthusiast
  if (userType !== 'individual') {
    navigate('/onboarding');
    return null;
  }

  // Initialize health metrics state
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    height: undefined,
    weight: undefined,
    restingHeartRate: undefined,
    sleepQuality: null,
    stressLevel: 5,
    energyLevel: 5
  });

  // Track if data was imported from health app
  const [dataImported, setDataImported] = useState(false);

  // Track active tab
  const [activeTab, setActiveTab] = useState<string>('manual');

  // Initialize health sync service
  useEffect(() => {
    healthSyncService.initialize().catch(console.error);
  }, []);

  // Update health metrics
  const updateMetric = (key: keyof HealthMetrics, value: any) => {
    setHealthMetrics({
      ...healthMetrics,
      [key]: value
    });
  };

  // Handle health data import from health app
  const handleHealthDataSync = (data: HealthData) => {
    // Update health metrics with data from health app
    const updatedMetrics: HealthMetrics = {
      ...healthMetrics,
      // Only update if data exists
      ...(data.height && { height: data.height }),
      ...(data.weight && { weight: data.weight }),
      ...(data.heartRate?.resting && { restingHeartRate: data.heartRate.resting }),
      // Map sleep quality if available
      ...(data.sleep?.quality && { sleepQuality: data.sleep.quality })
    };

    setHealthMetrics(updatedMetrics);
    setDataImported(true);
  };

  // Handle navigation
  const handleBack = () => {
    navigate('/onboarding');
  };

  const handleContinue = () => {
    // Save health metrics to context or local storage
    localStorage.setItem('healthMetrics', JSON.stringify(healthMetrics));

    // Navigate to next step
    navigate('/onboarding/individual/lifestyle-habits');
  };

  // Check if form is complete enough to continue
  const isFormValid = () => {
    return (
      healthMetrics.height !== undefined &&
      healthMetrics.weight !== undefined &&
      healthMetrics.sleepQuality !== null
    );
  };

  return (
    <OnboardingLayout
      step={1}
      totalSteps={5}
      title="Your Health Profile"
      subtitle="Let's understand your current health status to create a personalized plan"
    >
      <div className="space-y-6 mb-8">
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-start">
            <Heart className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-700 mb-1">Why We Ask This</h3>
              <p className="text-sm text-gray-600">
                Your health metrics help us create a safe and effective wellness plan tailored to your body's needs.
                All information is kept private and used only for personalization.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs for data entry methods */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center">
              <Smartphone className="h-4 w-4 mr-2" />
              Import from Health App
            </TabsTrigger>
          </TabsList>

          {/* Manual Entry Tab */}
          <TabsContent value="manual" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Height */}
              <div className="space-y-2">
                <Label htmlFor="height" className="flex items-center">
                  <Ruler className="h-4 w-4 mr-2 text-green-600" />
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Enter your height"
                  value={healthMetrics.height || ''}
                  onChange={(e) => updateMetric('height', parseInt(e.target.value) || undefined)}
                />
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center">
                  <Scale className="h-4 w-4 mr-2 text-green-600" />
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter your weight"
                  value={healthMetrics.weight || ''}
                  onChange={(e) => updateMetric('weight', parseInt(e.target.value) || undefined)}
                />
              </div>

              {/* Resting Heart Rate */}
              <div className="space-y-2">
                <Label htmlFor="heartRate" className="flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-green-600" />
                  Resting Heart Rate (bpm)
                </Label>
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="Optional"
                  value={healthMetrics.restingHeartRate || ''}
                  onChange={(e) => updateMetric('restingHeartRate', parseInt(e.target.value) || undefined)}
                />
                <p className="text-xs text-gray-500">If you don't know, leave blank</p>
              </div>

              {/* Sleep Quality */}
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-green-600" />
                  Sleep Quality
                </Label>
                <RadioGroup
                  value={healthMetrics.sleepQuality || ''}
                  onValueChange={(value) => updateMetric('sleepQuality', value as any)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="sleep-poor" />
                    <Label htmlFor="sleep-poor">Poor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fair" id="sleep-fair" />
                    <Label htmlFor="sleep-fair">Fair</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="sleep-good" />
                    <Label htmlFor="sleep-good">Good</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="sleep-excellent" />
                    <Label htmlFor="sleep-excellent">Excellent</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Stress Level */}
            <div className="space-y-4">
              <Label className="flex items-center">
                <Activity className="h-4 w-4 mr-2 text-green-600" />
                Stress Level
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[healthMetrics.stressLevel]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => updateMetric('stressLevel', value[0])}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low (1)</span>
                  <span>High (10)</span>
                </div>
              </div>
            </div>

            {/* Energy Level */}
            <div className="space-y-4">
              <Label className="flex items-center">
                <Activity className="h-4 w-4 mr-2 text-green-600" />
                Energy Level
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[healthMetrics.energyLevel]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => updateMetric('energyLevel', value[0])}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low (1)</span>
                  <span>High (10)</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Import from Health App Tab */}
          <TabsContent value="import" className="space-y-6 mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium">Import Health Data</h3>
                  <p className="text-sm text-gray-500">
                    Connect your mobile health app to automatically import your health metrics.
                  </p>
                </div>

                {dataImported ? (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                    <div className="flex items-start">
                      <Heart className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-green-700 mb-1">Data Imported Successfully</h3>
                        <p className="text-sm text-gray-600">
                          Your health data has been imported. You can review and edit it in the Manual Entry tab.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <HealthAppConnect onHealthDataSync={handleHealthDataSync} />
                )}

                {dataImported && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setActiveTab('manual')}
                    >
                      Review Imported Data
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="text-sm text-gray-500 mt-2">
              <p>
                Don't have a health app? You can manually enter your health metrics in the Manual Entry tab.
              </p>
            </div>
          </TabsContent>
        </Tabs>
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
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default HealthAssessment;
