import React, { useEffect, useState } from 'react';
import { DailyPhrase } from '../types';
import { getDailyLesson } from '../services/geminiService';
import { Volume2, RefreshCw, Star } from 'lucide-react';

const DailyLessonView: React.FC = () => {
  const [phrases, setPhrases] = useState<DailyPhrase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLesson = async () => {
    setLoading(true);
    try {
      const data = await getDailyLesson();
      setPhrases(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-gray-500 animate-pulse">Criando sua lição personalizada...</p>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lição do Dia</h1>
          <p className="text-gray-500 text-sm">Aprenda 3 novas frases hoje</p>
        </div>
        <button 
          onClick={fetchLesson}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          title="Novas frases"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {phrases.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            
            <div className="flex justify-between items-start mb-3">
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                Frase {index + 1}
              </span>
              <button 
                onClick={() => speak(item.phrase)}
                className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
              >
                <Volume2 size={24} />
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-1">{item.phrase}</h2>
            <p className="text-gray-500 italic mb-4">{item.pronunciationTips}</p>

            <div className="space-y-2">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 font-medium">Tradução:</p>
                <p className="text-gray-800">{item.translation}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Explicação:</p>
                <p className="text-blue-800 text-sm">{item.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white text-center shadow-lg">
        <Star className="mx-auto mb-2 text-yellow-300" fill="currentColor" size={32} />
        <h3 className="font-bold text-lg">Continue assim!</h3>
        <p className="text-indigo-100 text-sm opacity-90">Volte amanhã para mais frases.</p>
      </div>
    </div>
  );
};

export default DailyLessonView;