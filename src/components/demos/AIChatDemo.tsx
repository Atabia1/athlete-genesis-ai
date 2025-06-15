import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, User, Bot } from "lucide-react";
import { usePlan } from "@/context/PlanContext";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChatDemo = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { plan } = usePlan();

  const sendMessage = () => {
    if (input.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now().toString(),
        content: `AI Response: ${input}`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages([...messages, aiResponse]);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Chat Demo</CardTitle>
        <CardDescription>Interact with a simulated AI coach.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[300px] overflow-y-auto space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'
                }`}
            >
              <div
                className={`rounded-md px-3 py-2 text-sm shadow-sm ${message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                  }`}
              >
                {message.content}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {message.sender === 'user' ? 'You' : 'AI Coach'} -{' '}
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage}>
            Send
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatDemo;
