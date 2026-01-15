import React, { useEffect, useState } from 'react';
import { DailyPhrase, EnglishLevel } from '../types';
import { getDailyLesson } from '../services/geminiService';
import { Volume2, RefreshCw, Star, ArrowRight, Lightbulb, Globe } from 'lucide-react';

interface DailyLessonViewProps {
  level: EnglishLevel;
}

const DailyLessonView: React.FC<DailyLessonViewProps> = ({ level }) => {
  const [phrases, setPhrases] = useState<DailyPhrase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLesson = async () => {
    setLoading(true);
    try {
      const data = await getDailyLesson(level);
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
  }, [level]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-8 bg-dot-pattern">
        <div className="relative">
           <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping opacity-75"></div>
           <div className="relative bg-white p-6 rounded-full border-4 border-blue-100 shadow-2xl">
              <RefreshCw className="animate-spin text-blue-500" size={48} />
           </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-2xl font-black text-gray-700 tracking-tight">Criando sua aula...</p>
          <div className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
            {level}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dot-pattern min-h-full p-4 pb-32 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end px-2 pt-2">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Lição do Dia</h1>
          <div className="flex items-center gap-2 mt-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">{level}</p>
          </div>
        </div>
        <button 
          onClick={fetchLesson}
          className="bg-white border-2 border-gray-200 border-b-4 text-gray-400 hover:text-blue-500 hover:border-blue-200 p-3 rounded-2xl transition-all active:border-b-2 active:translate-y-[2px]"
          title="Novas frases"
        >
          <RefreshCw size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Cards List */}
      <div className="space-y-8">
        {phrases.map((item, index) => (
          <div key={index} className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border-2 border-gray-100 border-b-[8px] hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
            {/* Card Top Strip */}
            <div className="h-3 w-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-blue-100">
                  Frase {index + 1}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(item.phrase);
                  }}
                  className="text-blue-500 hover:text-white hover:bg-blue-500 bg-blue-50 p-3 rounded-2xl transition-all active:scale-95 shadow-sm"
                >
                  <Volume2 size={24} strokeWidth={3} />
                </button>
              </div>

              <div className="mb-8 text-center sm:text-left">
                <h2 className="text-3xl sm:text-4xl font-black text-gray-800 mb-3 leading-tight tracking-tight">"{item.phrase}"</h2>
                <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <span className="text-gray-400 font-bold text-xs uppercase">🗣 Pronúncia:</span>
                  <p className="text-gray-600 font-bold text-sm">{item.pronunciationTips}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col bg-indigo-50/50 rounded-2xl p-5 border-2 border-indigo-50 hover:border-indigo-100 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe size={16} className="text-indigo-400" />
                    <span className="text-xs font-black text-indigo-400 uppercase tracking-wide">Tradução</span>
                  </div>
                  <span className="text-xl font-bold text-indigo-900">{item.translation}</span>
                </div>
                
                <div className="flex flex-col bg-amber-50/50 rounded-2xl p-5 border-2 border-amber-50 hover:border-amber-100 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                     <Lightbulb size={16} className="text-amber-500" />
                     <span className="text-xs font-black text-amber-500 uppercase tracking-wide">Por que assim?</span>
                  </div>
                  <p className="text-amber-900 font-bold text-sm leading-relaxed opacity-90">{item.explanation}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Card */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-[2.5rem] p-8 text-white text-center shadow-xl shadow-green-200 border-b-8 border-green-700 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent)]"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="mb-4 inline-block relative">
             <Star className="text-yellow-300 drop-shadow-md animate-bounce-slight relative z-10" fill="currentColor" size={56} />
             <div className="absolute inset-0 bg-yellow-300 blur-xl opacity-50 animate-pulse"></div>
          </div>
          <h3 className="font-black text-3xl mb-2 tracking-tight">Lição Completa!</h3>
          <p className="text-green-100 font-bold mb-8 text-lg">Você ganhou +15 XP hoje.</p>
          
          <button onClick={fetchLesson} className="w-full bg-white text-green-600 font-black text-lg py-4 rounded-2xl shadow-lg border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3 hover:bg-gray-50">
             Continuar <ArrowRight size={24} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyLessonView;