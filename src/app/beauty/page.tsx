"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { CartProvider } from "@/components/CartContext";
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Heart, 
  Star, 
  ArrowRight, 
  X, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  category: "glam" | "bridal" | "class";
  price: number;
  deposit: number;
  duration: string;
  description: string;
  features: string[];
}

const SERVICES: Service[] = [
  {
    id: "soft-glam",
    name: "Signature Soft Glam",
    category: "glam",
    price: 8500,
    deposit: 4250,
    duration: "60 Mins",
    description: "A luminous, natural-finish look featuring flawless skin prep, soft neutral eyes, a delicate brow fill, and a classic nude lip.",
    features: ["Premium strip lashes included", "Hydrating skin prep", "Long-wear setting finish"]
  },
  {
    id: "ultra-glam",
    name: "Ultra-Glam / Photoshoot Special",
    category: "glam",
    price: 12000,
    deposit: 6000,
    duration: "90 Mins",
    description: "A dramatic, full-coverage transformation featuring intense cut-creases, graphic liners, glitter highlights, sculpted contouring, and luxury 3D mink lashes.",
    features: ["Luxury 3D Mink lashes included", "HD contouring & baking", "Water-resistant setting finish"]
  },
  {
    id: "royal-bridal",
    name: "The Royal Bridal Glam",
    category: "bridal",
    price: 35000,
    deposit: 17500,
    duration: "120 Mins",
    description: "The ultimate bridal package. Includes a mandatory pre-wedding trial session, ultra-long-wear HD skin prep, high-end water-resistant finishes, and a mini touch-up kit.",
    features: ["Mandatory pre-wedding trial session", "HD airbrush-effect skin prep", "Deluxe touch-up kit included", "Priority travel booking option"]
  },
  {
    id: "bridal-bridesmaids",
    name: "Bridesmaids / Party Beat",
    category: "bridal",
    price: 10000,
    deposit: 5000,
    duration: "75 Mins",
    description: "Cohesive, elegant, long-lasting glam tailored to coordinate beautifully with the wedding theme.",
    features: ["Strip lashes included", "Unified bridal party color palette", "Matte long-wear finish"]
  },
  {
    id: "class-1on1",
    name: "1-on-1 'Own Your Face' Class",
    category: "class",
    price: 35000,
    deposit: 17500,
    duration: "2 Hours",
    description: "A private, hands-on masterclass where clients learn self-application. Covers matching foundations, perfect brows, everyday-to-evening transitions, and brushes.",
    features: ["Complimentary beauty sponge", "Personalized product review", "Step-by-step PDF face map"]
  },
  {
    id: "class-group",
    name: "Group Glam Masterclass",
    category: "class",
    price: 25000,
    deposit: 12500,
    duration: "3 Hours",
    description: "Hands-on workshop for up to 6 people. Perfect for bridal showers or girls' night out. Includes a gift bag of curated cosmetics.",
    features: ["Curated cosmetics gift bag", "Live model demonstration", "Sip & Glam refreshments"]
  }
];

const TIME_SLOTS = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];

export default function BeautyBookingPage() {
  const [activeTab, setActiveTab] = useState<"glam" | "bridal" | "class">("glam");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Booking Flow States
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // UI Flow States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const filteredServices = SERVICES.filter(s => s.category === activeTab);

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setErrorMsg("");
    setIsDrawerOpen(true);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!bookingDate || !bookingTime || !customerName || !customerPhone || !selectedService) {
      setErrorMsg("Please fill in all details before proceeding.");
      return;
    }

    // Phone validation: +592 or 7-digit mobile
    const phoneRegex = /^(?:\+?592)?[6-7]\d{6}$/;
    if (!phoneRegex.test(customerPhone.trim())) {
      setErrorMsg("Please enter a valid Guyanese mobile number (e.g. 6201234 or 5926201234).");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/checkout/mmg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "booking",
          amount: selectedService.deposit,
          customerPhone: customerPhone.trim(),
          customerName: customerName.trim(),
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          price: selectedService.price,
          bookingDate,
          bookingTime,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate checkout handshake.");
      }

      // Redirect to Hosted MMG Gateway (mock or real depending on configs)
      window.location.href = data.redirectUrl;
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected checkout error occurred.");
      setLoading(false);
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
        {/* Animated background blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000 pointer-events-none" />
        <div className="absolute -bottom-32 left-20 w-[500px] h-[500px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 pointer-events-none" />

        <Header />

        <main className="flex-1 max-w-6xl mx-auto w-full relative z-10 pt-24 px-4 sm:px-6 pb-20">
          {/* Hero Section */}
          <section className="py-12 sm:py-16 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1 py-1 px-3.5 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-100/50 backdrop-blur-md text-pink-600 text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" /> Professional Glam & Artistry
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-800 mb-6 tracking-tight leading-tight">
              Classy Missy{" "}
              <span className="bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Beauty Bar
              </span>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base font-medium">
              Flawless soft glams, photoshoot-ready makeups, royal bridal packages, and hands-on artistry classes. Book your session inside our Georgetown physical boutique with a secure 50% deposit checkout.
            </p>
          </section>

          {/* Navigation Tabs */}
          <div className="flex justify-center gap-2 mb-10 border-b border-slate-200/60 pb-4 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab("glam")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                activeTab === "glam"
                  ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              Glam Artistry
            </button>
            <button
              onClick={() => setActiveTab("bridal")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                activeTab === "bridal"
                  ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              Bridal Services
            </button>
            <button
              onClick={() => setActiveTab("class")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                activeTab === "class"
                  ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              Masterclasses
            </button>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {filteredServices.map(service => (
              <div
                key={service.id}
                className="bg-white/80 backdrop-blur-md border border-white hover:border-pink-200 shadow-sm hover:shadow-lg rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between group relative"
              >
                {service.category === "bridal" && (
                  <div className="absolute -top-3 left-6 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-yellow-400/30">
                    <Star className="w-3 h-3 fill-white" /> Premium Package
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="text-xl font-extrabold text-slate-800 leading-snug">
                      {service.name}
                    </h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg flex-shrink-0">
                      {service.duration}
                    </span>
                  </div>

                  <p className="text-gray-500 text-xs sm:text-sm mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-slate-600">
                        <Heart className="w-3.5 h-3.5 text-pink-500 flex-shrink-0 fill-pink-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-100 pt-5 flex justify-between items-center gap-4">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">50% Deposit Due</span>
                    <span className="text-2xl font-black text-pink-600">
                      GYD {service.deposit.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Total: GYD {service.price.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => handleSelectService(service)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold uppercase tracking-widest px-5 py-3.5 rounded-2xl shadow-md hover:shadow-pink-500/25 active:scale-95 transition-all w-fit"
                  >
                    Select & Book <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Portfolio Section */}
          <section className="mt-20 border-t border-slate-200/60 pt-16 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-1 py-1 px-3.5 rounded-full bg-yellow-500/10 border border-yellow-200/30 text-yellow-600 text-[9px] font-black uppercase tracking-widest mb-3">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> Artistry Showcase
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                Our Work Portfolio
              </h3>
              <p className="text-gray-400 text-xs mt-1 font-medium">
                Sleek contours, radiant finishes, and flawless beats by our master artists.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  title: "Signature Soft Glam",
                  img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
                  tag: "Luminous Skin"
                },
                {
                  title: "Royal Bridal",
                  img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
                  tag: "Timeless HD"
                },
                {
                  title: "Photoshoot Special",
                  img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80",
                  tag: "Cut-Crease Glam"
                },
                {
                  title: "Editorial Radiant",
                  img: "https://images.unsplash.com/photo-1503249023995-51b0f3778ccf?auto=format&fit=crop&w=600&q=80",
                  tag: "Satin Finish"
                }
              ].map((work, idx) => (
                <div 
                  key={idx} 
                  className="relative group rounded-3xl overflow-hidden shadow-sm aspect-[4/5] bg-slate-100 border border-slate-200/50 hover:border-pink-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <img 
                    src={work.img} 
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Glassmorphic overlay details */}
                  <div className="absolute inset-x-3 bottom-3 p-3 bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl flex flex-col justify-end pointer-events-none transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-[8px] text-pink-600 font-black uppercase tracking-widest mb-0.5">{work.tag}</span>
                    <span className="font-extrabold text-slate-800 text-[10px] leading-snug">{work.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Sliding Booking Drawer Backdrop */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => {
              if (!loading) setIsDrawerOpen(false);
            }}
          />
        )}

        {/* Sliding Booking Drawer Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white border-l border-slate-200 z-50 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <span className="inline-block text-[9px] font-black uppercase tracking-widest text-pink-600 bg-pink-50 border border-pink-100 px-2.5 py-0.5 rounded-full mb-1">
                Glam Booking
              </span>
              <h2 className="text-xl font-black text-slate-800 leading-snug">
                Configure Your Session
              </h2>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              disabled={loading}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center border border-slate-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleCheckout} className="flex-1 overflow-y-auto p-6 space-y-6">
            {errorMsg && (
              <div className="bg-red-50 border border-red-100 p-3 rounded-2xl flex gap-2.5 items-start text-xs font-semibold text-red-500">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            {selectedService && (
              <div className="bg-pink-50/50 border border-pink-100/50 p-4 rounded-2xl shadow-inner">
                <span className="text-[9px] text-pink-500 font-bold uppercase tracking-wider block mb-0.5">Selected Package</span>
                <span className="font-extrabold text-slate-800 text-sm block leading-snug">{selectedService.name}</span>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-pink-100/40">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Deposit Required</span>
                  <span className="font-black text-pink-600 text-base">GYD {selectedService.deposit.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Date & Time Selectors */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-pink-500" /> Select Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-slate-200 p-3.5 rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all font-semibold text-slate-700 bg-white"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-pink-500" /> Time Slot *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setBookingTime(time)}
                      className={`py-3 px-2 border rounded-xl text-[10px] font-black text-center transition-all ${
                        bookingTime === time
                          ? "bg-pink-600 border-pink-600 text-white shadow-md shadow-pink-500/25"
                          : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 border-t border-slate-100 pt-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-pink-500" /> Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  className="w-full border border-slate-200 p-3.5 rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all font-semibold text-slate-700 bg-white"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-pink-500" /> Guyanese Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 6201234 or +592 620 1234"
                  className="w-full border border-slate-200 p-3.5 rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all font-semibold text-slate-700 bg-white"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>
          </form>

          {/* Footer Checkout Button */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={handleCheckout}
              disabled={loading || !bookingDate || !bookingTime || !customerName || !customerPhone}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-99 disabled:opacity-50 disabled:hover:shadow-none disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Pay Deposit via MMG</span>
                  <CheckCircle className="w-4 h-4 text-white" />
                </>
              )}
            </button>
            <p className="text-[9px] text-center text-slate-400 mt-2.5 leading-snug">
              Secure payments powered by MMG hosted gateway. All booking deposits are 50% non-refundable and lock your Georgetown slot.
            </p>
          </div>
        </div>
      </div>
    </CartProvider>
  );
}
