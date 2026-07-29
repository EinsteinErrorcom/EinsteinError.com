"use client";
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();

  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold">Payment Successful!</h1>
      <p className="mt-4">Thank you for your purchase.</p>
      
      <button 
        onClick={() => router.push('/chat')}
        className="mt-6 px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition"
      >
        Click to Open Chat
      </button>
    </main>
  );
}