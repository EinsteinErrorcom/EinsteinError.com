import Image from 'next/image';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Wrapping the image in a Link makes the entire graphic clickable */}
      <Link href="/gem">
        <Image 
          src="/successpage.png" 
          alt="Payment Successful - Click to OPEN the SUPERComputer" 
          width={700} 
          height={1000} 
          priority={true}
          className="cursor-pointer hover:opacity-90 transition-opacity"
        />
      </Link>
    </div>
  );
}