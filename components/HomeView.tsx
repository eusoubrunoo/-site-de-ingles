import React, { useMemo } from 'react';
import { EnglishLevel, AppTab } from '../types';
import { Flame, Diamond, Heart, Lock, Star, ChevronRight, Trophy, Crown } from 'lucide-react';

interface HomeViewProps {
  currentLevel: EnglishLevel;
  onLevelChange: (level: EnglishLevel) => void;
  onNavigate: (tab: AppTab) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ currentLevel, onLevelChange, onNavigate }) => {
  
  // Generate levels programmatically
  const levels = useMemo(() => {
    const TOTAL_LEVELS = 60;
    // Updated color palette for a more cohesive look
    const colors = [
      'bg-green-500 shadow-green-600', 
      'bg-cyan-500 shadow-cyan-600', 
      'bg-indigo-500 shadow-indigo-600', 
      'bg-purple-500 shadow-purple-600', 
      'bg-pink-500 shadow-pink-600', 
      'bg-orange-500 shadow-orange-600'
    ];
    
    return Array.from({ length: TOTAL_LEVELS }, (_, i) => {
      const num = i + 1;
      const topics = ["Fundamentos", "Frases Básicas", "Comida & Bebida", "Viagens", "Família", "Trabalho", "Hobbies", "Cidade", "Sentimentos", "Futuro"];
      
      return {
        id: `Unidade ${num}`,
        number: num,
        colorClass: colors[i % colors.length], // Contains bg and shadow color
        label: `Unidade ${num}`,
        desc: topics[i % topics.length]
      };
    });
  }, []);

  const handleLevelClick = (id: EnglishLevel, isUnlocked: boolean) => {
    if (isUnlocked) {
      onLevelChange(id);
    }
  };

  const handleStart = () => {
    onNavigate(AppTab.DAILY);
  };

  const currentLevelNum = parseInt(currentLevel.replace(/\D/g, '')) || 1;

  return (
    <div className="bg-dot-pattern min-h-full pb-32">
      {/* Top Bar Stats - Sticky Glass */}
      <div className="glass border-b border-gray-200/60 sticky top-0 z-40 px-4 py-3 shadow-sm">
         <div className="flex justify-between items-center max-w-md mx-auto">
             <div className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100/50 transition cursor-pointer border border-transparent hover:border-gray-200">
                <img src="https://flagcdn.com/w40/us.png" alt="English" className="w-8 h-6 rounded shadow-sm object-cover" />
                <span className="font-extrabold text-gray-600 text-sm hidden sm:block">Inglês</span>
             </div>
             
             <div className="flex items-center gap-4 sm:gap-6 font-black text-sm">
               <div className="flex items-center gap-1.5 text-orange-500 hover:scale-110 transition-transform cursor-pointer">
                  <Flame size={20} fill="currentColor" strokeWidth={2.5} />
                  <span>5</span>
               </div>
               <div className="flex items-center gap-1.5 text-blue-400 hover:scale-110 transition-transform cursor-pointer">
                  <Diamond size={20} fill="currentColor" strokeWidth={2.5} />
                  <span>450</span>
               </div>
               <div className="flex items-center gap-1.5 text-red-500 hover:scale-110 transition-transform cursor-pointer">
                  <Heart size={20} fill="currentColor" strokeWidth={2.5} />
                  <span>5</span>
               </div>
             </div>
         </div>
      </div>

      {/* Path Area */}
      <div className="flex flex-col items-center pt-8 gap-4 max-w-md mx-auto px-4 overflow-hidden">
        {levels.map((lvl, index) => {
          const levelNum = lvl.number;
          const isSelected = levelNum === currentLevelNum;
          const isUnlocked = levelNum <= currentLevelNum;
          const isCompleted = levelNum < currentLevelNum;
          
          // Zig-zag logic
          let offsetClass = 'translate-x-0';
          if (index % 4 === 1) offsetClass = 'translate-x-14';
          if (index % 4 === 3) offsetClass = '-translate-x-14';

          return (
            <div key={lvl.id} className={`flex flex-col items-center relative z-10 ${offsetClass} mb-2`}>
              {/* Unit Section Header (Every 5 levels) */}
              {index % 5 === 0 && (
                <div className={`absolute -top-12 whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-6 shadow-sm border ${
                   isUnlocked ? 'bg-white text-gray-500 border-gray-200' : 'bg-gray-200 text-gray-400 border-transparent'
                } ${offsetClass === 'translate-x-14' ? '-translate-x-14' : offsetClass === '-translate-x-14' ? 'translate-x-14' : ''}`}>
                   Seção {Math.floor(index / 5) + 1}
                </div>
              )}

              <div className="relative group">
                {/* Connector Line (Thicker, behind) */}
                {index < levels.length - 1 && (
                  <div className={`absolute top-1/2 left-1/2 w-4 h-28 -translate-x-1/2 -z-10 rounded-full transition-colors duration-500 ${isCompleted ? 'bg-yellow-400' : 'bg-gray-200'}`} />
                )}
                
                <button
                  onClick={() => handleLevelClick(lvl.id, isUnlocked)}
                  className={`
                    w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all duration-300 relative outline-none
                    ${isSelected 
                      ? 'bg-white ring-[8px] ring-blue-400/20 scale-110 z-20 shadow-xl' 
                      : isUnlocked 
                        ? isCompleted 
                           ? 'bg-gradient-to-b from-yellow-400 to-yellow-500 shadow-[0_6px_0_0_#ca8a04] active:shadow-none active:translate-y-[6px]'
                           : `bg-gradient-to-b ${lvl.colorClass.split(' ')[0]} to-${lvl.colorClass.split(' ')[0].replace('500','600')} shadow-[0_6px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[6px]` 
                        : 'bg-gray-200 shadow-[0_6px_0_0_rgba(0,0,0,0.05)]'
                    }
                  `}
                >
                  {isSelected ? (
                     <div className="relative">
                        <Star size={44} className="text-yellow-400 fill-yellow-400 animate-pulse" strokeWidth={3} />
                        <div className="absolute inset-0 bg-yellow-400 blur-lg opacity-30"></div>
                     </div>
                  ) : isCompleted ? (
                     <Star size={34} className="text-white fill-white drop-shadow-sm" strokeWidth={3} />
                  ) : isUnlocked ? (
                     <span className="text-white font-black text-3xl font-mono drop-shadow-md">{lvl.number}</span>
                  ) : (
                     <Lock size={26} className="text-gray-400/40" strokeWidth={3} />
                  )}
                  
                  {/* "Current" Crown Float */}
                  {isSelected && (
                    <div className="absolute -top-12 animate-float z-30 w-32 flex justify-center pointer-events-none">
                      <div className="bg-white px-3 py-1.5 rounded-xl shadow-xl border-2 border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest whitespace-nowrap flex items-center gap-1">
                        <Crown size={12} fill="currentColor" /> Atual
                      </div>
                      <div className="w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-blue-100 rotate-45 absolute bottom-[-5px] left-1/2 -translate-x-1/2"></div>
                    </div>
                  )}
                </button>
              </div>

              {/* Label below unit */}
              <div className="mt-2 text-center h-8">
                {isSelected && (
                   <h3 className="font-extrabold text-sm text-gray-700 animate-slide-up">{lvl.desc}</h3>
                )}
              </div>

              {/* Floating Start Button */}
              {isSelected && (
                 <div className="absolute top-2 left-20 ml-4 z-30 animate-slide-up">
                  <button 
                    onClick={handleStart}
                    className="group bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-2xl font-black uppercase tracking-wider shadow-lg shadow-gray-900/20 border-b-4 border-gray-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 text-sm whitespace-nowrap"
                  >
                    Bora! <ChevronRight size={18} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
        
        {/* End of Path Trophy */}
        <div className="mt-8 flex flex-col items-center opacity-60 pb-8">
           <Trophy size={64} className="text-yellow-500 mb-4 drop-shadow-sm" />
           <p className="font-black text-gray-400 text-center uppercase tracking-wide">Mais níveis em breve!</p>
        </div>
      </div>
    </div>
  );
};

export default HomeView;