import React, { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { useCivicData } from '../context/CivicDataContext';

export default function AiCopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { clusters } = useCivicData();
  const [input, setInput]     = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I'm CivicPulse AI Copilot. Ask me about reported issues, routing, or ward status." }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    const newMsgs = [...messages, { sender: 'user', text: userMsg }];
    setMessages(newMsgs);
    setInput('');

    setTimeout(() => {
      const q = userMsg.toLowerCase();
      let reply = `There are currently ${clusters.length} active civic issue clusters being tracked.`;

      if (q.includes('pothole') || q.includes('road')) {
        const n = clusters.filter(c => c.issueType === 'POTHOLE').length;
        reply = `${n} pothole cluster(s) found. Highest priority near university gate (Score: 28.8).`;
      } else if (q.includes('route') || q.includes('safest') || q.includes('fastest')) {
        reply = 'Risk-aware routing uses Dijkstra with live severity edge costs. Safest mode detours around high-severity hazards automatically.';
      } else if (q.includes('water') || q.includes('flood')) {
        reply = 'Heavy rainfall alert active: 55mm/24h forecast. 2 waterlogging clusters flagged, Amit Patel (Water) dispatched.';
      } else if (q.includes('status') || q.includes('report')) {
        reply = 'Your pothole #101 (3 reports merged) is ASSIGNED with top priority. Field team dispatched.';
      }

      setMessages([...newMsgs, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary rounded-full px-5 py-3 text-sm shadow-xl shadow-blue-200"
        >
          <Bot className="w-5 h-5" />
          <span>AI Civic Copilot</span>
          <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
        </button>
      ) : (
        <div className="card w-80 sm:w-96 flex flex-col h-[420px] shadow-elevated overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="bg-blue-gradient p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  Civic AI Copilot <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                </div>
                <div className="text-[11px] text-blue-200">Ward 4 Real-time Assistant</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-medium ${
                  m.sender === 'user'
                    ? 'bg-blue-gradient text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              placeholder="Ask about issues, routes, status..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-field flex-1 text-xs py-2"
            />
            <button type="submit" className="btn-primary p-2">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
