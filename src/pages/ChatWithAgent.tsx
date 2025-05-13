import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ChatLayout from '@/components/layout/ChatLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, PaperclipIcon, Send, Zap, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

type Agent = {
  id: string;
  name: string;
  description: string;
  avatar: string;
  avatarColor: string;
  textColor: string;
  department?: string;
  folderName?: string;
};

type Folder = {
  id: number;
  name: string;
  theme: string;
  agents: Agent[];
};

// Lấy danh sách agent từ localStorage
function getAllAgentsFromFolders(): Agent[] {
  const stored = localStorage.getItem('folders');
  if (!stored) return [];
  try {
    const folders: Folder[] = JSON.parse(stored);
    return folders.flatMap((f) => f.agents.map((a) => ({ ...a, folderName: f.name })));
  } catch {
    return [];
  }
}

// Hàm lấy lịch sử chat từ localStorage theo agentId
function getChatHistory(agentId: string): Message[] {
  const stored = localStorage.getItem(`chat_history_${agentId}`);
  if (!stored) return [];
  try {
    const arr = JSON.parse(stored);
    // Đảm bảo timestamp là Date object
    return arr.map((msg: Message) => ({
      ...msg,
      timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp
    }));
  } catch {
    return [];
  }
}

// Hàm lưu lịch sử chat vào localStorage theo agentId
function saveChatHistory(agentId: string, messages: Message[]) {
  localStorage.setItem(`chat_history_${agentId}`, JSON.stringify(messages));
}

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

type TaskField = { label: string; name: string; type: string; required?: boolean; props?: Record<string, unknown> };

// Cấu hình form cho từng task
const taskForms: Record<string, TaskField[]> = {
  'Generate a short video': [
    { label: 'Nhập ý tưởng video (prompt)', name: 'prompt', type: 'text', required: true },
    { label: 'Chọn ảnh', name: 'image', type: 'file' },
  ],
  'Generate color palette suggestions for a brand': [
    { label: 'Brand personality', name: 'brandPersonality', type: 'text', required: true },
    { label: 'Target audience', name: 'targetAudience', type: 'text', required: true },
    { label: 'Industry type', name: 'industryType', type: 'text' },
    { label: 'Preferred colors', name: 'preferredColors', type: 'text' },
    { label: 'Existing brand elements', name: 'brandElements', type: 'text' },
  ],
  'Develop a brand voice and tone guide': [
    { label: 'Brand personality', name: 'brandPersonality', type: 'text', required: true },
    { label: 'Target audience', name: 'targetAudience', type: 'text', required: true },
    { label: 'Industry type', name: 'industryType', type: 'text' },
  ],
  'Generate ideas for infographic layouts': [
    { label: 'Chủ đề infographic', name: 'topic', type: 'text', required: true },
    { label: 'Đối tượng hướng tới', name: 'audience', type: 'text' },
  ],
  'Generate ideas for interactive website elements': [
    { label: 'Loại website', name: 'websiteType', type: 'text', required: true },
    { label: 'Mục tiêu tương tác', name: 'interactionGoal', type: 'text' },
    { label: 'Đối tượng người dùng', name: 'userType', type: 'text' },
  ],
};

// Định nghĩa ChatContentProps bên ngoài ChatWithAgent
type ChatContentProps = {
  agent: Agent;
  messages: Message[];
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  suggestedTasks: string[];
  activeTask: string | null;
  handleSuggestedTaskClick: (task: string) => void;
  taskForms: Record<string, TaskField[]>;
  taskFormValues: Record<string, string | File | undefined>;
  handleTaskFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTaskFormSubmit: (e: React.FormEvent) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
};

function ChatContent({
  agent,
  messages,
  inputValue,
  setInputValue,
  isLoading,
  handleSendMessage,
  handleKeyDown,
  suggestedTasks,
  activeTask,
  handleSuggestedTaskClick,
  taskForms,
  taskFormValues,
  handleTaskFormChange,
  handleTaskFormSubmit,
  scrollRef,
}: ChatContentProps) {
  const welcomeMessage = messages.length > 0 ? messages[0] : null;
  const chatMessages = messages.length > 1
    ? messages.slice(1).filter(m => !suggestedTasks.includes(m.content))
    : [];

  return (
    <>
      {/* Chat header */}
      <div className="border-b p-4 flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${agent?.avatarColor} ${agent?.textColor}`}>
          {agent?.avatar}
        </div>
        <div>
          <p className="font-medium">{agent?.name}</p>
          <p className="text-xs text-muted-foreground">{agent?.department}</p>
        </div>
      </div>
      {/* Welcome message */}
      {welcomeMessage && (
        <div className="flex justify-start flex-col mb-2">
          <div className="max-w-[80%] rounded-lg p-3 bg-accent">
            {welcomeMessage.content}
            <div className="text-xs mt-1 opacity-70">
              {welcomeMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      )}
      {/* Task gợi ý ngay dưới welcome message */}
      <div className="space-y-2 mb-4">
        {suggestedTasks.map((task) => (
          <div
            key={task}
            className={`max-w-[80%] rounded-lg p-3 bg-yellow-50 border border-yellow-300 cursor-pointer hover:bg-yellow-100 flex items-center gap-2 shadow-sm ${activeTask === task ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => handleSuggestedTaskClick(task)}
          >
            <MessageSquare className="w-4 h-4 text-yellow-500 mr-2" />
            <span>{task}</span>
          </div>
        ))}
        {/* Form nhập liệu cho task nếu có */}
        {activeTask && (
          <form className="bg-white border border-yellow-200 rounded-lg p-4 mt-2 shadow" onSubmit={handleTaskFormSubmit}>
            {taskForms[activeTask].map((field) => (
              <div className="mb-2" key={field.name}>
                <label className="block text-sm font-medium mb-1">{field.label}{field.required && <span className="text-red-500">*</span>}</label>
                <input
                  type={field.type}
                  name={field.name}
                  className="w-full border rounded px-2 py-1"
                  {...(field.type !== 'file' ? { value: taskFormValues[field.name] as string || '' } : {})}
                  onChange={handleTaskFormChange}
                  required={field.required}
                  accept={field.type === 'file' ? 'image/*' : undefined}
                />
              </div>
            ))}
            <button type="submit" className="bg-teampal-500 text-white px-4 py-1 rounded hover:bg-teampal-600">Gửi task</button>
          </form>
        )}
      </div>
      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {chatMessages.map((message, idx) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} flex-col`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-teampal-500 text-white'
                    : 'bg-accent'
                }`}
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
}

const ChatWithAgent = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const agents = getAllAgentsFromFolders();
  const agent = agents.find(a => a.id === agentId);

  // Khai báo lại suggestedTasks ở đây
  const suggestedTasks = [
    'Generate a short video',
    'Generate color palette suggestions for a brand',
    'Develop a brand voice and tone guide',
    'Generate ideas for infographic layouts',
    'Generate ideas for interactive website elements',
  ];

  // Lấy lịch sử chat cho agent hiện tại
  const [messages, setMessages] = useState<Message[]>(() => {
    if (agentId && agent) {
      const history = getChatHistory(agentId);
      if (history.length > 0) return history;
      // Nếu chưa có lịch sử, tạo welcome + tasks như cũ
      const welcomeMessage = {
        id: '0',
        sender: 'agent' as const,
        content: `Xin chào! Tôi là ${agent.name}, ${agent.department} tại AI Automation, sẵn sàng hỗ trợ bạn trong mọi vấn đề liên quan đến giải pháp tự động hóa AI. Tôi có thể giúp bạn xây dựng chiến lược, tối ưu hiệu suất và giải đáp mọi thắc mắc. Hãy cho tôi biết tôi có thể hỗ trợ gì cho bạn hôm nay nhé!`,
        timestamp: new Date(),
      };
      return [welcomeMessage];
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [taskPrompt, setTaskPrompt] = useState('');
  const [taskImage, setTaskImage] = useState<File | null>(null);
  const [taskFormValues, setTaskFormValues] = useState<Record<string, string | File | undefined>>({});

  useEffect(() => {
    if (!agent) {
      navigate('/agents');
    }
  }, [agent, navigate]);
  
  useEffect(() => {
    if (agentId && agent) saveChatHistory(agentId, messages);
  }, [messages, agentId, agent]);
  
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
        content: `Thank you for your message. As ${agent?.name}, I'm here to help you with ${agent?.department.toLowerCase()} related questions. Let me address your inquiry about "${inputValue}".`,
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
        content: `Great question about "${content.substring(0, 50)}...". Here's my response as ${agent?.name}...`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, agentResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestedTaskClick = (content: string) => {
    setActiveTask(prev => (prev === content ? null : content));
  };

  const handleTaskFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    setTaskFormValues((prev) => ({
      ...prev,
      [name]: type === 'file' ? (files && files[0] ? files[0] : null) : value,
    }));
  };

  const handleTaskFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;
    const formConfig = taskForms[activeTask];
    let msg = `Task: ${activeTask}`;
    formConfig.forEach((field: TaskField) => {
      if (field.type === 'file' && taskFormValues[field.name]) {
        msg += `\n${field.label}: ${(taskFormValues[field.name] as File).name}`;
      } else if (taskFormValues[field.name]) {
        msg += `\n${field.label}: ${taskFormValues[field.name]}`;
      }
    });
    handleSuggestedQuestion(msg);
    setActiveTask(null);
    setTaskFormValues({});
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Hàm xử lý New chat
  const handleNewChat = () => {
    if (!agentId || !agent) return;
    localStorage.removeItem(`chat_history_${agentId}`);
    const welcomeMessage = {
      id: '0',
      sender: 'agent' as const,
      content: `Xin chào! Tôi là ${agent.name}, ${agent.department} tại AI Automation, sẵn sàng hỗ trợ bạn trong mọi vấn đề liên quan đến giải pháp tự động hóa AI. Tôi có thể giúp bạn xây dựng chiến lược, tối ưu hiệu suất và giải đáp mọi thắc mắc. Hãy cho tôi biết tôi có thể hỗ trợ gì cho bạn hôm nay nhé!`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    setActiveTask(null);
    setInputValue('');
    setTaskFormValues({});
  };

  // Left sidebar content - Agent list
  const LeftSidebar = () => (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/">
          <img src="/placeholder.svg" alt="Logo" className="w-8 h-8 cursor-pointer" />
        </Link>
        <h2 className="font-medium">Your Agents</h2>
      </div>
      {agents.map((a) => (
        <Link key={a.id} to={`/agents/chat/${a.id}`}>
          <div className={`flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-accent mb-2 ${a.id === agent?.id ? 'bg-accent' : ''}`}>
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
      
      <Button variant="outline" className="w-full mt-2 flex gap-2" onClick={handleNewChat}>
        <Plus className="h-4 w-4" />
        <span>New chat</span>
      </Button>
    </div>
  );

  // Right sidebar content - Chat history
  const RightSidebar = () => (
    <div className="p-4">
      <h2 className="font-medium mb-4">Chat History</h2>
      {mockChatHistory.filter(chat => chat.agentId === agent?.id).map((chat) => (
        <div key={chat.id} className="p-3 rounded-md cursor-pointer hover:bg-accent mb-2">
          <p className="font-medium text-sm truncate">{chat.title}</p>
          <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {chat.timestamp.toLocaleDateString()}
          </p>
        </div>
      ))}
      {mockChatHistory.filter(chat => chat.agentId === agent?.id).length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          <p>No chat history yet.</p>
          <p className="text-sm mt-2">Start a conversation to see it here.</p>
        </div>
      )}
    </div>
  );
  
  if (!agent) return null;

  return (
    <ChatLayout 
      leftSidebar={<LeftSidebar />} 
      rightSidebar={<RightSidebar />}
    >
      <ChatContent
        agent={agent}
        messages={messages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading}
        handleSendMessage={handleSendMessage}
        handleKeyDown={handleKeyDown}
        suggestedTasks={suggestedTasks}
        activeTask={activeTask}
        handleSuggestedTaskClick={handleSuggestedTaskClick}
        taskForms={taskForms}
        taskFormValues={taskFormValues}
        handleTaskFormChange={handleTaskFormChange}
        handleTaskFormSubmit={handleTaskFormSubmit}
        scrollRef={scrollRef}
      />
    </ChatLayout>
  );
};

export default ChatWithAgent;
