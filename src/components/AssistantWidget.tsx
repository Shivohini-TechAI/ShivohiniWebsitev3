import React, { useState, useEffect, useRef } from 'react';
import { Mic, MessageCircle, X, Send } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';
import assistantImage from '../assets/industry/assistant.png';
import VoiceAssistant from './VoiceAssistant';
import UserDetailsForm, { UserDetails } from './UserDetailsForm';
import { chatbotApiUrl } from '../config/api';

const AssistantWidget: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showRequirementPopup, setShowRequirementPopup] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [requirementMode, setRequirementMode] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    { text: "Hello! I'm your digital assistant. How can I assist you with our AI solutions today?", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
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
        const { data } = await axios.get(chatbotApiUrl(`/api/check-user/${details.email}`));
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
    if (!isMenuOpen && !isChatbotOpen && !isVoiceAssistantOpen) {
      if (isCheckingUser) return;
      if (userDetails) {
        setShowRequirementPopup(true);
      } else {
        setShowUserForm(true);
      }
    } else {
      setIsMenuOpen(false);
      setIsChatbotOpen(false);
      setIsVoiceAssistantOpen(false);
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

  const handleVoiceClick = () => {
    setIsVoiceAssistantOpen(true);
    setIsMenuOpen(false);
  };

  const handleChatbotClick = () => {
    setIsChatbotOpen(true);
    setIsMenuOpen(false);
  };

  const handleWhatsAppClick = () => {
    if (userDetails) {
      const phoneNumber = '916377787157';
      const message = `Hello! I'm ${userDetails.name} from ${userDetails.company || 'my company'}. ${userDetails.requirement ? `Requirement: ${userDetails.requirement}` : 'I need assistance.'}`;
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
      setIsMenuOpen(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = { text: inputMessage, isBot: false };
    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = inputMessage;
    setInputMessage('');

    try {
      const phone = userDetails?.phone || '';
      const requestBody = {
        message: currentInput,
        phone: phone,
        session_id: sessionId
      };

      const response = await fetch(chatbotApiUrl('/web/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        setIsChatbotOpen(false);
      }
    };
    if (isMenuOpen || isChatbotOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isChatbotOpen]);

  return (
    <>
      {/* Requirement Popup */}
      {showRequirementPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#050f20] p-6 shadow-[0_0_50px_rgba(0,0,0,1)] sm:p-10">
             {/* Aurora glow background */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-[#00C8FF]/10 rounded-full blur-[80px]" />
            </div>

            <button
              onClick={() => setShowRequirementPopup(false)}
              className="absolute right-4 top-4 p-2 text-white/40 transition-colors hover:text-white sm:right-6 sm:top-6"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00C8FF] to-[#7B61FF] shadow-lg shadow-blue-500/20 transition-transform sm:mb-8 sm:h-20 sm:w-20">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>

              <h3 className="mb-4 text-2xl font-display font-bold text-white sm:text-3xl">
                Welcome back, <span className="text-brand-gradient">{userDetails?.name.split(' ')[0]}</span>!
              </h3>
              <p className="mb-8 leading-relaxed text-white/60 font-sans sm:mb-10">
                Do you have any new requirements or projects you'd like to discuss with our AI experts?
              </p>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleRequirementResponse(true)}
                  className="w-full rounded-xl bg-[#00C8FF] px-6 py-4 text-base font-bold text-[#050f20] shadow-[0_4px_20px_rgba(0,200,255,0.3)] transition-all transform hover:-translate-y-1 hover:bg-[#00b0e6] sm:px-8 sm:text-lg"
                >
                  Yes, New Requirement
                </button>
                <button
                  onClick={() => handleRequirementResponse(false)}
                  className="w-full px-8 py-4 bg-white/[0.05] text-white/70 rounded-xl font-bold border border-white/10 hover:bg-white/[0.1] transition-all"
                >
                  Just Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUserForm && (
        <UserDetailsForm
          onSubmit={handleUserDetailsSubmit}
          onClose={() => setShowUserForm(false)}
          existingUser={requirementMode ? userDetails : null}
          requirementOnly={requirementMode}
        />
      )}

      <div ref={widgetRef} className="fixed bottom-4 right-4 z-[90] sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8">
        
        {/* Voice Assistant Modal */}
        {isVoiceAssistantOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
            <div className="flex w-full justify-center">
              <VoiceAssistant
                onClose={() => setIsVoiceAssistantOpen(false)}
                userDetails={userDetails}
                sessionId={sessionId}
              />
            </div>
          </div>
        )}

        {/* Chatbot Panel */}
        {isChatbotOpen && (
          <div className="fixed inset-x-3 bottom-24 z-50 flex h-[min(72svh,36rem)] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#050f20] shadow-[0_20px_80px_rgba(0,0,0,0.8)] animate-reveal sm:inset-x-auto sm:right-0 sm:w-[400px] sm:rounded-[2.5rem] md:absolute md:bottom-24 md:h-[600px]">
            <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] p-5 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00C8FF]/10 flex items-center justify-center border border-[#00C8FF]/20">
                  <Bot className="w-6 h-6 text-[#00C8FF]" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white tracking-tight">AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[0.7rem] uppercase tracking-widest font-bold text-white/40">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsChatbotOpen(false)}
                className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-4 scrollbar-hide sm:space-y-6 sm:p-8">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-fadeInUp`}
                >
                  <div
                    className={`max-w-[88%] rounded-[1.5rem] px-4 py-3 text-sm leading-[1.6] sm:px-5 sm:py-4 sm:text-[0.95rem] ${msg.isBot
                      ? 'bg-white/[0.04] text-white/90 rounded-tl-none font-sans border border-white/[0.05]'
                      : 'bg-[#00C8FF] text-[#050f20] rounded-tr-none font-semibold shadow-lg shadow-blue-500/10'
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 p-4 sm:p-8">
              <div className="relative group">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 pr-14 text-white transition-all font-sans focus:border-[#00C8FF]/50 focus:outline-none sm:px-6 sm:py-4"
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#00C8FF] text-[#050f20] rounded-xl flex items-center justify-center hover:bg-[#00b0e6] transition-all shadow-md active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Toggle List */}
        {isMenuOpen && (
          <div className="absolute bottom-20 right-0 mb-3 flex flex-col items-end gap-3 sm:bottom-24 sm:mb-4">
            {[
              { id: 'voice', label: 'Voice Assistant', icon: Mic, color: 'from-[#00C8FF] to-[#7B61FF]', action: handleVoiceClick },
              { id: 'chat', label: 'Chat Assistant', icon: MessageCircle, color: 'from-[#7B61FF] to-[#00C8FF]', action: handleChatbotClick },
              { id: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, color: 'from-[#25D366] to-[#128C7E]', action: handleWhatsAppClick }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  style={{ animationDelay: `${idx * 100}ms` }}
                  className="group flex items-center gap-4 animate-reveal"
                >
                  <span className="whitespace-nowrap rounded-xl border border-white/10 bg-[#050f20]/90 px-3 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-md opacity-100 transition-opacity sm:px-4 sm:text-sm sm:opacity-0 sm:group-hover:opacity-100">
                    {item.label}
                  </span>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-lg transition-transform active:scale-95 group-hover:scale-110 sm:h-14 sm:w-14`}>
                    <Icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Float Button */}
        <button
          onClick={handleMainButtonClick}
          disabled={isCheckingUser}
          className={`group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[1.35rem] border-[1.5px] border-white/10 bg-[#050f20] shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 transform hover:scale-110 sm:h-20 sm:w-20 sm:rounded-[1.75rem] ${isMenuOpen || isChatbotOpen ? 'scale-110' : ''}`}
        >
          {/* Internal Glow Effect */}
          <div className="absolute inset-0 bg-[#00C8FF]/5 group-hover:bg-[#00C8FF]/10 transition-colors" />
          <div className={`absolute inset-0 rounded-[1.35rem] border-[2px] border-[#00C8FF] opacity-0 transition-opacity group-hover:opacity-100 sm:rounded-[1.75rem] ${isMenuOpen || isChatbotOpen ? 'opacity-100' : ''}`} />
          
          <div className="relative z-10">
            {isMenuOpen || isChatbotOpen ? (
              <X className="h-7 w-7 rotate-0 text-white transition-all duration-300 group-hover:rotate-90 sm:h-8 sm:w-8" />
            ) : (
              <img
                src={assistantImage}
                alt="Assistant"
                className="h-10 w-10 object-contain drop-shadow-[0_0_8px_rgba(0,200,255,0.4)] sm:h-12 sm:w-12"
              />
            )}
          </div>

          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-[#050f20] animate-pulse" />
        </button>
      </div>
    </>
  );
};

// Simple custom component to replace missing lucide import in this context
const Bot = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
  </svg>
);

export default AssistantWidget;
