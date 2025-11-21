import React, { useState } from 'react';
import { MessageCircle, Mic, X } from 'lucide-react';
import ChatBox from './ChatBox';
import VoiceAssistant from './VoiceAssistant';

const FloatingChatButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'voice' | null>(null);

  const handleChatClick = () => {
    if (activeMode === 'chat') {
      setActiveMode(null);
    } else {
      setActiveMode('chat');
    }
    setIsExpanded(false);
  };

  const handleVoiceClick = () => {
    if (activeMode === 'voice') {
      setActiveMode(null);
    } else {
      setActiveMode('voice');
    }
    setIsExpanded(false);
  };

  const handleClose = () => {
    setActiveMode(null);
    setIsExpanded(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-8 right-8 z-50">
        {/* Expanded Options */}
        {isExpanded && (
          <div className="absolute bottom-20 right-0 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 space-y-4 min-w-56 animate-fade-in-up transform-gpu">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-3xl" />
            
            <button
              onClick={handleChatClick}
              className="relative flex items-center space-x-4 w-full p-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-2xl transition-all duration-300 group transform hover:scale-105 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg">AI Chatbot</div>
                <div className="text-sm text-gray-600">Ask questions via text</div>
              </div>
            </button>
            
            <button
              onClick={handleVoiceClick}
              className="relative flex items-center space-x-4 w-full p-4 text-left hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-100 rounded-2xl transition-all duration-300 group transform hover:scale-105 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg">Voice Assistant</div>
                <div className="text-sm text-gray-600">Speak to get help</div>
              </div>
            </button>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`group relative w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 flex items-center justify-center ${
            isExpanded ? 'rotate-180 scale-110' : ''
          }`}
          aria-label="Open chat options"
        >
          {/* Background Pulse */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-ping opacity-30" />
          <div className="absolute inset-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-ping opacity-20 delay-75" />
          
          {/* Icon Container */}
          <div className="relative flex items-center justify-center z-10">
            {isExpanded ? (
              <X className="w-8 h-8 text-white transform transition-transform duration-500" />
            ) : (
              <div className="flex items-center justify-center">
                <div className="relative">
                  <MessageCircle className="w-6 h-6 text-white transform group-hover:scale-125 transition-transform duration-300" />
                  <Mic className="w-4 h-4 text-white absolute -bottom-1 -right-1 transform group-hover:scale-125 transition-transform duration-300" />
                </div>
              </div>
            )}
          </div>

          {/* Notification Badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center animate-bounce shadow-lg">
            <span className="text-xs text-white font-bold">AI</span>
          </div>
          
          {/* 3D Ring Effect */}
          <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300" />
          <div className="absolute -inset-1 rounded-full border border-blue-300/30 group-hover:border-blue-300/60 transition-colors duration-300" />
        </button>
      </div>

      {/* Chat Box */}
      {activeMode === 'chat' && <ChatBox onClose={handleClose} />}
      
      {/* Voice Assistant */}
      {activeMode === 'voice' && <VoiceAssistant onClose={handleClose} />}
    </>
  );
};

export default FloatingChatButton;