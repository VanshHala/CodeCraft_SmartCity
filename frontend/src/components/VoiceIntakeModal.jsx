import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, CheckCircle2 } from 'lucide-react';

export default function VoiceIntakeModal({ isOpen, onClose, onTranscriptComplete }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript]   = useState('');
  const [statusText, setStatusText]   = useState('Click the mic and describe the issue in your own words.');

  useEffect(() => {
    if (!isOpen) { setIsListening(false); setTranscript(''); }
  }, [isOpen]);

  if (!isOpen) return null;

  const startRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setStatusText('Speech recognition not supported. Please type below instead.');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-IN';

    rec.onstart  = () => { setIsListening(true);  setStatusText('Listening… speak clearly.'); };
    rec.onresult = (e) => setTranscript(e.results[e.resultIndex][0].transcript);
    rec.onerror  = (e) => { setIsListening(false); setStatusText(`Error: ${e.error}. Try again.`); };
    rec.onend    = () => { setIsListening(false);  setStatusText('Done. Review your transcript below.'); };
    rec.start();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel max-w-md">
        <button onClick={onClose} className="absolute top-4 right-4 btn-ghost p-2">
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-4 mb-6">
          <button
            onClick={startRecognition}
            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white shadow-lg transition-all ${
              isListening
                ? 'bg-red-500 animate-pulse shadow-red-200'
                : 'bg-blue-gradient shadow-blue-200 hover:shadow-blue-300'
            }`}
          >
            {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>
          <div>
            <h3 className="text-lg font-display font-bold text-slate-900">AI Voice Intake</h3>
            <p className="text-xs text-slate-500 mt-0.5">{statusText}</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[90px] mb-5 text-sm text-slate-800">
          {transcript || <span className="text-slate-400 italic">"There is a deep pothole near the main entrance..."</span>}
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button
            type="button"
            onClick={() => { if (transcript) { onTranscriptComplete(transcript); onClose(); } }}
            disabled={!transcript}
            className="btn-primary disabled:opacity-40"
          >
            <CheckCircle2 className="w-4 h-4" />
            Use Voice Text
          </button>
        </div>
      </div>
    </div>
  );
}
