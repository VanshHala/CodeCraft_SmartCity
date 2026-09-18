import { useState } from 'react';

export default function Copilot() {
  const [messages, setMessages] = useState([{ text: "Hi! I'm your Civic Copilot. Ask me about your reports or ward stats.", sender: "bot" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userQuestion = input;
    setMessages(prev => [...prev, { text: userQuestion, sender: "user" }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch("/api/copilot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.answer, sender: "bot" }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Error connecting to Copilot.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded shadow flex flex-col h-96">
        <div className="p-3 bg-blue-600 text-white font-bold rounded-t text-center">
          🤖 AI Civic Copilot
        </div>
        <div className="flex-1 p-3 overflow-y-auto space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-2 rounded max-w-[80%] ${m.sender === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-800'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="p-2 rounded bg-gray-100 text-gray-800 animate-pulse">Thinking...</div>
            </div>
          )}
        </div>
        <form onSubmit={handleSend} className="border-t p-2 flex gap-2">
          <input 
            type="text" 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="Ask a question..." 
            className="flex-1 border p-2 rounded"
          />
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
