import React, { useState, useEffect, useRef } from 'react';
import { Mic, MessageCircle, X, Send, Volume2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';
import assistantImage from '../assets/industry/assistant.png';
import VoiceAssistant from './VoiceAssistant';
import UserDetailsForm, { UserDetails } from './UserDetailsForm';

const AssistantWidget: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVoicePanelOpen, setIsVoicePanelOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showRequirementPopup, setShowRequirementPopup] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [pendingAction, setPendingAction] = useState<'voice' | 'chatbot' | 'whatsapp' | null>(null);
  const [requirementMode, setRequirementMode] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    { text: "Hello! I'm your assistant. How can I help you today?", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Generate a unique session ID for anonymous users
  const [sessionId] = useState(() => {
    const stored = sessionStorage.getItem('chatSessionId');
    if (stored) return stored;
    const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('chatSessionId', newId);
    return newId;
  });

  // Check localStorage AND verify with backend
  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    setIsCheckingUser(true);

    const savedDetails = localStorage.getItem('userDetails');
    const hasSubmitted = localStorage.getItem('userDetailsSubmitted');

    if (savedDetails && hasSubmitted === 'true') {
      const details = JSON.parse(savedDetails);

      try {
        const { data } = await axios.get(`https://bgkkgwg48w08cg0owwowsc40.194.164.151.212.sslip.io/api/check-user/${details.email}`);

        if (data && data.exists) {
          setUserDetails(data.user);
          localStorage.setItem('userDetails', JSON.stringify(data.user));
        } else {
          localStorage.removeItem('userDetails');
          localStorage.removeItem('userDetailsSubmitted');
          setUserDetails(null);
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setUserDetails(details);
      }
    }

    setIsCheckingUser(false);
  };

  const handleMainButtonClick = () => {
    if (!isMenuOpen) {
      if (isCheckingUser) return;

      if (userDetails) {
        setShowRequirementPopup(true);
      } else {
        setShowUserForm(true);
      }
    } else {
      setIsMenuOpen(false);
      setIsVoicePanelOpen(false);
      setIsChatbotOpen(false);
    }
  };

  const handleRequirementResponse = (hasRequirement: boolean) => {
    setShowRequirementPopup(false);

    if (hasRequirement) {
      setRequirementMode(true);
      setShowUserForm(true);
    } else {
      setIsMenuOpen(true);
    }
  };

  const handleUserDetailsSubmit = (details: UserDetails) => {
    setUserDetails(details);
    setShowUserForm(false);
    setRequirementMode(false);
    setIsMenuOpen(true);
  };

  const proceedWithAction = (action: 'voice' | 'chatbot' | 'whatsapp') => {
    switch (action) {
      case 'voice':
        setIsVoiceAssistantOpen(true);
        setIsChatbotOpen(false);
        break;
      case 'chatbot':
        setIsChatbotOpen(true);
        setIsVoicePanelOpen(false);
        break;
      case 'whatsapp':
        handleWhatsAppClick();
        break;
    }
    setIsMenuOpen(false);
  };

  const handleVoiceClick = () => proceedWithAction('voice');
  const handleChatbotClick = () => proceedWithAction('chatbot');

  const handleWhatsAppClick = () => {
    if (userDetails) {
      const phoneNumber = '919876543210';
      const message = `Hello! I'm ${userDetails.name} from ${userDetails.company || 'my company'}. ${userDetails.requirement ? `Requirement: ${userDetails.requirement}` : 'I need assistance.'}`;
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
      setIsMenuOpen(false);
    }
  };

  const handleMicClick = () => {
    setIsListening(!isListening);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = { text: inputMessage, isBot: false };
    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    try {
      const phone = userDetails?.phone || '';

      const requestBody = {
        message: inputMessage,
        phone: phone,
        session_id: sessionId
      };

      console.log('🚀 Sending chat request:', requestBody);

      const response = await fetch('https://bgkkgwg48w08cg0owwowsc40.194.164.151.212.sslip.io/web/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      setChatMessages(prev => [...prev, {
        text: data.response || "I apologize, but I'm having trouble connecting right now.",
        isBot: true
      }]);

    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages(prev => [...prev, {
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        isBot: true
      }]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
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

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isVoicePanelOpen, isChatbotOpen]);

  return (
    <>
      {showRequirementPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-8 relative">
            <button
              type="button"
              onClick={() => setShowRequirementPopup(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close popup"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {userDetails?.name}! 👋
              </h3>
              <p className="text-gray-600 mb-6">
                Do you have any new requirements to share with us?
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleRequirementResponse(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  No, Continue
                </button>
                <button
                  type="button"
                  onClick={() => handleRequirementResponse(true)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Yes, Add Requirement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUserForm && (
        <UserDetailsForm
          onSubmit={handleUserDetailsSubmit}
          onClose={() => {
            setShowUserForm(false);
            setPendingAction(null);
            setRequirementMode(false);
          }}
          existingUser={requirementMode ? userDetails : null}
          requirementOnly={requirementMode}
        />
      )}

      {isChatbotOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsChatbotOpen(false)}
        />
      )}

      <div ref={widgetRef} className="fixed bottom-6 right-6 z-50">

        {/* Voice Assistant - NO WRAPPER */}
        {isVoiceAssistantOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl max-h-[600px] w-full">
              <VoiceAssistant
                onClose={() => setIsVoiceAssistantOpen(false)}
                userDetails={userDetails}
                sessionId={sessionId}
              />
            </div>
          </div>
        )}

        {/* Voice Panel (OLD - if you still need it) */}
        {isVoicePanelOpen && (
          <>
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
                    className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all duration-300 transform hover:scale-105 ${isListening
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
            <VoiceAssistant
              onClose={() => setIsVoiceAssistantOpen(false)}
              userDetails={userDetails}
              sessionId={sessionId}
            />
          </>
        )}

        {/* Chatbot Panel */}
        {isChatbotOpen && (
          <div className="absolute bottom-24 right-0 w-96 h-[500px] bg-white rounded-2xl shadow-2xl mb-2 animate-fade-in-up border border-gray-200 flex flex-col z-50">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Assistant Chatbot</h3>
              <button
                type="button"
                onClick={() => setIsChatbotOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close chatbot"
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
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${msg.isBot
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
                  type="button"
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Buttons */}
        {isMenuOpen && !isVoicePanelOpen && !isChatbotOpen && (
          <div className="absolute bottom-24 right-0 flex flex-col space-y-3 mb-2 animate-fade-in-up">
            <button
              type="button"
              onClick={handleVoiceClick}
              className="group flex items-center space-x-3 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-900 px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">Voice Assistant</span>
            </button>

            <button
              type="button"
              onClick={handleChatbotClick}
              className="group flex items-center space-x-3 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-900 px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">Chatbot</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="group flex items-center space-x-3 bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 text-gray-900 px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaWhatsapp className="w-6 h-6 text-white" />
              </div>
              <span className="font-semibold">WhatsApp</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleMainButtonClick}
          disabled={isCheckingUser}
          className={`relative w-24 h-24 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center bg-white border-2 border-gray-200 ${isMenuOpen ? 'scale-110 rotate-90' : ''
            } ${isCheckingUser ? 'opacity-50 cursor-wait' : ''}`}
          aria-label="Open assistant menu"
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
      </div >
    </>
  );
};

export default AssistantWidget;
