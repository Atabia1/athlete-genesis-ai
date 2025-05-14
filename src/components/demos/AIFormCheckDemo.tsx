import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Brain, 
  Lock, 
  Zap, 
  CheckCircle, 
  X, 
  AlertCircle,
  Loader2,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { usePlan } from '@/context/PlanContext';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { 
  trackFeatureUsage, 
  EventAction 
} from '@/utils/analytics';
import { cn } from '@/lib/utils';

/**
 * AIFormCheckDemo: Interactive demo of the AI Form Check feature
 * 
 * This component provides an interactive demo of the AI Form Check feature,
 * allowing users to experience the feature before subscribing.
 */

// Demo form check results
const demoResults = {
  squat: {
    score: 78,
    feedback: [
      {
        area: "Knee Alignment",
        issue: "Knees caving inward slightly during descent",
        recommendation: "Focus on pushing knees outward in line with toes",
        severity: "medium"
      },
      {
        area: "Depth",
        issue: "Not quite reaching parallel depth",
        recommendation: "Work on mobility to achieve deeper squat position",
        severity: "medium"
      },
      {
        area: "Back Position",
        issue: "Good neutral spine maintained throughout",
        recommendation: "Continue maintaining this strong position",
        severity: "good"
      },
      {
        area: "Bar Path",
        issue: "Bar path is mostly vertical with slight forward drift",
        recommendation: "Focus on keeping weight in mid-foot throughout movement",
        severity: "low"
      }
    ]
  },
  deadlift: {
    score: 82,
    feedback: [
      {
        area: "Starting Position",
        issue: "Hips slightly too high at starting position",
        recommendation: "Lower hips slightly to engage legs more in initial pull",
        severity: "low"
      },
      {
        area: "Back Position",
        issue: "Lower back rounds slightly at heaviest portion",
        recommendation: "Focus on maintaining neutral spine throughout lift",
        severity: "medium"
      },
      {
        area: "Bar Path",
        issue: "Excellent vertical bar path",
        recommendation: "Continue with this efficient movement pattern",
        severity: "good"
      },
      {
        area: "Lockout",
        issue: "Strong lockout at the top of the movement",
        recommendation: "Maintain this strong finishing position",
        severity: "good"
      }
    ]
  },
  bench: {
    score: 85,
    feedback: [
      {
        area: "Bar Path",
        issue: "Bar path is slightly diagonal rather than J-curve",
        recommendation: "Focus on lowering bar to mid-chest and pressing up toward shoulders",
        severity: "low"
      },
      {
        area: "Elbow Position",
        issue: "Elbows flaring out too wide",
        recommendation: "Keep elbows at about 45° angle to reduce shoulder stress",
        severity: "medium"
      },
      {
        area: "Arch",
        issue: "Good upper back arch and stability",
        recommendation: "Continue maintaining this strong position",
        severity: "good"
      },
      {
        area: "Foot Position",
        issue: "Feet firmly planted providing good stability",
        recommendation: "Maintain this stable base throughout the lift",
        severity: "good"
      }
    ]
  }
};

export const AIFormCheckDemo = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedExercise, setSelectedExercise] = useState<'squat' | 'deadlift' | 'bench' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { canAccess } = useFeatureAccess();
  
  // Check if user has access to AI form check
  const hasAccess = canAccess('ai_form_check', false);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Handle exercise selection
  const handleExerciseSelect = (exercise: 'squat' | 'deadlift' | 'bench') => {
    setSelectedExercise(exercise);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!selectedExercise) return;
    
    // Track feature usage
    trackFeatureUsage('ai_form_check', EventAction.FEATURE_USED, {
      exercise: selectedExercise,
      is_demo: true
    });
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          setActiveTab('results');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  // Handle reset
  const handleReset = () => {
    setSelectedExercise(null);
    setSelectedFile(null);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setAnalysisComplete(false);
    setActiveTab('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle upgrade click
  const handleUpgradeClick = () => {
    navigate('/dashboard/subscription');
  };
  
  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'good':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'good':
        return <CheckCircle className="h-4 w-4" />;
      case 'low':
        return <AlertCircle className="h-4 w-4" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4" />;
      case 'high':
        return <X className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>AI Form Check</CardTitle>
              <CardDescription>Get feedback on your exercise technique</CardDescription>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-800">
            <Sparkles className="h-3 w-3 mr-1" />
            Elite Feature
          </Badge>
        </div>
      </CardHeader>
      
      {hasAccess ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="upload" disabled={isAnalyzing}>Upload</TabsTrigger>
            <TabsTrigger value="results" disabled={!analysisComplete}>Results</TabsTrigger>
          </TabsList>
          
          <CardContent className="p-6">
            <TabsContent value="upload" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Select Exercise</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Card 
                      className={cn(
                        "cursor-pointer hover:border-purple-300 transition-all",
                        selectedExercise === 'squat' && "border-purple-500 bg-purple-50"
                      )}
                      onClick={() => handleExerciseSelect('squat')}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="font-medium">Squat</div>
                      </CardContent>
                    </Card>
                    <Card 
                      className={cn(
                        "cursor-pointer hover:border-purple-300 transition-all",
                        selectedExercise === 'deadlift' && "border-purple-500 bg-purple-50"
                      )}
                      onClick={() => handleExerciseSelect('deadlift')}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="font-medium">Deadlift</div>
                      </CardContent>
                    </Card>
                    <Card 
                      className={cn(
                        "cursor-pointer hover:border-purple-300 transition-all",
                        selectedExercise === 'bench' && "border-purple-500 bg-purple-50"
                      )}
                      onClick={() => handleExerciseSelect('bench')}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="font-medium">Bench Press</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Upload Video</h3>
                  <div 
                    className="border-2 border-dashed rounded-lg p-6 text-center hover:border-purple-300 transition-all cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-1">
                      {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500">
                      MP4, MOV or WebM (max. 100MB)
                    </p>
                  </div>
                </div>
                
                {isAnalyzing && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Analyzing form...</span>
                      <span>{analysisProgress}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                    <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
                      <Brain className="h-4 w-4 text-purple-500 animate-pulse" />
                      <span>AI is analyzing your {selectedExercise} form</span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="results" className="mt-0">
              {selectedExercise && demoResults[selectedExercise] && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Form Analysis Results</h3>
                    <Badge className={cn(
                      demoResults[selectedExercise].score >= 80 ? "bg-green-100 text-green-800" :
                      demoResults[selectedExercise].score >= 60 ? "bg-amber-100 text-amber-800" :
                      "bg-red-100 text-red-800"
                    )}>
                      Score: {demoResults[selectedExercise].score}/100
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {demoResults[selectedExercise].feedback.map((item, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border ${getSeverityColor(item.severity)}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {getSeverityIcon(item.severity)}
                          <span className="font-medium">{item.area}</span>
                        </div>
                        <p className="text-sm mb-2">{item.issue}</p>
                        <div className="text-sm bg-white bg-opacity-50 p-2 rounded">
                          <span className="font-medium">Recommendation:</span> {item.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-800">AI Coach Insight</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      {selectedExercise === 'squat' && "Your squat form is generally good, but focus on knee tracking and depth. Try box squats to develop positional awareness and improve mobility with ankle and hip stretches."}
                      {selectedExercise === 'deadlift' && "Your deadlift technique shows good bar path and lockout. Work on your starting position by practicing 'hip hinging' and core bracing exercises to maintain a neutral spine throughout the lift."}
                      {selectedExercise === 'bench' && "Your bench press shows good stability and arch. Focus on controlling the bar path and keeping your elbows tucked at about 45° to reduce shoulder stress. Consider adding some upper back work to improve overall pressing strength."}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 border-t p-4">
            {activeTab === 'upload' ? (
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleSubmit}
                disabled={!selectedExercise || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Form
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleReset}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Analyze Another Video
                </Button>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Get Personalized Coaching
                </Button>
              </>
            )}
          </CardFooter>
        </Tabs>
      ) : (
        <CardContent className="p-6 space-y-4">
          <Alert className="bg-purple-50 border-purple-200">
            <Lock className="h-4 w-4 text-purple-600" />
            <AlertTitle>Elite Feature</AlertTitle>
            <AlertDescription>
              AI Form Check is available with the Elite AI subscription.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Camera className="h-4 w-4 text-gray-600" />
                How It Works
              </h3>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5">
                <li>Upload a video of your exercise form</li>
                <li>Our AI analyzes your technique in detail</li>
                <li>Get personalized feedback and recommendations</li>
                <li>Track your form improvements over time</li>
              </ol>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gray-600" />
                Key Benefits
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                <li>Reduce injury risk with proper form</li>
                <li>Maximize exercise effectiveness</li>
                <li>Get coaching-quality feedback anytime</li>
                <li>Supports 30+ common exercises</li>
              </ul>
            </div>
          </div>
          
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={handleUpgradeClick}
          >
            <Zap className="mr-2 h-4 w-4" />
            Upgrade to Elite AI
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default AIFormCheckDemo;
