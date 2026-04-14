import { useState } from "react";
import {
  FlaskConical,
  Snowflake,
  Droplets,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react";

const SERVICE_ICONS = {
  lab: <FlaskConical size={18} className="text-custom-blue" />,
  cryo: <Snowflake size={18} className="text-sky-500" />,
  iv: <Droplets size={18} className="text-indigo-500" />,
};

const FREQ_COLORS = {
  "Every 2–3 weeks": "bg-blue-100 text-blue-700",
  "Twice weekly": "bg-violet-100 text-violet-700",
};

function ServiceRow({ svc, onRemove, onUpdate }) {
  return (
    <div className="flex items-start gap-4 py-5 border-b border-slate-100 last:border-none">
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        {SERVICE_ICONS[svc.icon] ?? (
          <FlaskConical size={18} className="text-slate-400" />
        )}
      </div>

      {/* Name + freq + interval */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 leading-tight">
          {svc.name}
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            Frequency
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${FREQ_COLORS[svc.freq] ?? "bg-slate-100 text-slate-600"}`}
          >
            {svc.freq}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            Interval:
          </span>
          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
            {svc.interval}
          </span>
        </div>
      </div>

      {/* Base price */}
      <div className="text-right flex-shrink-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          Base Price
        </p>
        <p className="text-sm font-bold text-slate-800">
          ${svc.basePrice.toFixed(2)}
        </p>
      </div>

      {/* Commission */}
      <div className="text-right flex-shrink-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          Commission
        </p>
        <p className="text-sm font-bold text-orange-500">
          {svc.commissionPct}%{" "}
          <span className="text-orange-400">
            (${((svc.basePrice * svc.commissionPct) / 100).toFixed(2)})
          </span>
        </p>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(svc.id)}
        className="mt-1 p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default function ServiceSelectionSection({
  services,
  onUpdate,
  catalog,
}) {
  const addPlaceholder = () => {
    const newSvc = {
      id: Date.now(),
      icon: "lab",
      name: "New Service",
      freq: "Every 2–3 weeks",
      interval: "7 days",
      basePrice: 100,
      commissionPct: 10,
    };
    onUpdate([...services, newSvc]);
  };

  const remove = (id) => onUpdate(services.filter((s) => s.id !== id));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-800">
          Service Selection &amp; Commissions
        </h3>
        <button
          onClick={addPlaceholder}
          className="flex items-center gap-1.5 text-xs font-bold text-custom-blue hover:underline transition-colors"
        >
          <Plus size={13} /> Add Service
        </button>
      </div>

      {/* Rows */}
      <div className="px-6">
        {services.map((svc) => (
          <ServiceRow
            key={svc.id}
            svc={svc}
            onRemove={remove}
            onUpdate={() => {}}
          />
        ))}
      </div>

      {/* Empty drop zone */}
      <div className="mx-6 mb-5 mt-2 border-2 border-dashed border-slate-200 rounded-xl py-5 text-center">
        <p className="text-xs text-slate-400">
          Click to select next service from catalog
        </p>
      </div>
    </div>
  );
}
