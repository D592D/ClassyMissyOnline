"use client";

import { useCart } from "./CartContext";
import { useState } from "react";
import { X, ShoppingBag, Trash2 } from "lucide-react";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, total, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [redirectUrl, setRedirectUrl] = useState("");

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setStatus("loading");
    
    try {
      const res = await fetch("/api/checkout/mmg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: `ORD-${Date.now()}`,
          amount: total,
          customerPhone: phone,
        }),
      });
      const data = await res.json();
      if (data.success && data.redirectUrl) {
        setStatus("success");
        setRedirectUrl(data.redirectUrl);
        // Normally we'd do: window.location.href = data.redirectUrl;
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isCartOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div 
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? "opacity-100" : "opacity-0"}`} 
        onClick={() => setIsCartOpen(false)} 
      />
      <div className={`absolute top-0 right-0 h-full w-full sm:w-[28rem] bg-white/80 backdrop-blur-2xl shadow-2xl flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] border-l border-white/40 ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0 bg-white/50">
          <h2 className="text-xl font-black flex items-center gap-2 text-slate-800">
            <ShoppingBag className="w-5 h-5 text-pink-600" /> Your Cart
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 bg-gray-100/50 hover:bg-gray-200/50 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <p className="font-medium text-gray-500">Your cart is surprisingly empty.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center bg-white/60 border border-white p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover shadow-sm" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm leading-tight text-gray-900 mb-1">{item.name}</h4>
                    <p className="text-sm font-semibold text-pink-600">GYD {item.price.toLocaleString()} <span className="text-gray-400 font-normal ml-1">x {item.quantity}</span></p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white/70 backdrop-blur-md flex-shrink-0">
            <div className="flex justify-between items-end mb-6">
              <span className="text-gray-500 font-medium">Total</span>
              <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">GYD {total.toLocaleString()}</span>
            </div>
            
            {!isCheckingOut ? (
              <button 
                onClick={() => setIsCheckingOut(true)}
                className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300"
              >
                Checkout with MMG
              </button>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-4">
                <input
                  type="tel"
                  required
                  placeholder="Phone number (e.g. 592-600-0000)"
                  className="w-full border border-gray-200 p-4 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                
                {status === "error" && (
                  <p className="text-xs text-red-500 font-medium bg-red-50 p-2 rounded-lg">Failed to initiate MMG checkout.</p>
                )}
                
                {status === "success" ? (
                  <a href={redirectUrl} target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:-translate-y-1 transition-all">
                    Proceed to Gateway
                  </a>
                ) : (
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setIsCheckingOut(false)} className="px-5 py-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors">Back</button>
                    <button 
                      type="submit" 
                      disabled={status === "loading"}
                      className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-bold flex justify-center items-center shadow-lg hover:shadow-pink-500/40 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {status === "loading" ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : "Pay Now"}
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}