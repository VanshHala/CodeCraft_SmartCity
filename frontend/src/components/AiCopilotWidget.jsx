import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, User, ChevronUp, ChevronDown } from 'lucide-react';
import { useCivicData } from '../context/CivicDataContext';

export default function AiCopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { clusters } = useCivicData();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am CivicPulse AI Copilot. Ask me about reported issues, risk routes, or status updates in your ward.'
    }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    const newMsgs = [...messages, { sender: 'user', text: userMsg }];
    setMessages(newMsgs);
    setInput('');

    // Generate intelligent AI response based on data
    setTimeout(() => {
      let reply = "I analyzed our city road graph. Currently, there are " + clusters.length + " active issue clusters.";
      const query = userMsg.toLowerCase();

      if (query.includes('pothole') || query.includes('road')) {
        const potholes = clusters.filter(c => c.issueType === 'POTHOLE');
        reply = `There are ${potholes.length} pothole cluster(s) reported in your area. Highest priority pothole is near university gate (Priority Score: 28.8).`;
      } else if (query.includes('safest') || query.includes('route') || query.includes('fastest')) {
        reply = "Our risk-weighted Dijkstra algorithm adjusts road edge costs based on active hazard severity. Safest mode avoids high-severity pothole and waterlogging stretches automatically.";
      } else if (query.includes('water') || query.includes('flood') || query.includes('rain')) {
        reply = "Heavy rainfall warning is active (55mm/24h). 2 waterlogging reports have been merged and assigned to Amit Patel (Water Dept).";
      } else if (query.includes('status') || query.includes('my report')) {
        reply = "Your reported pothole #101 has been deduplicated (merged with 2 other citizen reports) and assigned high priority. Work team has been dispatched.";
      }

      setMessages([...newMsgs, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-full shadow-2xl shadow-teal-500/30 transition-all transform hover:scale-105"
        >
          <div className="w-6 h-6 rounded-full bg-slate-950 text-teal-400 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-xs font-display tracking-wide">AI Civic Copilot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
        </button>
      ) : (
        <div className="glass-panel w-80 sm:w-96 rounded-2xl border border-slate-700 shadow-2xl flex flex-col h-[420px] overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-slate-900/90 p-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1">
                  <span>Civic AI Copilot</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </h4>
                <p className="text-[10px] text-teal-400 font-medium">Real-time Ward Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-medium rounded-br-none'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask AI about road safety or reports..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 p-2 rounded-xl"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
