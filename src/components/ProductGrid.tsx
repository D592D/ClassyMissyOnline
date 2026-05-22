"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import { Product } from "../lib/mockData";
import { createWhatsAppLink } from "../lib/whatsapp";

export default function ProductGrid({ products }: { products: Product[] }) {
  const { addToCart } = useCart();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {products.map((p, index) => (
        <div
          key={p.id}
          className="group relative backdrop-blur-xl bg-white/40 border border-white/60 shadow-xl rounded-3xl overflow-hidden flex flex-col hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl animate-fade-up"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          {/* Product image — links to shareable product page */}
          <Link href={`/shop/${p.slug}`} className="block relative h-72 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <Image
              src={p.image}
              alt={p.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority={index === 0}
            />

            {/* Out-of-stock badge */}
            {p.stock === 0 && (
              <div className="absolute top-4 right-4 z-20 bg-[#f7f1e4] text-charcoal text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 rounded-full shadow-sm border border-[#e8dcc2]">
                Sold Out
              </div>
            )}

            {/* Low stock warning */}
            {p.stock > 0 && p.stock <= 3 && (
              <div className="absolute top-4 right-4 z-20 bg-amber-50 text-amber-700 text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 rounded-full shadow-sm border border-amber-200">
                Only {p.stock} left
              </div>
            )}

            <div className="absolute bottom-4 left-4 z-20">
              <h3 className="font-bold text-xl text-white drop-shadow-md">{p.name}</h3>
            </div>
          </Link>

          {/* Card body */}
          <div className="p-5 flex flex-col flex-grow relative z-20 bg-white/60 backdrop-blur-md">
            <p className="text-gray-600 text-sm mt-1 mb-5 flex-grow line-clamp-2">{p.description}</p>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Price</span>
                <span className="font-extrabold text-pink-600 text-xl">GYD {p.price.toLocaleString()}</span>
              </div>

              {p.stock === 0 ? (
                <a
                  href={createWhatsAppLink(
                    `Hi Classy Missy, I'm interested in ${p.name}. Please notify me when it's back in stock.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-charcoal hover:bg-pink-brand text-[#25D366] px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-pink-500/30 hover:-translate-y-0.5"
                  aria-label={`Notify me about ${p.name} on WhatsApp`}
                >
                  Notify Me
                </a>
              ) : (
                <button
                  onClick={() => addToCart(p)}
                  className="bg-black/90 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-pink-500/30 hover:-translate-y-0.5"
                  aria-label={`Add ${p.name} to cart`}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}