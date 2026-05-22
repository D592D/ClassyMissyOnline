"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ShoppingBag, MessageCircle, Share2, Check } from "lucide-react";
import { Product } from "@/lib/mockData";
import { CartProvider, useCart } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import { createWhatsAppLink } from "@/lib/whatsapp";

function ProductDetailContent({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappMessage = `Hi Classy Missy! I'm interested in ordering the ${product.name} (GYD ${product.price.toLocaleString()}). Is it available?`;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-pink-50 via-gray-50 to-purple-50">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000 pointer-events-none" />

      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full relative z-10 pt-28 pb-16 px-4">

        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-pink-600 text-sm font-medium mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>

        {/* Product hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">

          {/* Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white/40 backdrop-blur-md border border-white/60">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white text-gray-900 font-black text-xl px-6 py-3 rounded-full shadow-lg">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-pink-600 font-bold bg-pink-50 border border-pink-100 px-3 py-1 rounded-full mb-4 w-fit">
              Classy Missy Collection
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 leading-tight mb-4">
              {product.name}
            </h1>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                GYD {product.price.toLocaleString()}
              </span>
            </div>

            {/* Stock indicator */}
            {!isOutOfStock && product.stock <= 5 && (
              <p className="text-amber-600 text-sm font-semibold mb-4">
                ⚡ Only {product.stock} in stock — order soon!
              </p>
            )}

            {/* CTAs */}
            <div className="space-y-3">
              {isOutOfStock ? (
                <a
                  href={createWhatsAppLink(
                    `Hi Classy Missy, I'm interested in ${product.name}. Please notify me when it's back in stock.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#25D366]/20 hover:bg-[#20b558] hover:-translate-y-0.5 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Notify Me on WhatsApp
                </a>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all hover:-translate-y-0.5 ${added
                      ? "bg-green-500 shadow-green-500/30 text-white"
                      : "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-pink-500/30 hover:shadow-pink-500/50"
                      }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-5 h-5" /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" /> Add to Cart
                      </>
                    )}
                  </button>

                  <a
                    href={createWhatsAppLink(whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 border border-[#d9d1c3] bg-[#f9f7f1] py-4 rounded-2xl font-semibold text-sm tracking-wide hover:bg-[#f2ecdf] transition-colors"
                    aria-label="Order via WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    Order via WhatsApp
                  </a>
                </>
              )}

              {/* Share button */}
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 border border-gray-200 bg-white/50 py-3 rounded-2xl font-medium text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {copied ? (
                  <><Check className="w-4 h-4 text-green-500" /> Link copied!</>
                ) : (
                  <><Share2 className="w-4 h-4" /> Share this product</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-black text-slate-800 mb-6 px-1">You Might Also Like</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </main>

      <CartDrawer />
    </div>
  );
}

// Wrap with CartProvider
export default function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  return (
    <CartProvider>
      <ProductDetailContent product={product} related={related} />
    </CartProvider>
  );
}
