import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, Users, FileText, BookOpen, MessageSquare, 
  Settings, PlusCircle, BarChart, Folder, User, Star, GraduationCap, Sparkles, Map, Shield, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen border-r bg-sidebar w-64 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-teampal-500 text-white p-1 rounded">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold">XCEL BOT</h1>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-auto">
       
        
        <nav className="space-y-1">
          <NavItem to="/workspace" icon={<Folder className="h-4 w-4" />} label="Workspace" end />
          <NavItem to="/dashboard" icon={<LayoutGrid className="h-4 w-4" />} label="Dashboard" />
          <NavItem to="/agents" icon={<Users className="h-4 w-4" />} label="Agents" />
          <NavItem to="/tasks" icon={<FileText className="h-4 w-4" />} label="Tasks" />
          <NavItem to="/knowledge" icon={<BookOpen className="h-4 w-4" />} label="Knowledge Base" />
          <NavItem to="/chat" icon={<MessageSquare className="h-4 w-4" />} label="Group Chat" />
          <NavItem to="/analytics" icon={<BarChart className="h-4 w-4" />} label="Analytics" />
          <NavItem to="/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />
        </nav>
      </div>
      
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar-container bg-teampal-100 text-teampal-700">
            <div className="avatar-fallback">AI</div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">AI Workspace</p>
            <p className="text-xs text-muted-foreground truncate">Free Plan</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-2 focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700">H</div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/profile')}><User className="w-4 h-4 mr-2" />Profile</DropdownMenuItem>
              <DropdownMenuItem><Star className="w-4 h-4 mr-2" />Upgrade plan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><GraduationCap className="w-4 h-4 mr-2" />Tutorial</DropdownMenuItem>
              <DropdownMenuItem><Sparkles className="w-4 h-4 mr-2" />What's new</DropdownMenuItem>
              <DropdownMenuItem><Map className="w-4 h-4 mr-2" />Roadmap</DropdownMenuItem>
              <DropdownMenuItem><FileText className="w-4 h-4 mr-2" />Terms of Use</DropdownMenuItem>
              <DropdownMenuItem><Shield className="w-4 h-4 mr-2" />Privacy Policy</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600"><LogOut className="w-4 h-4 mr-2" />Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}

const NavItem = ({ to, icon, label, end }: NavItemProps) => (
  <NavLink 
    to={to} 
    end={end}
    className={({ isActive }) => 
      cn("sidebar-item", isActive && "active")
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export default Sidebar;
