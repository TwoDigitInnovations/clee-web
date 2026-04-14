
import React from "react";
import { TrendingDown, TrendingUp, Users, Gift } from "lucide-react";

function BarMini() {
  const heights = [30, 45, 35, 55, 40, 60, 50];
  return (
    <div className="flex items-end gap-0.5 h-8">
      {heights.map((h, i) => (
        <div
          key={i}
          className="w-2 rounded-sm bg-custom-blue/20"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
      <div
        className="h-full bg-custom-blue rounded-full transition-all duration-700"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

function AvatarStack({ count }) {
  const colors = ["bg-blue-400", "bg-emerald-400", "bg-violet-400"];
  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-2">
        {colors.map((c, i) => (
          <div key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-white flex items-center justify-center text-[9px] text-white font-bold`}>
            {String.fromCharCode(65 + i)}
          </div>
        ))}
      </div>
      <span className="text-[10px] text-slate-500 font-medium ml-1">+{count} earned bonuses</span>
    </div>
  );
}

function Trend({ value }) {
  const up = value > 0;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-emerald-500" : "text-red-400"}`}>
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {Math.abs(value)}%
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

export default function StatsCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 h-32 animate-pulse">
            <div className="h-3 bg-slate-100 rounded w-3/4 mb-3" />
            <div className="h-7 bg-slate-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Commissions */}
      <Card>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Total Commissions (MTD)
        </p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-slate-800">
              ${(stats.totalCommissions / 1000).toFixed(0)}K
            </p>
            <Trend value={stats.commissionChange} />
          </div>
          <BarMini />
        </div>
      </Card>

      {/* Avg Commission / Staff */}
      <Card>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Avg. Commission / Staff
        </p>
        <p className="text-2xl font-bold text-slate-800 mb-1">
          ${stats.avgCommission.toLocaleString()}
        </p>
        <Trend value={stats.avgChange} />
        <ProgressBar value={62} />
      </Card>

      {/* Top Performing Team */}
      <Card>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Top Performing Team
        </p>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-custom-blue flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {stats.topTeam.initials}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">
              {stats.topTeam.name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Target reached: {stats.topTeam.target}%
            </p>
          </div>
        </div>
      </Card>

      {/* Incentive Payouts */}
      <Card>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Incentive Payouts
        </p>
        <p className="text-2xl font-bold text-slate-800 mb-2">
          ${(stats.incentivePayouts / 1000).toFixed(1)}K
        </p>
        <AvatarStack count={stats.bonusCount} />
      </Card>
    </div>
  );
}
