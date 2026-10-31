"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Database,
  Activity,
  MapPin,
  RefreshCw,
  Loader2,
  ArrowRight,
  Ticket,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

const DASHBOARD_API = "https://hotspot-project.vercel.app/api/vouchers/balance";

interface VoucherBalance {
  code: string;
  profileName: string;
  location: string;
  status: "ACTIVE" | "EXHAUSTED" | "UNCAPPED" | "UNUSED";
  dataLimit: string | null;
  dataUsedBytes: string;
  dataRemainingBytes: string | null;
  percentUsed: number;
  timeLimit: number | null;
  uptime: string | null;
  lastSeen: string | null;
  claimedAt: string | null;
  message?: string;
}

function formatBytes(bytes: string | null): string {
  if (!bytes || bytes === "0") return "0 MB";
  const b = Number(BigInt(bytes));
  if (b >= 1024 * 1024 * 1024) return (b / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  if (b >= 1024 * 1024) return (b / (1024 * 1024)).toFixed(1) + " MB";
  if (b >= 1024) return (b / 1024).toFixed(1) + " KB";
  return b + " B";
}

function formatTimeLimit(minutes: number | null): string {
  if (!minutes) return "No time limit";
  if (minutes >= 1440) return (minutes / 1440).toFixed(0) + " day(s)";
  if (minutes >= 60) return (minutes / 60).toFixed(0) + " hour(s)";
  return minutes + " minute(s)";
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusConfig(status: VoucherBalance["status"]) {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Active",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        icon: CheckCircle2,
        barColor: "bg-emerald-500",
      };
    case "EXHAUSTED":
      return {
        label: "Data Exhausted",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        icon: XCircle,
        barColor: "bg-red-500",
      };
    case "UNCAPPED":
      return {
        label: "Active (Unlimited)",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: Activity,
        barColor: "bg-blue-500",
      };
    case "UNUSED":
      return {
        label: "Not Used Yet",
        color: "text-gray-500",
        bg: "bg-gray-50",
        border: "border-gray-200",
        icon: Ticket,
        barColor: "bg-gray-300",
      };
  }
}

export default function VoucherBalancePage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VoucherBalance | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkCode = async (voucherCode: string) => {
    const trimmed = voucherCode.trim();
    if (!trimmed) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`${DASHBOARD_API}?code=${encodeURIComponent(trimmed.toUpperCase())}`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || `Unable to locate voucher. Please verify the code and try again.`);
      } else if (data) {
        setResult(data);
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (err) {
      console.error("Voucher balance fetch error:", err);
      setError("Could not connect to the server. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get("code");
      if (urlCode) {
        setCode(urlCode);
        checkCode(urlCode);
      }
    }
  }, []);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    checkCode(code);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setCode("");
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gray-50 py-16 sm:py-24 border-b border-gray-100 relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute -right-24 -top-24 w-96 h-96 opacity-[0.06]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" stroke="#FF6B00" strokeWidth="1" fill="none" strokeDasharray="4 8" />
            <circle cx="100" cy="100" r="60" stroke="#FF6B00" strokeWidth="1" fill="none" strokeDasharray="6 12" />
            <circle cx="100" cy="100" r="40" stroke="#FF6B00" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
              <BarChart3 className="w-4 h-4" />
              Real-Time Data Tracker
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-4">
              Check Your <span className="text-primary">Voucher Balance</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Enter your hotspot voucher code below to instantly see how much data you've used, what's remaining, and when your last session was active.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Card */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <form
              onSubmit={handleCheck}
              className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-lg shadow-gray-100/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Ticket className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-gray-900 text-lg">Enter Voucher Code</h2>
                  <p className="text-sm text-gray-500">Found on your purchase receipt or SMS</p>
                </div>
              </div>

              <div className="relative mb-4">
                <input
                  id="voucher-code-input"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. A3K7P2"
                  maxLength={12}
                  className="w-full px-5 py-4 pr-16 border-2 border-gray-200 rounded-2xl text-xl font-mono font-bold tracking-widest text-center text-gray-900 focus:outline-none focus:border-primary transition-colors placeholder:font-sans placeholder:text-gray-300 placeholder:tracking-normal placeholder:text-base placeholder:font-normal"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <button
                id="check-balance-btn"
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 px-6 rounded-2xl hover:bg-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checking…
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Check Balance
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-red-700">Not Found</p>
                  <p className="text-sm text-red-600 mt-0.5">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Card */}
          <AnimatePresence>
            {result && (() => {
              const cfg = getStatusConfig(result.status);
              const StatusIcon = cfg.icon;
              const hasDataCap = result.dataLimit !== null;

              return (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6"
                >
                  {/* Status Header */}
                  <div className={`rounded-3xl border-2 ${cfg.border} ${cfg.bg} p-6 mb-4`}>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`w-6 h-6 ${cfg.color}`} />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Status</p>
                          <p className={`font-bold text-lg ${cfg.color}`}>{cfg.label}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Voucher Code</p>
                        <p className="font-mono font-bold text-xl text-gray-900 tracking-widest">{result.code}</p>
                      </div>
                    </div>

                    {/* Plan & Location */}
                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-white/70 px-3 py-1.5 rounded-full border border-gray-200">
                        <Wifi className="w-3.5 h-3.5 text-primary" />
                        {result.profileName}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-white/70 px-3 py-1.5 rounded-full border border-gray-200">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {result.location}
                      </span>
                      {result.timeLimit && (
                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-white/70 px-3 py-1.5 rounded-full border border-gray-200">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          {formatTimeLimit(result.timeLimit)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Data Usage Card */}
                  {result.status !== "UNUSED" && (
                    <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 mb-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-5">
                        <Database className="w-5 h-5 text-primary" />
                        <h3 className="font-heading font-bold text-gray-900">Data Usage</h3>
                      </div>

                      {hasDataCap ? (
                        <>
                          {/* Progress Bar */}
                          <div className="mb-5">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-500">Used</span>
                              <span className={`font-bold ${result.percentUsed >= 90 ? "text-red-600" : result.percentUsed >= 50 ? "text-amber-600" : "text-emerald-600"}`}>
                                {result.percentUsed}%
                              </span>
                            </div>
                            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${result.percentUsed}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                                className={`h-full rounded-full ${
                                  result.percentUsed >= 90
                                    ? "bg-red-500"
                                    : result.percentUsed >= 50
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                              />
                            </div>
                          </div>

                          {/* Stats Row */}
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center bg-gray-50 rounded-2xl p-3">
                              <p className="text-xs text-gray-500 mb-1">Total</p>
                              <p className="font-bold text-gray-900 text-sm">{formatBytes(result.dataLimit)}</p>
                            </div>
                            <div className="text-center bg-amber-50 rounded-2xl p-3">
                              <p className="text-xs text-amber-600 mb-1">Used</p>
                              <p className="font-bold text-amber-700 text-sm">{formatBytes(result.dataUsedBytes)}</p>
                            </div>
                            <div className={`text-center rounded-2xl p-3 ${result.status === "EXHAUSTED" ? "bg-red-50" : "bg-emerald-50"}`}>
                              <p className={`text-xs mb-1 ${result.status === "EXHAUSTED" ? "text-red-500" : "text-emerald-600"}`}>Remaining</p>
                              <p className={`font-bold text-sm ${result.status === "EXHAUSTED" ? "text-red-700" : "text-emerald-700"}`}>
                                {result.status === "EXHAUSTED" ? "0 MB" : formatBytes(result.dataRemainingBytes)}
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <Activity className="w-10 h-10 text-blue-500 mx-auto mb-2" />
                          <p className="text-gray-600 font-medium">This is an unlimited data plan.</p>
                          <p className="text-sm text-gray-400 mt-1">Data used: {formatBytes(result.dataUsedBytes)}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Session Info */}
                  <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 mb-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity className="w-5 h-5 text-primary" />
                      <h3 className="font-heading font-bold text-gray-900">Session Info</h3>
                    </div>
                    <div className="space-y-3">
                      {result.claimedAt && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                          <span className="text-sm text-gray-500">Activated</span>
                          <span className="text-sm font-medium text-gray-800">{formatDate(result.claimedAt)}</span>
                        </div>
                      )}
                      {result.lastSeen && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                          <span className="text-sm text-gray-500">Last Active</span>
                          <span className="text-sm font-medium text-gray-800">{formatDate(result.lastSeen)}</span>
                        </div>
                      )}
                      {result.uptime && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-gray-500">Session Uptime</span>
                          <span className="text-sm font-medium text-gray-800">{result.uptime}</span>
                        </div>
                      )}
                      {!result.lastSeen && result.status === "UNUSED" && (
                        <p className="text-sm text-gray-400 text-center py-2">{result.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Tip Banner */}
                  {result.percentUsed >= 50 && result.status === "ACTIVE" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-start gap-3"
                    >
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-800 text-sm">You've used over 50% of your data!</p>
                        <p className="text-sm text-amber-700 mt-0.5">
                          Consider topping up soon so you don't run out unexpectedly.{" "}
                          <Link href="/#services" className="underline font-semibold">Buy a new voucher →</Link>
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {result.status === "EXHAUSTED" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex items-start gap-3"
                    >
                      <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-800 text-sm">Your data is fully used.</p>
                        <p className="text-sm text-red-700 mt-0.5">
                          Please purchase a new voucher from your nearest Infoway agent or online to continue browsing.{" "}
                          <Link href="/contact" className="underline font-semibold">Contact us →</Link>
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Check Another */}
                  <button
                    id="check-another-btn"
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-primary border-2 border-gray-100 hover:border-primary/30 rounded-2xl py-3 font-medium text-sm transition-all duration-200 hover:bg-primary/5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Check Another Voucher
                  </button>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* Info Note */}
          {!result && !error && !loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-sm text-gray-400 mt-6 flex items-center justify-center gap-1.5"
            >
              <Clock className="w-4 h-4" />
              Usage data updates every 5 minutes from your active session.
            </motion.p>
          )}
        </div>
      </section>

      {/* FAQ-style tips */}
      <section className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold text-gray-900 text-center mb-10">Tips for Managing Your Data</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: RefreshCw,
                title: "Check Regularly",
                desc: "Visit this page anytime to track your data. Usage updates live every 5 minutes while you're connected.",
              },
              {
                icon: AlertTriangle,
                title: "Act at 50%",
                desc: "When you're at 50% usage, plan your next purchase to avoid unexpected disconnection.",
              },
              {
                icon: Wifi,
                title: "Save Data",
                desc: "Avoid background app updates, video autoplay, and large file downloads to make your voucher last longer.",
              },
            ].map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
              >
                <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <tip.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
