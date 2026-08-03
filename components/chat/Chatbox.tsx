'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getChatAccessToken } from '@/app/actions/chat';
import { formatGeminiErrorForChat, isGeminiConfigError } from '@/lib/ai/gemini-billing-help';

type ChatboxProps = {
  embedded?: boolean;
  onClose?: () => void;
};

export default function Chatbox({
  embedded = false,
  onClose,
}: ChatboxProps) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    setLoading(true);
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');

    try {
      const token = await getChatAccessToken();

      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 25_000);

      let res: Response;
      try {
        res = await fetch('/api/chat', {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({ message: userMessage }),
          signal: controller.signal,
        });
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setMessages(prev => [
            ...prev,
            {
              role: 'ai',
              text: 'Request timed out. Gemini may be rate-limited — wait a moment and try again.',
            },
          ]);
          return;
        }
        throw err;
      } finally {
        window.clearTimeout(timeoutId);
      }

      let data: { error?: string; response?: string } = {};
      try {
        data = await res.json();
      } catch {
        data = { error: 'Invalid server response' };
      }

      if (!res.ok) {
        if (data.error === 'Trial expired') {
          window.location.assign('/pricing');
          return;
        }
        if (res.status === 429) {
          setMessages(prev => [
            ...prev,
            { role: 'ai', text: data.error ?? 'Too many requests. Please wait and try again.' },
          ]);
          return;
        }
        const errorText = data.error ?? 'Request failed';
        const helpText = isGeminiConfigError(errorText)
          ? formatGeminiErrorForChat(errorText)
          : errorText;
        setMessages(prev => [...prev, { role: 'ai', text: helpText }]);
        return;
      }

      setMessages(prev => [
        ...prev,
        { role: 'ai', text: data.response ?? 'No response received.' },
      ]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error: Could not connect to AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    setIsOpen(false);
  };

  if (!embedded && !isOpen) {
    return null;
  }

  const containerClass = embedded
    ? "w-full max-w-2xl mx-auto h-[600px] bg-[#161b22] border-4 border-[#C5A059] rounded-xl shadow-2xl flex flex-col overflow-hidden"
    : "fixed bottom-6 right-6 w-96 h-[500px] bg-[#161b22] border-4 border-[#C5A059] rounded-xl shadow-2xl flex flex-col overflow-hidden";

  return (
    <div className={containerClass}>
      <div className="relative p-4 bg-[#0d1117] flex items-center justify-center border-b border-[#C5A059]">
        <div className="text-center px-8">
          <span className="text-[#00FFFF] font-bold italic">
            Welcome to your &nbsp;2-Hour&nbsp; FREE&nbsp; trial of the
            <br />
            World&apos;s most POWERFUL&nbsp;&nbsp;&quot;Pure&quot;&nbsp;&nbsp;Physics processor.
          </span>
          {!embedded && (
            <Link
              href="/chat"
              className="block text-[#C5A059] text-sm underline mt-1 hover:text-[#FFFF00]"
            >
              Go to Full-Screen Mode
            </Link>
          )}
        </div>
        {(onClose || !embedded) && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 text-[#FF0000] font-bold"
            aria-label="Close chat"
          >
            X
          </button>
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
          onKeyDown={handleKeyDown}
          className="w-full p-2 bg-[#161b22] text-white border border-[#C5A059] rounded"
          placeholder="Ask your Physics question HERE and then Get Ready !"
        />
        <button 
          type="button"
          onClick={() => void sendMessage()} 
          disabled={loading || !input.trim()}
          className="w-full mt-2 p-2 bg-[#00FFFF] text-black font-bold rounded disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Send to MAX-LIT'}
        </button>
      </div>
    </div>
  );
}
