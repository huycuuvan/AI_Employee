import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Folder, FolderPlus, Plus, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

interface Agent {
  id: string;
  name: string;
  description: string;
  avatar: string;
  avatarColor: string;
  textColor: string;
}

interface WorkspaceFolder {
  id: number;
  name: string;
  theme: string;
  agents: Agent[];
}

const Workspace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isCreateAgentOpen, setIsCreateAgentOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<WorkspaceFolder | null>(null);
  const [renameFolderId, setRenameFolderId] = useState<number | null>(null);
  const [renameFolderName, setRenameFolderName] = useState('');
  const [isRenameFolderOpen, setIsRenameFolderOpen] = useState(false);

  // Khi khởi tạo Workspace, lấy dữ liệu từ localStorage nếu có
  const [folders, setFolders] = useState<WorkspaceFolder[]>(() => {
    const stored = localStorage.getItem('folders');
    if (stored) return JSON.parse(stored);
    return [
      {
        id: 1,
        name: "Sales Team",
        theme: "sales",
        agents: [
          {
            id: '101',
            name: "Sales Representative",
            description: "Focuses on acquiring new customers and closing deals",
            avatar: "S",
            avatarColor: "bg-blue-100",
            textColor: "text-blue-700",
          },
          {
            id: '102',
            name: "Sales Consultant",
            description: "Provides expert advice to customers on product solutions",
            avatar: "S",
            avatarColor: "bg-blue-100",
            textColor: "text-blue-700",
          }
        ]
      },
      {
        id: 2,
        name: "Marketing Team",
        theme: "marketing",
        agents: [
          {
            id: '201',
            name: "Content Marketer",
            description: "Creates engaging content for various marketing channels",
            avatar: "M",
            avatarColor: "bg-green-100",
            textColor: "text-green-700",
          }
        ]
      },
      {
        id: 3,
        name: "IT Support",
        theme: "it",
        agents: [
          {
            id: '301',
            name: "IT Specialist",
            description: "Provides technical support and troubleshooting",
            avatar: "I",
            avatarColor: "bg-purple-100",
            textColor: "text-purple-700",
          }
        ]
      }
    ];
  });

  // Sau mỗi lần folders thay đổi, lưu vào localStorage
  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  const handleCreateFolder = () => {
    setIsCreateFolderOpen(true);
  };

  const handleFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const folderName = formData.get('name') as string;
    const folderTheme = formData.get('theme') as string;
    
    if (folderName) {
      const newFolder: WorkspaceFolder = {
        id: Date.now(),
        name: folderName,
        theme: folderTheme || 'general',
        agents: []
      };
      
      setFolders([...folders, newFolder]);
      setIsCreateFolderOpen(false);
      
      toast({
        title: "Folder created",
        description: `"${folderName}" folder has been created successfully.`,
      });
    }
  };

  const handleCreateAgent = (folder: WorkspaceFolder) => {
    setSelectedFolder(folder);
    setIsCreateAgentOpen(true);
  };

  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const agentName = formData.get('name') as string;
    const agentDescription = formData.get('description') as string;
    
    if (agentName && selectedFolder) {
      const newAgent: Agent = {
        id: Date.now().toString(),
        name: agentName,
        description: agentDescription || `A ${selectedFolder.theme} agent`,
        avatar: agentName.charAt(0).toUpperCase(),
        avatarColor: getColorByTheme(selectedFolder.theme, "bg"),
        textColor: getColorByTheme(selectedFolder.theme, "text"),
      };
      
      const updatedFolders = folders.map(folder => 
        folder.id === selectedFolder.id 
          ? { ...folder, agents: [...folder.agents, newAgent] } 
          : folder
      );
      
      setFolders(updatedFolders);
      setIsCreateAgentOpen(false);
      
      toast({
        title: "Agent created",
        description: `"${agentName}" agent has been added to the "${selectedFolder.name}" folder.`,
      });
    }
  };

  const getColorByTheme = (theme: string, type: "bg" | "text") => {
    const colors: Record<string, { bg: string, text: string }> = {
      sales: { bg: "bg-blue-100", text: "text-blue-700" },
      marketing: { bg: "bg-green-100", text: "text-green-700" },
      it: { bg: "bg-purple-100", text: "text-purple-700" },
      design: { bg: "bg-pink-100", text: "text-pink-700" },
      hr: { bg: "bg-yellow-100", text: "text-yellow-700" },
      general: { bg: "bg-gray-100", text: "text-gray-700" },
    };
    
    return colors[theme.toLowerCase()] 
      ? colors[theme.toLowerCase()][type] 
      : colors.general[type];
  };

  const handleChatWithAgent = (agentId: string) => {
    navigate(`/agents/chat/${agentId}`);
  };

  const handleDeleteFolder = (folderId: number) => {
    const updatedFolders = folders.filter(folder => folder.id !== folderId);
    setFolders(updatedFolders);
    
    toast({
      title: "Folder deleted",
      description: "The folder and its agents have been deleted.",
    });
  };

  const handleRenameFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameFolderId === null || !renameFolderName.trim()) return;
    setFolders(prev =>
      prev.map(f =>
        f.id === renameFolderId ? { ...f, name: renameFolderName } : f
      )
    );
    setIsRenameFolderOpen(false);
    setRenameFolderId(null);
    setRenameFolderName('');
    toast({ title: 'Folder renamed', description: `Folder has been renamed to "${renameFolderName}".` });
  };

  const openRenameFolder = (folder: WorkspaceFolder) => {
    setRenameFolderId(folder.id);
    setRenameFolderName(folder.name);
    setIsRenameFolderOpen(true);
  };

  return (
    <Layout title="Workspace" showCreateButton onCreateClick={handleCreateFolder}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Workspace</h1>
          <Button
            onClick={handleCreateFolder}
            className="bg-teampal-500 hover:bg-teampal-600 text-white"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </div>
        
        <div className="space-y-8">
          {folders.map((folder) => (
            <div key={folder.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Folder className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">{folder.name}</h2>
                  <span className="badge bg-gray-100 text-gray-800 capitalize">{folder.theme}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCreateAgent(folder)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Agent
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openRenameFolder(folder)}>Rename Folder</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteFolder(folder.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Folder
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {folder.agents.map((agent) => (
                  <Card key={agent.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col h-full">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`avatar-container w-8 h-8 ${agent.avatarColor} ${agent.textColor}`}>
                              <div className="avatar-fallback">{agent.avatar}</div>
                            </div>
                            <div>
                              <h3 className="font-medium">{agent.name}</h3>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {agent.description}
                        </p>
                        
                        <div className="mt-auto pt-4">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleChatWithAgent(agent.id)}
                          >
                            Chat with agent
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {folder.agents.length === 0 && (
                  <div className="col-span-3 flex items-center justify-center p-8 border rounded-lg border-dashed">
                    <div className="text-center">
                      <p className="text-muted-foreground">No agents in this folder</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => handleCreateAgent(folder)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Agent
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {folders.length === 0 && (
            <div className="flex items-center justify-center p-12 border rounded-lg border-dashed">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No folders yet</h3>
                <p className="text-muted-foreground mb-4">Create your first folder to organize your agents</p>
                <Button 
                  onClick={handleCreateFolder} 
                  className="bg-teampal-500 hover:bg-teampal-600 text-white"
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create Folder
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Create a new folder to organize your agents by theme or department.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFolderSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" name="name" placeholder="Folder name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="theme" className="text-right">
                  Theme
                </Label>
                <Input id="theme" name="theme" placeholder="e.g., Sales, IT, Marketing" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-teampal-500 hover:bg-teampal-600">Create Folder</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Agent Dialog */}
      <Dialog open={isCreateAgentOpen} onOpenChange={setIsCreateAgentOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Agent</DialogTitle>
            <DialogDescription>
              {selectedFolder && `Add a new agent to the "${selectedFolder.name}" folder.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAgentSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" name="name" placeholder="Agent name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input id="description" name="description" placeholder="What does this agent do?" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-teampal-500 hover:bg-teampal-600">Create Agent</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Rename Folder Dialog */}
      <Dialog open={isRenameFolderOpen} onOpenChange={setIsRenameFolderOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
            <DialogDescription>
              Enter a new name for this folder.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRenameFolderSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rename-folder-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="rename-folder-name"
                  value={renameFolderName}
                  onChange={e => setRenameFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="col-span-3"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-teampal-500 hover:bg-teampal-600">Rename</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Workspace;
