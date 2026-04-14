"use client";
import React from "react";
import { DollarSign, Target, UserPlus } from "lucide-react";

export function AchievementSpotlight({ data }) {
  return (
    <div className="bg-custom-blue rounded-2xl overflow-hidden shadow-md">
      {/* Label */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
          Achievement Spotlight
        </p>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center px-5 pb-5">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white border-4 border-white/30">
            {data.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          {/* Camera badge */}
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow">
            <div className="w-3 h-3 rounded-full bg-custom-blue" />
          </div>
        </div>

        <p className="text-white font-bold text-base leading-tight text-center">
          {data.name}
        </p>
        <p className="text-white/60 text-xs mt-0.5 text-center">{data.title}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 w-full mt-5 pt-4 border-t border-white/20">
          <div className="text-center">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">
              Bonus
            </p>
            <p className="text-xl font-bold text-white">
              ${data.bonus.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">
              Leads
            </p>
            <p className="text-xl font-bold text-white">{data.leads}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const ACTIVITY_ICONS = {
  dollar: { icon: DollarSign, bg: "bg-emerald-100", color: "text-emerald-600" },
  target: { icon: Target, bg: "bg-amber-100", color: "text-amber-600" },
  user: { icon: UserPlus, bg: "bg-blue-100", color: "text-blue-600" },
};

export function LiveActivity({ activities }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <h3 className="text-base font-bold text-slate-800 mb-4">Live Activity</h3>

      <div className="space-y-4">
        {activities.map((a, i) => {
          const cfg = ACTIVITY_ICONS[a.icon] ?? ACTIVITY_ICONS.user;
          const Icon = cfg.icon;
          return (
            <div key={i} className="flex gap-3">
              <div
                className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
              >
                <Icon size={15} className={cfg.color} />
              </div>
              <div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {a.text}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5 tracking-wider">
                  {a.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 pt-4 border-t border-slate-100 text-xs font-bold text-custom-blue hover:underline tracking-widest uppercase">
        View All Activity
      </button>
    </div>
  );
}

export function AnnualTargetProgress({ percent, reached, goal }) {
  const R = 52;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC - (percent / 100) * CIRC;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <h3 className="text-base font-bold text-slate-800 mb-4">
        Annual Target Progress
      </h3>

      <div className="flex flex-col items-center">
        {/* Donut */}
        <div className="relative w-36 h-36">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="#1e3a6e"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-slate-800">
              {percent}%
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 text-center mt-3 leading-relaxed">
          ${reached}M of ${goal}M goal reached. You are{" "}
          <span className="font-semibold text-emerald-600">
            ahead of schedule
          </span>{" "}
          for Q4.
        </p>
      </div>
    </div>
  );
}

