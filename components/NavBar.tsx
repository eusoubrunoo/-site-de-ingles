import React from 'react';
import { AppTab } from '../types';
import { BookOpen, MessageCircle, Mic, Home } from 'lucide-react';

interface NavBarProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-gray-200/50 px-4 py-3 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex w-full max-w-md mx-auto justify-between items-center">
        <NavButton 
          isActive={currentTab === AppTab.HOME} 
          onClick={() => onTabChange(AppTab.HOME)}
          icon={<Home size={26} strokeWidth={currentTab === AppTab.HOME ? 2.8 : 2.5} />}
          label="Início"
        />
        <NavButton 
          isActive={currentTab === AppTab.DAILY} 
          onClick={() => onTabChange(AppTab.DAILY)}
          icon={<BookOpen size={26} strokeWidth={currentTab === AppTab.DAILY ? 2.8 : 2.5} />}
          label="Aprender"
        />
        <NavButton 
          isActive={currentTab === AppTab.CHAT} 
          onClick={() => onTabChange(AppTab.CHAT)}
          icon={<MessageCircle size={26} strokeWidth={currentTab === AppTab.CHAT ? 2.8 : 2.5} />}
          label="Chat"
        />
        <NavButton 
          isActive={currentTab === AppTab.PRONUNCIATION} 
          onClick={() => onTabChange(AppTab.PRONUNCIATION)}
          icon={<Mic size={26} strokeWidth={currentTab === AppTab.PRONUNCIATION ? 2.8 : 2.5} />}
          label="Falar"
        />
      </div>
    </nav>
  );
};

const NavButton = ({ isActive, onClick, icon, label }: { isActive: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95 ${
      isActive 
        ? 'text-blue-500' 
        : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    <div className={`transition-all duration-300 ${isActive ? '-translate-y-1 drop-shadow-sm' : ''}`}>
      {icon}
    </div>
    {/* Optional: Add a small indicator dot for active state instead of text color only */}
    {isActive && <div className="w-1 h-1 bg-blue-500 rounded-full mt-0.5"></div>}
  </button>
);

export default NavBar;