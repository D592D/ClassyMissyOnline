import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { createWhatsAppLink } from "@/lib/whatsapp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Successful — Classy Missy Collection",
  description: "Your payment was successful. Thank you for shopping with Classy Missy Collection.",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-gray-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-xl max-w-md w-full rounded-3xl shadow-2xl p-10 text-center border border-white/60">

        {/* Animated checkmark */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full animate-ping opacity-20" />
          <div className="relative w-24 h-24 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-2">
          Your order has been placed and is being processed.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          You'll receive a confirmation shortly. We're packaging your Classy Missy pieces with love 💕
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all"
          >
            Continue Shopping
          </Link>

          <a
            href={createWhatsAppLink("Hi Classy Missy! I just completed my order. Can you confirm my order status?")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border border-gray-200 bg-white/50 text-gray-700 font-semibold py-4 rounded-2xl hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            Message us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
