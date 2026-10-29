"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, ShoppingBag, TrendingUp, Plus, X, CheckCircle,
  Trash2, Edit3, Search, Filter, Eye, AlertCircle,
  Store, RefreshCw, BarChart3, MapPin, Phone, Tag, LogOut, Lock, Vote, ExternalLink,
  MessageSquareHeart, Star, CheckCircle2, User, Mail, MessageSquare, Clock
} from "lucide-react";

// ---------- Interfaces ----------
interface PollOption {
  _id?: string;
  text: string;
  votes: number;
}

interface Poll {
  _id: string;
  question: string;
  category: "pricing" | "service" | "feature" | "general";
  description?: string;
  options: PollOption[];
  isActive: boolean;
  totalVotes: number;
  createdAt: string;
}

interface Business {
  _id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  phone: string;
  email?: string;
  badge?: string;
  isActive: boolean;
  createdAt: string;
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
  createdAt: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  businessName?: string;
  customer: {
    name: string;
    email?: string;
    phone: string;
    deliveryAddress: string;
    city: string;
  };
  items: { productName: string; price: number; quantity: number; businessName?: string }[];
  totalAmount: number;
  status: "pending" | "processing" | "confirmed" | "delivered" | "cancelled";
  paymentMethod: string;
  notes?: string;
  createdAt: string;
}

interface FeedbackItem {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  category: "connectivity" | "vouchers" | "customer_service" | "pricing" | "feature_request" | "general";
  rating: number;
  subject?: string;
  message: string;
  location?: string;
  role?: string;
  status: "new" | "reviewed" | "in_progress" | "resolved" | "archived";
  adminNotes?: string;
  createdAt: string;
}

type AdminTab = "orders" | "products" | "businesses" | "polls" | "feedback";

const FEEDBACK_STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  reviewed: "bg-purple-100 text-purple-700 border-purple-200",
  in_progress: "bg-amber-100 text-amber-700 border-amber-200",
  resolved: "bg-green-100 text-green-700 border-green-200",
  archived: "bg-gray-100 text-gray-700 border-gray-200",
};

const FEEDBACK_CATEGORY_LABELS: Record<string, string> = {
  connectivity: "Internet & Wi-Fi Speed",
  vouchers: "Hotspot Vouchers & Login",
  customer_service: "Customer Care",
  pricing: "Pricing & Plans",
  feature_request: "Feature Request",
  general: "General Feedback",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  processing: "bg-blue-100 text-blue-700 border-blue-200",
  confirmed: "bg-purple-100 text-purple-700 border-purple-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_OPTIONS = ["pending", "processing", "confirmed", "delivered", "cancelled"];

const BUSINESS_CATEGORIES = [
  "Food & Groceries",
  "Electronics & Gadgets",
  "Fashion & Apparel",
  "Agriculture",
  "Services & Repairs",
  "Other",
];

const fadeIn = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);
  const [loginEmail, setLoginEmail] = useState("admin@infoway.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [tab, setTab] = useState<AdminTab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);

  const [orderFilter, setOrderFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Business Modal & Form
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [businessForm, setBusinessForm] = useState({
    name: "",
    category: "Food & Groceries",
    description: "",
    location: "",
    phone: "",
    email: "",
    badge: "Hotspot Partner",
  });

  // Product Modal & Form
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    businessId: "",
    name: "",
    description: "",
    price: "",
    category: "",
    tags: "",
    inStock: true,
    featured: false,
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Check auth on load and auto seed
  useEffect(() => {
    fetch("/api/seed", { method: "POST" }).catch(() => { });
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Unauthenticated");
      })
      .then((data) => {
        setIsAuthenticated(true);
        setAdminUser(data.user);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setAdminUser(data.user);
        showToast("Logged in successfully");
      } else {
        setLoginError(data.error || "Invalid email or password");
      }
    } catch {
      setLoginError("Failed to authenticate. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      setAdminUser(null);
      showToast("Logged out");
    } catch {
      setIsAuthenticated(false);
    }
  }

  const [polls, setPolls] = useState<Poll[]>([]);
  const [loadingPolls, setLoadingPolls] = useState(true);

  // Poll Modal & Form
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollForm, setPollForm] = useState({
    question: "",
    category: "pricing" as "pricing" | "service" | "feature" | "general",
    description: "",
    options: "", // newline separated
  });

  // Feedback State
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState("all");
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState("all");
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState("all");
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [editingAdminNotes, setEditingAdminNotes] = useState("");
  const [savingFeedbackNotes, setSavingFeedbackNotes] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingOrders(true);
    try {
      const res = await fetch(`/api/orders?status=${orderFilter}`);
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } finally {
      setLoadingOrders(false);
    }
  }, [orderFilter, isAuthenticated]);

  const fetchProducts = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } finally {
      setLoadingProducts(false);
    }
  }, [isAuthenticated]);

  const fetchBusinesses = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingBusinesses(true);
    try {
      const res = await fetch("/api/businesses");
      const data = await res.json();
      if (data.success) setBusinesses(data.businesses);
    } finally {
      setLoadingBusinesses(false);
    }
  }, [isAuthenticated]);

  const fetchPolls = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingPolls(true);
    try {
      const res = await fetch("/api/polls?all=true");
      const data = await res.json();
      if (data.success) setPolls(data.polls);
    } finally {
      setLoadingPolls(false);
    }
  }, [isAuthenticated]);

  const fetchFeedbacks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingFeedbacks(true);
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      if (data.success) setFeedbacks(data.feedbacks);
    } catch {
      // ignore
    } finally {
      setLoadingFeedbacks(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchBusinesses(); }, [fetchBusinesses]);
  useEffect(() => { fetchPolls(); }, [fetchPolls]);
  useEffect(() => { fetchFeedbacks(); }, [fetchFeedbacks]);

  // Poll Actions
  async function savePoll(e: React.FormEvent) {
    e.preventDefault();
    const optionsArray = pollForm.options
      .split("\n")
      .map((o) => o.trim())
      .filter(Boolean);

    if (optionsArray.length < 2) {
      showToast("Please provide at least 2 options", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: pollForm.question,
          category: pollForm.category,
          description: pollForm.description,
          options: optionsArray,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPolls((prev) => [data.poll, ...prev]);
        setShowPollModal(false);
        setPollForm({ question: "", category: "pricing", description: "", options: "" });
        showToast("New poll created");
      }
    } catch {
      showToast("Failed to create poll", "error");
    } finally {
      setSaving(false);
    }
  }

  async function togglePollActive(poll: Poll) {
    try {
      const res = await fetch(`/api/polls/${poll._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !poll.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setPolls((prev) => prev.map((p) => (p._id === poll._id ? data.poll : p)));
        showToast(poll.isActive ? "Poll closed" : "Poll opened");
      }
    } catch {
      showToast("Failed to update poll status", "error");
    }
  }

  async function deletePoll(id: string) {
    if (!confirm("Are you sure you want to delete this poll and all its votes?")) return;
    try {
      const res = await fetch(`/api/polls/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setPolls((prev) => prev.filter((p) => p._id !== id));
        showToast("Poll deleted");
      }
    } catch {
      showToast("Failed to delete poll", "error");
    }
  }

  // Feedback Actions
  async function updateFeedbackStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbacks((prev) => prev.map((f) => (f._id === id ? data.feedback : f)));
        if (selectedFeedback && selectedFeedback._id === id) {
          setSelectedFeedback(data.feedback);
        }
        showToast(`Feedback marked as ${status.replace('_', ' ')}`);
      }
    } catch {
      showToast("Failed to update feedback status", "error");
    }
  }

  async function saveFeedbackNotes(id: string) {
    setSavingFeedbackNotes(true);
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: editingAdminNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbacks((prev) => prev.map((f) => (f._id === id ? data.feedback : f)));
        if (selectedFeedback && selectedFeedback._id === id) {
          setSelectedFeedback(data.feedback);
        }
        showToast("Admin notes saved");
      }
    } catch {
      showToast("Failed to save admin notes", "error");
    } finally {
      setSavingFeedbackNotes(false);
    }
  }

  async function deleteFeedback(id: string) {
    if (!confirm("Are you sure you want to permanently delete this feedback?")) return;
    try {
      const res = await fetch(`/api/feedback/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setFeedbacks((prev) => prev.filter((f) => f._id !== id));
        if (selectedFeedback && selectedFeedback._id === id) {
          setSelectedFeedback(null);
        }
        showToast("Feedback deleted");
      }
    } catch {
      showToast("Failed to delete feedback", "error");
    }
  }

  // Order status update
  async function updateOrderStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status: status as Order["status"] } : o));
        if (selectedOrder?._id === id) setSelectedOrder((prev) => prev ? { ...prev, status: status as Order["status"] } : null);
        showToast("Order status updated");
      }
    } catch {
      showToast("Failed to update status", "error");
    }
  }

  // Delete Order
  async function deleteOrder(id: string) {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o._id !== id));
        if (selectedOrder?._id === id) setSelectedOrder(null);
        showToast("Order removed");
      }
    } catch {
      showToast("Failed to delete order", "error");
    }
  }

  // Business Save
  async function saveBusiness(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingBusiness) {
        const res = await fetch(`/api/businesses/${editingBusiness._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(businessForm),
        });
        const data = await res.json();
        if (data.success) {
          setBusinesses((prev) => prev.map((b) => b._id === editingBusiness._id ? data.business : b));
          showToast("Business updated");
        }
      } else {
        const res = await fetch("/api/businesses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(businessForm),
        });
        const data = await res.json();
        if (data.success) {
          setBusinesses((prev) => [data.business, ...prev]);
          showToast("Partner business created");
        }
      }
      setShowBusinessModal(false);
    } catch {
      showToast("Failed to save business", "error");
    } finally {
      setSaving(false);
    }
  }

  // Delete Business
  async function deleteBusiness(id: string) {
    if (!confirm("Delete this partner business and all its linked products?")) return;
    try {
      const res = await fetch(`/api/businesses/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setBusinesses((prev) => prev.filter((b) => b._id !== id));
        setProducts((prev) => prev.filter((p) => p.businessId !== id));
        showToast("Business deleted");
      }
    } catch {
      showToast("Failed to delete business", "error");
    }
  }

  // Open Product Modal
  function openProductForm(product?: Product) {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        businessId: product.businessId,
        name: product.name,
        description: product.description,
        price: String(product.price),
        category: product.category,
        tags: product.tags ? product.tags.join(", ") : "",
        inStock: product.inStock,
        featured: product.featured || false,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        businessId: businesses[0]?._id || "",
        name: "",
        description: "",
        price: "",
        category: "",
        tags: "",
        inStock: true,
        featured: false,
      });
    }
    setShowProductModal(true);
  }

  // Product Save
  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    const biz = businesses.find((b) => b._id === productForm.businessId);
    if (!biz) {
      showToast("Please choose a valid partner business", "error");
      return;
    }

    setSaving(true);
    const payload = {
      businessId: biz._id,
      businessName: biz.name,
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      category: productForm.category || "General",
      tags: productForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
      inStock: productForm.inStock,
      featured: productForm.featured,
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => prev.map((p) => p._id === editingProduct._id ? data.product : p));
          showToast("Product updated");
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => [data.product, ...prev]);
          showToast("Product added to business");
        }
      }
      setShowProductModal(false);
    } catch {
      showToast("Failed to save product", "error");
    } finally {
      setSaving(false);
    }
  }

  // Delete Product
  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        showToast("Product deleted");
      }
    } catch {
      showToast("Failed to delete product", "error");
    }
  }

  const filteredOrders = orders.filter((o) =>
    search === "" ||
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
    (o.customer.phone && o.customer.phone.includes(search))
  );

  const unreadFeedbacks = feedbacks.filter((f) => f.status === "new").length;
  const avgRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : "5.0";

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.totalAmount, 0),
    totalBusinesses: businesses.length,
    totalProducts: products.length,
    totalFeedbacks: feedbacks.length,
    unreadFeedbacks,
    avgRating,
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <img src="/logo-clean.png" alt="Infoway Logo" className="h-10 mx-auto object-contain mb-4" />
            <h2 className="text-2xl font-heading font-bold text-gray-900">Admin Sign In</h2>
            <p className="text-gray-500 text-sm mt-1">Manage partner businesses and customer orders</p>
          </div>

          {loginError && (
            <div className="bg-red-50 text-red-600 border border-red-200 text-sm p-3 rounded-xl mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loginLoading ? "Authenticating..." : "Sign In to Dashboard"}</span>
            </button>
          </form>


        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-6 z-50 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-white font-semibold ${toast.type === "success" ? "bg-green-600" : "bg-red-600"
              }`}
          >
            {toast.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="bg-white border-b border-gray-100 sticky top-20 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-3 md:py-0 md:h-16 gap-3">
            <div className="flex items-center justify-between w-full md:w-auto">
              <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-2">
                  <img src="/logo-clean.png" alt="Infoway Logo" className="h-8 w-auto object-contain" />
                </Link>
                <div className="border-l border-gray-200 pl-3">
                  <h1 className="font-heading font-bold text-gray-900 leading-tight">Admin Portal</h1>
                  <p className="text-xs text-gray-400 hidden sm:block">Hotspot Advertising & Partner Orders</p>
                </div>
              </div>

              {/* Mobile Logout Button */}
              <button
                onClick={handleLogout}
                className="md:hidden p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto gap-3">
              <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl overflow-x-auto max-w-full w-full md:w-auto scrollbar-none">
                {[
                  { key: "orders", label: "Orders", icon: ShoppingBag, count: orders.length },
                  { key: "businesses", label: "Partners", icon: Store, count: businesses.length },
                  { key: "products", label: "Products", icon: Package, count: products.length },
                  { key: "polls", label: "Polls", icon: Vote, count: polls.length },
                  { key: "feedback", label: "Feedback", icon: MessageSquareHeart, count: feedbacks.length, highlight: unreadFeedbacks > 0 },
                ].map(({ key, label, icon: Icon, count, highlight }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key as AdminTab)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${tab === key
                        ? "bg-white text-gray-900 shadow-sm scale-102"
                        : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    <span>{label}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      highlight ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
                    }`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Desktop Logout Button */}
              <button
                onClick={handleLogout}
                className="hidden md:flex p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
          {[
            { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
            { label: "Order Volume", value: `GHS ${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-600 bg-green-50" },
            { label: "Partner Businesses", value: stats.totalBusinesses, icon: Store, color: "text-purple-600 bg-purple-50" },
            { label: "Listed Products", value: stats.totalProducts, icon: Package, color: "text-primary bg-accent-light" },
            { label: "Active Polls", value: `${polls.filter(p => p.isActive).length} / ${polls.length}`, icon: Vote, color: "text-amber-600 bg-amber-50" },
            { label: "Student Feedback", value: `${stats.totalFeedbacks} (${stats.unreadFeedbacks} new)`, icon: MessageSquareHeart, color: "text-rose-600 bg-rose-50" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase truncate">{item.label}</p>
                <p className="text-lg sm:text-2xl font-bold font-heading text-gray-900 mt-0.5 truncate">{item.value}</p>
              </div>
              <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                <item.icon className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
          ))}
        </div>

        {/* ── TAB 1: ORDERS ── */}
        {tab === "orders" && (
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by customer, phone, or order number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:border-primary"
                >
                  <option value="all">All Statuses</option>
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st} className="capitalize">
                      {st.charAt(0).toUpperCase() + st.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={fetchOrders}
                className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-primary hover:border-primary transition-colors"
                title="Refresh orders"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {loadingOrders ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-700">No orders placed yet</h3>
                <p className="text-gray-400 text-sm mt-1">Orders from the partnership catalog will show up here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    className="bg-white border border-gray-100 hover:border-primary/40 rounded-2xl p-5 shadow-sm transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono font-bold text-sm text-primary">
                          {order.orderNumber}
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold capitalize ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-base">{order.customer.name}</h4>
                      <p className="text-xs text-gray-500">
                        {order.customer.phone} • {order.customer.deliveryAddress}, {order.customer.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase font-semibold">Total Amount</p>
                        <p className="text-lg font-bold font-heading text-gray-900">
                          GHS {order.totalAmount.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="p-2 bg-gray-50 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteOrder(order._id);
                          }}
                          className="p-2 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── TAB 2: BUSINESSES ── */}
        {tab === "businesses" && (
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                Partner businesses advertised on Infoway hotspots ({businesses.length})
              </p>
              <button
                onClick={() => {
                  setEditingBusiness(null);
                  setBusinessForm({
                    name: "",
                    category: "Food & Groceries",
                    description: "",
                    location: "Duayaw Nkwanta",
                    phone: "",
                    email: "",
                    badge: "Hotspot Partner",
                  });
                  setShowBusinessModal(true);
                }}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl shadow-md shadow-primary/20 flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Partner Business</span>
              </button>
            </div>

            {loadingBusinesses ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-40 bg-white rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : businesses.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-700">No partner businesses yet</h3>
                <p className="text-gray-400 text-sm mt-1">Click Add Partner Business to add your first partner.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((biz) => {
                  const bizProductsCount = products.filter((p) => p.businessId === biz._id).length;
                  return (
                    <div
                      key={biz._id}
                      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className="text-xs font-bold text-primary uppercase">{biz.category}</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent-light text-primary">
                            {biz.badge || "Partner"}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold font-heading text-gray-900 mb-2">{biz.name}</h4>
                        <p className="text-gray-600 text-xs line-clamp-3 mb-4 leading-relaxed">{biz.description}</p>

                        <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            <span>{biz.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-primary" />
                            <span>{biz.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-400">
                          {bizProductsCount} Product{bizProductsCount !== 1 ? "s" : ""}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingBusiness(biz);
                              setBusinessForm({
                                name: biz.name,
                                category: biz.category,
                                description: biz.description,
                                location: biz.location,
                                phone: biz.phone,
                                email: biz.email || "",
                                badge: biz.badge || "Hotspot Partner",
                              });
                              setShowBusinessModal(true);
                            }}
                            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteBusiness(biz._id)}
                            className="p-2 bg-gray-50 hover:bg-red-50 text-red-600 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ── TAB 3: PRODUCTS ── */}
        {tab === "products" && (
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                Products linked to partner businesses ({products.length})
              </p>
              <button
                onClick={() => openProductForm()}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl shadow-md shadow-primary/20 flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {loadingProducts ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-44 bg-white rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-700">No products added yet</h3>
                <p className="text-gray-400 text-sm mt-1">Add products to feature them on each partner business page.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <div
                    key={prod._id}
                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold text-primary uppercase">
                          {prod.businessName}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                          {prod.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-base mb-1">{prod.name}</h4>
                      <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900 font-heading">
                        GHS {prod.price.toLocaleString()}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openProductForm(prod)}
                          className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod._id)}
                          className="p-2 bg-gray-50 hover:bg-red-50 text-red-600 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── TAB 4: POLLS ── */}
        {tab === "polls" && (
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-heading font-bold text-gray-900">
                  Customer & Pricing Polls ({polls.length})
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Ask questions to discover price sensitivity, package preferences, and feature demands.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/polls"
                  target="_blank"
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Live Polls</span>
                </Link>

                <button
                  onClick={() => setShowPollModal(true)}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl shadow-md shadow-primary/20 flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Poll</span>
                </button>
              </div>
            </div>

            {loadingPolls ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="h-64 bg-white rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : polls.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <Vote className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-700">No polls created yet</h3>
                <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">
                  Create a poll to ask your community about pricing, plan preferences, or new services.
                </p>
                <button
                  onClick={() => setShowPollModal(true)}
                  className="mt-4 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl"
                >
                  Create First Poll
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {polls.map((poll) => {
                  const categoryBadgeColor = {
                    pricing: "bg-amber-100 text-amber-800 border-amber-200",
                    service: "bg-blue-100 text-blue-800 border-blue-200",
                    feature: "bg-purple-100 text-purple-800 border-purple-200",
                    general: "bg-gray-100 text-gray-800 border-gray-200",
                  }[poll.category] || "bg-gray-100 text-gray-800";

                  return (
                    <div
                      key={poll._id}
                      className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Status + Category Header */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${categoryBadgeColor}`}>
                            {poll.category === "pricing" ? "Pricing & Plans" : poll.category === "service" ? "Service Quality" : poll.category === "feature" ? "New Feature" : "General"}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => togglePollActive(poll)}
                              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-bold transition-colors ${poll.isActive
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                              title={poll.isActive ? "Click to close poll" : "Click to reopen poll"}
                            >
                              {poll.isActive ? (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                  <span>Active Voting</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3.5 h-3.5 text-gray-500" />
                                  <span>Closed</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => deletePoll(poll._id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete poll"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Question */}
                        <h4 className="text-lg font-bold font-heading text-gray-900 mb-2 leading-snug">
                          {poll.question}
                        </h4>

                        {poll.description && (
                          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                            {poll.description}
                          </p>
                        )}

                        {/* Options & Votes breakdown */}
                        <div className="space-y-3 mt-4">
                          {poll.options.map((opt, idx) => {
                            const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-gray-800">{opt.text}</span>
                                  <span className="text-gray-500 font-mono">
                                    {opt.votes} vote{opt.votes !== 1 ? "s" : ""} ({pct}%)
                                  </span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary transition-all duration-500 rounded-full"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="pt-5 mt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                        <span className="font-bold text-gray-600">
                          {poll.totalVotes} total response{poll.totalVotes !== 1 ? "s" : ""}
                        </span>
                        <span>
                          {new Date(poll.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ── TAB 5: FEEDBACK ── */}
        {tab === "feedback" && (
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            {/* Header info & filters */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-heading font-bold text-gray-900">
                      Customer & Student Feedback
                    </h2>
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {feedbacks.length} total
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Live feedback from campus hostels, Wi-Fi hotspots, voucher users, and community partners.
                  </p>
                </div>

                {/* Rating snapshot */}
                <div className="flex items-center gap-4 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="text-lg font-bold font-heading text-gray-900">{stats.avgRating}</span>
                    <span className="text-xs text-gray-400">/ 5.0</span>
                  </div>
                  <div className="h-6 w-px bg-gray-200" />
                  <div className="text-xs">
                    <span className="font-bold text-blue-600">{stats.unreadFeedbacks} New</span>
                    <span className="text-gray-400 mx-1">•</span>
                    <span className="font-medium text-green-600">
                      {feedbacks.filter((f) => f.status === "resolved").length} Resolved
                    </span>
                  </div>
                </div>
              </div>

              {/* Filters toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
                {/* Search */}
                <div className="relative lg:col-span-2">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, location, keyword..."
                    value={feedbackSearch}
                    onChange={(e) => setFeedbackSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={feedbackStatusFilter}
                  onChange={(e) => setFeedbackStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:border-primary"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New / Unread</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>

                {/* Category Filter */}
                <select
                  value={feedbackCategoryFilter}
                  onChange={(e) => setFeedbackCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:border-primary"
                >
                  <option value="all">All Categories</option>
                  <option value="connectivity">Internet & Speed</option>
                  <option value="vouchers">Hotspot Vouchers</option>
                  <option value="customer_service">Customer Care</option>
                  <option value="pricing">Pricing & Plans</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="general">General Feedback</option>
                </select>

                {/* Rating filter & Refresh */}
                <div className="flex items-center gap-2">
                  <select
                    value={feedbackRatingFilter}
                    onChange={(e) => setFeedbackRatingFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:border-primary"
                  >
                    <option value="all">All Star Ratings</option>
                    <option value="5">5 Stars (Excellent)</option>
                    <option value="4">4 Stars (Good)</option>
                    <option value="3">3 Stars (Fair)</option>
                    <option value="2">2 Stars (Poor)</option>
                    <option value="1">1 Star (Critical)</option>
                  </select>

                  <button
                    onClick={fetchFeedbacks}
                    className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-500 hover:text-primary transition-colors shrink-0"
                    title="Refresh feedback"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content List */}
            {loadingFeedbacks ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Loading feedbacks...</p>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquareHeart className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">No Feedback Received Yet</h3>
                <p className="text-gray-500 text-xs max-w-md mx-auto mb-6">
                  When students, campus residents, or customers submit comments via the Feedback portal, they will appear right here for review.
                </p>
                <Link
                  href="/feedback"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Public Feedback Form</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {feedbacks
                  .filter((f) => {
                    const matchesStatus = feedbackStatusFilter === "all" || f.status === feedbackStatusFilter;
                    const matchesCategory = feedbackCategoryFilter === "all" || f.category === feedbackCategoryFilter;
                    const matchesRating = feedbackRatingFilter === "all" || String(f.rating) === feedbackRatingFilter;
                    const matchesSearch =
                      feedbackSearch === "" ||
                      (f.name && f.name.toLowerCase().includes(feedbackSearch.toLowerCase())) ||
                      (f.subject && f.subject.toLowerCase().includes(feedbackSearch.toLowerCase())) ||
                      (f.message && f.message.toLowerCase().includes(feedbackSearch.toLowerCase())) ||
                      (f.location && f.location.toLowerCase().includes(feedbackSearch.toLowerCase())) ||
                      (f.email && f.email.toLowerCase().includes(feedbackSearch.toLowerCase()));
                    return matchesStatus && matchesCategory && matchesRating && matchesSearch;
                  })
                  .map((item) => {
                    const statusClass = FEEDBACK_STATUS_COLORS[item.status] || "bg-gray-100 text-gray-600";
                    const categoryLabel = FEEDBACK_CATEGORY_LABELS[item.category] || item.category;

                    return (
                      <div
                        key={item._id}
                        className={`bg-white rounded-2xl p-5 border transition-all ${
                          item.status === "new"
                            ? "border-blue-200 shadow-md ring-1 ring-blue-100"
                            : "border-gray-100 shadow-sm hover:shadow-md"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          {/* Sender Info & Rating */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm shrink-0">
                              {item.name ? item.name.charAt(0).toUpperCase() : "A"}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-gray-900 text-sm">
                                  {item.name || "Anonymous"}
                                </span>
                                {item.role && (
                                  <span className="text-[10px] font-semibold uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                                    {item.role.replace('_', ' ')}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <div className="flex items-center text-amber-400">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                      key={s}
                                      className={`w-3.5 h-3.5 ${
                                        s <= item.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-[11px] text-gray-400 font-medium">
                                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Category and Status Badges */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">
                              {categoryLabel}
                            </span>
                            <span
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider capitalize flex items-center gap-1.5 ${statusClass}`}
                            >
                              {item.status === "new" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                              )}
                              <span>{item.status.replace("_", " ")}</span>
                            </span>
                          </div>
                        </div>

                        {/* Subject */}
                        {item.subject && (
                          <h4 className="font-bold text-gray-900 text-sm mb-1.5">{item.subject}</h4>
                        )}

                        {/* Message body */}
                        <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 text-gray-700 text-xs sm:text-sm leading-relaxed mb-3">
                          {item.message}
                        </div>

                        {/* Metadata row (Location, contact, admin notes) */}
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
                          <div className="flex flex-wrap items-center gap-3">
                            {item.location && (
                              <span className="flex items-center gap-1 text-primary font-medium">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{item.location}</span>
                              </span>
                            )}
                            {item.email && (
                              <span className="flex items-center gap-1 text-gray-500">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{item.email}</span>
                              </span>
                            )}
                            {item.phone && (
                              <span className="flex items-center gap-1 text-gray-500">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{item.phone}</span>
                              </span>
                            )}
                            {item.adminNotes && (
                              <span className="flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md text-[11px] font-medium">
                                <span>Note:</span>
                                <span className="truncate max-w-[200px]">{item.adminNotes}</span>
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {item.status === "new" && (
                              <button
                                onClick={() => updateFeedbackStatus(item._id, "reviewed")}
                                className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                              >
                                Mark Reviewed
                              </button>
                            )}

                            {item.status !== "resolved" && (
                              <button
                                onClick={() => updateFeedbackStatus(item._id, "resolved")}
                                className="px-2.5 py-1 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Resolve</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setSelectedFeedback(item);
                                setEditingAdminNotes(item.adminNotes || "");
                              }}
                              className="px-3 py-1 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Details & Notes</span>
                            </button>

                            <button
                              onClick={() => deleteFeedback(item._id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete feedback"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* ── Order Detail Modal ── */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
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
                    <span className="text-xs text-primary font-mono font-bold block">
                      {selectedOrder.orderNumber}
                    </span>
                    <h3 className="text-2xl font-heading font-bold text-gray-900">Order Information</h3>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6 text-sm">
                  {/* Status buttons */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Update Order Status</label>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_OPTIONS.map((st) => (
                        <button
                          key={st}
                          onClick={() => updateOrderStatus(selectedOrder._id, st)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${selectedOrder.status === st
                              ? "bg-primary text-white shadow-md shadow-primary/20"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Customer info */}
                  <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Customer:</span>
                      <span className="font-bold text-gray-900">{selectedOrder.customer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-bold text-gray-900">{selectedOrder.customer.phone}</span>
                    </div>
                    {selectedOrder.customer.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.customer.email}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delivery Address:</span>
                      <span className="font-medium text-gray-900 text-right">
                        {selectedOrder.customer.deliveryAddress}, {selectedOrder.customer.city}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment:</span>
                      <span className="font-bold capitalize text-primary">
                        {selectedOrder.paymentMethod.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  {/* Ordered Items */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Ordered Products</h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900">{item.productName}</p>
                            <p className="text-xs text-primary">{item.businessName || "Partner Store"}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                            <p className="font-bold text-gray-900">GHS {(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-3">
                      <span className="font-bold text-gray-700">Total Amount</span>
                      <span className="text-xl font-bold font-heading text-primary">
                        GHS {selectedOrder.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {selectedOrder.notes && (
                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Customer Notes</span>
                      <p className="p-3 bg-gray-50 rounded-xl text-gray-600 text-xs">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Business Form Modal ── */}
      <AnimatePresence>
        {showBusinessModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBusinessModal(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <h3 className="text-2xl font-heading font-bold text-gray-900">
                    {editingBusiness ? "Edit Partner Business" : "Add Partner Business"}
                  </h3>
                  <button onClick={() => setShowBusinessModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={saveBusiness} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Business Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Golden Crust Bakery"
                      value={businessForm.name}
                      onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                      <select
                        value={businessForm.category}
                        onChange={(e) => setBusinessForm({ ...businessForm, category: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm"
                      >
                        {BUSINESS_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Badge Tag</label>
                      <input
                        type="text"
                        placeholder="Hotspot Partner"
                        value={businessForm.badge}
                        onChange={(e) => setBusinessForm({ ...businessForm, badge: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe what this business does and what they offer on the hotspot advertisement network..."
                      value={businessForm.description}
                      onChange={(e) => setBusinessForm({ ...businessForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Location / Town</label>
                      <input
                        type="text"
                        required
                        placeholder="Duayaw Nkwanta"
                        value={businessForm.location}
                        onChange={(e) => setBusinessForm({ ...businessForm, location: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                      <input
                        type="text"
                        required
                        placeholder="+233 24 123 4567"
                        value={businessForm.phone}
                        onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary/30"
                  >
                    {saving ? "Saving..." : editingBusiness ? "Save Changes" : "Create Business"}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Product Form Modal ── */}
      <AnimatePresence>
        {showProductModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProductModal(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <h3 className="text-2xl font-heading font-bold text-gray-900">
                    {editingProduct ? "Edit Product" : "Add Product to Business"}
                  </h3>
                  <button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={saveProduct} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Partner Business</label>
                    <select
                      required
                      value={productForm.businessId}
                      onChange={(e) => setProductForm({ ...productForm, businessId: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm"
                    >
                      {businesses.map((b) => (
                        <option key={b._id} value={b._id}>{b.name} ({b.category})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 20,000mAh Fast Power Bank"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price (GHS)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        placeholder="150"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category / Type</label>
                      <input
                        type="text"
                        placeholder="Accessories, Bakery, etc."
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Product details, specs, sizes, or ingredients..."
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="Fast Charge, Popular, Fresh"
                      value={productForm.tags}
                      onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={productForm.inStock}
                        onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                      />
                      <span>In Stock</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                      />
                      <span>Featured</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary/30 mt-4"
                  >
                    {saving ? "Saving Product..." : editingProduct ? "Save Product" : "Add Product"}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Poll Creation Modal ── */}
      <AnimatePresence>
        {showPollModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPollModal(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-gray-900">
                      Create New Community Poll
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Collect votes from your customers on pricing, plans, or questions
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPollModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={savePoll} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Poll Category
                    </label>
                    <select
                      value={pollForm.category}
                      onChange={(e) =>
                        setPollForm({
                          ...pollForm,
                          category: e.target.value as "pricing" | "service" | "feature" | "general",
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm bg-gray-50 text-gray-900 font-medium"
                    >
                      <option value="pricing">Pricing & Plans (Internet packages, price points, bundles)</option>
                      <option value="service">Internet & Service Quality (Speed, coverage, reliability)</option>
                      <option value="feature">New Tools & Features (Merchant tools, app features)</option>
                      <option value="general">General & Community (Feedback, local events)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Poll Question
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. What is your preferred price for unlimited home internet?"
                      value={pollForm.question}
                      onChange={(e) => setPollForm({ ...pollForm, question: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Description / Context (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Help us tailor our new fiber packages for 2026"
                      value={pollForm.description}
                      onChange={(e) => setPollForm({ ...pollForm, description: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase">
                        Voting Options
                      </label>
                      <span className="text-[11px] text-gray-400">One option per line (min 2)</span>
                    </div>
                    <textarea
                      rows={4}
                      required
                      placeholder={"GHS 100 - GHS 150 / month\nGHS 150 - GHS 250 / month\nGHS 250 - GHS 350 / month\nGHS 350+ / month"}
                      value={pollForm.options}
                      onChange={(e) => setPollForm({ ...pollForm, options: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm text-gray-900 font-mono leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary/30 mt-4 disabled:opacity-50"
                  >
                    {saving ? "Publishing Poll..." : "Publish Poll"}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Feedback Detail & Management Modal ── */}
      <AnimatePresence>
        {selectedFeedback && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeedback(null)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <div>
                    <span className="text-xs text-primary font-bold uppercase tracking-wider">
                      Feedback Review & Management
                    </span>
                    <h3 className="text-xl font-heading font-bold text-gray-900 mt-0.5">
                      {selectedFeedback.name || "Anonymous User"}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedFeedback(null)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5 text-sm">
                  {/* Status update buttons */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">
                      Update Feedback Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(["new", "reviewed", "in_progress", "resolved", "archived"] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateFeedbackStatus(selectedFeedback._id, st)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                            selectedFeedback.status === st
                              ? "bg-primary text-white shadow-md shadow-primary/20"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {st.replace("_", " ")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating & Category header info */}
                  <div className="bg-gray-50 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-500">Rating:</span>
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= selectedFeedback.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-gray-800 ml-1">
                        ({selectedFeedback.rating} / 5)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500">Category:</span>
                      <span className="text-xs font-bold bg-white text-gray-800 px-2.5 py-1 rounded-lg border border-gray-200">
                        {FEEDBACK_CATEGORY_LABELS[selectedFeedback.category] || selectedFeedback.category}
                      </span>
                    </div>
                  </div>

                  {/* Sender details */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                    <div>
                      <span className="text-gray-400 block font-medium">Role:</span>
                      <span className="font-bold text-gray-800 capitalize">
                        {selectedFeedback.role ? selectedFeedback.role.replace("_", " ") : "Student"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Location:</span>
                      <span className="font-bold text-primary">
                        {selectedFeedback.location || "Not specified"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Email:</span>
                      <span className="font-medium text-gray-800">
                        {selectedFeedback.email || "Not provided"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Phone:</span>
                      <span className="font-medium text-gray-800">
                        {selectedFeedback.phone || "Not provided"}
                      </span>
                    </div>
                  </div>

                  {/* Feedback Message */}
                  <div>
                    {selectedFeedback.subject && (
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{selectedFeedback.subject}</h4>
                    )}
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                      Full Feedback
                    </label>
                    <div className="p-4 bg-gray-50 rounded-2xl text-gray-800 text-sm leading-relaxed border border-gray-100 whitespace-pre-wrap">
                      {selectedFeedback.message}
                    </div>
                  </div>

                  {/* Internal Admin Notes */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase block mb-1.5">
                      Internal Admin Notes / Action Taken
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Dispatched technician to Hostel Block B to inspect AP coverage. Switch port replaced."
                      value={editingAdminNotes}
                      onChange={(e) => setEditingAdminNotes(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white resize-none"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <button
                        type="button"
                        onClick={() => saveFeedbackNotes(selectedFeedback._id)}
                        disabled={savingFeedbackNotes}
                        className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                      >
                        {savingFeedbackNotes ? "Saving..." : "Save Admin Notes"}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteFeedback(selectedFeedback._id)}
                        className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        Delete Feedback
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
