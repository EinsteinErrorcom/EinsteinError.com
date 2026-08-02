import Link from 'next/link';

export default function TrialExpiredPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Your Free Trial Has Ended</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Subscribe to continue using MAX-LIT and access the full SUPERComputer.
      </p>
      <Link
        href="/pricing"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        View Pricing
      </Link>
    </div>
  );
}
