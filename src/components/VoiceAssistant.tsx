import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Volume2 } from 'lucide-react';

interface VoiceAssistantProps {
  onClose: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock speech recognition functionality
  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setResponse('');
    
    // Simulate speech recognition
    setTimeout(() => {
      setTranscript("Hello, I'd like to know more about your AI solutions...");
      setIsListening(false);
      setIsProcessing(true);
      
      setTimeout(() => {
        setResponse("Great! I'd be happy to help you learn about our AI solutions. We offer AI Agents, Face Recognition Systems, Customized Drones, and more. Which area interests you most?");
        setIsProcessing(false);
      }, 2000);
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const simulateResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('product') || lowerInput.includes('service')) {
      return "We offer five main products: AI Agents for task automation, Face Recognition Systems for security, Customized Drones for various applications, AI Virtual Assistants for customer service, and Interactive Websites. Which one would you like to learn more about?";
    } else if (lowerInput.includes('industry')) {
      return "We serve multiple industries including Hotels, Restaurants, Supermarkets, Education, Real Estate, Finance, Healthcare, and more. Each solution is tailored to specific industry requirements.";
    } else if (lowerInput.includes('contact')) {
      return "You can reach us at bhatiagunjan27@gmail.com or call us at +91-7688929473. We're available to discuss your AI needs anytime.";
    } else if (lowerInput.includes('demo')) {
      return "I'd love to arrange a demo for you! Please call us at +91-7688929473 or email bhatiagunjan27@gmail.com to schedule a personalized demonstration.";
    } else {
      return "Thank you for your question! For detailed information, I recommend speaking with our team directly. You can reach us at +91-7688929473 or bhatiagunjan27@gmail.com.";
    }
  };

  // Mock text-to-speech
  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (response) {
      speakResponse(response);
    }
  }, [response]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Close voice assistant"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Voice Assistant</h3>
          <p className="text-gray-600">Speak naturally and I'll help you</p>
        </div>

        {/* Microphone Visualization */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Main Microphone Button */}
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                isListening
                  ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse shadow-2xl'
                  : isProcessing
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl'
              }`}
            >
              {isListening ? (
                <MicOff className="w-12 h-12 text-white" />
              ) : (
                <Mic className="w-12 h-12 text-white" />
              )}
            </button>

            {/* Pulse Rings */}
            {isListening && (
              <>
                <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20" />
                <div className="absolute inset-2 bg-red-400 rounded-full animate-ping opacity-30 delay-75" />
                <div className="absolute inset-4 bg-red-400 rounded-full animate-ping opacity-40 delay-150" />
              </>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="absolute -inset-4 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center mb-6">
          {isListening && (
            <p className="text-red-600 font-semibold animate-pulse">
              🎙️ Listening... Click to stop
            </p>
          )}
          {isProcessing && (
            <p className="text-yellow-600 font-semibold">
              🤔 Processing your request...
            </p>
          )}
          {!isListening && !isProcessing && (
            <p className="text-gray-600">
              Click the microphone to start speaking
            </p>
          )}
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-blue-50 rounded-2xl p-4 mb-4">
            <div className="flex items-start space-x-2">
              <Mic className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">You said:</p>
                <p className="text-blue-800">{transcript}</p>
              </div>
            </div>
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4">
            <div className="flex items-start space-x-2">
              <Volume2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-purple-900 mb-1">AI Assistant:</p>
                <p className="text-purple-800">{response}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => {
              setTranscript("Tell me about your products");
              setResponse(simulateResponse("Tell me about your products"));
            }}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors duration-200"
          >
            Products
          </button>
          <button
            onClick={() => {
              setTranscript("What industries do you serve?");
              setResponse(simulateResponse("What industries do you serve?"));
            }}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors duration-200"
          >
            Industries
          </button>
          <button
            onClick={() => {
              setTranscript("How can I contact you?");
              setResponse(simulateResponse("How can I contact you?"));
            }}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors duration-200"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;