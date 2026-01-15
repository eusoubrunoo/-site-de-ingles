import React, { useState, useRef, useEffect } from 'react';
import { Message, EnglishLevel } from '../types';
import { chatWithTutor } from '../services/geminiService';
import { Send, User, Bot, Sparkles } from 'lucide-react';

interface ChatViewProps {
  level: EnglishLevel;
}

const ChatView: React.FC<ChatViewProps> = ({ level }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! 👋 Welcome to **${level}**.\nEstou pronto para praticar. Let's talk!`,
      timestamp: Date.now()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithTutor(history, userMsg.text, level);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I didn't catch that.",
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-[#f8fafc]">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-28">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white border-2 border-gray-200 text-green-500'
            }`}>
              {msg.role === 'user' ? <User size={20} strokeWidth={2.5} /> : <Bot size={22} strokeWidth={2.5} />}
            </div>
            
            <div
              className={`max-w-[80%] p-4 rounded-2xl shadow-sm relative text-[15px] leading-relaxed font-bold ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white text-gray-700 border-2 border-gray-200 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex items-end gap-3">
             <div className="w-10 h-10 rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0 text-green-500 shadow-sm">
               <Bot size={22} strokeWidth={2.5} />
             </div>
             <div className="bg-white p-4 rounded-2xl rounded-bl-none border-2 border-gray-200 shadow-sm">
               <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
                 <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                 <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100">
        <div className="max-w-2xl mx-auto relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite em Inglês..."
            className="w-full pl-5 pr-14 py-4 rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all font-bold text-gray-700 placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2.5 top-2.5 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
          >
            <Send size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;