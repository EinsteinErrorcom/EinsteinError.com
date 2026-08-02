"use client";
import Link from 'next/link';
import { useState } from 'react';

type ChatboxProps = {
  embedded?: boolean;
};

export default function Chatbox({ embedded = false }: ChatboxProps) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, modelType: 'gemini' }),
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error: Could not connect to AI." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!embedded && !isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-6 right-6 bg-[#C5A059] text-black font-bold p-4 rounded-full shadow-lg"
      >
        Open Chat
      </button>
    );
  }

  const containerClass = embedded
    ? "w-full max-w-2xl mx-auto h-[600px] bg-[#161b22] border-4 border-[#C5A059] rounded-xl shadow-2xl flex flex-col overflow-hidden"
    : "fixed bottom-6 right-6 w-96 h-[500px] bg-[#161b22] border-4 border-[#C5A059] rounded-xl shadow-2xl flex flex-col overflow-hidden";

  return (
    <div className={containerClass}>
      <div className="p-4 bg-[#0d1117] flex justify-between items-center border-b border-[#C5A059]">
        <div>
          <span className="text-[#00FFFF] font-bold italic">Welcome to your free trial</span>
          {!embedded && (
            <Link
              href="/chat"
              className="block text-[#C5A059] text-sm underline mt-1 hover:text-[#FFFF00]"
            >
              Go to Full-Screen Mode
            </Link>
          )}
        </div>
        {!embedded && (
          <button onClick={() => setIsOpen(false)} className="text-[#FF0000] font-bold">X</button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded ${m.role === 'user' ? 'bg-[#C5A059] text-black self-end' : 'bg-[#0d1117] text-[#00FFFF]'}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="text-[#FFFF00] italic">Max-Lit is thinking...</div>}
      </div>

      <div className="p-4 border-t border-[#C5A059] bg-[#0d1117]">
        <textarea 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          className="w-full p-2 bg-[#161b22] text-white border border-[#C5A059] rounded"
          placeholder="Ask your physics question..."
        />
        <button 
          onClick={sendMessage} 
          disabled={loading}
          className="w-full mt-2 p-2 bg-[#00FFFF] text-black font-bold rounded"
        >
          {loading ? 'Processing...' : 'Send to MAX-LIT'}
        </button>
      </div>
    </div>
  );
}