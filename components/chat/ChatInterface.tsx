"use client";
import { useState } from 'react';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const sendMessage = async () => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt: input, modelType: 'gemini' }),
    });
    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div className="p-4 border rounded shadow">
      <textarea 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        className="w-full p-2 border" 
      />
      <button onClick={sendMessage} className="mt-2 p-2 bg-blue-500 text-white">
        Send to AI
      </button>
      <div className="mt-4 p-2 bg-gray-100">{response}</div>
    </div>
  );
}