"use client";

import { useCart } from "./CartContext";
import { ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { itemCount, setIsCartOpen } = useCart();
  const pathname = usePathname();

  return (
    <div className="fixed top-0 w-full z-30 px-4 py-3 pb-0 pointer-events-none">
      <header className="max-w-5xl mx-auto backdrop-blur-xl bg-white/70 border border-white/40 shadow-sm px-4 sm:px-5 py-3 rounded-2xl flex justify-between items-center pointer-events-auto transition-all duration-300">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-xl shadow-lg flex items-center justify-center text-white font-black text-lg hover:rotate-6 transition-transform">
            C
          </div>
          <span className="font-black text-lg tracking-tight hidden sm:block text-slate-800">
            Classy Missy
          </span>
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100/60 border border-slate-200/40 p-1 rounded-xl">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
              pathname === "/"
                ? "bg-white text-pink-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Shop
          </Link>
          <Link
            href="/beauty"
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
              pathname === "/beauty"
                ? "bg-white text-pink-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-3 h-3 text-pink-500 fill-pink-500/20" />
            Beauty Bar
          </Link>
        </nav>

        <button
          onClick={() => setIsCartOpen(true)}
          aria-label={`Open cart — ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
          className="relative bg-white/80 hover:bg-white shadow-sm border border-gray-100 p-2 rounded-full transition-all hover:scale-105 flex items-center gap-1 px-3"
        >
          <ShoppingBag className="w-4 h-4 text-pink-600" />
          <span className="font-semibold text-xs text-gray-700">{itemCount}</span>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-md animate-bounce">
              {itemCount}
            </span>
          )}
        </button>
      </header>
    </div>
  );
}