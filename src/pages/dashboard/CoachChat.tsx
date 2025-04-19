
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, FileText, Image, Paperclip, Video, Smile, MicIcon, Clock, Dumbbell as DumbbellIcon, CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { usePlan } from "@/context/PlanContext";
import { toast } from "@/components/ui/use-toast";

// Mock data for demonstration
const mockConversations = [
  {
    id: "1",
    with: "Coach Sarah",
    avatar: "",
    lastMessage: "How's your recovery going after yesterday's session?",
    time: "10:23 AM",
    unread: 2,
  },
  {
    id: "2",
    with: "Coach Mike",
    avatar: "",
    lastMessage: "I've updated your training plan for next week",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: "3",
    with: "Performance Team",
    avatar: "",
    lastMessage: "Your latest metrics look great!",
    time: "Monday",
    unread: 0,
  },
  {
    id: "4",
    with: "Nutrition Advisor",
    avatar: "",
    lastMessage: "Remember to increase your protein intake this week",
    time: "08/15/2023",
    unread: 0,
  },
];

// Mock messages for active conversation
const mockMessages = [
  {
    id: "1",
    sender: "coach",
    name: "Coach Sarah",
    content: "Hi there! How's your training going this week?",
    time: "10:05 AM",
  },
  {
    id: "2",
    sender: "user",
    name: "You",
    content: "It's been good! I completed all my sessions, but my right knee is feeling a bit sore after yesterday's run.",
    time: "10:08 AM",
  },
  {
    id: "3",
    sender: "coach",
    name: "Coach Sarah",
    content: "Thanks for letting me know about your knee. Let's modify your workout for tomorrow. Can you rate the pain on a scale of 1-10 and let me know if there's any swelling?",
    time: "10:15 AM",
  },
  {
    id: "4",
    sender: "user",
    name: "You",
    content: "I'd say it's about a 4/10 - noticeable but not severe. No visible swelling, just feels a bit tender on the outer side.",
    time: "10:20 AM",
  },
  {
    id: "5",
    sender: "coach",
    name: "Coach Sarah",
    content: "Alright, sounds like we should take precautions but it's not serious. I'm sending over a modified plan for tomorrow with lower impact exercises. Also, try applying ice for 15 minutes tonight, and make sure to do the knee mobility exercises we discussed last week.",
    time: "10:23 AM",
    attachment: {
      type: "document",
      name: "Modified_Workout_Plan.pdf",
    },
  },
];

const CoachChat = () => {
  const { userType } = usePlan();
  const [activeConversation, setActiveConversation] = useState(mockConversations[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [showWellbeingShare, setShowWellbeingShare] = useState(false);
  const [wellbeingNote, setWellbeingNote] = useState("");

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      name: "You",
      content: message,
      time: format(new Date(), "h:mm a"),
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate a response after a delay (in a real app, this would come from your API)
    setTimeout(() => {
      const response = {
        id: `msg-${Date.now() + 1}`,
        sender: "coach",
        name: activeConversation.with,
        content: "I've received your message. I'll get back to you soon!",
        time: format(new Date(), "h:mm a"),
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  const handleShareWellbeing = () => {
    const wellbeingData = {
      sleepHours: 7.5,
      sleepQuality: 8,
      energyLevel: 7,
      soreness: 6,
      mood: 8,
      notes: wellbeingNote,
      date: format(new Date(), "PPP"),
    };

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      name: "You",
      content: `📊 Wellbeing Update (${format(new Date(), "MMM d")})\n\nSleep: ${wellbeingData.sleepHours}hrs (Quality: ${wellbeingData.sleepQuality}/10)\nEnergy: ${wellbeingData.energyLevel}/10\nSoreness: ${wellbeingData.soreness}/10\nMood: ${wellbeingData.mood}/10\n\n${wellbeingData.notes ? `Notes: ${wellbeingData.notes}` : ""}`,
      time: format(new Date(), "h:mm a"),
      wellbeingData,
    };

    setMessages([...messages, newMessage]);
    setShowWellbeingShare(false);
    setWellbeingNote("");

    toast({
      title: "Wellbeing data shared",
      description: "Your coach will be notified of your wellbeing update.",
    });
  };

  return (
    <DashboardLayout title={userType === 'coach' ? "Athlete Communication" : "Coach Chat"}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-13rem)]">
        {/* Conversations list */}
        <Card className="lg:col-span-1 border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>{userType === 'coach' ? "Athletes" : "Coaches"}</CardTitle>
            <CardDescription>Your conversations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="divide-y">
                {mockConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      activeConversation.id === conversation.id ? "bg-gray-50" : ""
                    }`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-athleteBlue-100 text-athleteBlue-700">
                          {conversation.with.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm truncate">
                            {conversation.with}
                          </h4>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {conversation.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-athleteBlue-600 rounded-full">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat area */}
        <Card className="lg:col-span-3 flex flex-col border shadow-sm">
          <CardHeader className="border-b pb-3">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-athleteBlue-100 text-athleteBlue-700">
                  {activeConversation.with.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{activeConversation.with}</CardTitle>
                <CardDescription>
                  {userType === 'coach' ? "Athlete" : "Coach"} • Last active: Just now
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
            {/* Messages area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        msg.sender === "user"
                          ? "bg-athleteBlue-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                          : "bg-gray-100 text-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg"
                      } p-3 shadow-sm`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span className="font-medium text-sm">{msg.name}</span>
                        <span className={`text-xs ${msg.sender === "user" ? "text-athleteBlue-100" : "text-gray-500"}`}>
                          {msg.time}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      {msg.attachment && (
                        <div className={`mt-2 p-2 rounded flex items-center gap-2 ${
                          msg.sender === "user" ? "bg-athleteBlue-700" : "bg-gray-200"
                        }`}>
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{msg.attachment.name}</span>
                          <Button variant="ghost" size="sm" className="ml-auto h-6 px-2">
                            Download
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Wellbeing share form */}
            {showWellbeingShare && (
              <div className="p-4 border-t">
                <div className="bg-gray-50 p-4 rounded-lg border mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Share Wellbeing Update</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    The following wellbeing data from your latest check-in will be shared:
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Sleep</p>
                      <p className="font-medium">7.5 hours (Quality: 8/10)</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Energy Level</p>
                      <p className="font-medium">7/10</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Soreness</p>
                      <p className="font-medium">6/10</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Mood</p>
                      <p className="font-medium">8/10</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="wellbeingNote" className="text-xs text-gray-500 mb-1 block">
                      Add a note (optional)
                    </label>
                    <Textarea
                      id="wellbeingNote"
                      placeholder="Add any additional notes for your coach..."
                      className="resize-none"
                      value={wellbeingNote}
                      onChange={(e) => setWellbeingNote(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowWellbeingShare(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleShareWellbeing}>
                      Share Wellbeing Data
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="p-4 border-t">
              <Tabs defaultValue="message">
                <TabsList className="mb-4">
                  <TabsTrigger value="message">Message</TabsTrigger>
                  <TabsTrigger value="quick">Quick Responses</TabsTrigger>
                  {userType !== 'coach' && (
                    <TabsTrigger value="share">Share Data</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="message" className="m-0">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Type your message..."
                        className="resize-none"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <div className="flex mt-2 gap-1">
                        <Button type="button" size="icon" variant="outline" className="h-8 w-8">
                          <Image className="h-4 w-4" />
                        </Button>
                        <Button type="button" size="icon" variant="outline" className="h-8 w-8">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button type="button" size="icon" variant="outline" className="h-8 w-8">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button type="button" size="icon" variant="outline" className="h-8 w-8">
                          <Smile className="h-4 w-4" />
                        </Button>
                        <Button type="button" size="icon" variant="outline" className="h-8 w-8">
                          <MicIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button 
                      className="h-24" 
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="quick" className="m-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "I've completed today's workout!",
                      "Can we schedule a call to discuss my progress?",
                      "I need to reschedule tomorrow's session.",
                      "The workout was more challenging than expected.",
                      "I'm feeling great after today's session!",
                      "I need some clarification on the technique for...",
                      "My recovery is going well today.",
                      "I'm experiencing some soreness in my...",
                    ].map((quickMessage, index) => (
                      <Button 
                        key={index}
                        variant="outline"
                        className="justify-start h-auto py-3 px-4 whitespace-normal text-left"
                        onClick={() => {
                          setMessage(quickMessage);
                          document.querySelector('button[value="message"]')?.dispatchEvent(
                            new Event('click', { bubbles: true })
                          );
                        }}
                      >
                        {quickMessage}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
                
                {userType !== 'coach' && (
                  <TabsContent value="share" className="m-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button 
                        variant="outline"
                        className="flex items-center justify-start h-auto py-3 px-4"
                        onClick={() => setShowWellbeingShare(true)}
                      >
                        <div className="mr-3 bg-purple-100 p-2 rounded-full">
                          <Clock className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Wellbeing Update</p>
                          <p className="text-xs text-gray-500">Share your latest wellbeing data</p>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="flex items-center justify-start h-auto py-3 px-4"
                      >
                        <div className="mr-3 bg-athleteBlue-100 p-2 rounded-full">
                          <DumbbellIcon className="h-5 w-5 text-athleteBlue-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Workout Results</p>
                          <p className="text-xs text-gray-500">Share your latest workout data</p>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="flex items-center justify-start h-auto py-3 px-4"
                      >
                        <div className="mr-3 bg-green-100 p-2 rounded-full">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Progress Report</p>
                          <p className="text-xs text-gray-500">Share your weekly progress</p>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="flex items-center justify-start h-auto py-3 px-4"
                      >
                        <div className="mr-3 bg-amber-100 p-2 rounded-full">
                          <CalendarIcon className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Schedule Request</p>
                          <p className="text-xs text-gray-500">Request schedule changes</p>
                        </div>
                      </Button>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CoachChat;
