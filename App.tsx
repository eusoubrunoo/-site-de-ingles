import React, { useState } from 'react';
import { AppTab, EnglishLevel } from './types';
import NavBar from './components/NavBar';
import DailyLessonView from './components/DailyLessonView';
import ChatView from './components/ChatView';
import PronunciationView from './components/PronunciationView';
import HomeView from './components/HomeView';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.HOME);
  const [currentLevel, setCurrentLevel] = useState<EnglishLevel>('Unidade 1');

  const renderContent = () => {
    switch (currentTab) {
      case AppTab.HOME:
        return (
          <HomeView 
            currentLevel={currentLevel} 
            onLevelChange={setCurrentLevel} 
            onNavigate={setCurrentTab} 
          />
        );
      case AppTab.DAILY:
        return <DailyLessonView level={currentLevel} />;
      case AppTab.CHAT:
        return <ChatView level={currentLevel} />;
      case AppTab.PRONUNCIATION:
        return <PronunciationView level={currentLevel} />;
      default:
        return (
          <HomeView 
            currentLevel={currentLevel} 
            onLevelChange={setCurrentLevel} 
            onNavigate={setCurrentTab} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900 font-sans flex justify-center">
      <main className="w-full max-w-lg min-h-screen bg-white shadow-2xl relative flex flex-col">
        {/* We removed the global Header because it is now integrated into HomeView */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {renderContent()}
        </div>
        <NavBar currentTab={currentTab} onTabChange={setCurrentTab} />
      </main>
    </div>
  );
};

export default App;