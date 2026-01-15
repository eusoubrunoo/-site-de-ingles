import React from 'react';
import { EnglishLevel } from '../types';
import { Flame, Diamond, Heart, Lock, Star } from 'lucide-react';

interface HeaderProps {
  currentLevel: EnglishLevel;
  onLevelChange: (level: EnglishLevel) => void;
}

const Header: React.FC<HeaderProps> = ({ currentLevel, onLevelChange }) => {
  const levels: { id: EnglishLevel; number: number; color: string; label: string }[] = [
    { id: 'Unidade 1', number: 1, color: 'bg-green-500', label: 'Intro' },
    { id: 'Unidade 2', number: 2, color: 'bg-teal-500', label: 'Básico' },
    { id: 'Unidade 3', number: 3, color: 'bg-red-500', label: 'Rotina' },
    { id: 'Unidade 4', number: 4, color: 'bg-orange-500', label: 'Viagem' },
    { id: 'Unidade 5', number: 5, color: 'bg-blue-500', label: 'Futuro' },
    { id: 'Unidade 6', number: 6, color: 'bg-purple-500', label: 'Mestre' },
  ];

  return (
    <div className="bg-white sticky top-0 z-40 shadow-sm">
      {/* Top Bar Stats */}
      <div className="border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
           <div className="flex items-center gap-1 hover:bg-gray-100 p-1.5 rounded-xl cursor-pointer transition">
              <img src="https://flagcdn.com/w40/us.png" alt="English" className="w-7 h-5 rounded shadow-sm" />
           </div>
           
           <div className="flex items-center gap-6 font-extrabold text-sm">
             <div className="flex items-center gap-1.5 text-orange-500">
                <Flame size={22} fill="currentColor" strokeWidth={2.5} />
                <span>5</span>
             </div>
             <div className="flex items-center gap-1.5 text-blue-400">
                <Diamond size={22} fill="currentColor" strokeWidth={2.5} />
                <span>450</span>
             </div>
             <div className="flex items-center gap-1.5 text-red-500">
                <Heart size={22} fill="currentColor" strokeWidth={2.5} />
                <span>5</span>
             </div>
           </div>
        </div>
      </div>

      {/* Level Path Selector */}
      <div className="w-full py-4 overflow-x-auto scrollbar-hide bg-gray-50 border-b border-gray-200">
         <div className="flex items-center px-6 gap-8 min-w-max mx-auto">
            {levels.map((lvl, index) => {
              const isSelected = currentLevel === lvl.id;
              const currentIndex = levels.findIndex(l => l.id === currentLevel);
              const isUnlocked = index <= currentIndex;

              return (
                <div key={lvl.id} className="relative flex flex-col items-center group">
                  <button
                    onClick={() => onLevelChange(lvl.id)}
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 outline-none
                      ${isSelected 
                        ? 'bg-white ring-4 ring-offset-2 ring-blue-400 scale-110 shadow-xl' 
                        : isUnlocked 
                          ? `${lvl.color} shadow-lg shadow-gray-300/50 hover:scale-105` 
                          : 'bg-gray-200 shadow-inner'
                      }
                    `}
                  >
                    {isSelected ? (
                       <Star size={32} className="text-yellow-400 fill-yellow-400 animate-pulse" />
                    ) : isUnlocked ? (
                       <span className="text-white font-black text-2xl font-mono">{lvl.number}</span>
                    ) : (
                       <Lock size={24} className="text-gray-400" />
                    )}
                    
                    {/* 3D bottom effect */}
                    {isUnlocked && !isSelected && (
                       <div className="absolute inset-0 rounded-full border-b-4 border-black/10"></div>
                    )}
                  </button>

                  {/* Connecting Line */}
                  {index < levels.length - 1 && (
                    <div className={`absolute top-8 left-[4rem] w-8 h-2 -z-0 rounded-full ${index < currentIndex ? 'bg-yellow-400' : 'bg-gray-200'}`} />
                  )}

                  {/* Label */}
                  <div className={`
                    mt-3 text-xs font-extrabold uppercase tracking-wide px-2 py-1 rounded-md transition-opacity duration-300
                    ${isSelected ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}
                  `}>
                    {lvl.label}
                  </div>
                </div>
              );
            })}
         </div>
      </div>
    </div>
  );
};

export default Header;