
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ChatLayout from '@/components/layout/ChatLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, PaperclipIcon, Send, Zap, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

// Mock agent data
const mockAgents = [
  {
    id: '1',
    name: 'Design Manager',
    department: 'Design',
    avatar: 'D',
    avatarColor: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  {
    id: '2',
    name: 'Sales Manager',
    department: 'Sales',
    avatar: 'S',
    avatarColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
];

// Mock chat history data
const mockChatHistory = [
  {
    id: '1',
    agentId: '1',
    title: 'Design Discussion',
    lastMessage: 'Let me help you with those design questions',
    timestamp: new Date(2024, 4, 10),
  },
  {
    id: '2',
    agentId: '2',
    title: 'Sales Strategy',
    lastMessage: 'Here are the sales tactics I recommend',
    timestamp: new Date(2024, 4, 9),
  },
  {
    id: '3',
    agentId: '1',
    title: 'UI/UX Feedback',
    lastMessage: 'Your design looks great, but I have some suggestions',
    timestamp: new Date(2024, 4, 8),
  },
];

interface Message {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

const ChatWithAgent = () => {
  const { agentId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Find the agent based on the ID from params, or use the first one as default
  const agent = mockAgents.find(a => a.id === agentId) || mockAgents[0];
  
  // Initial agent welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: '0',
      sender: 'agent' as const,
      content: `Xin chào! Tôi là ${agent.name}, ${agent.department} tại AI Automation, sẵn sàng hỗ trợ bạn trong mọi vấn đề liên quan đến giải pháp tự động hóa AI. Tôi có thể giúp bạn xây dựng chiến lược, tối ưu hiệu suất và giải đáp mọi thắc mắc. Hãy cho tôi biết tôi có thể hỗ trợ gì cho bạn hôm nay nhé!`,
      timestamp: new Date(),
    };
    
    const suggestedQuestions = [
      {
        id: '1',
        sender: 'agent' as const,
        content: 'Làm thế nào để tôi có thể cải thiện kỹ năng bán hàng và đạt được chỉ tiêu doanh số?',
        timestamp: new Date(),
      },
      {
        id: '2',
        sender: 'agent' as const,
        content: 'Có cách nào để xây dựng mối quan hệ tốt hơn với khách hàng không?',
        timestamp: new Date(),
      },
      {
        id: '3',
        sender: 'agent' as const,
        content: 'Tôi nên ưu tiên những hoạt động nào để tăng hiệu quả kinh doanh?',
        timestamp: new Date(),
      },
    ];
    
    setMessages([welcomeMessage, ...suggestedQuestions]);
  }, [agent]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate agent response after a delay
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: `Thank you for your message. As ${agent.name}, I'm here to help you with ${agent.department.toLowerCase()} related questions. Let me address your inquiry about "${inputValue}".`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, agentResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestedQuestion = (content: string) => {
    // Add the suggested question as a user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev.filter(m => m.content !== content), userMessage]);
    setIsLoading(true);
    
    // Simulate agent response after a delay
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: `Great question about "${content.substring(0, 50)}...". Here's my response as ${agent.name}...`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, agentResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Left sidebar content - Agent list
  const LeftSidebar = () => (
    <div className="p-4">
      <h2 className="font-medium mb-4">Your Agents</h2>
      {mockAgents.map((a) => (
        <Link key={a.id} to={`/agents/chat/${a.id}`}>
          <div className={`flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-accent mb-2 ${a.id === agent.id ? 'bg-accent' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${a.avatarColor} ${a.textColor}`}>
              {a.avatar}
            </div>
            <div>
              <p className="font-medium text-sm">{a.name}</p>
              <p className="text-xs text-muted-foreground">{a.department}</p>
            </div>
          </div>
        </Link>
      ))}
      
      <Button variant="outline" className="w-full mt-2 flex gap-2">
        <Plus className="h-4 w-4" />
        <span>New chat</span>
      </Button>
    </div>
  );

  // Right sidebar content - Chat history
  const RightSidebar = () => (
    <div className="p-4">
      <h2 className="font-medium mb-4">Chat History</h2>
      {mockChatHistory.filter(chat => chat.agentId === agent.id).map((chat) => (
        <div key={chat.id} className="p-3 rounded-md cursor-pointer hover:bg-accent mb-2">
          <p className="font-medium text-sm truncate">{chat.title}</p>
          <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {chat.timestamp.toLocaleDateString()}
          </p>
        </div>
      ))}
      {mockChatHistory.filter(chat => chat.agentId === agent.id).length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          <p>No chat history yet.</p>
          <p className="text-sm mt-2">Start a conversation to see it here.</p>
        </div>
      )}
    </div>
  );
  
  // Main chat content
  const ChatContent = () => (
    <>
      {/* Chat header */}
      <div className="border-b p-4 flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${agent.avatarColor} ${agent.textColor}`}>
          {agent.avatar}
        </div>
        <div>
          <p className="font-medium">{agent.name}</p>
          <p className="text-xs text-muted-foreground">{agent.department}</p>
        </div>
      </div>
      
      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-teampal-500 text-white'
                    : message.content.startsWith('Làm thế nào') || 
                      message.content.startsWith('Có cách nào') || 
                      message.content.startsWith('Tôi nên ưu tiên')
                    ? 'bg-accent/50 border cursor-pointer hover:bg-accent'
                    : 'bg-accent'
                }`}
                onClick={() => {
                  if (
                    message.sender === 'agent' && 
                    (message.content.startsWith('Làm thế nào') || 
                     message.content.startsWith('Có cách nào') || 
                     message.content.startsWith('Tôi nên ưu tiên'))
                  ) {
                    handleSuggestedQuestion(message.content);
                  }
                }}
              >
                {message.content}
                <div className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-accent/50">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      
      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Textarea
              placeholder="Ask your Agent..."
              className="min-h-[50px] py-3 pr-10 resize-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button 
              size="icon" 
              variant="ghost"
              className="absolute right-2 bottom-2 text-muted-foreground hover:text-foreground"
              type="button"
            >
              <PaperclipIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button className="bg-teampal-500 hover:bg-teampal-600" disabled={!inputValue.trim() || isLoading} onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex gap-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Super Power</span>
            </Button>
          </div>
        </div>
        <div className="flex justify-end mt-2 text-xs text-muted-foreground">
          <span>GPT 4o</span>
        </div>
      </div>
    </>
  );

  return (
    <ChatLayout 
      leftSidebar={<LeftSidebar />} 
      rightSidebar={<RightSidebar />}
    >
      <ChatContent />
    </ChatLayout>
  );
};

export default ChatWithAgent;
