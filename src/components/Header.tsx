"use client";

import { useCart } from "./CartContext";
import { ShoppingBag } from "lucide-react";

export default function Header() {
  const { cart, setIsCartOpen } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed top-0 w-full z-30 px-4 py-3 pb-0 pointer-events-none">
      <header className="max-w-5xl mx-auto backdrop-blur-xl bg-white/70 border border-white/40 shadow-sm px-5 py-3 rounded-2xl flex justify-between items-center pointer-events-auto transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-xl shadow-lg flex items-center justify-center text-white font-black text-xl hover:rotate-6 transition-transform">
            C
          </div>
          <h1 className="font-extrabold text-2xl tracking-tight hidden sm:block text-slate-800 bg-clip-text">
            Classy Missy
          </h1>
        </div>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative bg-white/80 hover:bg-white shadow-sm border border-gray-100 p-2 rounded-full transition-all hover:scale-105 flex items-center gap-2 px-4"
        >
          <ShoppingBag className="w-5 h-5 text-pink-600" />
          <span className="font-semibold text-sm text-gray-700">{itemCount}</span>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md animate-bounce">
              {itemCount}
            </span>
          )}
        </button>
      </header>
    </div>
  );
}