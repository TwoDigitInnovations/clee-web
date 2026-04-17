// ClientReferralPage.jsx
import React, { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
  Mail,
  LayoutDashboard,
  UserCircle2,
  Send,
  Sparkles,
  Gift,
  Wallet,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
const DUMMY = {
  user: {
    name: "Sarah Johnson",
    referralCode: "SARAH25",
    referralLink: "https://cleebeauty.com/ref/SARAH25",
  },
  rewards: {
    friendsReferred: 3,
    creditEarned: 75,
    creditAvailable: 50,
    nextMilestone: "5 referrals → free service",
    nextMilestoneReferrals: 5,
  },
  referrals: [
    {
      id: 1,
      initials: "EW",
      name: "Emma W.",
      color: "#6366f1",
      status: "Booked",
      reward: "+$25",
    },
    {
      id: 2,
      initials: "CM",
      name: "Claire M.",
      color: "#3b82f6",
      status: "Booked",
      reward: "+$25",
    },
    {
      id: 3,
      initials: "JT",
      name: "Jess T.",
      color: "#64748b",
      status: "Link sent",
      reward: "Pending",
    },
  ],
  howItWorks: [
    {
      step: 1,
      title: "Send your link",
      desc: "Share your unique code with friends who haven't visited Clee Beauty.",
      icon: Send,
    },
    {
      step: 2,
      title: "They get $25 off",
      desc: "Your friend receives an immediate discount on their first clinic booking.",
      icon: Sparkles,
    },
    {
      step: 3,
      title: "You earn $25",
      desc: "Once their appointment is completed, we'll add $25 credit to your wallet.",
      icon: Gift,
    },
  ],
};

function StatusBadge({ status }) {
  const map = {
    Booked: "bg-blue-100 text-blue-700",
    "Link sent": "bg-amber-100 text-amber-700",
    Pending: "bg-slate-100 text-slate-500",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status] || "bg-slate-100 text-slate-500"}`}
    >
      {status}
    </span>
  );
}

function Avatar({ initials, color }) {
  return (
    <span
      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

export default function ClientReferralPage() {
  const [copied, setCopied] = useState(false);
  const { user, rewards, referrals, howItWorks } = DUMMY;

  const handleCopy = () => {
    navigator.clipboard.writeText(user.referralCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const router = useRouter();
  const progressPct = Math.min(
    (rewards.friendsReferred / rewards.nextMilestoneReferrals) * 100,
    100,
  );

  return (
    <>
      <DashboardHeader title="Referrals" />
      <div className="min-h-screen bg-custom-gray">
        <div className="md:px-6 px-3 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Client Referrals Page
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Track client referrals, rewards and revenue generated
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="flex items-center gap-1.5 text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-1.5 hover:bg-slate-50 transition-colors"
              onClick={() => router.push("/Referrals")}
            >
              <LayoutDashboard size={14} /> Clinic dashboard
            </button>
            <button className="flex items-center gap-1.5 text-sm text-white bg-custom-blue  rounded-xl px-3 py-1.5 hover:bg-custom-blue  transition-colors">
              <UserCircle2 size={14} /> Client referral page
            </button>
            <button className="flex items-center gap-1.5 text-sm text-white bg-custom-blue hover:bg-slate-900 rounded-xl px-3.5 py-1.5 transition-colors">
              <Share2 size={14} /> Share referral link
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto md:px-4 px-3 py-8 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex gap-6 md:p-7 p-4">
              {/* Left */}
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Share the love, earn rewards
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Give your friends $25 off their first treatment and get $25
                  credit for yourself when they book. It's a win-win for
                  everyone's glow.
                </p>

                {/* Code Input */}
                <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden mb-3 focus-within:border-custom-blue  transition-colors">
                  <span className="flex-1 px-4 py-3 text-sm font-bold text-slate-700 tracking-widest bg-white">
                    {user.referralCode}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors border-l border-slate-200"
                  >
                    {copied ? (
                      <Check size={14} className="text-emerald-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                {/* Share Button */}
                <button className="w-full flex items-center justify-center gap-2 bg-custom-blue  hover:bg-custom-blue  text-white font-semibold py-3 rounded-xl transition-colors shadow-sm mb-4 text-sm">
                  <Share2 size={15} /> Share my referral link
                </button>

                {/* Social Icons */}
                <div className="flex items-center justify-center gap-3">
                  <button className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-colors shadow-sm">
                    <MessageCircle size={16} className="text-white" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors shadow-sm">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-800 flex items-center justify-center transition-colors shadow-sm">
                    <Mail size={16} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Right — Decorative image placeholder */}
              <div className="hidden sm:block w-64 h-52 rounded-2xl overflow-hidden flex-shrink-0  relative">
                <img src="/images/image-34.png" alt="image" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Your Rewards */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wallet size={16} className="text-custom-blue " />
                <h3 className="text-sm font-bold text-slate-800">
                  Your rewards
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">
                    Friends referred
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {rewards.friendsReferred}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">Credit earned</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${rewards.creditEarned}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">
                    Credit available
                  </p>
                  <p className="text-2xl font-bold text-amber-500">
                    ${rewards.creditAvailable}
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-3">
                  <p className="text-xs text-custom-blue  mb-1">
                    Next milestone
                  </p>
                  <p className="text-xs font-semibold text-custom-blue  leading-snug">
                    {rewards.nextMilestone}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-2">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>{rewards.friendsReferred} referrals</span>
                  <span>{rewards.nextMilestoneReferrals} needed</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-custom-blue  rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* How it Works */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-custom-blue " />
                <h3 className="text-sm font-bold text-slate-800">
                  How it works
                </h3>
              </div>
              <div className="space-y-4">
                {howItWorks.map(({ step, title, desc, icon: Icon }) => (
                  <div key={step} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-custom-blue  text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {title}
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed mt-0.5 max-w-xs">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                Your referrals
              </h3>
              <span className="text-xs text-slate-400">
                Tracking {referrals.length} people
              </span>
            </div>

            <div className="grid grid-cols-3 px-6 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-50">
              <span>Friend</span>
              <span className="text-center">Status</span>
              <span className="text-right">Reward</span>
            </div>

            {referrals.map((r, i) => (
              <div
                key={r.id}
                className={`grid grid-cols-3 items-center px-6 py-4 hover:bg-slate-50 transition-colors ${
                  i < referrals.length - 1 ? "border-b border-slate-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar initials={r.initials} color={r.color} />
                  <span className="text-sm font-medium text-slate-800">
                    {r.name}
                  </span>
                </div>
                <div className="flex justify-center">
                  <StatusBadge status={r.status} />
                </div>
                <div className="text-right">
                  <span
                    className={`text-sm font-bold ${r.reward === "Pending" ? "text-slate-400" : "text-emerald-600"}`}
                  >
                    {r.reward}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
