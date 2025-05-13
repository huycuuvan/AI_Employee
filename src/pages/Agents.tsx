import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { MoreHorizontal, Star } from 'lucide-react';

const Agents = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCreateAgentOpen, setIsCreateAgentOpen] = useState(false);
  
  // Mock data for agents
  const agents = [
    {
      id: 1,
      name: "Design Manager",
      department: "Design",
      description: "Collaborate with cross-functional teams to develop and implement effective design strategies.",
      avatar: "D",
      avatarColor: "bg-blue-100",
      textColor: "text-blue-700",
      isNew: true,
    },
    {
      id: 2,
      name: "Sales Manager",
      department: "Sales",
      description: "Develop and implement effective sales strategies to drive revenue growth.",
      avatar: "S",
      avatarColor: "bg-green-100",
      textColor: "text-green-700",
      isNew: true,
    },
    {
      id: 3,
      name: "Visual Designer",
      department: "Design",
      description: "Collaborate with cross-functional teams to understand project requirements and create visual designs.",
      avatar: "V",
      avatarColor: "bg-orange-100",
      textColor: "text-orange-700",
      isNew: true,
    },
    {
      id: 4,
      name: "Customer Support",
      department: "Support",
      description: "Handle customer inquiries, complaints, and requests efficiently to ensure satisfaction.",
      avatar: "C",
      avatarColor: "bg-pink-100",
      textColor: "text-pink-700",
      isNew: false,
    },
    {
      id: 5,
      name: "HR Manager",
      department: "Human Resources",
      description: "Develop and implement comprehensive HR policies and procedures to ensure compliance.",
      avatar: "H",
      avatarColor: "bg-purple-100",
      textColor: "text-purple-700",
      isNew: false,
    },
    {
      id: 6,
      name: "IT Manager",
      department: "IT",
      description: "Oversee the development, implementation, and maintenance of IT systems and infrastructure.",
      avatar: "I",
      avatarColor: "bg-teal-100",
      textColor: "text-teal-700",
      isNew: false,
    }
  ];

  const handleCreateAgent = () => {
    setIsCreateAgentOpen(true);
  };

  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreateAgentOpen(false);
    toast({
      title: "Agent created",
      description: "Your new agent has been created successfully.",
    });
  };

  const handleChatWithAgent = (agentId: number) => {
    navigate(`/agents/chat/${agentId}`);
  };

  return (
    <Layout title="Agents" showCreateButton onCreateClick={handleCreateAgent}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">All Agents</h2>
            <p className="text-sm text-muted-foreground">Total: {agents.length} agents</p>
          </div>
          <div className="flex items-center gap-3">
            <Input 
              placeholder="Search agents..." 
              className="max-w-xs"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Departments</DropdownMenuItem>
                <DropdownMenuItem>Design</DropdownMenuItem>
                <DropdownMenuItem>Sales</DropdownMenuItem>
                <DropdownMenuItem>Marketing</DropdownMenuItem>
                <DropdownMenuItem>IT</DropdownMenuItem>
                <DropdownMenuItem>HR</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id} className="dashboard-card">
              <CardContent className="p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between p-5 pb-3">
                    <div className="flex items-start gap-3">
                      <div className={`avatar-container w-10 h-10 ${agent.avatarColor} ${agent.textColor}`}>
                        <div className="avatar-fallback">{agent.avatar}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{agent.name}</h3>
                          {agent.isNew && (
                            <span className="badge bg-teampal-100 text-teampal-800 text-xs">New</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{agent.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Star className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="px-5 pb-3">
                    <p className="text-sm line-clamp-3">{agent.description}</p>
                  </div>
                  
                  <div className="mt-auto p-5 pt-3 border-t">
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
        </div>
      </div>

      {/* Create Agent Dialog */}
      <Dialog open={isCreateAgentOpen} onOpenChange={setIsCreateAgentOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Agent</DialogTitle>
            <DialogDescription>
              Create a new AI agent to help with your tasks.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAgentSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" placeholder="Agent name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <Input id="department" placeholder="e.g., Sales, Design" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input id="description" placeholder="What does this agent do?" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-teampal-500 hover:bg-teampal-600">Create Agent</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Agents;
