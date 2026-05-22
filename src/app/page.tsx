import { mockProducts } from "@/lib/mockData";
import ProductGrid from "@/components/ProductGrid";
import CartDrawer from "@/components/CartDrawer";
import Header from "@/components/Header";
import { CartProvider } from "@/components/CartContext";

export default function Home() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Animated Background blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-200/50 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/50 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-[500px] h-[500px] bg-pink-200/50 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000"></div>

        <Header />
        
        <main className="flex-1 max-w-6xl mx-auto w-full relative z-10 pt-24">
          <section className="px-4 py-12 sm:py-20 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-white/60 backdrop-blur-md border border-pink-100 text-pink-600 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">New Arrivals</span>
            <h2 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 mb-6 tracking-tight leading-tight">
              Elevate Your <br className="sm:hidden" /> Style Game
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto mb-8 font-medium">
              Upgrade your wardrobe with our exclusive fashion picks. Fast, frictionless checkout with MMG.
            </p>
          </section>

          <ProductGrid products={mockProducts} />
        </main>

        <CartDrawer />
      </div>
    </CartProvider>
  );
}