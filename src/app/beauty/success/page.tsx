"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Calendar, Clock, Sparkles, Receipt, CheckCircle } from "lucide-react";
import { createWhatsAppLink, whatsappContactLabel } from "@/lib/whatsapp";

function BookingSuccessContent() {
  const searchParams = useSearchParams();

  const serviceName = searchParams.get("serviceName") || "Glam Beauty Session";
  const date = searchParams.get("date") || "Selected Date";
  const time = searchParams.get("time") || "Selected Time";
  const deposit = searchParams.get("deposit") || "0";
  const bookingId = searchParams.get("bookingId") || "BK-UNKNOWN";

  const messageText = `Hi Classy Missy Glam! 🎀 I've just booked the "${serviceName}" session for ${date} at ${time}. Deposit of GYD ${parseFloat(deposit).toLocaleString()} successfully paid via MMG! ✨ (Booking ID: ${bookingId})`;
  const whatsappUrl = createWhatsAppLink(messageText);

  return (
    <div className="bg-white/80 backdrop-blur-xl max-w-md w-full rounded-3xl shadow-2xl p-8 sm:p-10 text-center border border-white/60 relative overflow-hidden">
      {/* Background visual halo */}
      <div className="absolute top-[-100px] left-[-100px] w-[250px] h-[250px] bg-pink-300/20 rounded-full blur-[60px] pointer-events-none" />

      {/* Animated Glam checkmark */}
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full animate-ping opacity-20" />
        <div className="relative w-24 h-24 bg-gradient-to-tr from-pink-500 via-pink-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
      </div>

      <span className="inline-flex items-center gap-1 py-1 px-3 rounded-full bg-pink-100 text-pink-600 text-[10px] font-black uppercase tracking-widest mb-3 border border-pink-200">
        <Sparkles className="w-3 h-3" /> Booking Confirmed
      </span>

      <h1 className="text-3xl font-black text-slate-800 mb-2 leading-tight">
        You're Booked!
      </h1>
      <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
        Your 50% deposit has been processed. We can't wait to elevate your glam! 💄✨
      </p>

      {/* Appointment Summary Card */}
      <div className="bg-slate-50/50 border border-slate-200/60 p-5 rounded-2xl text-left space-y-3.5 mb-8 shadow-inner">
        <div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Booking ID</span>
          <span className="font-mono font-bold text-slate-800 text-xs bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 w-fit block">{bookingId}</span>
        </div>

        <div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Service</span>
          <span className="font-extrabold text-slate-800 text-sm">{serviceName}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Date</span>
              <span className="font-bold text-slate-800 text-xs">{date}</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Time Slot</span>
              <span className="font-bold text-slate-800 text-xs">{time}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Deposit Paid (MMG)</span>
          </div>
          <span className="font-extrabold text-pink-600 text-sm">
            GYD {parseFloat(deposit).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#25D366]/20 transition-all hover:scale-102 group active:scale-98"
        >
          <MessageCircle className="w-5 h-5 text-white animate-pulse group-hover:scale-110 transition-transform" />
          Confirm on WhatsApp
        </a>

        <Link
          href="/"
          className="block w-full border border-slate-200 bg-white hover:bg-slate-50 text-gray-700 font-bold py-4 rounded-2xl transition-colors text-sm"
        >
          Back to Storefront
        </Link>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-50 via-gray-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-pink-300/30 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-purple-300/30 rounded-full blur-[80px] pointer-events-none" />

      <Suspense fallback={
        <div className="bg-white/80 backdrop-blur-xl max-w-md w-full rounded-3xl shadow-2xl p-10 text-center border border-white/60 flex items-center justify-center min-h-[350px]">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <BookingSuccessContent />
      </Suspense>
    </div>
  );
}
