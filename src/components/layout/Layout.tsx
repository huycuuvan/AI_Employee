
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

const Layout = ({ children, title, showCreateButton = false, onCreateClick }: LayoutProps) => {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Header 
          title={title}
          onCreateClick={showCreateButton ? onCreateClick : undefined} 
        />
        <main className="flex-1 p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
