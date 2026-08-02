import Chatbox from '@/components/chat/Chatbox';

export default function ChatPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-[#00FFFF]">AI Chat Window</h1>
      <Chatbox embedded />
    </main>
  );
}