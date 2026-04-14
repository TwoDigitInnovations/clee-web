
import React from "react";
import { Star, Zap, TrendingUp, TrendingDown } from "lucide-react";

const RANK_COLORS = ["bg-amber-400", "bg-slate-300", "bg-amber-700/60"];
const ACHIEVEMENT_ICONS = {
  star: <Star  size={13} className="text-amber-400" fill="currentColor" />,
  bolt: <Zap   size={13} className="text-sky-500"   fill="currentColor" />,
};

function Avatar({ name, color = "bg-custom-blue" }) {
  return (
    <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
      {name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    </div>
  );
}

const AVATAR_COLORS = ["bg-blue-600", "bg-violet-500", "bg-emerald-500"];

export default function StaffLeaderboard({ data, loading, searchQuery = "" }) {
  const filtered = data.filter((m) =>
    m.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-800">Staff Leaderboard</h3>
        <button className="text-xs font-semibold text-custom-blue hover:underline transition-colors">
          View Full Team
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Rank &amp; Name
              </th>
              <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Achievements
              </th>
              <th className="text-right px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Total Commission
              </th>
              <th className="text-right px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Conv. Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b border-slate-50 animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 bg-slate-100 rounded" />
                          <div className="h-2.5 w-20 bg-slate-100 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4"><div className="h-4 w-12 bg-slate-100 rounded mx-auto" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-16 bg-slate-100 rounded ml-auto" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-100 rounded ml-auto" /></td>
                  </tr>
                ))
              : filtered?.map((member, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-50 last:border-none hover:bg-slate-50/60 transition-colors"
                  >
                  
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        
                        <span
                          className={`w-5 h-5 rounded-full ${RANK_COLORS[i] ?? "bg-slate-200"} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}
                        >
                          {i+1}
                        </span>
                        <Avatar name={member.fullname} color={AVATAR_COLORS[i % AVATAR_COLORS.length]} />
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-tight">{member.fullname}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{member.role}</p>
                        </div>
                      </div>
                    </td>

              
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {member.achievements?.map((a, j) => (
                          <span key={j}>{ACHIEVEMENT_ICONS[a]}</span>
                        ))}
                      </div>
                    </td>

                    {/* Commission */}
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm font-bold text-slate-800">
                        ${member.commission?.toLocaleString()}
                      </span>
                    </td>

                    {/* Conv rate */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-sm font-semibold text-slate-700">{member.convRate}%</span>
                        {member.trend === "up"
                          ? <TrendingUp  size={13} className="text-emerald-500" />
                          : <TrendingDown size={13} className="text-red-400" />
                        }
                      </div>
                    </td>
                  </tr>
                ))
            }
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">
                  No staff match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}