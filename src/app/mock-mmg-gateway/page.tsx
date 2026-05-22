import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function MockGatewayPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-lg p-8 text-center border-t-4 border-primary">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black mb-2 text-gray-900">Mock Web Gateway</h1>
        <p className="text-gray-500 mb-8 text-sm">
          Simulating a successful cryptographic handshake with the MMG Payment Server in local dev mode.
        </p>
        
        <Link 
          href="/"
          className="block w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition"
        >
          Return to Storefront
        </Link>
      </div>
    </div>
  );
}