import React, { useState, useRef, useEffect } from 'react';
import { analyzePronunciation } from '../services/geminiService';
import { PronunciationFeedback, EnglishLevel } from '../types';
import { Mic, Square, Play, RefreshCw, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

interface PronunciationViewProps {
  level: EnglishLevel;
}

// Basic hardcoded phrases for low levels
const PHRASES_BY_LEVEL: Record<string, string[]> = {
  'Unidade 1': [
    "I eat bread.",
    "She drinks water.",
    "Hello, good morning.",
    "A man and a woman.",
    "I am from Brazil."
  ],
  'Unidade 2': [
    "The cat is black.",
    "I have a red car.",
    "Do you speak English?",
    "My dog is happy.",
    "This is my house."
  ],
  'Unidade 3': [
    "I go to work every day.",
    "My sister likes coffee.",
    "Where is the supermarket?",
    "I play soccer on Sundays.",
    "What time is it?"
  ],
  'Unidade 4': [
    "I booked a hotel room.",
    "Can you help me find the airport?",
    "The food was delicious.",
    "I traveled to London last year.",
    "How much is the ticket?"
  ],
  'Unidade 5': [
    "I will start a new job soon.",
    "I think that is a great idea.",
    "We are going to travel next month.",
    "In my opinion, it is important.",
    "If I study, I will learn."
  ],
  'Unidade 6': [
    "Actions speak louder than words.",
    "I'm feeling under the weather.",
    "It's a piece of cake.",
    "Let's get down to business.",
    "Better late than never."
  ]
};

const PronunciationView: React.FC<PronunciationViewProps> = ({ level }) => {
  // If no phrases exist for this specific level (e.g. Unidade 50), default to generic or level 1 for now
  // Ideally we would fetch these from AI too, but fallback is safer for quick scaling
  const [phrases, setPhrases] = useState<string[]>(PHRASES_BY_LEVEL[level] || [
    "I love learning English.",
    "This is a beautiful day.",
    "Can you help me please?",
    "I want to be fluent.",
    "Practice makes perfect."
  ]);
  
  const [targetPhrase, setTargetPhrase] = useState(phrases[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Logic to switch phrases when level changes
    const newPhrases = PHRASES_BY_LEVEL[level] || [
        "I love learning English.",
        "This is a beautiful day.",
        "Can you help me please?",
        "I want to be fluent.",
        "Practice makes perfect."
    ];
    setPhrases(newPhrases);
    setTargetPhrase(newPhrases[0]);
    setFeedback(null);
  }, [level]);

  const startRecording = async () => {
    setFeedback(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : 'audio/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await handleAudioUpload(audioBlob, mimeType);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Erro ao acessar o microfone. Verifique suas permissões.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (blob: Blob, mimeType: string) => {
    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const result = await analyzePronunciation(base64Audio, mimeType, targetPhrase, level);
        setFeedback(result);
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
    }
  };

  const changePhrase = () => {
    const currentIndex = phrases.indexOf(targetPhrase);
    const nextIndex = (currentIndex + 1) % phrases.length;
    setTargetPhrase(phrases[nextIndex]);
    setFeedback(null);
  };

  const playPhrase = () => {
    const utterance = new SpeechSynthesisUtterance(targetPhrase);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-4 pb-32 max-w-xl mx-auto flex flex-col items-center">
      <div className="w-full mb-8 text-center">
         <span className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full text-indigo-600 font-extrabold text-sm uppercase tracking-wide border border-indigo-100">
            <Sparkles size={14} /> {level}
         </span>
      </div>
      
      {/* Main Interaction Card */}
      <div className="w-full bg-white rounded-3xl p-8 shadow-xl shadow-gray-100/50 border-2 border-gray-100 relative overflow-hidden">
        
        {/* Phrase Display */}
        <div className="text-center mb-8 relative z-10">
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">Fale em voz alta</p>
          <h2 className="text-3xl font-black text-gray-800 leading-tight">
             "{targetPhrase}"
          </h2>
        </div>
        
        {/* Controls */}
        <div className="flex justify-center gap-3 mb-10 relative z-10">
          <button 
            onClick={playPhrase}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors border-2 border-transparent hover:border-blue-200"
          >
            <Play size={18} fill="currentColor" /> Ouvir
          </button>
          <button 
            onClick={changePhrase}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-500 rounded-xl font-bold hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-gray-200"
          >
            <RefreshCw size={18} strokeWidth={2.5} /> Pular
          </button>
        </div>

        {/* Big Mic Button Area */}
        <div className="flex justify-center relative z-10 h-32 items-center">
          {!isRecording && !isAnalyzing && (
            <button 
              onClick={startRecording}
              className="group relative w-24 h-24 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus:outline-none"
            >
              <div className="absolute inset-0 bg-blue-500 rounded-2xl shadow-[0_8px_0_0_#1d4ed8] group-active:shadow-none group-active:translate-y-2 transition-all"></div>
              <Mic size={40} className="text-white relative z-10" strokeWidth={2.5} />
            </button>
          )}

          {isRecording && (
            <button 
              onClick={stopRecording}
              className="group relative w-24 h-24 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus:outline-none"
            >
              <div className="absolute inset-0 bg-red-500 rounded-2xl shadow-[0_8px_0_0_#b91c1c] group-active:shadow-none group-active:translate-y-2 transition-all animate-pulse"></div>
              <div className="absolute -inset-4 border-4 border-red-100 rounded-3xl animate-ping opacity-50"></div>
              <Square size={36} fill="currentColor" className="text-white relative z-10" />
            </button>
          )}

          {isAnalyzing && (
            <div className="relative w-24 h-24 flex items-center justify-center">
               <div className="absolute inset-0 border-4 border-gray-100 rounded-2xl"></div>
               <div className="absolute inset-0 border-4 border-blue-500 rounded-2xl border-t-transparent animate-spin"></div>
               <Sparkles className="text-blue-500 animate-pulse" size={32} />
            </div>
          )}
        </div>
        
        <p className={`text-center mt-6 font-bold text-sm transition-colors ${isRecording ? 'text-red-500' : 'text-gray-400'}`}>
          {isRecording ? "Gravando..." : isAnalyzing ? "A IA está ouvindo..." : "Toque para gravar"}
        </p>
      </div>

      {/* Feedback Card */}
      {feedback && (
        <div className={`w-full mt-6 rounded-3xl p-6 border-b-8 animate-fade-in-up transform transition-all ${
          feedback.score > 80 ? 'bg-green-100 border-green-300 text-green-900' : 'bg-orange-50 border-orange-200 text-orange-900'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${feedback.score > 80 ? 'bg-green-200' : 'bg-orange-200'}`}>
                 {feedback.score > 80 ? (
                  <CheckCircle className={feedback.score > 80 ? 'text-green-600' : 'text-orange-600'} size={24} strokeWidth={3} />
                ) : (
                  <AlertCircle className={feedback.score > 80 ? 'text-green-600' : 'text-orange-600'} size={24} strokeWidth={3} />
                )}
              </div>
              <span className="font-black text-lg uppercase tracking-wide">
                {feedback.score > 80 ? 'Excelente!' : 'Continue tentando'}
              </span>
            </div>
            <div className={`text-3xl font-black ${feedback.score > 80 ? 'text-green-600' : 'text-orange-500'}`}>
              {feedback.score}%
            </div>
          </div>
          
          <div className="bg-white/60 rounded-2xl p-4 backdrop-blur-sm">
            <p className="font-bold leading-relaxed opacity-90">{feedback.feedback}</p>
            {feedback.correction && (
              <div className="mt-3 pt-3 border-t border-black/5">
                <p className="text-xs font-extrabold uppercase opacity-50 mb-1">Dica de Ouro</p>
                <p className="font-bold">{feedback.correction}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PronunciationView;