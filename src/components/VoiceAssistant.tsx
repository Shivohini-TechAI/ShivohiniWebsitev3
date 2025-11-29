import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Volume2 } from 'lucide-react';
import axios from 'axios';

interface VoiceAssistantProps {
  onClose: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

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

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Send query to Python backend
  const handleQuery = async (query: string) => {
    setIsProcessing(true);
    
    try {
      const { data } = await axios.post('http://localhost:8000/api/chat', {
        query
      });

      console.log('Bot response:', data);
      setResponse(data.answer);
      
      speakResponse(data.answer);
      
    } catch (error) {
      console.error('Error:', error);
      setResponse('Sorry, I encountered an error. Please make sure the backend is running.');
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
    
    // Stop any ongoing speech before starting to listen
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

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleQuickAction = async (query: string) => {
    setTranscript(query);
    await handleQuery(query);
  };

  // Handle close with cleanup
  const handleClose = () => {
    // Stop speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Stop recognition if listening
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
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
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                isListening
                  ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse shadow-2xl'
                  : isProcessing
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl'
              }`}
            >
              {isListening ? (
                <MicOff className="w-12 h-12 text-white" />
              ) : (
                <Mic className="w-12 h-12 text-white" />
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
            onClick={() => handleQuickAction("Tell me about your products")}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50"
          >
            Products
          </button>
          <button
            onClick={() => handleQuickAction("What industries do you serve?")}
            disabled={isProcessing}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors duration-200 disabled:opacity-50"
          >
            Industries
          </button>
          <button
            onClick={() => handleQuickAction("How can I contact you?")}
            disabled={isProcessing}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors duration-200 disabled:opacity-50"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
