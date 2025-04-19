
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Paperclip, User, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Sample coach data
const coach = {
  id: 1,
  name: "Coach Sarah",
  avatar: "",
  status: "online",
  role: "Head Coach",
  lastActive: "Just now"
};

// Sample message history
const initialMessages = [
  {
    id: 1,
    sender: "coach",
    content: "Hi there! I've reviewed your workout logs from last week. Great progress on your squat form!",
    timestamp: "10:30 AM",
    read: true
  },
  {
    id: 2,
    sender: "user",
    content: "Thanks! I've been focusing on keeping my back straight as you suggested.",
    timestamp: "10:32 AM",
    read: true
  },
  {
    id: 3,
    sender: "coach",
    content: "I noticed your last run was a bit slower than usual. How was your energy level that day?",
    timestamp: "10:35 AM",
    read: true
  },
  {
    id: 4,
    sender: "user",
    content: "I was feeling a bit tired. I didn't sleep well the night before.",
    timestamp: "10:38 AM",
    read: true
  },
  {
    id: 5,
    sender: "coach",
    content: "I see. For this week, let's adjust your running schedule slightly. I recommend doing your long run on Saturday instead of Friday to give you more recovery time. Also, try some of the sleep improvement techniques we discussed earlier.",
    timestamp: "10:42 AM",
    read: true
  },
];

const CoachChat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");

    // Simulate coach response after a delay
    setTimeout(() => {
      const coachResponse = {
        id: messages.length + 2,
        sender: "coach",
        content: "I've received your message and will analyze how it affects your training plan. I'll get back to you with more detailed feedback soon!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      setMessages(prev => [...prev, coachResponse]);
    }, 1500);
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
                <span className="text-sm">Next session: Tomorrow, 2:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Working with you since: March 2023</span>
              </div>
              <Button variant="outline" className="w-full">View Coach Profile</Button>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h4 className="font-medium mb-2">Recent Topics</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Nutrition</Badge>
                <Badge variant="secondary">Deadlift Form</Badge>
                <Badge variant="secondary">Recovery</Badge>
                <Badge variant="secondary">Race Prep</Badge>
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
                            A
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
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
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-5 w-5" />
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
