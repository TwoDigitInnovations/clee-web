
import React from "react";
import { Search, Calendar, Download, ChevronDown } from "lucide-react";

const TABS = ["Overview", "Team View", "Archive"];

export default function StaffAnalyticsHeader({
  activeTab, onTabChange, dateRange, onDateRangeChange,
  searchQuery, onSearchChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      {/* Left: title + tabs */}
      <div>
        <h1 className="text-2xl font-bold text-custom-blue leading-tight">
          Staff Achievements &amp; Commissions
        </h1>
        <p className="text-sm text-slate-500 mt-0.5 mb-4">
          Performance tracking for the Q3 Fiscal Period
        </p>
        <div className="flex gap-0 border-b border-slate-200">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => onTabChange(t)}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors -mb-px
                ${activeTab === t
                  ? "border-custom-blue text-custom-blue"
                  : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Right: search + date + export */}
      <div className="flex items-center gap-2 pb-1 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-xl px-3 py-2 shadow-sm min-w-[180px]">
          <Search size={13} className="text-slate-400 flex-shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search staff or data..."
            className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full"
          />
        </div>

        {/* Date range */}
        <button className="flex items-center gap-2 border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm text-slate-600 font-medium shadow-sm hover:bg-slate-50 transition-colors">
          <Calendar size={13} className="text-slate-400" />
          {dateRange}
          <ChevronDown size={13} className="text-slate-400" />
        </button>

        {/* Export */}
        <button className="flex items-center gap-2 border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm text-slate-600 font-medium shadow-sm hover:bg-slate-50 transition-colors">
          <Download size={13} className="text-slate-400" />
          Export Data
        </button>
      </div>
    </div>
  );
}