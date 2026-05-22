import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { createWhatsAppLink } from "@/lib/whatsapp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Cancelled — Classy Missy Collection",
  description: "Your payment was cancelled. You can try again or order via WhatsApp.",
};

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-gray-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-xl max-w-md w-full rounded-3xl shadow-2xl p-10 text-center border border-white/60">

        {/* Icon */}
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-slate-800 mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 mb-2">
          No worries — your cart items are still saved and waiting for you.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          You can try MMG checkout again, or place your order directly through WhatsApp.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-gray-900 to-black text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            Return to Shop
          </Link>

          <a
            href={createWhatsAppLink("Hi Classy Missy! I had trouble completing my MMG payment. Can you help me place my order?")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-semibold py-4 rounded-2xl hover:bg-[#20b558] transition-colors shadow-lg shadow-[#25D366]/20"
          >
            <MessageCircle className="w-4 h-4" />
            Order via WhatsApp instead
          </a>
        </div>
      </div>
    </div>
  );
}
