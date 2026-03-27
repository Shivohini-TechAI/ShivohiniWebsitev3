import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Volume2, Loader2, Sparkles, Navigation2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import robotGif from '../assets/Robot-Bot 3D.gif';
import clearIcon from '../assets/reload.png';
import { chatbotApiUrl } from '../config/api';

interface VoiceAssistantProps {
  onClose: () => void;
  userDetails?: any;
  sessionId: string;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onClose, userDetails, sessionId }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = async (event: any) => {
      const speechText = event.results[0][0].transcript;
      setTranscript(speechText);
      setIsListening(false);
      await handleQuery(speechText);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    playWelcomeGreeting();
  }, []);

  const playWelcomeGreeting = () => {
    const hasGreetedInSession = sessionStorage.getItem('voiceAssistantGreeted');
    if (hasGreetedInSession) return;

    const greeting = userDetails
      ? `Hello ${userDetails.name.split(' ')[0]}! I am Shivohini's Voice Intelligence. How can I help you explore our solutions?`
      : "Hello! I am Shivohini's Voice Intelligence. How can I assist you today?";

    setResponse(greeting);
    setIsSpeaking(true);
    speakResponse(greeting, null);
    sessionStorage.setItem('voiceAssistantGreeted', 'true');
  };

  useEffect(() => {
    if (response && isSpeaking) {
      setDisplayedText('');
      let index = 0;
      const timer = setInterval(() => {
        if (index <= response.length) {
          setDisplayedText(response.slice(0, index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 25);
      return () => clearInterval(timer);
    }
  }, [response, isSpeaking]);

  const detectNavigationIntent = (query: string): string | null => {
    const lowerQuery = query.toLowerCase();
    if (/\b(home|homepage|main)\b/i.test(lowerQuery)) return '/';
    if (/\b(hotel|hostel)\b/i.test(lowerQuery)) return '/industries/hotel';
    if (/\b(restaurant|cafe|dining)\b/i.test(lowerQuery)) return '/industries/restaurant';
    if (/\b(supermarket|retail|grocery)\b/i.test(lowerQuery)) return '/industries/supermarket';
    if (/\b(export|import|trade)\b/i.test(lowerQuery)) return '/industries/export-import';
    if (/\b(logistic|supply.*chain)\b/i.test(lowerQuery)) return '/industries/logistics';
    if (/\b(education|school|university)\b/i.test(lowerQuery)) return '/industries/education';
    if (/\b(real.*estate|property)\b/i.test(lowerQuery)) return '/industries/realestate';
    if (/\b(finance|banking)\b/i.test(lowerQuery)) return '/industries/finance';
    if (/\b(hr|human.*resource|recruitment)\b/i.test(lowerQuery)) return '/industries/hr';
    if (/\b(sport|fitness|gym)\b/i.test(lowerQuery)) return '/industries/sports';
    if (/\b(ai.*agent|voice.*agent|call.*agent)\b/i.test(lowerQuery)) return '/solutions/1';
    if (/\b(face.*recognition|facial.*recognition)\b/i.test(lowerQuery)) return '/solutions/2';
    if (/\b(drone|uav)\b/i.test(lowerQuery)) return '/solutions/3';
    if (/\b(virtual.*assistant|chatbot|ai.*assistant)\b/i.test(lowerQuery)) return '/solutions/4';
    if (/\b(interactive.*website|web.*development)\b/i.test(lowerQuery)) return '/solutions/5';
    if (/\b(industries|industry|sector)\b/i.test(lowerQuery)) return '/industries';
    if (/\b(solution|product|offer|service)\b/i.test(lowerQuery)) return '/solutions';
    if (/\b(contact|reach|phone|email|location|support)\b/i.test(lowerQuery)) return '/contact';
    if (/\b(career|job|hiring|work|join|opening)\b/i.test(lowerQuery)) return '/careers';
    if (/\b(about|company|who.*are.*you|mission)\b/i.test(lowerQuery)) return '/about-us';
    return null;
  };

  const handleQuery = async (query: string) => {
    setIsProcessing(true);
    try {
      const navPath = detectNavigationIntent(query);
      const phone = userDetails?.phone || '';

      const { data } = await axios.post(chatbotApiUrl('/api/chat'), {
        query,
        phone,
        session_id: sessionId
      });

      let finalResponse = data.answer;
      if (navPath) setPendingNavigation(navPath);
      
      setResponse(finalResponse);
      setIsSpeaking(true);
      speakResponse(finalResponse, navPath);
    } catch (error) {
      console.error('Error:', error);
      setResponse("I apologize, I'm having trouble processing your request right now.");
      setIsSpeaking(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }
    setTranscript('');
    setResponse('');
    setDisplayedText('');
    setIsSpeaking(false);
    setPendingNavigation(null);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    recognitionRef.current.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  };

  const speakResponse = (text: string, navigationPath: string | null = null) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      
      let selectedVoice = voices.find(v => v.name.includes('Google English (India)') && !v.name.includes('Male')) 
        || voices.find(v => v.lang === 'en-IN' && v.name.includes('Female'))
        || voices.find(v => v.lang === 'en-US' && v.name.includes('Female'))
        || voices[0];

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.pitch = 1.2;
        utterance.rate = 1.2;
      }
      
      utterance.onstart = () => {
        if (navigationPath) navigate(navigationPath);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (navigationPath) setTimeout(() => onClose(), 1500);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNavigateNow = () => {
    if (pendingNavigation) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      navigate(pendingNavigation);
      onClose();
    }
  };

  const handleQuickAction = async (query: string) => {
    setTranscript(query);
    await handleQuery(query);
  };

  const handleClear = () => {
    setTranscript('');
    setResponse('');
    setDisplayedText('');
    setPendingNavigation(null);
    setIsSpeaking(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  return (
    <div className="flex h-[min(85svh,650px)] w-full max-w-[400px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#050f20] shadow-[0_20px_80px_rgba(0,0,0,0.8)] animate-reveal sm:rounded-[2.5rem]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 p-5 pb-4 sm:p-8 sm:pb-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#00C8FF] to-[#7B61FF] p-[1px] sm:h-12 sm:w-12">
            <div className="w-full h-full bg-[#050f20] rounded-[11px] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[#00C8FF] sm:h-6 sm:w-6" />
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-display font-bold tracking-tight text-white sm:text-xl">Voice Intelligence</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00C8FF] animate-pulse" />
              <span className="text-[0.7rem] uppercase tracking-widest font-bold text-white/40">Active</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
            <button onClick={handleClear} className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center text-white/40 hover:text-white transition-all transform hover:rotate-180">
                <img src={clearIcon} alt="Clear" className="w-4 h-4 opacity-50 brightness-200" />
            </button>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center text-white/40 hover:text-white transition-all">
                <X className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Main interaction area */}
      <div className="flex-1 space-y-6 overflow-y-auto p-5 scrollbar-hide sm:space-y-8 sm:p-8">
        
        {/* Visualizer / Robot area */}
        <div className="flex flex-col items-center">
          <div className={`relative transition-all duration-500 transform ${isSpeaking || isListening ? 'scale-110' : 'scale-100'}`}>
            <div className="absolute inset-0 bg-[#00C8FF]/20 blur-[60px] rounded-full animate-pulse" />
            <img 
                src={robotGif} 
                alt="AI Assistant" 
                className={`relative z-10 h-24 w-24 object-contain sm:h-32 sm:w-32 ${isSpeaking ? 'animate-bounce' : ''}`} 
            />
            {isSpeaking && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-1.5 h-6 bg-[#00C8FF] rounded-full animate-voice-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                </div>
            )}
          </div>
          
          <div className="mt-8 sm:mt-12">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`group relative flex h-16 w-16 items-center justify-center rounded-full shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-all transform hover:scale-110 active:scale-95 sm:h-20 sm:w-20 ${
                isListening ? 'bg-red-500' : 'bg-[#00C8FF]'
              }`}
            >
              <div className={`absolute inset-0 rounded-full bg-inherit animate-ping opacity-25 ${isListening ? '' : 'hidden'}`} />
              {isListening ? (
                <MicOff className="h-6 w-6 text-white sm:h-8 sm:w-8" />
              ) : isProcessing ? (
                <Loader2 className="h-6 w-6 animate-spin text-[#050f20] sm:h-8 sm:w-8" />
              ) : (
                <Mic className="h-6 w-6 text-[#050f20] sm:h-8 sm:w-8" />
              )}
            </button>
            <p className="text-center mt-4 text-[0.7rem] uppercase tracking-[0.2em] font-bold text-white/30">
              {isListening ? "Listening..." : isProcessing ? "Thinking..." : "Tap to Speak"}
            </p>
          </div>
        </div>

        {/* Conversation Bubbles */}
        <div className="space-y-4">
            {transcript && (
                <div className="flex justify-end animate-fadeInUp">
                    <div className="max-w-[88%] rounded-[1.5rem] rounded-tr-none border border-white/10 bg-white/[0.04] px-4 py-3 text-sm italic text-white/90 font-sans sm:max-w-[85%] sm:px-5 sm:py-3.5">
                        "{transcript}"
                    </div>
                </div>
            )}

            {response && (
                <div className="flex justify-start animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                    <div className="max-w-[92%] rounded-[1.5rem] rounded-tl-none border border-[#00C8FF]/20 bg-[#00C8FF]/5 px-4 py-4 sm:max-w-[90%] sm:px-6">
                        <div className="flex items-center gap-2 mb-2">
                             <Volume2 className="w-3 h-3 text-[#00C8FF]" />
                             <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#00C8FF]">Assistant</span>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed font-sans">
                            {isSpeaking ? displayedText : response}
                            {isSpeaking && <span className="inline-block w-1.5 h-4 ml-1 bg-[#00C8FF] animate-pulse" />}
                        </p>
                    </div>
                </div>
            )}

            {pendingNavigation && !isSpeaking && (
                <div className="flex justify-center pt-2 animate-reveal">
                    <button
                        onClick={handleNavigateNow}
                        className="flex items-center gap-3 px-6 py-3 bg-white/[0.05] border border-white/10 rounded-2xl text-[0.75rem] font-bold text-white hover:bg-[#00C8FF] hover:text-[#050f20] transition-all shadow-xl group"
                    >
                        <Navigation2 className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Explore Page Now
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="border-t border-white/5 bg-white/[0.02] p-4 sm:p-6">
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { label: "About Us", q: "Tell me about your company" },
            { label: "Solutions", q: "What products do you offer?" },
            { label: "Careers", q: "Show me job openings" }
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => handleQuickAction(action.q)}
              disabled={isProcessing || isSpeaking}
              className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-[0.7rem] font-bold text-white/50 hover:bg-white/[0.08] hover:text-white hover:border-white/10 transition-all disabled:opacity-30"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
