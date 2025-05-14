import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Send, 
  Brain, 
  Sparkles, 
  Loader2, 
  Zap,
  Lock,
  ArrowRight,
  User,
  Dumbbell,
  Clock,
  Calendar,
  Heart,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { usePlan } from '@/context/PlanContext';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { 
  trackFeatureUsage, 
  EventAction 
} from '@/utils/analytics';
import { cn } from '@/lib/utils';

/**
 * AIChatDemo: Interactive demo of the AI Coach Chat feature
 * 
 * This component provides an interactive demo of the AI Coach Chat feature,
 * allowing users to experience the feature before subscribing.
 */

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Predefined responses for demo purposes
const demoResponses: Record<string, string> = {
  default: "I'm your AI Coach. I can help you with workout plans, nutrition advice, recovery strategies, and more. What would you like to know?",
  workout: "Based on your goals and fitness level, I recommend a 4-day split focusing on compound movements. Here's a sample plan:\n\n**Monday: Upper Body**\n- Bench Press: 4 sets of 8-10 reps\n- Rows: 4 sets of 10-12 reps\n- Shoulder Press: 3 sets of 10-12 reps\n- Pull-ups/Lat Pulldowns: 3 sets of 8-10 reps\n\n**Tuesday: Lower Body**\n- Squats: 4 sets of 8-10 reps\n- Romanian Deadlifts: 4 sets of 10-12 reps\n- Lunges: 3 sets of 12 reps per leg\n- Calf Raises: 3 sets of 15 reps",
  nutrition: "Based on your activity level and goals, I recommend the following nutrition plan:\n\n**Daily Macros:**\n- Calories: 2,400\n- Protein: 180g (30%)\n- Carbs: 240g (40%)\n- Fats: 80g (30%)\n\n**Meal Timing:**\n- Pre-workout: Carb-focused meal 2 hours before\n- Post-workout: Protein + carbs within 30 minutes\n- Evenly distribute protein throughout the day\n\nWould you like me to create a sample meal plan based on these macros?",
  recovery: "Recovery is just as important as training! Here are my recommendations:\n\n1. **Sleep:** Aim for 7-9 hours of quality sleep each night\n2. **Active Recovery:** Light activity (walking, swimming) on rest days\n3. **Stretching:** 10-15 minutes of stretching after workouts\n4. **Nutrition:** Protein intake within 30 minutes post-workout\n5. **Hydration:** Minimum 3 liters of water daily\n\nBased on your recent training data, I'd recommend focusing on improving sleep quality and adding 10 minutes of foam rolling to your routine.",
  injury: "I'm sorry to hear about your knee pain. Here are some recommendations:\n\n1. **Rest:** Take 2-3 days off from lower body training\n2. **Ice:** Apply ice for 15-20 minutes every 2-3 hours\n3. **Compression:** Use a compression sleeve during the day\n4. **Elevation:** Elevate your leg when resting\n\nFor alternative exercises, try:\n- Upper body focus workouts\n- Swimming or water aerobics\n- Seated upper body exercises\n\nIf pain persists for more than a week, I recommend consulting with a physical therapist.",
  motivation: "Everyone struggles with motivation sometimes! Here are some strategies that might help:\n\n1. **Set specific, achievable goals** - Instead of \"get fit,\" try \"complete 3 workouts this week\"\n2. **Find your 'why'** - Connect your fitness journey to deeper values\n3. **Create accountability** - Find a workout partner or share goals with friends\n4. **Track progress** - Celebrate small wins along the way\n5. **Prepare for obstacles** - Plan ahead for common challenges\n\nBased on your activity patterns, morning workouts seem to be most consistent for you. Would you like me to help you create a morning routine?",
  progress: "Based on your training data from the past 8 weeks, I can see several positive trends:\n\n- **Strength:** +12% increase in major lifts\n- **Endurance:** +15% improvement in cardio capacity\n- **Consistency:** 85% workout completion rate\n- **Recovery:** Average sleep up by 30 minutes\n\nAreas for improvement:\n- Protein intake is below target on non-training days\n- Weekend workouts have a 65% completion rate\n\nWould you like me to suggest adjustments to your plan based on this data?"
};

// Function to generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

export const AIChatDemo = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: demoResponses.default,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { canAccess } = useFeatureAccess();
  const { subscriptionTier } = usePlan();
  
  // Check if user has access to AI chat
  const hasAccess = canAccess('ai_advanced_chat', false);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // Handle message submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Track feature usage
    trackFeatureUsage('ai_advanced_chat', EventAction.FEATURE_USED, {
      message_type: 'demo',
      is_demo: true
    });
    
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      let responseContent = demoResponses.default;
      
      // Check for keywords in the user message
      const lowerCaseMessage = inputValue.toLowerCase();
      if (lowerCaseMessage.includes('workout') || lowerCaseMessage.includes('exercise') || lowerCaseMessage.includes('training')) {
        responseContent = demoResponses.workout;
      } else if (lowerCaseMessage.includes('nutrition') || lowerCaseMessage.includes('diet') || lowerCaseMessage.includes('food') || lowerCaseMessage.includes('eat')) {
        responseContent = demoResponses.nutrition;
      } else if (lowerCaseMessage.includes('recovery') || lowerCaseMessage.includes('rest') || lowerCaseMessage.includes('sleep')) {
        responseContent = demoResponses.recovery;
      } else if (lowerCaseMessage.includes('injury') || lowerCaseMessage.includes('pain') || lowerCaseMessage.includes('hurt')) {
        responseContent = demoResponses.injury;
      } else if (lowerCaseMessage.includes('motivation') || lowerCaseMessage.includes('motivate') || lowerCaseMessage.includes('inspired')) {
        responseContent = demoResponses.motivation;
      } else if (lowerCaseMessage.includes('progress') || lowerCaseMessage.includes('improve') || lowerCaseMessage.includes('better')) {
        responseContent = demoResponses.progress;
      }
      
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Handle upgrade click
  const handleUpgradeClick = () => {
    navigate('/dashboard/subscription');
  };
  
  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>AI Coach Chat</CardTitle>
              <CardDescription>Ask anything about your training</CardDescription>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-800">
            <Sparkles className="h-3 w-3 mr-1" />
            Elite Feature
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3",
                message.role === 'user' ? "justify-end" : ""
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/ai-coach-avatar.png" />
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    <Brain className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={cn(
                  "rounded-lg p-3 max-w-[80%]",
                  message.role === 'user'
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                )}
              >
                <div className="whitespace-pre-line">{message.content}</div>
                <div
                  className={cn(
                    "text-xs mt-1",
                    message.role === 'user' ? "text-blue-100" : "text-gray-500"
                  )}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/user-avatar.png" />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  <Brain className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-4">
        {hasAccess ? (
          <form onSubmit={handleSubmit} className="w-full flex gap-2">
            <Input
              placeholder="Ask your AI coach anything..."
              value={inputValue}
              onChange={handleInputChange}
              className="flex-grow"
            />
            <Button type="submit" disabled={!inputValue.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <div className="w-full space-y-3">
            <Alert className="bg-purple-50 border-purple-200">
              <Lock className="h-4 w-4 text-purple-600" />
              <AlertTitle>Elite Feature</AlertTitle>
              <AlertDescription>
                AI Coach Chat is available with the Elite AI subscription.
              </AlertDescription>
            </Alert>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={handleUpgradeClick}
            >
              <Zap className="mr-2 h-4 w-4" />
              Upgrade to Elite AI
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AIChatDemo;
