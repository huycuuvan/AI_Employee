import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Plus, Menu } from 'lucide-react';
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
  onMenuClick?: () => void;
}

const Header = ({ title, onCreateClick, onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative hidden md:block max-w-md w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="search"
            placeholder="Search..." 
            className="w-full pl-9 py-2 pr-3 text-sm bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-teampal-500"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>

        {onCreateClick && (
          <Button 
            variant="default" 
            size="sm"
            className="hidden md:flex items-center gap-2 bg-teampal-500 hover:bg-teampal-600"
            onClick={onCreateClick}
          >
            <Plus className="h-4 w-4" />
            Create
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700">H</div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
