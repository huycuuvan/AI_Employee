import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';

interface ChatLayoutProps {
  children: React.ReactNode;
  leftSidebar: React.ReactNode;
  rightSidebar: React.ReactNode;
}

const SIDEBAR_WIDTH = 256; // 64 * 4

const ChatLayout = ({ children, leftSidebar, rightSidebar }: ChatLayoutProps) => {
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false); // trạng thái Drawer sidebar trái

  return (
    <div className="min-h-screen bg-background relative">
      {/* Sidebar trái fixed cho desktop */}
      {showLeft && (
        <div className="hidden md:block fixed top-0 left-0 h-screen w-64 z-30 border-r bg-sidebar">
          {leftSidebar}
        </div>
      )}
      {/* Sidebar Drawer cho mobile */}
      <div className="md:hidden">
        {/* Nút menu mở Drawer */}
        <button
          className="absolute top-2 left-2 z-40 p-2 rounded hover:bg-muted bg-white shadow"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        {/* Drawer sidebar trái */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/30" onClick={() => setDrawerOpen(false)} />
            {/* Sidebar content */}
            <div className="relative w-64 h-full bg-sidebar border-r shadow-xl animate-slideInLeft">
              <button
                className="absolute top-2 right-2 z-10 p-1 rounded hover:bg-muted"
                onClick={() => setDrawerOpen(false)}
                aria-label="Đóng sidebar"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {leftSidebar}
            </div>
          </div>
        )}
      </div>
      {/* Sidebar phải fixed */}
      {showRight && (
        <div className="hidden lg:block fixed top-0 right-0 h-screen w-64 z-30 border-l bg-sidebar">
          <button
            className="absolute top-2 left-2 z-10 p-1 rounded hover:bg-muted block lg:hidden"
            onClick={() => setShowRight(false)}
            title="Hide sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          {rightSidebar}
        </div>
      )}
      {!showRight && (
        <button
          className="block fixed right-0 top-2 z-40 p-1 rounded hover:bg-muted border bg-background"
          onClick={() => setShowRight(true)}
          title="Show sidebar"
          style={{ marginRight: 0 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {/* Main chat content */}
      <div className="flex flex-col h-screen min-h-0 md:ml-64 lg:mr-64">
        {children}
      </div>
    </div>
  );
};

export default ChatLayout;

/* Thêm animation cho Drawer */
// tailwind.config.js: theme.extend.animation.slideInLeft = 'slide-in-left 0.3s ease-out forwards'
// @layer utilities { @keyframes slide-in-left { from { transform: translateX(-100%); } to { transform: translateX(0); } } }
