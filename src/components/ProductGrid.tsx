"use client";

import { useCart } from "./CartContext";
import { Product } from "../lib/mockData";

export default function ProductGrid({ products }: { products: Product[] }) {
  const { addToCart } = useCart();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 perspective-1000">
      {products.map((p, index) => (
        <div 
          key={p.id} 
          className="group relative backdrop-blur-xl bg-white/40 border border-white/60 shadow-xl rounded-3xl overflow-hidden flex flex-col hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="relative h-72 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            <img 
              src={p.image} 
              alt={p.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            {p.stock === 0 && (
              <div className="absolute top-4 right-4 z-20 bg-red-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                Sold Out
              </div>
            )}
            <div className="absolute bottom-4 left-4 z-20">
              <h3 className="font-bold text-xl text-white drop-shadow-md">{p.name}</h3>
            </div>
          </div>
          
          <div className="p-5 flex flex-col flex-grow relative z-20 bg-white/60 backdrop-blur-md">
            <p className="text-gray-600 text-sm mt-1 mb-5 flex-grow line-clamp-2">{p.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Price</span>
                <span className="font-extrabold text-pink-600 text-xl">GYD {p.price.toLocaleString()}</span>
              </div>
              <button
                disabled={p.stock === 0}
                onClick={() => addToCart(p)}
                className="bg-black/90 hover:bg-pink-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-pink-500/30 hover:-translate-y-0.5"
                aria-label={`Add ${p.name} to cart`}
              >
                {p.stock === 0 ? "Unavailable" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}