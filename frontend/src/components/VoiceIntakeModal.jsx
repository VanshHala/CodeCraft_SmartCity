import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, X, CheckCircle2 } from 'lucide-react';

export default function VoiceIntakeModal({ isOpen, onClose, onTranscriptComplete }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusText, setStatusText] = useState('Click to start speaking your issue');

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setStatusText('Speech recognition not supported in this browser. Please type below.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setStatusText('Listening... Describe the civic issue in your own words.');
    };

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setStatusText(`Error: ${event.error}. Please try typing or speak clearly.`);
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatusText('Recording finished. Review transcript below.');
    };

    recognition.start();
  };

  const handleConfirm = () => {
    if (transcript) {
      onTranscriptComplete(transcript);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3 mb-5">
          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500 p-0.5 shadow-glow-emerald flex items-center justify-center">
            <button
              onClick={startSpeechRecognition}
              className={`w-full h-full rounded-full flex items-center justify-center transition-all ${
                isListening ? 'bg-rose-600 animate-pulse text-white' : 'bg-slate-950 text-teal-400 hover:bg-slate-900'
              }`}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center justify-center gap-1.5">
              <span>AI Voice Intake</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">{statusText}</p>
          </div>
        </div>

        {/* Live Speech Output Box */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 min-h-[100px] text-sm text-slate-200 mb-5 focus:outline-none">
          {transcript ? (
            <p className="leading-relaxed">{transcript}</p>
          ) : (
            <span className="text-slate-500 italic">"There is a deep pothole near the main entrance street..."</span>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!transcript}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-teal-900/40"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Use Voice Text</span>
          </button>
        </div>
      </div>
    </div>
  );
}
