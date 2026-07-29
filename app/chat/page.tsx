import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">AI Chat Window</h1>
      <ChatInterface />
    </main>
  );
}