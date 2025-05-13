
import React from 'react';

interface ChatLayoutProps {
  children: React.ReactNode;
  leftSidebar: React.ReactNode;
  rightSidebar: React.ReactNode;
}

const ChatLayout = ({ children, leftSidebar, rightSidebar }: ChatLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left sidebar - Agent list */}
      <div className="w-64 border-r bg-background overflow-auto">
        {leftSidebar}
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-accent/5">
        {children}
      </div>
      
      {/* Right sidebar - Chat history */}
      <div className="w-64 border-l bg-background overflow-auto">
        {rightSidebar}
      </div>
    </div>
  );
};

export default ChatLayout;
