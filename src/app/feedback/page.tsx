"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquareHeart,
  Star,
  Wifi,
  Ticket,
  Headphones,
  CreditCard,
  Lightbulb,
  MessageCircle,
  MapPin,
  User,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Vote,
  AlertCircle
} from "lucide-react";

interface CategoryOption {
  id: "connectivity" | "vouchers" | "customer_service" | "pricing" | "feature_request" | "general";
  label: string;
  icon: any;
  description: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: "connectivity",
    label: "Internet & Wi-Fi Speed",
    icon: Wifi,
    description: "Signal coverage, latency, connection stability, downtime",
  },
  {
    id: "vouchers",
    label: "Hotspot Vouchers & Login",
    icon: Ticket,
    description: "Login portal, voucher verification, radius, data limits",
  },
  {
    id: "customer_service",
    label: "Customer Support",
    icon: Headphones,
    description: "Response speed, technician visits, resolution quality",
  },
  {
    id: "pricing",
    label: "Pricing & Data Packages",
    icon: CreditCard,
    description: "Package affordability, duration, payment methods",
  },
  {
    id: "feature_request",
    label: "Feature Request / Idea",
    icon: Lightbulb,
    description: "New tools, student perks, portal upgrades",
  },
  {
    id: "general",
    label: "General Feedback",
    icon: MessageCircle,
    description: "Compliments, overall thoughts, or other remarks",
  },
];

const RATING_LABELS: Record<number, { text: string; color: string; emoji: string }> = {
  1: { text: "Poor", color: "text-red-500", emoji: "😞" },
  2: { text: "Needs Improvement", color: "text-orange-500", emoji: "🙁" },
  3: { text: "Fair / Average", color: "text-amber-500", emoji: "😐" },
  4: { text: "Good", color: "text-blue-500", emoji: "🙂" },
  5: { text: "Excellent", color: "text-green-500", emoji: "🤩" },
};

export default function FeedbackPage() {
  const [category, setCategory] = useState<CategoryOption["id"]>("connectivity");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("student");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const activeRating = hoverRating || rating;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!message.trim()) {
      setErrorMessage("Please enter your feedback message.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          rating,
          subject: subject.trim(),
          message: message.trim(),
          name: isAnonymous ? "Anonymous" : (name.trim() || "Anonymous"),
          email: isAnonymous ? "" : email.trim(),
          phone: isAnonymous ? "" : phone.trim(),
          location: location.trim(),
          role,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || "Failed to submit feedback. Please try again.");
      }
    } catch {
      setErrorMessage("Network error occurred. Please check your connection and retry.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setMessage("");
    setSubject("");
    setRating(5);
    setCategory("connectivity");
    setSubmitted(false);
    setErrorMessage("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community & Student Feedback</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-gray-900 tracking-tight"
          >
            Your Voice Shapes <span className="text-primary">Infoway</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Tell us about your campus Wi-Fi experience, voucher issues, or what we can do better. Every comment goes directly to our operations and technical team.
          </motion.p>
        </div>

        {/* Content Box */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-10"
            >
              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                    1. What is your feedback about?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                            isSelected
                              ? "bg-primary/5 border-primary shadow-sm ring-2 ring-primary/20"
                              : "bg-gray-50/50 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                isSelected ? "bg-primary text-white" : "bg-white text-gray-600 border border-gray-100"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <span
                              className={`text-sm font-bold leading-tight ${
                                isSelected ? "text-primary" : "text-gray-900"
                              }`}
                            >
                              {cat.label}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                            {cat.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Rating */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                      2. How would you rate your overall experience?
                    </label>
                    <span className={`text-xs font-bold flex items-center gap-1.5 ${RATING_LABELS[activeRating].color}`}>
                      <span>{RATING_LABELS[activeRating].emoji}</span>
                      <span>{RATING_LABELS[activeRating].text}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 bg-gray-50/70 p-3 sm:p-4 rounded-2xl border border-gray-100 w-fit">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const isFilled = starVal <= activeRating;
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setRating(starVal)}
                          onMouseEnter={() => setHoverRating(starVal)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 sm:p-1.5 rounded-xl hover:scale-110 active:scale-95 transition-transform"
                          aria-label={`Rate ${starVal} star`}
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                              isFilled
                                ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                                : "text-gray-300 hover:text-gray-400"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Feedback Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                      3. Subject / Quick Summary (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Wi-Fi in Hostel Block B drops at 9 PM, or Great customer care"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors"
                      maxLength={120}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Detailed Message / Suggestion <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-gray-400">{message.length} characters</span>
                    </div>
                    <textarea
                      rows={5}
                      required
                      placeholder="Please share specifics: What happened? What device were you using? Where on campus were you? How can we make it better?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* 4. Location & Campus Context */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>Campus / Hall / Area (Recommended)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Legon Hall Block C, Sunyani Campus, Room 102"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Helps network engineers diagnose signal issues in your area.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-primary" />
                      <span>Who are you?</span>
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-primary focus:bg-white font-medium text-gray-800"
                    >
                      <option value="student">Student (Campus Wi-Fi / Hotspot)</option>
                      <option value="campus_resident">Campus Resident / Hostel</option>
                      <option value="business_partner">Merchant / Partner Store</option>
                      <option value="community_user">Community / Home Internet User</option>
                      <option value="visitor">Visitor / Occasional User</option>
                    </select>
                  </div>
                </div>

                {/* 5. Contact Info & Privacy Option */}
                <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Contact Details
                      </span>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-600">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                      />
                      <span>Send Anonymously</span>
                    </label>
                  </div>

                  {!isAnonymous ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                    >
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Your Name</label>
                        <div className="relative">
                          <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Optional"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Email (For follow-up)</label>
                        <div className="relative">
                          <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            placeholder="Optional"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            placeholder="e.g. 0244123456"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      Your name and contact info will not be attached. Your feedback will be submitted completely anonymously.
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 text-base disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending your feedback...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-12 text-center"
            >
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-heading font-black text-gray-900 mb-3">
                Feedback Received!
              </h2>

              <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base mb-8 leading-relaxed">
                Thank you for taking the time to share your thoughts. Your feedback has been forwarded to the Infoway engineering and support team.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Send Another Feedback
                </button>

                <Link
                  href="/polls"
                  className="w-full sm:w-auto px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Vote className="w-4 h-4" />
                  <span>Vote in Community Polls</span>
                </Link>

                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold rounded-xl text-sm transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Informative Stats & Commitment Footer */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-gray-900 text-sm">Direct to Engineering</h4>
            <p className="text-xs text-gray-500 mt-1">
              Every message is routed straight to technical operators and administrators.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-gray-900 text-sm">Student Privacy</h4>
            <p className="text-xs text-gray-500 mt-1">
              Submit completely anonymously whenever you prefer. Your privacy is protected.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Vote className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-gray-900 text-sm">Actionable Changes</h4>
            <p className="text-xs text-gray-500 mt-1">
              Feedback directly guides our signal upgrades, voucher radius, and pricing bundles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
