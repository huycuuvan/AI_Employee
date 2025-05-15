import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ChatLayout from '@/components/layout/ChatLayout';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, PaperclipIcon, Send, Zap, Plus, Info, Search, X, AlertTriangle, Flame, BarChart, BookOpen, Pencil } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import Skeleton from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

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
  const [superPowerOpen, setSuperPowerOpen] = useState(false);
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
      {/* Nội dung chat, task, tin nhắn */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 md:px-4 py-2"> {/* scrollable */}
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
        <div className="space-y-4">
          {chatMessages.map((message, idx) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-end`}>
              {message.sender === 'agent' && (
                <div className={`avatar-container w-8 h-8 ${agent?.avatarColor} ${agent?.textColor} mr-2`}><div className="avatar-fallback">{agent?.avatar}</div></div>
              )}
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
              {message.sender === 'user' && (
                <div className="avatar-container w-8 h-8 bg-blue-100 text-blue-700 font-bold ml-2"><div className="avatar-fallback">U</div></div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-end">
              <div className={`avatar-container w-8 h-8 ${agent?.avatarColor} ${agent?.textColor} mr-2`}><div className="avatar-fallback">{agent?.avatar}</div></div>
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
      </div>
      {/* Input area */}
      <div className="border-t p-4 flex-shrink-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Textarea
              placeholder="Nhập tin nhắn..."
              className="min-h-[36px] py-2 pr-10 resize-none rounded-md text-sm"
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
            <Button className="bg-teampal-500 hover:bg-teampal-600 px-3 py-2 rounded-md" disabled={!inputValue.trim() || isLoading} onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex gap-1 px-3 py-2 rounded-md text-sm" onClick={() => setSuperPowerOpen(true)}>
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Super Power</span>
            </Button>
          </div>
        </div>
        <div className="flex justify-end mt-2 text-xs text-muted-foreground">
          <span>GPT 4o</span>
        </div>
      </div>
      {/* Modal Super Power */}
      <Dialog open={superPowerOpen} onOpenChange={setSuperPowerOpen}>
        <DialogContent className="max-w-lg w-full rounded-2xl shadow-xl bg-white p-0 overflow-hidden">
          <div className="flex items-center justify-center px-0 pt-6 pb-2 border-b relative">
            <span className="text-2xl font-bold mx-auto flex items-center gap-2">
              <span className="text-yellow-500">⚡</span> Super Power
            </span>
            <DialogClose asChild>
              <button className="absolute right-6 top-6 p-2 rounded hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </DialogClose>
          </div>
          <div className="p-0">
            <Accordion type="multiple" defaultValue={['skills']}>
              {/* Knowledge */}
              <AccordionItem value="knowledge" className="border-b">
                <AccordionTrigger className="flex items-center px-6 py-4">
                  <span className="font-semibold flex-1 flex items-center gap-2">
                    Knowledge <Info className="w-4 h-4 text-muted-foreground" />
                  </span>
                  <Switch checked={false} onCheckedChange={() => {}} />
                </AccordionTrigger>
                <AccordionContent className="bg-muted/40 rounded-b-lg px-6 py-8 flex flex-col items-center text-center">
                  <AlertTriangle className="w-6 h-6 text-muted-foreground mb-2" />
                  <div className="text-sm text-muted-foreground mb-2">
                    Empty section. <a href="#" className="text-blue-600 underline">Please upload file to reference</a>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Supported format <b>.pdf</b> | <b>.pptx</b> | <b>.docx</b> | <b>.txt</b> | <b>.rtf</b> | <b>.epub</b><br />
                    Maximum file size: <b>90.00 MB</b>
                  </div>
                </AccordionContent>
              </AccordionItem>
              {/* Skills */}
              <AccordionItem value="skills" className="border-b">
                <AccordionTrigger className="flex items-center px-6 py-4">
                  <span className="font-semibold flex-1 flex items-center gap-2">
                    Skills <Info className="w-4 h-4 text-muted-foreground" />
                  </span>
                  <Switch checked={true} onCheckedChange={() => {}} />
                </AccordionTrigger>
                <AccordionContent className="bg-muted/40 rounded-b-lg px-6 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Input placeholder="Search" className="flex-1" />
                    <Button variant="outline" size="sm">Filter</Button>
                    <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">Auto <Pencil className="w-4 h-4" /></span>
                  </div>
                  <div className="mb-2 text-xs text-muted-foreground font-semibold flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-500" /> Recently Featured
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {/* Skill card */}
                    <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition">
                      <input type="checkbox" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-semibold">
                          <BarChart className="w-4 h-4" /> Data analysis
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Specialized for data processing, analysis and visualization by utilizing Python commands and related libraries. Supported data file: csv, xlsx.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition">
                      <input type="checkbox" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-semibold">
                          <BookOpen className="w-4 h-4" /> Document reader v2
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Read and extract content from documents available online. Supported formats: PDF, DOCX, TXT...
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              {/* Brand voice */}
              <AccordionItem value="brandvoice">
                <AccordionTrigger className="flex items-center px-6 py-4">
                  <span className="font-semibold flex-1 flex items-center gap-2">
                    Brand voice <Info className="w-4 h-4 text-muted-foreground" />
                  </span>
                  <Switch checked={false} onCheckedChange={() => {}} />
                </AccordionTrigger>
                <AccordionContent className="bg-muted/40 rounded-b-lg px-6 py-8 flex flex-col items-center text-center">
                  <AlertTriangle className="w-6 h-6 text-muted-foreground mb-2" />
                  <div className="text-sm text-muted-foreground mb-2">
                    Empty section. <a href="#" className="text-blue-600 underline">Please create a brand voice to add to your agent.</a>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t bg-muted">
            <Button variant="outline" size="sm">Reset</Button>
            <Button className="bg-teampal-500 text-white font-semibold rounded px-6 py-2 shadow hover:bg-teampal-600 transition" disabled>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Định nghĩa type cho phần tử lịch sử chat
interface ChatHistoryItem {
  id: string;
  agentId: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

// Lazy load AgentListSidebar
const AgentListSidebar = React.lazy(() => Promise.resolve({
  default: (props: { agents: Agent[], currentAgent: Agent | undefined, handleNewChat: () => void, historyList: ChatHistoryItem[] }) => {
    const { agents, currentAgent, handleNewChat, historyList } = props;
    return (
      <div className="p-4">
        {/* Header sidebar trái */}
        <div className="flex items-center gap-2 mb-4">
          <Link to="/">
            <img src="/placeholder.svg" alt="Logo" className="w-8 h-8 cursor-pointer" />
          </Link>
          <h2 className="font-medium text-base md:text-lg flex-1 text-center md:text-left">Your Agents</h2>
        </div>
        {/* Danh sách agent */}
        {agents.map((a) => (
          <Link key={a.id} to={`/agents/chat/${a.id}`}>
            <div className={`flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-accent mb-2 ${a.id === currentAgent?.id ? 'bg-accent' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${a.avatarColor} ${a.textColor}`}>{a.avatar}</div>
              <div>
                <p className="font-medium text-sm">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.department}</p>
              </div>
            </div>
          </Link>
        ))}
        {/* Nút New chat */}
        <Button variant="outline" className="w-full mt-2 flex gap-2" onClick={handleNewChat}>
          <Plus className="h-4 w-4" />
          <span>New chat</span>
        </Button>
        {/* Lịch sử chat dưới New chat */}
        <div className="mt-6">
          <h3 className="text-xs font-semibold mb-2 px-2">History</h3>
          <div className="space-y-2 px-2">
            {historyList.length > 0 ? historyList.map((item) => (
              <div key={item.id} className="text-sm truncate cursor-pointer hover:bg-accent rounded px-2 py-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground truncate">{item.lastMessage}</div>
                <div className="text-xs text-muted-foreground mt-1">{new Date(item.timestamp).toLocaleDateString()}</div>
              </div>
            )) : (
              <div className="text-xs text-muted-foreground px-2">No chat history yet.</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}));

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
    <Suspense fallback={
      <div className="p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 mb-4">
            <Skeleton className="w-10 h-10" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    }>
      <AgentListSidebar agents={agents} currentAgent={agent} handleNewChat={handleNewChat} historyList={mockChatHistory.filter(chat => chat.agentId === agent?.id)} />
    </Suspense>
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
