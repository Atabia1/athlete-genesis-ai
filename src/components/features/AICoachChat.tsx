/**
 * AI Coach Chat Component
 *
 * This component provides a chat interface for users to interact with an AI coach.
 * It uses the OpenAI service to generate responses based on user input.
 */

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Send, Brain, Sparkles, Lock, Zap, WifiOff } from 'lucide-react';
import { useServices } from '@/services/service-registry';
import { useNavigate } from 'react-router-dom';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { OpenAIModel } from '@/services/api/openai-service';

// Message type
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// Generate a unique ID for messages
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Props for the AICoachChat component
interface AICoachChatProps {
  hasAccess?: boolean;
  maxMessages?: number;
}

/**
 * AI Coach Chat Component
 *
 * This component provides a chat interface for users to interact with an AI coach.
 * It uses the OpenAI service to generate responses based on user input.
 *
 * @param hasAccess Whether the user has access to the AI coach feature
 * @param maxMessages Maximum number of messages to display
 */
const AICoachChat = ({ hasAccess = true, maxMessages = 50 }: AICoachChatProps) => {
  const services = useServices();
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "I'm your AI Coach. I can help you with workout plans, nutrition advice, recovery strategies, and more. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Check if user is online
    if (!isOnline) {
      setMessages(prev => [
        ...prev,
        {
          id: generateId(),
          role: 'assistant',
          content: "You appear to be offline. Please check your internet connection and try again.",
          timestamp: new Date()
        }
      ]);
      return;
    }

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

    try {
      // Check if OpenAI service is available
      if (services.openAI.isAvailable()) {
        // Get previous messages for context (limit to last 10)
        const contextMessages = messages
          .slice(-10)
          .map(msg => ({ role: msg.role, content: msg.content }));

        // Add system message for context
        contextMessages.unshift({
          role: 'system',
          content: `You are an AI fitness coach assistant. Provide helpful, accurate, and concise advice about fitness,
          nutrition, and wellness. Base your responses on scientific evidence and best practices in sports science.
          Keep responses under 150 words unless the user specifically asks for more detail.`
        });

        // Add user message
        contextMessages.push({
          role: 'user',
          content: inputValue
        });

        // Define a custom model for the AI coach chat
        const COACH_CHAT_MODEL = OpenAIModel.GPT_4O_MINI;

        // Generate response using OpenAI service
        const completion = await services.openAI.generateChatCompletion({
          model: COACH_CHAT_MODEL,
          messages: contextMessages,
          temperature: 0.7,
        });

        // Extract response
        const responseContent = completion.choices[0].message.content;

        // Add assistant message
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Fallback to demo responses if OpenAI is not available
        setTimeout(() => {
          const assistantMessage: Message = {
            id: generateId(),
            role: 'assistant',
            content: "I'm sorry, but the AI coach feature is currently unavailable. Please try again later or contact support if the issue persists.",
            timestamp: new Date()
          };

          setMessages(prev => [...prev, assistantMessage]);
        }, 1000);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);

      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: "I'm sorry, but I encountered an error while processing your request. Please try again later.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle upgrade click
  const handleUpgradeClick = () => {
    navigate('/dashboard/subscription');
  };

  // Format message timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

      <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-athleteBlue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              <div
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-athleteBlue-100' : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
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
            <Button type="submit" disabled={!inputValue.trim() || isTyping || !isOnline}>
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
              Upgrade to Elite
            </Button>
          </div>
        )}

        {!isOnline && (
          <Alert className="mt-3 bg-red-50 border-red-200">
            <WifiOff className="h-4 w-4 text-red-600" />
            <AlertTitle>Offline</AlertTitle>
            <AlertDescription>
              You are currently offline. Please check your internet connection.
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};

export default AICoachChat;
