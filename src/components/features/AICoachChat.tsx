
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/use-feature-access';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'workout' | 'nutrition' | 'injury_prevention';
}

const AICoachChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const { canAccess } = useFeatureAccess();
  const canAccessAICoach = canAccess('ai_basic_chat' as any);

  useEffect(() => {
    // Scroll to bottom on message change
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now().toString(),
        content: `AI Response: ${input}`,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Coach Chat</CardTitle>
        <CardDescription>
          {canAccessAICoach
            ? "Get personalized workout and nutrition advice from our AI coach."
            : "Upgrade to premium to unlock the AI Coach feature."}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] flex flex-col">
        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
              >
                <div className="flex items-center">
                  {message.sender === 'ai' && (
                    <Bot className="mr-2 h-4 w-4 text-blue-500" />
                  )}
                  <div
                    className={`px-3 py-2 rounded-md ${message.sender === 'user' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    {message.content}
                  </div>
                  {message.sender === 'user' && (
                    <User className="ml-2 h-4 w-4 text-green-500" />
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center">
                <Bot className="mr-2 h-4 w-4 text-blue-500" />
                <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-md">
                  Thinking... <Loader2 className="ml-2 h-4 w-4 animate-spin inline" />
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>
        </ScrollArea>

        {canAccessAICoach ? (
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Ask the AI Coach..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
              className="mr-2"
            />
            <Button onClick={sendMessage} disabled={isLoading}>
              Send
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button disabled>
            Upgrade to unlock AI Coach <Send className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AICoachChat;
