"use client";

import { useCart } from "./CartContext";
import { useState } from "react";
import Image from "next/image";
import { X, ShoppingBag, Trash2, MessageCircle, Plus, Minus } from "lucide-react";
import { createWhatsAppLink, whatsappContactLabel } from "../lib/whatsapp";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [phoneError, setPhoneError] = useState("");

  const cartSummary = cart
    .map((item) => `${item.name} x${item.quantity}`)
    .join("\n");
  const whatsappMessage = cart.length
    ? `Hi Classy Missy, I want to order these items:\n${cartSummary}\n\nTotal: GYD ${total.toLocaleString()}`
    : "Hi Classy Missy, I would like to shop with you.";

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");

    if (!phone) {
      setPhoneError("Please enter your phone number.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/checkout/mmg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerPhone: phone.replace(/[\s\-()]/g, ""),
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const fieldErrors = data.details?.customerPhone?.[0];
        if (fieldErrors) setPhoneError(fieldErrors);
        setStatus("error");
        return;
      }

      if (data.success && data.redirectUrl) {
        clearCart();
        window.location.assign(data.redirectUrl);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleClose = () => {
    if (status === "loading") return;
    setIsCartOpen(false);
    setIsCheckingOut(false);
    setStatus("idle");
    setPhoneError("");
  };

  return (
    <div className={`fixed inset-0 z-50 ${isCartOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full sm:w-[28rem] bg-white/80 backdrop-blur-2xl shadow-2xl flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] border-l border-white/40 ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0 bg-white/50">
          <h2 className="text-xl font-black flex items-center gap-2 text-slate-800">
            <ShoppingBag className="w-5 h-5 text-pink-600" />
            Your Cart
            {cart.length > 0 && (
              <span className="text-sm font-normal text-gray-400">
                ({cart.length} {cart.length === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close cart"
            className="p-2 bg-gray-100/50 hover:bg-gray-200/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <p className="font-medium text-gray-500">Your cart is surprisingly empty.</p>
              <p className="text-sm text-gray-400 mt-1">Tap a product to add it here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-center bg-white/60 border border-white p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Product thumbnail */}
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm leading-tight text-gray-900 mb-1 truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm font-semibold text-pink-600">
                      GYD {(item.price * item.quantity).toLocaleString()}
                    </p>

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-pink-100 hover:text-pink-600 transition-colors text-gray-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold text-gray-800 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-pink-100 hover:text-pink-600 transition-colors text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="text-gray-400 p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer checkout section */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white/70 backdrop-blur-md flex-shrink-0">
            <div className="flex justify-between items-end mb-6">
              <span className="text-gray-500 font-medium">Total</span>
              <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
                GYD {total.toLocaleString()}
              </span>
            </div>

            {/* WhatsApp order option */}
            <a
              href={createWhatsAppLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mb-4 flex items-center justify-center gap-2 rounded-2xl border border-[#d9d1c3] bg-[#f9f7f1] px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal transition-colors hover:bg-[#f2ecdf]"
              aria-label="Order via WhatsApp"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              Order via WhatsApp
            </a>

            {/* MMG checkout */}
            {!isCheckingOut ? (
              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300"
              >
                Checkout with MMG
              </button>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-3" noValidate>
                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Phone (e.g. 592 600 0000)"
                    className={`w-full border p-4 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all ${phoneError ? "border-red-400" : "border-gray-200"}`}
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setPhoneError(""); }}
                    aria-describedby={phoneError ? "phone-error" : undefined}
                  />
                  {phoneError && (
                    <p id="phone-error" className="text-xs text-red-500 font-medium mt-1 px-1">
                      {phoneError}
                    </p>
                  )}
                </div>

                {status === "error" && !phoneError && (
                  <p className="text-xs text-red-500 font-medium bg-red-50 p-2 rounded-lg">
                    Failed to initiate MMG checkout. Please try again.
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setIsCheckingOut(false); setStatus("idle"); setPhoneError(""); }}
                    className="px-5 py-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-bold flex justify-center items-center shadow-lg hover:shadow-pink-500/40 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {status === "loading" ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </div>
              </form>
            )}

            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-gray-400 text-center">
              Or message us directly at {whatsappContactLabel}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}