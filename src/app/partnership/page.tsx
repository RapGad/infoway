"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi, ShoppingBag, Store, MapPin, Phone, ArrowRight,
  CheckCircle, Star, Search, Filter, ShoppingCart, X, Plus, Minus,
  Trash2, ShieldCheck, Tag, ArrowLeft, Radio, Sparkles, MessageCircle
} from "lucide-react";

interface Business {
  _id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  phone: string;
  email?: string;
  badge?: string;
  productCount?: number;
}

interface Product {
  _id: string;
  businessId: string;
  businessName: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  featured?: boolean;
  tags?: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

const CATEGORIES = [
  "all",
  "Food & Groceries",
  "Electronics & Gadgets",
  "Fashion & Apparel",
  "Agriculture",
  "Services & Repairs",
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function PartnershipPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Cart & Checkout state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phone: "",
    deliveryAddress: "",
    city: "Duayaw Nkwanta",
    paymentMethod: "cash_on_delivery" as "cash_on_delivery" | "mobile_money" | "pickup",
    notes: "",
  });

  // Fetch businesses & track marketplace visit
  useEffect(() => {
    // Track visit from captive portal or direct browsing
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const source = params.get("source") || "direct";
      const mac = params.get("mac");
      const user = params.get("user");

      fetch("/api/analytics/track-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          mac,
          username: user,
          path: window.location.pathname,
        }),
      }).catch(() => {});
    }

    // Attempt auto-seed if first time
    fetch("/api/seed", { method: "POST" })
      .catch(() => {})
      .finally(() => {
        fetchBusinesses();
      });
  }, []);

  async function fetchBusinesses() {
    setLoading(true);
    try {
      const res = await fetch("/api/businesses");
      const data = await res.json();
      if (data.success) {
        setBusinesses(data.businesses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function selectBusiness(biz: Business) {
    setSelectedBusiness(biz);
    setLoadingProducts(true);

    // Track business inspection
    fetch("/api/analytics/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "shop_view",
        businessName: biz.name,
        path: `/partnership#${biz._id}`,
      }),
    }).catch(() => {});

    try {
      const res = await fetch(`/api/products?businessId=${biz._id}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  }

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function updateQuantity(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product._id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  async function handleOrderSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmittingOrder(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: checkoutForm.name,
            phone: checkoutForm.phone,
            deliveryAddress: checkoutForm.deliveryAddress,
            city: checkoutForm.city,
          },
          items: cart.map((item) => ({
            productId: item.product._id,
            productName: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            businessId: item.product.businessId,
            businessName: item.product.businessName,
          })),
          paymentMethod: checkoutForm.paymentMethod,
          notes: checkoutForm.notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderSuccess(data.order.orderNumber);
        setCart([]);
        setCheckoutOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingOrder(false);
    }
  }

  const filteredBusinesses = businesses.filter((biz) => {
    const matchesCat = activeCategory === "all" || biz.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      biz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      biz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      biz.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gray-900 text-white pt-16 pb-20">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
          <svg className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#FF6B00" strokeWidth="0.5" fill="none" strokeDasharray="3 6" />
            <circle cx="50" cy="50" r="28" stroke="#FF6B00" strokeWidth="0.8" fill="none" strokeDasharray="5 10" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 px-4 py-1.5 rounded-full text-primary text-sm font-semibold mb-6">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Infoway Hotspot Advertising & Partnership</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-6">
              Empowering Local Businesses Through <span className="text-primary">Connectivity.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl text-gray-300 mb-8 leading-relaxed">
              We leverage our community internet hotspots to promote local businesses and entrepreneurs. Explore our verified partners, browse their inventory, and place your orders directly.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-wrap gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 text-primary" /> Verified Merchants
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <Wifi className="w-4 h-4 text-primary" /> Powered by Infoway Hotspots
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" /> Direct Local Ordering
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Main Interactive Section ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!selectedBusiness ? (
          /* View 1: Partnered Businesses Directory */
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-primary font-bold text-sm tracking-wider uppercase mb-2 block">
                  Partner Directory
                </span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                  Businesses We Are Working With
                </h2>
                <p className="text-gray-500 mt-2">
                  Select any partner to explore their products and place orders.
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-primary text-sm text-gray-900 transition-colors"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
              <Filter className="w-4 h-4 text-gray-400 shrink-0 ml-1 mr-1" />
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat === "all" ? "All Categories" : cat}
                </button>
              ))}
            </div>

            {/* Business Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-gray-100 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl">
                <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700">No partner businesses found</h3>
                <p className="text-gray-400 mt-1">Try selecting another category or clear your search.</p>
              </div>
            ) : (
              <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBusinesses.map((biz) => (
                  <motion.div
                    key={biz._id}
                    variants={fadeIn}
                    className="group bg-white border border-gray-100 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="w-14 h-14 bg-accent-light rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                          <Store className="w-7 h-7" />
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {biz.badge || "Partner Business"}
                        </span>
                      </div>

                      <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                        {biz.category}
                      </span>
                      <h3 className="text-2xl font-heading font-bold text-gray-900 group-hover:text-primary transition-colors mb-3">
                        {biz.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        {biz.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="space-y-2 mb-5 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary shrink-0" />
                          <span>{biz.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary shrink-0" />
                          <span>{biz.phone}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => selectBusiness(biz)}
                        className="w-full py-3.5 bg-gray-900 group-hover:bg-primary text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/30"
                      >
                        <span>View Products & Order</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        ) : (
          /* View 2: Selected Business Products Storefront */
          <div>
            <div className="mb-10">
              <button
                onClick={() => setSelectedBusiness(null)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Partner Businesses</span>
              </button>

              <div className="bg-accent-light border border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                      {selectedBusiness.badge || "Hotspot Partner"}
                    </span>
                    <span className="text-xs font-bold text-gray-500 uppercase">
                      {selectedBusiness.category}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                    {selectedBusiness.name}
                  </h2>
                  <p className="text-gray-600 mt-2 max-w-2xl text-sm leading-relaxed">
                    {selectedBusiness.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{selectedBusiness.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{selectedBusiness.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                    <p className="text-xs text-gray-400 uppercase font-semibold">Available Products</p>
                    <p className="text-3xl font-heading font-bold text-primary mt-1">{products.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Listing */}
            <div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                Products & Offerings
              </h3>

              {loadingProducts ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 bg-gray-100 rounded-3xl animate-pulse" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-3xl">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-semibold">No products listed by this partner yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Products can be added via the Admin Dashboard.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const inCart = cart.find((i) => i.product._id === product._id);
                    return (
                      <div
                        key={product._id}
                        className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 rounded-lg text-gray-600">
                              {product.category}
                            </span>
                            {product.featured && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-lg">
                                <Star className="w-3 h-3 fill-yellow-500" /> Featured
                              </span>
                            )}
                          </div>

                          <h4 className="text-xl font-bold font-heading text-gray-900 mb-2">
                            {product.name}
                          </h4>
                          <p className="text-gray-500 text-sm leading-relaxed mb-4">
                            {product.description}
                          </p>

                          {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-6">
                              {product.tags.map((t, idx) => (
                                <span key={idx} className="text-[11px] bg-accent-light text-primary font-medium px-2 py-0.5 rounded-full">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-gray-400 block font-medium">Price</span>
                            <span className="text-2xl font-bold text-gray-900">
                              GHS {product.price.toLocaleString()}
                            </span>
                          </div>

                          {inCart ? (
                            <div className="flex items-center gap-2 bg-primary/10 rounded-2xl p-1.5">
                              <button
                                onClick={() => updateQuantity(product._id, -1)}
                                className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-bold text-sm text-primary px-2">{inCart.quantity}</span>
                              <button
                                onClick={() => updateQuantity(product._id, 1)}
                                className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(product)}
                              className="px-5 py-2.5 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-all shadow-md shadow-primary/20 flex items-center gap-2 text-sm"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>Order</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ── Floating Cart Button ── */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-22 right-4 sm:bottom-24 sm:right-6 z-40 max-w-[calc(100vw-2rem)]"
          >
            <button
              onClick={() => setCartOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white px-5 sm:px-6 py-3.5 sm:py-4 rounded-full shadow-2xl shadow-primary/40 flex items-center gap-2.5 sm:gap-3 font-bold transition-all text-sm sm:text-base transform hover:scale-105 active:scale-95"
            >
              <div className="relative shrink-0">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute -top-2 -right-2 bg-white text-primary text-[10px] sm:text-xs font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow">
                  {cartItemCount}
                </span>
              </div>
              <span className="truncate">View Order (GHS {cartTotal.toLocaleString()})</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cart Drawer ── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                  <h3 className="font-heading font-bold text-xl text-gray-900">Your Order</h3>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No items in your order yet.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product._id}
                      className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-semibold text-primary block truncate">
                          {item.product.businessName}
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm truncate">{item.product.name}</h4>
                        <p className="text-gray-500 text-xs">
                          GHS {item.product.price.toLocaleString()} each
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product._id, -1)}
                          className="w-7 h-7 bg-white rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, 1)}
                          className="w-7 h-7 bg-white rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors ml-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="text-2xl font-bold font-heading text-gray-900">
                      GHS {cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                    className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Checkout Modal ── */}
      <AnimatePresence>
        {checkoutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-gray-900">Complete Your Order</h3>
                    <p className="text-gray-500 text-xs mt-1">Direct from our partner merchant</p>
                  </div>
                  <button
                    onClick={() => setCheckoutOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kwame Mensah"
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number (Calls & WhatsApp)</label>
                    <input
                      type="tel"
                      required
                      placeholder="050 000 0000"
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City / Town</label>
                      <input
                        type="text"
                        required
                        placeholder="Duayaw Nkwanta"
                        value={checkoutForm.city}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Delivery Address / Landmark</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Near Market Square, House #14"
                        value={checkoutForm.deliveryAddress}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, deliveryAddress: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Payment / Fulfillment</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: "cash_on_delivery", label: "Cash on Delivery" },
                        { id: "mobile_money", label: "Mobile Money" },
                        { id: "pickup", label: "Store Pickup" },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: p.id as any })}
                          className={`py-3 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                            checkoutForm.paymentMethod === p.id
                              ? "border-primary bg-accent-light text-primary"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Delivery Notes (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Any specific delivery instructions or notes..."
                      value={checkoutForm.notes}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm text-gray-900 resize-none"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">{cartItemCount} item{cartItemCount > 1 ? "s" : ""}</p>
                      <p className="font-bold text-gray-900">Total Due</p>
                    </div>
                    <span className="text-2xl font-bold font-heading text-primary">
                      GHS {cartTotal.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingOrder}
                    className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                  >
                    {submittingOrder ? "Submitting Order..." : "Confirm & Place Order"}
                  </button>

                  <div className="pt-2 text-center">
                    <p className="text-xs text-gray-500 mb-2">Prefer to order or inquire directly?</p>
                    <a
                      href={`https://wa.me/233506706787?text=${encodeURIComponent(
                        `Hello Infoway! I would like to place an order for: ${cart
                          .map((i) => `${i.product.name} (x${i.quantity})`)
                          .join(", ")}. Total: GHS ${cartTotal.toLocaleString()}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat & Order on WhatsApp (0506706787)</span>
                    </a>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Order Success Modal ── */}
      <AnimatePresence>
        {orderSuccess && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">Order Confirmed!</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                  Your order has been recorded. Our partner business will reach out to you via call or WhatsApp.
                </p>

                <div className="bg-accent-light border border-primary/20 rounded-2xl p-4 mb-5">
                  <span className="text-xs text-gray-500 font-medium block">Order Reference Number</span>
                  <span className="text-lg font-mono font-bold text-primary">{orderSuccess}</span>
                </div>

                <div className="space-y-3 mb-2">
                  <a
                    href={`https://wa.me/233506706787?text=${encodeURIComponent(
                      `Hello! I just placed order ${orderSuccess} on Infoway Partnership Program. My name is ${checkoutForm.name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Follow Up on WhatsApp (0506706787)</span>
                  </a>

                  <button
                    onClick={() => setOrderSuccess(null)}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-colors text-sm"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
