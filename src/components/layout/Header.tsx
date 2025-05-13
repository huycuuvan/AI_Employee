
import React from 'react';
import { Bell, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  title: string;
  onCreateClick?: () => void;
}

const Header = ({ title, onCreateClick }: HeaderProps) => {
  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">{title}</h1>
      
      <div className="flex items-center gap-4">
        <div className="relative max-w-md w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="search"
            placeholder="Search..." 
            className="w-full pl-9 py-2 pr-3 text-sm bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-teampal-500"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-teampal-500 rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-auto">
              <DropdownMenuItem className="p-3 cursor-pointer">
                <div>
                  <p className="font-medium text-sm">New agent templates available</p>
                  <p className="text-xs text-muted-foreground mt-1">Explore 10+ new agent templates for marketing and sales.</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer">
                <div>
                  <p className="font-medium text-sm">Task completed</p>
                  <p className="text-xs text-muted-foreground mt-1">Design Manager has completed the task "Create brand guidelines".</p>
                  <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {onCreateClick && (
          <Button 
            onClick={onCreateClick} 
            className="bg-teampal-500 hover:bg-teampal-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Agent
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
