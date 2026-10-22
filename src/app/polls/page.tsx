"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Vote, CheckCircle2, BarChart2, MessageSquare, TrendingUp,
  Tag, HelpCircle, ArrowRight, ShieldCheck, Sparkles, Filter
} from "lucide-react";

interface PollOption {
  _id: string;
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

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  pricing: { label: "Pricing & Packages", color: "bg-green-100 text-green-700 border-green-200" },
  service: { label: "Network & Services", color: "bg-blue-100 text-blue-700 border-blue-200" },
  feature: { label: "Business Features", color: "bg-purple-100 text-purple-700 border-purple-200" },
  general: { label: "Community Questions", color: "bg-orange-100 text-orange-700 border-orange-200" },
};

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [votedMap, setVotedMap] = useState<Record<string, string>>({}); // pollId -> optionId
  const [submittingPollId, setSubmittingPollId] = useState<string | null>(null);

  useEffect(() => {
    // Load local voted state
    try {
      const stored = localStorage.getItem("infoway_voted_polls");
      if (stored) {
        setVotedMap(JSON.parse(stored));
      }
    } catch {}

    fetchPolls();
  }, []);

  async function fetchPolls() {
    setLoading(true);
    try {
      const res = await fetch("/api/polls");
      const data = await res.json();
      if (data.success) {
        setPolls(data.polls);
      }
    } catch (e) {
      console.error("Failed to load polls:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleVote(pollId: string, optionId: string) {
    if (votedMap[pollId] || submittingPollId) return;

    setSubmittingPollId(pollId);
    try {
      const res = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });
      const data = await res.json();

      if (data.success && data.poll) {
        // Update local poll data
        setPolls((prev) => prev.map((p) => (p._id === pollId ? data.poll : p)));

        // Store voted status in state & localStorage
        const updatedVoted = { ...votedMap, [pollId]: optionId };
        setVotedMap(updatedVoted);
        try {
          localStorage.setItem("infoway_voted_polls", JSON.stringify(updatedVoted));
        } catch {}
      }
    } catch (err) {
      console.error("Vote failed:", err);
    } finally {
      setSubmittingPollId(null);
    }
  }

  const filteredPolls = polls.filter((p) => {
    if (filterCategory === "all") return true;
    return p.category === filterCategory;
  });

  const totalVotesAcrossAll = polls.reduce((sum, p) => sum + (p.totalVotes || 0), 0);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-gray-900 text-white pt-16 pb-20">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="absolute w-[180%] h-[180%] top-[-40%] left-[-40%]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" stroke="#FF6B00" strokeWidth="0.6" fill="none" strokeDasharray="3 6" />
            <circle cx="50" cy="50" r="28" stroke="#FF6B00" strokeWidth="0.8" fill="none" strokeDasharray="5 10" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 px-4 py-1.5 rounded-full text-primary text-sm font-semibold mb-6">
              <Vote className="w-4 h-4 animate-pulse" />
              <span>Infoway Community Opinion & Pricing Polls</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-6">
              Your Voice Shapes Our <span className="text-primary">Services & Pricing.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              We design our connectivity, hotspot plans, and partner software around what our local communities actually need. Cast your vote below and see live results.
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-primary" /> 100% Anonymous & Free
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <BarChart2 className="w-4 h-4 text-primary" /> Live Instant Percentages
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" /> {totalVotesAcrossAll.toLocaleString()} Community Votes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Polls Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-gray-100">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
              Active Community Questions
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Select an option to cast your vote and view real-time community results.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "all", label: "All Questions" },
              { id: "pricing", label: "Pricing & Plans" },
              { id: "feature", label: "Features & Tools" },
              { id: "service", label: "Services" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  filterCategory === tab.id
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-102"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Polls Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : filteredPolls.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700">No active polls in this category</h3>
            <p className="text-gray-400 text-sm mt-1">Check back soon for new community questions!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPolls.map((poll) => {
              const hasVoted = Boolean(votedMap[poll._id]);
              const votedOptionId = votedMap[poll._id];
              const totalVotes = poll.totalVotes || 0;
              const catMeta = CATEGORY_LABELS[poll.category] || CATEGORY_LABELS.pricing;

              return (
                <div
                  key={poll._id}
                  className="bg-white border border-gray-100 hover:border-primary/30 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Badge & Category */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${catMeta.color}`}>
                        {catMeta.label}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Question */}
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-gray-900 mb-3 leading-snug">
                      {poll.question}
                    </h3>

                    {poll.description && (
                      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        {poll.description}
                      </p>
                    )}

                    {/* Options List */}
                    <div className="space-y-3 mb-6">
                      {poll.options.map((opt) => {
                        const votes = opt.votes || 0;
                        const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                        const isSelected = votedOptionId === opt._id;

                        return (
                          <div
                            key={opt._id}
                            onClick={() => !hasVoted && handleVote(poll._id, opt._id)}
                            className={`relative overflow-hidden rounded-2xl border transition-all ${
                              hasVoted
                                ? isSelected
                                  ? "border-primary bg-accent-light/40"
                                  : "border-gray-200 bg-gray-50/50"
                                : "border-gray-200 hover:border-primary bg-white hover:bg-accent-light/20 cursor-pointer hover:shadow-sm"
                            }`}
                          >
                            {/* Vote Percentage Fill Bar */}
                            {hasVoted && (
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={`absolute top-0 left-0 bottom-0 ${
                                  isSelected ? "bg-primary/20" : "bg-gray-200/50"
                                }`}
                              />
                            )}

                            <div className="relative z-10 p-4 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                    isSelected
                                      ? "border-primary bg-primary text-white"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                                </div>
                                <span className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-gray-800"}`}>
                                  {opt.text}
                                </span>
                              </div>

                              {hasVoted && (
                                <div className="text-right shrink-0">
                                  <span className="font-heading font-bold text-sm text-gray-900 block">
                                    {percent}%
                                  </span>
                                  <span className="text-[10px] text-gray-400">
                                    {votes} vote{votes !== 1 ? "s" : ""}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Footer State */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    {hasVoted ? (
                      <span className="flex items-center gap-1.5 text-primary font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        Thank you for voting!
                      </span>
                    ) : (
                      <span>Click an option above to cast your vote</span>
                    )}

                    <span className="font-medium">
                      Live Results
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Call To Action Suggest A Question ── */}
        <div className="mt-16 bg-accent-light border border-primary/20 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-primary font-bold text-xs uppercase tracking-wider block mb-1">
              Have a pricing question or feedback?
            </span>
            <h3 className="text-2xl font-heading font-bold text-gray-900">
              Want us to poll a specific topic or price point?
            </h3>
            <p className="text-gray-600 text-sm mt-1 max-w-xl">
              Reach out directly to the Infoway tech team on WhatsApp with questions you'd like to see added.
            </p>
          </div>

          <a
            href="https://wa.me/233506706787?text=Hello%20Infoway!%20I%20have%20a%20pricing%20question%20suggestion%20for%20the%20community%20poll."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all shadow-md shadow-primary/20 flex items-center gap-2 text-sm shrink-0"
          >
            <span>Suggest a Question</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
