
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, FileText, BookOpen, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreateAgentOpen, setIsCreateAgentOpen] = useState(false);

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

  return (
    <Layout title="Dashboard" showCreateButton onCreateClick={handleCreateAgent}>
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">3 agents created this week</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs mt-2 text-teampal-500 hover:text-teampal-600 hover:bg-teampal-50 p-0 h-auto" 
                onClick={() => navigate('/agents')}
              >
                View all agents →
              </Button>
            </CardContent>
          </Card>
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <div className="flex items-center mt-1 space-x-1">
                <ArrowUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">12% increase</span>
              </div>
              <Progress value={65} className="mt-3 h-1" />
              <p className="text-xs text-muted-foreground mt-2">65% completed</p>
            </CardContent>
          </Card>
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Knowledge Files</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <div className="flex items-center mt-1 space-x-1">
                <ArrowDown className="h-3 w-3 text-red-500" />
                <span className="text-xs text-red-500">3 deleted files</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs mt-2 text-teampal-500 hover:text-teampal-600 hover:bg-teampal-50 p-0 h-auto" 
                onClick={() => navigate('/knowledge')}
              >
                Manage files →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Agents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Agents</h2>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => navigate('/agents')}
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <AgentCard 
                key={i}
                name={i === 1 ? "Design Manager" : i === 2 ? "Sales Manager" : "Marketing Specialist"}
                description={i === 1 ? "Collaborate with teams to create design resources" : i === 2 ? "Drive sales and revenue" : "Create marketing campaigns"}
                avatarColor={i === 1 ? "bg-blue-100" : i === 2 ? "bg-green-100" : "bg-purple-100"}
                textColor={i === 1 ? "text-blue-700" : i === 2 ? "text-green-700" : "text-purple-700"}
                initial={i === 1 ? "D" : i === 2 ? "S" : "M"}
              />
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Tasks</h2>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => navigate('/tasks')}
            >
              View All
            </Button>
          </div>
          <Card>
            <div className="rounded-md border">
              <div className="grid grid-cols-8 table-header text-left">
                <div className="col-span-3">Task</div>
                <div className="col-span-2">Assignee</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Due Date</div>
              </div>
              <div className="divide-y">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="grid grid-cols-8 table-row text-left">
                    <div className="col-span-3 table-cell font-medium">
                      {i === 1 ? "Create brand guidelines" : i === 2 ? "Design landing page" : "Generate blog ideas"}
                    </div>
                    <div className="col-span-2 table-cell">
                      <div className="flex items-center gap-2">
                        <div className="avatar-container">
                          <div className={`avatar-fallback ${i === 1 ? "bg-blue-100 text-blue-700" : i === 2 ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>
                            {i === 1 ? "DM" : i === 2 ? "SM" : "MS"}
                          </div>
                        </div>
                        <span className="text-sm">
                          {i === 1 ? "Design Manager" : i === 2 ? "Sales Manager" : "Marketing Specialist"}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2 table-cell">
                      <span className={`badge ${i === 1 ? "badge-success" : i === 2 ? "badge-warning" : "bg-blue-100 text-blue-800"}`}>
                        {i === 1 ? "Completed" : i === 2 ? "In Progress" : "Pending"}
                      </span>
                    </div>
                    <div className="col-span-1 table-cell text-muted-foreground">
                      {i === 1 ? "Today" : i === 2 ? "Tomorrow" : "May 20"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
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

interface AgentCardProps {
  name: string;
  description: string;
  avatarColor: string;
  textColor: string;
  initial: string;
}

const AgentCard = ({ name, description, avatarColor, textColor, initial }: AgentCardProps) => (
  <Card className="dashboard-card flex flex-col">
    <div className="flex items-start gap-4">
      <div className={`avatar-container w-8 h-8 ${avatarColor} ${textColor}`}>
        <div className="avatar-fallback">{initial}</div>
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-sm">{name}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
      </div>
    </div>
    <div className="mt-auto pt-4 flex justify-between items-center">
      <span className="badge bg-blue-100 text-blue-800">New</span>
      <Button variant="ghost" size="sm" className="text-xs text-teampal-500 hover:text-teampal-600 hover:bg-teampal-50">
        Chat with agent
      </Button>
    </div>
  </Card>
);

export default Dashboard;
