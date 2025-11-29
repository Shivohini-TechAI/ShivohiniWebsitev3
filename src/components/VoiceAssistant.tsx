import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import robotGif from '../assets/Robot-Bot 3D.gif';

interface VoiceAssistantProps {
  onClose: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onClose }) => {
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

  // Typewriter effect for response
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

  // Smart hardcoded navigation detection
  const detectNavigationIntent = (query: string): string | null => {
    const lowerQuery = query.toLowerCase();
    
    // Remove common filler words for better matching
    const cleanQuery = lowerQuery
      .replace(/\b(can you|could you|please|i want to|i wanna|show me|tell me about|what are|what is|take me to)\b/g, '')
      .trim();
    
    console.log('Clean query:', cleanQuery);
    
    // Product page
    const productKeywords = /product|sell|offer|buy|purchase|catalog|catalogue|item|service|solution|goods|merchandise|inventory|stuff.*have|what.*do.*sell|what.*available|show.*offer/i;
    if (productKeywords.test(lowerQuery)) {
      return '/solutions';
    }
    
    // Industries page
    const industryKeywords = /industr|sector|field|client|customer|serve|market|vertical|work with|target|who.*use|domain|business.*type/i;
    if (industryKeywords.test(lowerQuery)) {
      return '/industries';
    }
    
    // Contact page
    const contactKeywords = /contact|reach|phone|call|email|address|location|touch|support|help.*desk|speak.*to|talk.*to|get.*hold|message.*you|office/i;
    if (contactKeywords.test(lowerQuery)) {
      return '/contact';
    }
    
    // About page
    const aboutKeywords = /about|who.*you|company|business|background|story|mission|vision|history|organization|what.*do.*do|tell.*about.*you/i;
    if (aboutKeywords.test(lowerQuery)) {
      return '/about-us';
    }
    
    // Home page
    const homeKeywords = /home.*page|go.*home|main.*page|start.*page|beginning|homepage|landing.*page/i;
    if (homeKeywords.test(lowerQuery)) {
      return '/';
    }
    
    return null;
  };

  // NEW: Handle query - answer FIRST, then navigate
  const handleQuery = async (query: string) => {
    setIsProcessing(true);
    
    try {
      // Check if user wants to navigate
      const navigationPath = detectNavigationIntent(query);
      
      // Get the answer from backend (regardless of navigation intent)
      const { data } = await axios.post('http://localhost:8000/api/chat', {
        query
      });

      console.log('Bot response:', data);
      
      // If navigation detected, add redirect message to the response
      let finalResponse = data.answer;
      
      if (navigationPath) {
        const pageNames: { [key: string]: string } = {
          '/products': 'Products',
          '/industries': 'Industries',
          '/contact': 'Contact Us',
          '/about': 'About Us',
          '/': 'Home'
        };
        
        const pageName = pageNames[navigationPath] || 'that page';
        finalResponse += `\n\nWould you like me to take you to the ${pageName} page for more details?`;
        
        // Store navigation path for later
        setPendingNavigation(navigationPath);
        console.log(`📍 Navigation available to: ${navigationPath}`);
      }
      
      setResponse(finalResponse);
      setIsSpeaking(true);
      speakResponse(finalResponse, navigationPath);
      
    } catch (error) {
      console.error('Error:', error);
      setResponse('Sorry, I encountered an error. Please make sure the backend is running.');
      setIsSpeaking(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser. Please use Chrome.');
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

  // NEW: Updated speech function with navigation after speech ends
  const speakResponse = (text: string, navigationPath: string | null = null) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.lang = 'en-US';
      
      utterance.onend = () => {
        setIsSpeaking(false);
        
        // Navigate after speech ends (if navigation path exists)
        if (navigationPath) {
          setTimeout(() => {
            console.log(`🔀 Navigating to: ${navigationPath}`);
            navigate(navigationPath);
            onClose();
          }, 1500); // Wait 1.5 seconds after speech ends
        }
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // NEW: Manual navigation button handler
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Sticky Header with Close Button */}
        <div className="flex-shrink-0 relative p-6 pb-4 border-b border-gray-200">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 z-10"
            aria-label="Close voice assistant"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-center pr-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Voice Assistant</h3>
            <p className="text-gray-600 text-sm">Speak naturally and I'll help you</p>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Robot GIF or Microphone */}
          <div className="flex justify-center">
            {isSpeaking ? (
              <div className="relative flex flex-col items-center">
                <img 
                  src={robotGif} 
                  alt="AI Speaking" 
                  className="w-32 h-32 object-contain animate-bounce"
                />
                <div className="absolute -bottom-4 w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse" />
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                    isListening
                      ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse shadow-2xl'
                      : isProcessing
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-10 h-10 text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </button>

                {isListening && (
                  <>
                    <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20" />
                    <div className="absolute inset-2 bg-red-400 rounded-full animate-ping opacity-30 delay-75" />
                    <div className="absolute inset-4 bg-red-400 rounded-full animate-ping opacity-40 delay-150" />
                  </>
                )}

                {isProcessing && (
                  <div className="absolute -inset-4 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            )}
          </div>

          {/* Status Text */}
          <div className="text-center">
            {isListening && (
              <p className="text-red-600 font-semibold animate-pulse text-sm">
                🎙️ Listening... Click to stop
              </p>
            )}
            {isProcessing && (
              <p className="text-yellow-600 font-semibold text-sm">
                🤔 Processing your request...
              </p>
            )}
            {isSpeaking && (
              <p className="text-purple-600 font-semibold animate-pulse text-sm">
                🤖 AI is speaking...
              </p>
            )}
            {!isListening && !isProcessing && !isSpeaking && (
              <p className="text-gray-600 text-sm">
                Click the microphone to start speaking
              </p>
            )}
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="flex items-start space-x-2">
                <Mic className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-blue-900 mb-1">You said:</p>
                  <p className="text-blue-800 text-sm break-words">{transcript}</p>
                </div>
              </div>
            </div>
          )}

          {/* Response with Typewriter Effect */}
          {response && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4">
              <div className="flex items-start space-x-2">
                <Volume2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-purple-900 mb-1">AI Assistant:</p>
                  <p className="text-purple-800 text-sm break-words whitespace-pre-wrap">
                    {isSpeaking ? displayedText : response}
                    {isSpeaking && <span className="animate-pulse">|</span>}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* NEW: Show "Go to Page" button if navigation is available */}
          {pendingNavigation && !isSpeaking && (
            <div className="flex justify-center pt-2">
              <button
                onClick={handleNavigateNow}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Go to Page →
              </button>
            </div>
          )}
        </div>

        {/* Sticky Footer with Quick Actions */}
        <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handleQuickAction("Tell me about your products")}
              disabled={isProcessing || isSpeaking}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Products
            </button>
            <button
              onClick={() => handleQuickAction("What industries do you serve?")}
              disabled={isProcessing || isSpeaking}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Industries
            </button>
            <button
              onClick={() => handleQuickAction("How can I contact you?")}
              disabled={isProcessing || isSpeaking}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
