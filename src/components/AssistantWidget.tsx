import React, { useState, useEffect, useRef } from 'react';
import { Mic, MessageCircle, X, Send, Volume2 } from 'lucide-react';
import assistantImage from '../assets/industry/assistant.png';

const AssistantWidget: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVoicePanelOpen, setIsVoicePanelOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: "Hello! I'm your assistant. How can I help you today?", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleMainButtonClick = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
      setIsVoicePanelOpen(false);
      setIsChatbotOpen(false);
    }
  };

  const handleVoiceClick = () => {
    setIsVoicePanelOpen(true);
    setIsChatbotOpen(false);
    setIsMenuOpen(false);
    console.log('Voice Assistant opened');
  };

  const handleChatbotClick = () => {
    setIsChatbotOpen(true);
    setIsVoicePanelOpen(false);
    setIsMenuOpen(false);
    console.log('Chatbot opened');
  };

  const handleMicClick = () => {
    setIsListening(!isListening);
    console.log(isListening ? 'Stopped listening' : 'Started listening');
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setChatMessages([...chatMessages, { text: inputMessage, isBot: false }]);
      console.log('User message:', inputMessage);
      setInputMessage('');

      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          text: "I received your message. This is a placeholder response.",
          isBot: true
        }]);
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsVoicePanelOpen(false);
        setIsChatbotOpen(false);
      }
    };

    if (isMenuOpen || isVoicePanelOpen || isChatbotOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isVoicePanelOpen, isChatbotOpen]);

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-50">

      {/* Voice Assistant Panel */}
      {isVoicePanelOpen && (
        <div className="absolute bottom-24 right-0 w-80 bg-white rounded-2xl shadow-2xl p-6 mb-2 animate-fade-in-up border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Voice Assistant</h3>
            <button
              onClick={() => setIsVoicePanelOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="w-full bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 text-center">
              <p className="text-gray-700 mb-4">
                {isListening ? 'Listening...' : 'Click the microphone to start'}
              </p>

              <button
                onClick={handleMicClick}
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all duration-300 transform hover:scale-105 ${
                  isListening
                    ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                }`}
              >
                {isListening ? (
                  <Volume2 className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </button>
            </div>

            <div className="w-full text-sm text-gray-500 text-center">
              Voice recognition will be implemented here
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Panel */}
      {isChatbotOpen && (
        <div className="absolute bottom-24 right-0 w-96 h-[500px] bg-white rounded-2xl shadow-2xl mb-2 animate-fade-in-up border border-gray-200 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Assistant Chatbot</h3>
            <button
              onClick={() => setIsChatbotOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    msg.isBot
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-gray-900'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Option Buttons */}
      {isMenuOpen && !isVoicePanelOpen && !isChatbotOpen && (
        <div className="absolute bottom-24 right-0 flex flex-col space-y-3 mb-2 animate-fade-in-up">
          <button
            onClick={handleVoiceClick}
            className="group flex items-center space-x-3 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-900 px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Voice Assistant</span>
          </button>

          <button
            onClick={handleChatbotClick}
            className="group flex items-center space-x-3 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-900 px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Chatbot</span>
          </button>
        </div>
      )}

      {/* Main Assistant Button */}
      <button
        onClick={handleMainButtonClick}
        className={`relative w-24 h-24 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center bg-white border-2 border-gray-200 ${
          isMenuOpen ? 'scale-110 rotate-90' : ''
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full animate-pulse" />

        {isMenuOpen ? (
          <X className="w-10 h-10 text-gray-700 relative z-10" />
        ) : (
          <img
            src={assistantImage}
            alt="Assistant"
            className="w-14 h-14 object-contain relative z-10"
          />
        )}

        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    </div>
  );
};

export default AssistantWidget;
