
import { Zap, Info } from "lucide-react";

function SummaryRow({ label, value, bold, large, accent }) {
  return (
    <div className={`flex items-center justify-between py-2 ${bold ? "border-t border-white/20 mt-1 pt-3" : ""}`}>
      <span className={`text-sm ${bold ? "font-bold text-white" : "text-white/70"}`}>{label}</span>
      <span className={`font-bold ${large ? "text-2xl text-white" : accent ? "text-orange-300 text-sm" : "text-white text-sm"}`}>
        {value}
      </span>
    </div>
  );
}

export default function PlanSummaryPanel({
  totalPlan, totalCommission, servicesCount,
  marketingSteps, taxBreakdown, totalNet,
  onActivate, loading,
}) {
  return (
    <div className="space-y-3 lg:sticky lg:top-6">
      {/* Summary card */}
      <div className="bg-custom-blue rounded-2xl p-5 shadow-md">
        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3">Plan Summary</p>

        <div className="mb-1">
          <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider">Total Plan Value</p>
          <p className="text-3xl font-bold text-white">${totalPlan.toFixed(2)}</p>
        </div>
        <p className="text-sm font-semibold text-white/80 mb-4">
          Est. Commissions &nbsp;
          <span className="text-orange-300">${totalCommission.toFixed(2)}</span>
        </p>

        <div className="space-y-0.5 border-t border-white/20 pt-3">
          <SummaryRow label="Services Included" value={`${servicesCount} Items`} />
          <SummaryRow label="Marketing Steps"   value={`${marketingSteps} Touchpoints`} />
          <SummaryRow label="Tax Breakdown"     value={`$${taxBreakdown.toFixed(2)}`} />
          <SummaryRow label="Total Net Revenue" value={`$${totalNet.toFixed(2)}`} bold />
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={onActivate}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-custom-blue text-white text-sm font-bold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-60 shadow-sm"
      >
        {loading
          ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <Zap size={15} fill="currentColor" />
        }
        Activate Plan
      </button>

      <button className="w-full border-2 border-slate-200 text-slate-700 text-sm font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors">
        Preview Draft
      </button>

      <button className="w-full text-xs text-slate-400 hover:text-slate-600 py-2 transition-colors">
        Save Draft &amp; Exit
      </button>

      {/* Enterprise notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3.5 flex gap-3">
        <Info size={15} className="text-custom-blue flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-custom-blue mb-0.5">Enterprise Rule Applied:</p>
          <p className="text-xs text-blue-600/80 leading-relaxed">
            Custom plans for tier-1 clients require secondary approval if commission exceeds 20% total value.
          </p>
        </div>
      </div>
    </div>
  );
}