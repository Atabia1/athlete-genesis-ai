
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Paperclip, User, Calendar, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePlan } from "@/context/PlanContext";
import { toast } from "@/components/ui/use-toast";

// Sample coach data
const coach = {
  id: 1,
  name: "Coach Sarah",
  avatar: "",
  status: "online",
  role: "AI Fitness Coach",
  lastActive: "Just now"
};

// Sample message history
const initialMessages = [
  {
    id: 1,
    sender: "coach",
    content: "Hi there! I'm your AI-powered fitness coach. I can help you with workout advice, nutrition tips, and answer questions about your training plan. How can I assist you today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: true
  },
];

const CoachChat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { workoutPlan, mealPlan } = usePlan();
  const messagesEndRef = React.useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      // Prepare context about the user's plans to help the AI provide relevant responses
      let context = "The user has a personalized fitness plan.";
      
      if (workoutPlan) {
        context += ` Their workout plan focuses on ${workoutPlan.weeklyPlan?.[0]?.focus || "various exercises"}.`;
      }
      
      if (mealPlan) {
        context += ` Their nutrition plan recommends approximately ${mealPlan.dailyCalories || "2000"} calories per day.`;
      }

      // In a production app, this would call your Supabase Edge Function
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate an appropriate coach response based on the message content
      let coachResponseText = generateCoachResponse(newMessage, context);

      const coachResponse = {
        id: messages.length + 2,
        sender: "coach",
        content: coachResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      
      setMessages(prev => [...prev, coachResponse]);
    } catch (error) {
      console.error('Error getting coach response:', error);
      toast({
        title: "Error",
        description: "Failed to get response from coach. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simple response generator - in a production app, this would be replaced with an actual AI call
  const generateCoachResponse = (message: string, context: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("workout") || lowerMessage.includes("exercise")) {
      return "For your workout today, focus on proper form and maintaining intensity throughout. Remember to warm up properly and stay hydrated. Your plan includes specific rest periods - make sure to follow them for optimal recovery between sets.";
    } else if (lowerMessage.includes("nutrition") || lowerMessage.includes("diet") || lowerMessage.includes("food") || lowerMessage.includes("eat")) {
      return "Your nutrition plan is designed to support your fitness goals. Remember to prioritize protein intake after workouts, stay hydrated throughout the day, and time your carbohydrate intake around your training sessions for optimal energy and recovery.";
    } else if (lowerMessage.includes("motivation") || lowerMessage.includes("tired") || lowerMessage.includes("don't feel")) {
      return "It's normal to have days when motivation is low. Try focusing on how good you'll feel after your workout, or set a small achievable goal for today. Remember why you started this journey, and know that consistency, not perfection, is what leads to results.";
    } else if (lowerMessage.includes("progress") || lowerMessage.includes("result")) {
      return "Progress isn't always linear - focus on consistency and small improvements. Your body is adapting even when you don't see visible changes. Track various metrics beyond just weight, like energy levels, strength improvements, and how your clothes fit. Trust the process and stay consistent with your plan.";
    } else {
      return "That's a great question. As your coach, I recommend focusing on consistency with both your workout and nutrition plans. Remember that recovery is just as important as the actual training. Is there something specific about your fitness journey you'd like guidance on?";
    }
  };

  return (
    <DashboardLayout title="Coach Chat">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Coach profile sidebar */}
        <Card className="hidden lg:block">
          <CardHeader className="pb-2">
            <CardTitle>Your Coach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-4">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarFallback className="bg-orange-100 text-orange-700 text-xl">
                  {coach.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{coach.name}</h3>
              <Badge variant="outline" className="flex items-center gap-1 mt-1">
                <span className={cn(
                  "h-2 w-2 rounded-full",
                  coach.status === "online" ? "bg-green-500" : "bg-gray-300"
                )}></span>
                {coach.status === "online" ? "Online" : "Offline"}
              </Badge>
              <p className="text-muted-foreground mt-1">{coach.role}</p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Available 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Personalized coaching based on your profile</span>
              </div>
              <Button variant="outline" className="w-full">View Training History</Button>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h4 className="font-medium mb-2">Coaching Expertise</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Technique Analysis</Badge>
                <Badge variant="secondary">Nutrition Advice</Badge>
                <Badge variant="secondary">Recovery Strategies</Badge>
                <Badge variant="secondary">Goal Setting</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Chat area */}
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader className="border-b bg-muted/30 pb-3">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarFallback className="bg-orange-100 text-orange-700">
                  {coach.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg">{coach.name}</CardTitle>
                <p className="text-xs text-muted-foreground">Last active: {coach.lastActive}</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-green-500">Expert</Badge>
                <Badge variant="outline">AI-Enhanced</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className="flex gap-2 max-w-[80%]">
                      {message.sender === "coach" && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-orange-100 text-orange-700">
                            {coach.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div 
                          className={cn(
                            "rounded-lg p-3",
                            message.sender === "user" 
                              ? "bg-primary text-primary-foreground ml-auto"
                              : "bg-muted"
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {message.timestamp}
                        </p>
                      </div>
                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            U
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Button 
                  type="button"
                  size="icon"
                  variant="ghost"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask your coach a question..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CoachChat;
