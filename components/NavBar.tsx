import React from 'react';
import { AppTab } from '../types';
import { BookOpen, MessageCircle, Mic } from 'lucide-react';

interface NavBarProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <button
        onClick={() => onTabChange(AppTab.DAILY)}
        className={`flex flex-col items-center gap-1 transition-colors ${
          currentTab === AppTab.DAILY ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <BookOpen size={24} />
        <span className="text-xs font-medium">Lições</span>
      </button>
      
      <button
        onClick={() => onTabChange(AppTab.CHAT)}
        className={`flex flex-col items-center gap-1 transition-colors ${
          currentTab === AppTab.CHAT ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <MessageCircle size={24} />
        <span className="text-xs font-medium">Chat AI</span>
      </button>

      <button
        onClick={() => onTabChange(AppTab.PRONUNCIATION)}
        className={`flex flex-col items-center gap-1 transition-colors ${
          currentTab === AppTab.PRONUNCIATION ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <Mic size={24} />
        <span className="text-xs font-medium">Pronúncia</span>
      </button>
    </nav>
  );
};

export default NavBar;