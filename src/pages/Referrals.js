// Referrals.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  CalendarCheck,
  DollarSign,
  Gift,
  Share2,
  LayoutDashboard,
  UserCircle2,
  ChevronRight,
  Star,
  AlertCircle,
  Edit2,
} from "lucide-react";
import { fetchReferrals, setFilter } from "../redux/slices/RefralsSlice";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";

function Avatar({ initials, color, size = "md" }) {
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0 ${sizes[size]}`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    Rewarded: "bg-emerald-100 text-emerald-700",
    Booked: "bg-blue-100 text-blue-700",
    Pending: "bg-amber-100 text-amber-700",
  };
  return (
    <span
      className={`px-2.5 py-0.5 w-fit rounded-full text-xs font-medium ${map[status] || "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, highlight }) {
  return (
    <div
      className={`rounded-2xl p-5 flex flex-col gap-1 shadow-sm border ${highlight ? "bg-custom-blue border-custom-blue text-white" : "bg-white border-slate-100 text-slate-800"}`}
    >
      <div className="flex items-center justify-between mb-1">
        <p
          className={`text-sm font-medium ${highlight ? "text-indigo-100" : "text-slate-500"}`}
        >
          {label}
        </p>
        <Icon
          size={18}
          className={highlight ? "text-indigo-200" : "text-slate-400"}
        />
      </div>
      <p
        className={`text-3xl font-bold tracking-tight ${highlight ? "text-white" : "text-slate-900"}`}
      >
        {value}
      </p>
      {sub && (
        <p
          className={`text-xs mt-0.5 ${highlight ? "text-indigo-200" : "text-slate-400"}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export default function Referrals() {
  const dispatch = useDispatch();
  const {
    stats,
    referrals,
    topReferrers,
    rewardTiers,
    activeFilter,
    loading,
    error,
    usingDummyData,
  } = useSelector((state) => state.referrals);
  const router = useRouter();
  useEffect(() => {
    dispatch(fetchReferrals());
  }, [dispatch]);

  // Filter referrals
  const filtered =
    activeFilter === "All"
      ? referrals
      : referrals.filter((r) => r.status === activeFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-custom-blue  border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading referrals…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader title="Referrals" />
      <div className="min-h-screen bg-custom-gray">
        <div className="md:px-6 p-3 py-4 flex md:flex-row flex-col md:items-center gap-3 justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Referrals
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Track client referrals, rewards and revenue generated
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-1.5 text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-1.5 hover:bg-slate-50 transition-colors">
              <LayoutDashboard size={14} /> Clinic dashboard
            </button>
            <button
              className="flex items-center gap-1.5 text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-1.5 hover:bg-slate-50 transition-colors"
              onClick={() => router.push("/ClientRefrrals")}
            >
              <UserCircle2 size={14} /> Client referral page
            </button>
            <button className="flex items-center gap-1.5 text-sm text-white bg-custom-blue  hover:bg-indigo-700 rounded-xl px-3.5 py-1.5 transition-colors shadow-sm">
              <Share2 size={14} /> Share referral link
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto md:px-6 px-4 py-0 space-y-6">
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Users}
                label="Total referrals"
                value={stats.totalReferrals}
                sub={`+${stats.newThisMonth} Active this month`}
              />
              <StatCard
                icon={CalendarCheck}
                label="Converted bookings"
                value={stats.convertedBookings}
                sub={`${stats.conversionRate}% conversion rate`}
              />
              <StatCard
                icon={DollarSign}
                label="Revenue generated"
                value={`$${stats.revenueGenerated.toLocaleString()}`}
                sub="This financial year"
                highlight
              />
              <StatCard
                icon={Gift}
                label="Rewards issued"
                value={`$${stats.rewardsIssued.toLocaleString()}`}
                sub={`$${stats.pendingPayout} pending payout`}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-slate-900">
                  Reward tiers
                </h2>
                <button className="flex items-center gap-1 text-xs text-slate-500 border border-slate-200 rounded-lg px-2.5 py-1 hover:bg-slate-50 transition-colors">
                  <Edit2 size={11} /> Edit
                </button>
              </div>
              <div className="space-y-3">
                {rewardTiers.map((tier, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all ${
                      tier.active
                        ? "bg-[#0A4D911A] text-black"
                        : "bg-slate-50 border-slate-100 text-slate-800"
                    }`}
                  >
                    {tier.rank && (
                      <span
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          tier.active
                            ? "bg-custom-blue  text-white"
                            : "bg-white text-slate-700 border border-slate-200"
                        }`}
                      >
                        {tier.rank}
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold ${tier.active ? "text-custom-blue" : "text-slate-900"}`}
                      >
                        {tier.label}
                      </p>
                      <p
                        className={`text-xs ${tier.active ? "text-gray-700" : "text-slate-400"}`}
                      >
                        {tier.description}
                      </p>
                    </div>
                    {tier.active && (
                      <Star
                        size={16}
                        className="text-custom-blue flex-shrink-0"
                        fill="currentColor"
                      />
                    )}
                    {tier.badge && (
                      <span className="bg-custom-blue text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                        {tier.badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-slate-900">
                  Top referrers
                </h2>
                <button className="text-xs text-custom-blue font-medium hover:underline flex items-center gap-0.5">
                  View all <ChevronRight size={12} />
                </button>
              </div>
              <div className="space-y-4">
                {topReferrers.map((r) => (
                  <div key={r.rank} className="flex items-center gap-3">
                    <span className="w-5 text-sm font-bold text-slate-400">
                      {r.rank}
                    </span>
                    <Avatar initials={r.avatar} color={r.color} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {r.name}
                      </p>
                      <p className="text-xs text-slate-400">{r.since}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-indigo-600">
                        {r.referrals} referrals
                      </p>
                      <p className="text-xs text-slate-400">
                        ${r.revenue.toLocaleString()} revenue
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-6 py-4 border-b border-slate-100 gap-3">
              <h2 className="text-base font-semibold text-slate-900">
                All referrals
              </h2>

              <div className="flex flex-wrap items-center gap-1 bg-slate-100 rounded-xl p-1">
                {["All", "Booked", "Pending", "Rewarded"].map((f) => (
                  <button
                    key={f}
                    onClick={() => dispatch(setFilter(f))}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      activeFilter === f
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden md:grid md:grid-cols-6 px-6 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-50">
              <span className="col-span-2">Referred by</span>
              <span>Friend referred</span>
              <span>Date</span>
              <span>Status</span>
              <span className="text-right">Booking value</span>
            </div>

            {filtered.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-400 text-sm">
                No referrals found for this filter.
              </div>
            ) : (
              filtered.map((r, i) => (
                <div
                  key={r.id}
                  className={`border-b border-slate-50 ${
                    i === filtered.length - 1 ? "border-none" : ""
                  }`}
                >
                  <div className="hidden md:grid grid-cols-6 items-center px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="col-span-2 flex items-center gap-3">
                      <Avatar
                        initials={r.referredBy.initials}
                        color={r.referredBy.color}
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {r.referredBy.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {r.referredBy.email}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm text-slate-700">
                      {r.friendReferred}
                    </span>

                    <span className="text-sm text-slate-500">{r.date}</span>

                    <StatusBadge status={r.status} />

                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {r.bookingValue != null
                          ? `$${r.bookingValue.toFixed(2)}`
                          : "—"}
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${
                          r.status === "Rewarded"
                            ? "text-custom-blue font-medium"
                            : "text-slate-400"
                        }`}
                      >
                        {r.reward}
                      </p>
                    </div>
                  </div>

                  {/* ✅ Mobile Card */}
                  <div className="md:hidden p-4 space-y-3">
                    {/* User */}
                    <div className="flex items-center gap-3">
                      <Avatar
                        initials={r.referredBy.initials}
                        color={r.referredBy.color}
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {r.referredBy.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {r.referredBy.email}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-slate-400">Friend</p>
                        <p className="text-slate-700">{r.friendReferred}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Date</p>
                        <p className="text-slate-500">{r.date}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Status</p>
                        <StatusBadge status={r.status} />
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-400">Value</p>
                        <p className="text-slate-900 font-semibold">
                          {r.bookingValue != null
                            ? `$${r.bookingValue.toFixed(2)}`
                            : "—"}
                        </p>
                        <p className="text-xs text-slate-400">{r.reward}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
