export default function PricingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Choose Your Plan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Example Plan Card */}
        <div className="border p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold">SUPERComputer Access</h2>
          <p className="text-4xl font-bold my-4">$XX.XX</p>
          <p className="mb-6 text-gray-600">Get full access to the power of the SUPERComputer.</p>
          
          <a href="https://www.EinsteinGravity.com/stripe-payment" className="block w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
            Buy Now
          </a>
        </div>
      </div>
    </div>
  );
}