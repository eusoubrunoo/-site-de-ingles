import React, { useState } from 'react';
import { AppTab } from './types';
import NavBar from './components/NavBar';
import DailyLessonView from './components/DailyLessonView';
import ChatView from './components/ChatView';
import PronunciationView from './components/PronunciationView';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.DAILY);

  const renderContent = () => {
    switch (currentTab) {
      case AppTab.DAILY:
        return <DailyLessonView />;
      case AppTab.CHAT:
        return <ChatView />;
      case AppTab.PRONUNCIATION:
        return <PronunciationView />;
      default:
        return <DailyLessonView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <main className="max-w-md mx-auto min-h-screen bg-white shadow-xl overflow-hidden relative">
        {renderContent()}
        <NavBar currentTab={currentTab} onTabChange={setCurrentTab} />
      </main>
    </div>
  );
};

export default App;