"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Product } from "@/lib/mockData";
import Image from "next/image";
import {
  Package,
  ClipboardList,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Search,
  Upload,
  User,
  ShoppingBag,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  X,
  FileCheck,
  Clock,
  Phone,
  Sparkles
} from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  amount: number;
  customer_phone: string;
  status: "pending" | "paid" | "cancelled";
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  mmg_reference?: string;
}

interface Booking {
  id: string;
  created_at: string;
  service_id: string;
  service_name: string;
  price: number;
  deposit_amount: number;
  customer_phone: string;
  customer_name: string;
  booking_date: string;
  booking_time: string;
  status: "pending" | "paid" | "cancelled";
  mmg_reference?: string;
}

interface ShowcaseItem {
  id: string;
  created_at: string;
  title: string;
  tag: string;
  image_url: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "bookings" | "showcase">("products");

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productSearch, setProductSearch] = useState("");

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingSearch, setBookingSearch] = useState("");

  // Showcase state
  const [showcase, setShowcase] = useState<ShowcaseItem[]>([]);
  const [showcaseLoading, setShowcaseLoading] = useState(true);
  const [showcaseSearch, setShowcaseSearch] = useState("");

  // New Showcase Form states
  const [newShowcaseTitle, setNewShowcaseTitle] = useState("");
  const [newShowcaseTag, setNewShowcaseTag] = useState("");
  const [newShowcaseImg, setNewShowcaseImg] = useState("");
  const [showcaseUploading, setShowcaseUploading] = useState(false);

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [formError, setFormError] = useState("");

  // Auth check on mount
  useEffect(() => {
    const checkSession = async () => {
      if (!isSupabaseConfigured || !supabase) {
        router.replace("/admin/login");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/admin/login");
      } else {
        setSessionChecked(true);
        loadProducts();
        loadOrders();
        loadBookings();
        loadShowcase();
      }
    };
    checkSession();
  }, [router]);

  // Load products from Supabase
  const loadProducts = async () => {
    if (!supabase) return;
    setProductsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  // Load orders from Supabase
  const loadOrders = async () => {
    if (!supabase) return;
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Load bookings from Supabase
  const loadBookings = async () => {
    if (!supabase) return;
    setBookingsLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("booking_date", { ascending: true })
        .order("booking_time", { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error("Error loading bookings:", err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (id: string, newStatus: "paid" | "cancelled") => {
    if (!supabase) return;
    if (!confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) return;
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      loadBookings();
    } catch (err: any) {
      alert(`Failed to update booking status: ${err.message}`);
    }
  };

  // Load showcase items from Supabase
  const loadShowcase = async () => {
    if (!supabase) return;
    setShowcaseLoading(true);
    try {
      const { data, error } = await supabase
        .from("showcase")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setShowcase(data || []);
    } catch (err) {
      console.error("Error loading showcase items:", err);
    } finally {
      setShowcaseLoading(false);
    }
  };

  const handleCreateShowcase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShowcaseTitle || !newShowcaseTag || !newShowcaseImg) {
      alert("Please fill in all showcase fields.");
      return;
    }
    try {
      const { error } = await supabase!
        .from("showcase")
        .insert({
          title: newShowcaseTitle,
          tag: newShowcaseTag,
          image_url: newShowcaseImg,
        });

      if (error) throw error;
      setNewShowcaseTitle("");
      setNewShowcaseTag("");
      setNewShowcaseImg("");
      loadShowcase();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const handleDeleteShowcase = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove ${title} from your showcase?`)) return;
    try {
      const { error } = await supabase!
        .from("showcase")
        .delete()
        .eq("id", id);

      if (error) throw error;
      loadShowcase();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleShowcaseImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    setShowcaseUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `showcase/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setNewShowcaseImg(publicUrl);
    } catch (err: any) {
      alert(`Upload failed: ${err.message || err}`);
    } finally {
      setShowcaseUploading(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  // Auto-generate slug from product name
  const handleNameChange = (nameVal: string) => {
    setFormName(nameVal);
    if (modalMode === "add") {
      setFormSlug(
        nameVal
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim()
      );
    }
  };

  // Image upload directly to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    setImageUploading(true);
    setFormError("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload file to product-images bucket
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setFormImageUrl(publicUrl);
    } catch (err: any) {
      setFormError(`Image upload failed: ${err.message || err}`);
    } finally {
      setImageUploading(false);
    }
  };

  // Open modal in Add mode
  const openAddModal = () => {
    setModalMode("add");
    setSelectedProductId(null);
    setFormName("");
    setFormSlug("");
    setFormPrice("");
    setFormStock("");
    setFormCategory("");
    setFormDescription("");
    setFormImageUrl("");
    setFormError("");
    setIsModalOpen(true);
  };

  // Open modal in Edit mode
  const openEditModal = (product: Product) => {
    setModalMode("edit");
    setSelectedProductId(product.id);
    setFormName(product.name);
    setFormSlug(product.slug);
    setFormPrice(String(product.price));
    setFormStock(String(product.stock));
    setFormCategory(product.category || "");
    setFormDescription(product.description || "");
    setFormImageUrl(product.image || "");
    setFormError("");
    setIsModalOpen(true);
  };

  // Submit product Form (Insert or Update)
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName || !formSlug || !formPrice || !formStock || !formImageUrl) {
      setFormError("Please fill in all required fields (Name, Slug, Price, Stock, Image).");
      return;
    }

    const payload = {
      name: formName,
      slug: formSlug,
      price: parseFloat(formPrice),
      stock: parseInt(formStock, 10),
      category: formCategory || null,
      description: formDescription || null,
      image: formImageUrl,
    };

    try {
      if (modalMode === "add") {
        const { error } = await supabase!
          .from("products")
          .insert(payload);

        if (error) throw error;
      } else {
        const { error } = await supabase!
          .from("products")
          .update(payload)
          .eq("id", selectedProductId);

        if (error) throw error;
      }

      setIsModalOpen(false);
      loadProducts();
    } catch (err: any) {
      setFormError(`Save failed: ${err.message || err}`);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const { error } = await supabase!
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;
      loadProducts();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredBookings = bookings.filter(
    (b) =>
      b.customer_name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customer_phone.includes(bookingSearch) ||
      b.service_name.toLowerCase().includes(bookingSearch.toLowerCase())
  );

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col sm:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full sm:w-64 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0">
        <div>
          <div className="p-6 border-b border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-black text-lg">
              C
            </div>
            <h2 className="font-extrabold text-lg text-slate-800">Classy CMS</h2>
          </div>

          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === "products"
                  ? "bg-pink-50 text-pink-600 shadow-sm"
                  : "text-gray-500 hover:bg-slate-50 hover:text-gray-800"
              }`}
            >
              <Package className="w-4 h-4" />
              Manage Products
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === "orders"
                  ? "bg-pink-50 text-pink-600 shadow-sm"
                  : "text-gray-500 hover:bg-slate-50 hover:text-gray-800"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Orders Tracker
              {orders.filter((o) => o.status === "pending").length > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {orders.filter((o) => o.status === "pending").length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === "bookings"
                  ? "bg-pink-50 text-pink-600 shadow-sm"
                  : "text-gray-500 hover:bg-slate-50 hover:text-gray-800"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Bookings Manager
              {bookings.filter((b) => b.status === "pending").length > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {bookings.filter((b) => b.status === "pending").length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("showcase")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === "showcase"
                  ? "bg-pink-50 text-pink-600 shadow-sm"
                  : "text-gray-500 hover:bg-slate-50 hover:text-gray-800"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Showcase Portfolio
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10 max-w-7xl mx-auto w-full">
        {activeTab === "products" ? (
          <div>
            {/* Products Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-800">Products Catalog</h1>
                <p className="text-gray-500 mt-1">Add, update, or delete catalog items.</p>
              </div>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-5 py-3 rounded-2xl font-bold shadow-lg hover:shadow-pink-500/20 active:scale-95 transition-all text-sm w-fit"
              >
                <Plus className="w-4 h-4" />
                Add New Product
              </button>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-sm max-w-md">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products by name or category..."
                className="w-full text-sm outline-none text-slate-700 bg-transparent"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>

            {/* Products Table/Card View */}
            {productsLoading ? (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-gray-400">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="font-semibold text-gray-500">No products found</p>
                <p className="text-sm mt-1">Try refining your search or add a new product.</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-gray-500 font-black">
                        <th className="py-4 px-6">Product</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6">Price</th>
                        <th className="py-4 px-6">Stock</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-slate-100">
                              <Image
                                src={p.image}
                                alt={p.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate">{p.name}</p>
                              <p className="text-xs text-gray-400 truncate max-w-[250px]">{p.description}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                              {p.category || "General"}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-bold text-pink-600">
                            GYD {p.price.toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            {p.stock === 0 ? (
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-red-50 text-red-600 rounded-full border border-red-100">
                                Sold Out
                              </span>
                            ) : p.stock <= 3 ? (
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                                Low Stock ({p.stock})
                              </span>
                            ) : (
                              <span className="inline-block text-xs font-bold text-gray-700">
                                {p.stock} units
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() => openEditModal(p)}
                              aria-label={`Edit ${p.name}`}
                              className="p-2 hover:bg-slate-100 text-slate-600 hover:text-pink-600 rounded-lg transition-colors inline-flex"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              aria-label={`Delete ${p.name}`}
                              className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors inline-flex"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === "orders" ? (
          <div>
            {/* Orders Tracking View */}
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-800">Orders History</h1>
              <p className="text-gray-500 mt-1">Monitor payments and check out webhook logs.</p>
            </div>

            {ordersLoading ? (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-gray-400">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="font-semibold text-gray-500">No orders registered yet</p>
                <p className="text-sm mt-1">Pending order records will populate here during checkouts.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-slate-800">{o.id}</span>
                          <span
                            className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                              o.status === "paid"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : o.status === "pending"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {o.status === "paid" ? (
                              <>
                                <CheckCircle className="w-3 h-3" /> Paid
                              </>
                            ) : o.status === "pending" ? (
                              <>
                                <AlertCircle className="w-3 h-3" /> Pending
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" /> Cancelled
                              </>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(o.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right sm:text-right">
                        <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider">Total Amount</span>
                        <span className="text-xl font-extrabold text-slate-800">
                          GYD {o.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Customer Details */}
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Customer</h4>
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm space-y-1">
                          <p className="flex items-center gap-2 font-semibold text-slate-700">
                            <User className="w-4 h-4 text-gray-400" />
                            {o.customer_phone}
                          </p>
                          {o.mmg_reference && (
                            <p className="text-xs text-slate-500 font-mono mt-2">
                              MMG Ref: <span className="font-bold text-slate-800">{o.mmg_reference}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Items Details */}
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Cart Items</h4>
                        <ul className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-white">
                          {o.items.map((item, idx) => (
                            <li key={idx} className="p-3 text-xs flex justify-between gap-4">
                              <span className="font-semibold text-slate-800">
                                {item.name} <span className="text-gray-400 font-normal">x{item.quantity}</span>
                              </span>
                              <span className="font-bold text-slate-500">
                                GYD {(item.price * item.quantity).toLocaleString()}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "bookings" ? (
          <div>
            {/* Bookings Tracker View */}
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-800">Bookings Catalog</h1>
              <p className="text-gray-500 mt-1">Manage makeup and masterclass appointments.</p>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-sm max-w-md">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search bookings by customer name or service..."
                className="w-full text-sm outline-none text-slate-700 bg-transparent"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
              />
            </div>

            {bookingsLoading ? (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-gray-400">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="font-semibold text-gray-500">No bookings registered yet</p>
                <p className="text-sm mt-1">Pending booking records will populate here during checkouts.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-slate-800">{b.id}</span>
                          <span
                            className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                              b.status === "paid"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : b.status === "pending"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {b.status === "paid" ? (
                              <>
                                <CheckCircle className="w-3 h-3" /> Confirmed
                              </>
                            ) : b.status === "pending" ? (
                              <>
                                <AlertCircle className="w-3 h-3" /> Pending Deposit
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" /> Cancelled
                              </>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-1.5 font-semibold">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-pink-500" />
                            {b.booking_date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-pink-500" />
                            {b.booking_time}
                          </span>
                        </div>
                      </div>
                      <div className="text-right sm:text-right">
                        <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider">Deposit Paid</span>
                        <span className="text-xl font-extrabold text-slate-800">
                          GYD {b.deposit_amount.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-400 block mt-0.5 font-bold uppercase">Total: GYD {b.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                      {/* Customer Details */}
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Client Details</h4>
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm space-y-1.5">
                          <p className="flex items-center gap-2 font-bold text-slate-800">
                            <User className="w-4 h-4 text-gray-400" />
                            {b.customer_name}
                          </p>
                          <p className="flex items-center gap-2 font-semibold text-slate-600">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {b.customer_phone}
                          </p>
                          {b.mmg_reference && (
                            <p className="text-xs text-slate-500 font-mono mt-2 pt-2 border-t border-slate-200/40">
                              MMG Ref: <span className="font-bold text-slate-800">{b.mmg_reference}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Service Details & Manual Admin Controls */}
                      <div className="flex flex-col gap-4">
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Booked Session</h4>
                          <div className="bg-white border border-slate-150 p-4 rounded-2xl text-sm font-extrabold text-slate-800 shadow-sm flex items-center justify-between">
                            <span>{b.service_name}</span>
                          </div>
                        </div>

                        {b.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateBookingStatus(b.id, "paid")}
                              className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-md active:scale-95"
                            >
                              <CheckCircle className="w-4 h-4" /> Confirm Paid
                            </button>
                            <button
                              onClick={() => handleUpdateBookingStatus(b.id, "cancelled")}
                              className="flex-1 inline-flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all active:scale-95"
                            >
                              <XCircle className="w-4 h-4" /> Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Dynamic Showcase Portfolio Management View */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-800">Showcase Portfolio</h1>
                <p className="text-gray-500 mt-1">Manage makeup and beauty artwork images shown in the booking tab.</p>
              </div>
            </div>

            {/* Quick Add Form Section */}
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm mb-10">
              <h2 className="text-lg font-black text-slate-850 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-600 fill-pink-50" /> Add Portfolio Artwork
              </h2>
              <form onSubmit={handleCreateShowcase} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Artwork Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Signature Soft Glam"
                      className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-pink-500 transition-all font-semibold"
                      value={newShowcaseTitle}
                      onChange={(e) => setNewShowcaseTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Description Tag *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Luminous Skin, Timeless HD"
                      className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-pink-500 transition-all font-semibold"
                      value={newShowcaseTag}
                      onChange={(e) => setNewShowcaseTag(e.target.value)}
                    />
                  </div>
                </div>

                {/* Showcase Image Upload Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center border-t border-slate-100 pt-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Select Artwork Image *
                    </label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-pink-300 p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={handleShowcaseImageUpload}
                        disabled={showcaseUploading}
                      />
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <p className="text-xs font-bold text-gray-500">
                        {showcaseUploading ? "Uploading image..." : "Upload from Device"}
                      </p>
                    </div>
                  </div>

                  {newShowcaseImg ? (
                    <div className="relative h-28 border border-slate-100 rounded-2xl overflow-hidden shadow-inner bg-slate-50 flex items-center justify-center">
                      <img
                        src={newShowcaseImg}
                        alt="Upload preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setNewShowcaseImg("")}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-28 border border-slate-200 border-dashed rounded-2xl flex items-center justify-center text-gray-300 text-xs">
                      No image selected
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={showcaseUploading || !newShowcaseTitle || !newShowcaseTag || !newShowcaseImg}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold transition-all shadow-md disabled:opacity-50 active:scale-95 text-xs uppercase tracking-wider"
                  >
                    Publish to Booking Tab
                  </button>
                </div>
              </form>
            </div>

            {/* List Showcase Catalog Grid */}
            <h2 className="text-lg font-black text-slate-850 mb-6 flex items-center gap-2">
              Active Showcase Catalog ({showcase.length})
            </h2>

            {showcaseLoading ? (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : showcase.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-gray-400">
                <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="font-semibold text-gray-500">Your showcase portfolio is empty</p>
                <p className="text-sm mt-1">Upload artwork above to populate your bookings page catalog.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {showcase.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow relative flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/5] bg-slate-100">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleDeleteShowcase(item.id, item.title)}
                        className="absolute top-3 right-3 p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                        aria-label={`Delete ${item.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4 border-t border-slate-100 bg-white">
                      <span className="text-[8px] text-pink-600 font-extrabold uppercase tracking-widest block mb-0.5">{item.tag}</span>
                      <h3 className="font-bold text-slate-800 text-xs truncate">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Product Form Modal (Add / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => {
              if (!imageUploading) setIsModalOpen(false);
            }}
          />

          {/* Modal Panel */}
          <div className="relative z-10 bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-pink-600" />
                {modalMode === "add" ? "Add New Product" : "Edit Product"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={imageUploading}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="flex-1 overflow-y-auto p-6 space-y-4">
              {formError && (
                <p className="text-xs font-semibold text-red-500 bg-red-50 border border-red-100 p-3 rounded-xl">
                  {formError}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Classic Silk Scarf"
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="classic-silk-scarf"
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Price (GYD) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="12000"
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Stock Level *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="5"
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dresses, Bags"
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell customers about material, fit, sizing, and styling..."
                  className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>

              {/* Image Upload Block */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Product Image *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="border-2 border-dashed border-slate-200 hover:border-pink-300 p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      onChange={handleImageUpload}
                      disabled={imageUploading}
                    />
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-xs font-bold text-gray-500">
                      {imageUploading ? "Uploading image..." : "Upload from Device"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                  </div>

                  {formImageUrl ? (
                    <div className="relative h-32 border border-slate-100 rounded-2xl overflow-hidden shadow-inner bg-slate-50 flex items-center justify-center">
                      <Image
                        src={formImageUrl}
                        alt="Upload preview"
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-32 border border-slate-200 border-dashed rounded-2xl flex items-center justify-center text-gray-300 text-xs">
                      No image selected
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={imageUploading}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={imageUploading}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold transition-all shadow-lg hover:shadow-pink-500/20 active:scale-95 text-sm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
