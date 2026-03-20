import { useState } from "react";

const Delta = ({ value }) => {
  const positive = value >= 0;
  return (
    <span
      className={`flex items-center gap-0.5 text-xs font-semibold ${positive ? "text-emerald-500" : "text-rose-500"}`}
    >
      <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none">
        {positive ? (
          <path d="M5 2 L9 8 L1 8 Z" fill="currentColor" />
        ) : (
          <path d="M5 8 L9 2 L1 2 Z" fill="currentColor" />
        )}
      </svg>
      {positive ? "+" : ""}
      {value}%
    </span>
  );
};

const StatCard = ({
  label,
  value,
  delta,
  sub,
  valueClass = "text-slate-800",
  progress,
}) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-5 flex-1 min-w-0">
    <p className="text-[13px] text-slate-400 font-semibold mb-2">
      {label}
    </p>
    <div className="flex items-end justify-between gap-2">
      <span className={`text-3xl font-extrabold leading-none ${valueClass}`}>
        {value}
      </span>
      <Delta value={delta} />
    </div>
    {sub && <p className="text-[11px] text-slate-400 mt-1">{sub}</p>}
    {progress !== undefined && (
      <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#EC5B13] transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
    )}
  </div>
);

const staffOptions = [
  "Alice Johnson",
  "Bob Smith",
  "Carol White",
  "David Lee",
  "Emma Davis",
];
const typeOptions = ["Services", "Products", "Revenue", "Rebooking"];
const periodOptions = ["Daily", "Weekly", "Monthly", "Quarterly"];

const Modal = ({ onClose }) => {
  const [staff, setStaff] = useState("");
  const [type, setType] = useState("Services");
  const [period, setPeriod] = useState("Weekly");
  const [goal, setGoal] = useState("");

  const handleAdd = () => {
    if (!staff || !goal) return;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
     
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 border-2  overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold text-slate-800">Add target</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Staff */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Staff
            </label>
            <div className="relative">
              <select
                value={staff}
                onChange={(e) => setStaff(e.target.value)}
                className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent transition"
              >
                <option value="" disabled>
                  Select staff member
                </option>
                {staffOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Type + Period */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Type
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent transition"
                >
                  {typeOptions.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div className="relative flex-1">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent transition"
                >
                  {periodOptions.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Goal
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                $
              </span>
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="0.00"
                className="w-full border border-slate-200 rounded-lg pl-7 pr-3 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Info Banner */}
          <div className="flex gap-2.5 bg-orange-50 border border-orange-100 rounded-lg px-4 py-3">
            <svg
              className="w-4 h-4 text-custom-blue flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs text-slate-600 leading-relaxed">
              Staff's progress cannot be updated once it's logged at the end of
              the period. Ensure your invoices are up to date before the target
              ends.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-6 py-2 rounded-lg text-sm font-semibold bg-custom-blue hover:bg-blue-00 text-white shadow-md shadow-sky-200 transition-all active:scale-95"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Week Nav ──────────────────────────────────────────────────────────────────

const WeekNav = () => (
  <div className="flex items-center justify-center gap-4 mb-6">
    <button className="text-slate-400 hover:text-slate-600 transition-colors">
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
      This Week
    </span>
    <button className="text-slate-400 hover:text-slate-600 transition-colors">
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
);


export default function TargetsDashboard() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      
      <div className="flex md:flex-row flex-col gap-3 md:items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Targets</h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor and manage business, staff, and departmental goals.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex w-fit items-center gap-2 bg-custom-blue hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-sky-200 transition-all active:scale-95"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Target
        </button>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
        <StatCard
          label="Overall Progress (%)"
          value="72.4%"
          delta={5.2}
          progress={72.4}
        />
        <StatCard
          label="Total Target Value"
          value="$450,000"
          delta={-12.0}
          sub="Current quarter forecast projection"
        />
        <StatCard
          label="Current Achievement"
          value="$324,000"
          delta={-8.4}
          sub="Revenue recognized this period"
          valueClass="text-orange-500"
        />
      </div>

      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
}
