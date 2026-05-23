import { mockProducts } from "@/lib/mockData";
import { fetchLiveProducts } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";
import CartDrawer from "@/components/CartDrawer";
import Header from "@/components/Header";
import { CartProvider } from "@/components/CartContext";
import { MessageCircle } from "lucide-react";
import { createWhatsAppLink, whatsappContactLabel } from "@/lib/whatsapp";

async function getProducts() {
  try {
    const live = await fetchLiveProducts();
    return live.length > 0 ? live : mockProducts;
  } catch {
    return mockProducts;
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-200/50 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/50 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000 pointer-events-none" />
        <div className="absolute -bottom-32 left-20 w-[500px] h-[500px] bg-pink-200/50 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000 pointer-events-none" />

        <Header />

        <main className="flex-1 max-w-6xl mx-auto w-full relative z-10 pt-24">
          {/* Hero section */}
          <section className="px-4 py-12 sm:py-20 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-pink-600/10 backdrop-blur-md border border-pink-100 text-pink-600 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
              New Arrivals ✨
            </span>
            <h2 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 mb-6 tracking-tight leading-tight">
              Elevate Your{" "}
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Style Game
              </span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto mb-8 font-medium">
              Georgetown's premium fashion destination. Exclusive picks delivered fast
              with frictionless MMG checkout.
            </p>
            <div className="flex items-center justify-center">
              <a
                href={createWhatsAppLink("Hi Classy Missy, I want to shop the collection!")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-pink-brand text-white px-8 py-4 rounded-full uppercase tracking-[0.2em] text-[11px] font-bold shadow-lg border-2 border-pink-brand transition-all duration-300 hover:scale-105 hover:shadow-pink-500/40 focus:scale-105 group"
                style={{ minWidth: 240, justifyContent: "center" }}
              >
                <MessageCircle className="h-5 w-5 text-[#25D366] group-hover:scale-110 transition-transform" />
                Shop The Collection
              </a>
            </div>
          </section>

          {/* Product grid */}
          <ProductGrid products={products} />
        </main>

        {/* WhatsApp FAB */}
        <a
          href={createWhatsAppLink("Hi Classy Missy, I need help with my order.")}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg shadow-[#25D366]/30 transition-all hover:scale-105 hover:shadow-[#25D366]/50 sm:bottom-6 sm:right-6"
          aria-label={`Chat on WhatsApp at ${whatsappContactLabel}`}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden sm:inline">WhatsApp</span>
        </a>

        <CartDrawer />
      </div>
    </CartProvider>
  );
}