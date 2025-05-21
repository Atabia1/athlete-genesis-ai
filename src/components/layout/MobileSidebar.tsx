
import React from 'react';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

/**
 * Mobile Sidebar Component
 * 
 * A responsive sidebar for mobile devices
 */
export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold">Athlete Genesis AI</h2>
            <button 
              onClick={onClose} 
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
