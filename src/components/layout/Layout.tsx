import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

const Layout = ({ children, title, showCreateButton = false, onCreateClick }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar fixed */}
      <div className="hidden md:block">
        <div className="fixed top-0 left-0 h-screen w-64 z-30 border-r bg-sidebar">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        <Header 
          title={title}
          onCreateClick={showCreateButton ? onCreateClick : undefined}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
