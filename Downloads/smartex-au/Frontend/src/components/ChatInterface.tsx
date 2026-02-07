import React, { useState, useRef, useEffect } from 'react';
// 1. We import the function from your services folder
import { getAIResponse } from '../services/api';
import { Message } from '../types';
import { SYLLABUS_CONTEXT } from '../constants';

interface ChatInterfaceProps {
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to your Smartex AU Study Assistant. I'm trained on your current Unit 1 notes. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    // Prevent sending empty messages or if already loading
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput(''); // Clear input box
    
    // Add user message to screen immediately
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      // 2. Combine the Syllabus Context with the User's question
      // This helps the AI understand what it should teach.
      const fullPrompt = `System Context: ${SYLLABUS_CONTEXT}\n\nUser Question: ${userText}`;

      // 3. Call your new GitHub API function
      const responseText = await getAIResponse(fullPrompt);

      // 4. Add the AI's response to the screen
      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      } else {
        throw new Error("Empty response from AI");
      }

    } catch (e) {
      console.error("AI Request Failed:", e);
      setMessages(prev => [...prev, { role: 'model', text: 'Connection failed. Please check your network or API Key.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white flex-1 animate-fadeIn">
      {/* Header */}
      <div className="p-8 border-b border-gray-100 bg-[#003366] text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
            <i className="fas fa-microchip text-sm"></i>
          </div>
          <div>
            <h3 className="text-white font-black text-sm tracking-tight">AI Academic Tutor</h3>
            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
               <span className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Active Support</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <i className="fas fa-times text-xs"></i>
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-gray-50/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-5 rounded-[2rem] max-w-[90%] text-sm font-bold leading-relaxed shadow-sm ${
              m.role === 'user' ? 'bg-[#003366] text-white rounded-tr-none' : 'bg-white border border-gray-100 text-black rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        
        {/* Loading Bubble Animation */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-2 shadow-sm">
              <div className="w-1.5 h-1.5 bg-[#003366] rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-[#003366] rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-[#003366] rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white border-t border-gray-100">
        <div className="relative flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a clarifying question..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003366]/50"
          />
          <button 
            onClick={handleSend}
            className="w-12 h-12 bg-[#003366] text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all shadow-lg active:scale-90"
          >
            <i className="fas fa-paper-plane text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;