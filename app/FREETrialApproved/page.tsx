import Image from 'next/image';
import Chatbox from '@/components/chat/Chatbox';

export default function FREETrialApprovedPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Image 
        src="/FREETRIALAPPROVED.png" 
        alt="Free Trial Approved" 
        width={500} 
        height={300} 
      />
      <h1>Welcome to your Trial!</h1>
      <Chatbox />
    </div>
  );
}