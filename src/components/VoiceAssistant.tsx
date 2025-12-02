import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import robotGif from '../assets/Robot-Bot 3D.gif';
import clearIcon from '../assets/reload.png';

interface VoiceAssistantProps {
  onClose: () => void;
  userDetails?: any;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onClose, userDetails }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  // Initialize Speech Recognition
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
      console.log('You said:', speechText);
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
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Play welcome greeting when component mounts (only once per session)
  useEffect(() => {
    playWelcomeGreeting();
  }, []);

  // Welcome greeting function
  const playWelcomeGreeting = () => {
    const hasGreetedInSession = sessionStorage.getItem('voiceAssistantGreeted');

    if (hasGreetedInSession) {
      return; // Skip greeting if already played in session
    }

    const greeting = userDetails
      ? `Hello ${userDetails.name}! I am Shivohini Voice Assistant. How can I assist you today?`
      : "Hello! I am Shivohini Voice Assistant. How can I assist you today?";

    setResponse(greeting);
    setIsSpeaking(true);
    speakResponse(greeting, null);
    sessionStorage.setItem('voiceAssistantGreeted', 'true');
  };

  // Typewriter effect
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
      }, 30);

      return () => clearInterval(timer);
    }
  }, [response, isSpeaking]);

  const detectNavigationIntent = (query: string): string | null => {
    const lowerQuery = query.toLowerCase();

    if (/\b(home|main.*page|homepage|go.*home|take.*home)\b/i.test(lowerQuery)) return '/';
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
    if (/\b(industries|industry|industr|sector|client.*serve|what.*market|which.*industr)\b/i.test(lowerQuery)) return '/industries';
    if (/\b(solution|product|products|what.*sell|what.*offer|your.*service|show.*product)\b/i.test(lowerQuery)) return '/solutions';
    if (/\b(contact|reach.*you|phone.*number|email.*address|office.*location|get.*touch|support)\b/i.test(lowerQuery)) return '/contact';
    if (/\b(career|job|hiring|vacancy|work.*with.*you|join.*team|employment|opening)\b/i.test(lowerQuery)) return '/careers';
    if (/\b(blog|article|news|post|read)\b/i.test(lowerQuery)) return '/blog';
    if (/\b(about.*company|about.*business|who.*are.*you|your.*company|company.*background|company.*history|mission.*vision|tell.*me.*about.*you|what.*is.*your.*company)\b/i.test(lowerQuery)) return '/about-us';

    return null;
  };

  const truncateToTokens = (text: string, maxTokens: number = 200): string => {
    const words = text.split(/\s+/);
    if (words.length <= maxTokens) return text;
    return words.slice(0, maxTokens).join(' ') + '...';
  };

  const handleQuery = async (query: string) => {
    setIsProcessing(true);

    try {
      const navigationPath = detectNavigationIntent(query);

      const { data } = await axios.post('http://localhost:8000/api/chat', {
        query
      });

      let finalResponse = truncateToTokens(data.answer, 200);

      if (navigationPath) {
        setPendingNavigation(navigationPath);
      }

      setResponse(finalResponse);
      setIsSpeaking(true);
      speakResponse(finalResponse, navigationPath);

    } catch (error) {
      console.error('Error:', error);
      setResponse('Error occurred.');
      setIsSpeaking(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Speech not supported. Use Chrome.');
      return;
    }

    setTranscript('');
    setResponse('');
    setDisplayedText('');
    setIsSpeaking(false);
    setPendingNavigation(null);

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    recognitionRef.current.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speakResponse = (text: string, navigationPath: string | null = null) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        console.log('🗣️ Speech started');
        if (navigationPath) {
          console.log(`🔀 Navigating to: ${navigationPath}`);
          navigate(navigationPath);
        }
      };

      utterance.onend = () => {
        console.log('✅ Speech finished');
        setIsSpeaking(false);

        if (navigationPath) {
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setIsSpeaking(false);
        if (navigationPath) {
          onClose();
        }
      };

      window.speechSynthesis.speak(utterance);

    } else {
      if (navigationPath) {
        navigate(navigationPath);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
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

  const handleClearConversation = () => {
    setTranscript('');
    setResponse('');
    setDisplayedText('');
    setPendingNavigation(null);
    setIsSpeaking(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleClose = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    onClose();
  };

  return (
    <div className="fixed bottom-32 right-8 w-80 h-80 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-50 animate-fade-in-right">
      
      {/* Header */}
      <div className="flex-shrink-0 relative p-3 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close assistant"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <button
          type="button"
          onClick={handleClearConversation}
          className="absolute top-2 right-10 p-1 hover:bg-white/20 rounded-full transition-colors text-white text-sm"
          aria-label="Clear conversation"
          title="Clear conversation"
        >
          <img src={clearIcon} alt="Clear" className="w-4 h-4" /> 
        </button>

        <div className="text-center pr-16">
          <h3 className="text-sm font-bold text-white">Voice Assistant</h3>
          <p className="text-blue-100 text-xs">Speak naturally</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        
        {/* Mic/Robot */}
        <div className="flex justify-center">
          {isSpeaking ? (
            <div className="relative">
              <img src={robotGif} alt="AI" className="w-16 h-16 object-contain animate-bounce" />
              <div className="absolute -bottom-1 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
            </div>
          ) : (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isListening
                  ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse'
                  : isProcessing
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isListening ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
            </button>
          )}
        </div>

        {/* Status */}
        <div className="text-center">
          {isListening && <p className="text-red-600 text-xs font-semibold animate-pulse">🎙️ Listening...</p>}
          {isProcessing && <p className="text-yellow-600 text-xs font-semibold">🤔 Processing...</p>}
          {isSpeaking && <p className="text-purple-600 text-xs font-semibold animate-pulse">🤖 Speaking...</p>}
          {!isListening && !isProcessing && !isSpeaking && <p className="text-gray-600 text-xs">Tap microphone to speak</p>}
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-blue-50 rounded-lg p-2">
            <div className="flex items-start gap-2">
              <Mic className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-blue-900">You:</p>
                <p className="text-blue-800 text-xs break-words">{transcript}</p>
              </div>
            </div>
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-2">
            <div className="flex items-start gap-2">
              <Volume2 className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-purple-900">AI:</p>
                <p className="text-purple-800 text-xs break-words whitespace-pre-wrap">
                  {isSpeaking ? displayedText : response}
                  {isSpeaking && <span className="animate-pulse">|</span>}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Manual Navigate Button */}
        {pendingNavigation && !isSpeaking && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleNavigateNow}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-semibold hover:scale-105 transition-transform shadow-md"
            >
              Go to Page →
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-2 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-center gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickAction("Tell me about your company")}
            disabled={isProcessing || isSpeaking}
            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors disabled:opacity-50"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => handleQuickAction("Show me hotel industry")}
            disabled={isProcessing || isSpeaking}
            className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors disabled:opacity-50"
          >
            Hotel
          </button>
          <button
            type="button"
            onClick={() => handleQuickAction("Contact")}
            disabled={isProcessing || isSpeaking}
            className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
