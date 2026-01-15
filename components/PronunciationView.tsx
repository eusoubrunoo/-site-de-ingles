import React, { useState, useRef } from 'react';
import { analyzePronunciation } from '../services/geminiService';
import { PronunciationFeedback } from '../types';
import { Mic, Square, Play, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

const SUGGESTED_PHRASES = [
  "I would like a cup of coffee.",
  "Where is the nearest subway station?",
  "It's nice to meet you.",
  "How much does this cost?",
  "Can you help me, please?"
];

const PronunciationView: React.FC = () => {
  const [targetPhrase, setTargetPhrase] = useState(SUGGESTED_PHRASES[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setFeedback(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Determine supported mime type
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
        
        // Stop all tracks to release microphone
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
        const result = await analyzePronunciation(base64Audio, mimeType, targetPhrase);
        setFeedback(result);
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
    }
  };

  const changePhrase = () => {
    const currentIndex = SUGGESTED_PHRASES.indexOf(targetPhrase);
    const nextIndex = (currentIndex + 1) % SUGGESTED_PHRASES.length;
    setTargetPhrase(SUGGESTED_PHRASES[nextIndex]);
    setFeedback(null);
  };

  const playPhrase = () => {
    const utterance = new SpeechSynthesisUtterance(targetPhrase);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-4 pb-24 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Treino de Pronúncia</h1>
      
      <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-center mb-6">
        <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-2">Tente dizer:</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">"{targetPhrase}"</h2>
        
        <div className="flex justify-center gap-4 mb-6">
          <button 
            onClick={playPhrase}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors text-sm font-medium"
          >
            <Play size={16} /> Ouvir
          </button>
          <button 
            onClick={changePhrase}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            <RefreshCw size={16} /> Mudar
          </button>
        </div>

        <div className="flex justify-center">
          {!isRecording && !isAnalyzing && (
            <button 
              onClick={startRecording}
              className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200 hover:scale-105 hover:bg-indigo-700 transition-all"
            >
              <Mic size={32} />
            </button>
          )}

          {isRecording && (
            <button 
              onClick={stopRecording}
              className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200 animate-pulse hover:scale-105 transition-all"
            >
              <Square size={32} fill="currentColor" />
            </button>
          )}

          {isAnalyzing && (
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-4 border-indigo-200 border-t-indigo-600 animate-spin">
            </div>
          )}
        </div>
        <p className="mt-4 text-sm text-gray-500 min-h-[20px]">
          {isRecording ? "Ouvindo... Toque para parar" : isAnalyzing ? "A IA está analisando..." : "Toque no microfone para falar"}
        </p>
      </div>

      {feedback && (
        <div className={`rounded-2xl p-6 border-2 animate-fade-in ${
          feedback.score > 80 ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            {feedback.score > 80 ? (
              <CheckCircle className="text-green-600" size={32} />
            ) : (
              <AlertCircle className="text-orange-600" size={32} />
            )}
            <div>
              <p className="text-sm text-gray-500 font-medium">Nota de Pronúncia</p>
              <p className={`text-2xl font-bold ${
                feedback.score > 80 ? 'text-green-700' : 'text-orange-700'
              }`}>{feedback.score}/100</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-gray-800 mb-1">Feedback:</p>
              <p className="text-gray-700 leading-relaxed">{feedback.feedback}</p>
            </div>
            
            {feedback.correction && (
              <div className="bg-white/50 p-3 rounded-lg mt-2">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Dica de correção</p>
                <p className="text-gray-800 font-medium">{feedback.correction}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PronunciationView;