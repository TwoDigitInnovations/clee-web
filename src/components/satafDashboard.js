import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaffStats } from "@/redux/actions/staffActions";

const PER_PAGE = 3;

const fmt = (v) => (v === 0 ? "$0" : `$${Math.abs(v).toLocaleString()}`);

const Delta = ({ value, suffix = "" }) => {
  if (value === 0) return null;
  const positive = value > 0;
  return (
    <span
      className={`flex items-center gap-0.5 text-xs font-semibold mt-0.5 ${
        positive ? "text-emerald-500" : "text-rose-500"
      }`}
    >
      <svg
        viewBox="0 0 10 10"
        className="w-3 h-3"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {positive ? (
          <path d="M5 2 L9 8 L1 8 Z" fill="currentColor" />
        ) : (
          <path d="M5 8 L9 2 L1 2 Z" fill="currentColor" />
        )}
      </svg>
      {positive ? "+" : ""}
      {suffix === "%" ? `${value}%` : `$${Math.abs(value).toLocaleString()}`}
      {suffix === "%" ? "" : ""}
    </span>
  );
};

const Avatar = ({ initials, color }) => {
  // Generate color from initials if not provided
  const colors = [
    "#6C8EBF", "#E07A5F", "#81B29A", "#F2CC8F", "#9B8EA8",
    "#E9C46A", "#264653", "#2A9D8F", "#E76F51", "#A8DADC",
    "#457B9D", "#1D3557"
  ];
  const colorIndex = initials.charCodeAt(0) % colors.length;
  const bgColor = color || colors[colorIndex];
  
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md"
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
};

const StatCell = ({ label, main, delta, suffix }) => (
  <div className="flex flex-col">
    <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
      {label}
    </span>
    <span className="text-slate-800 font-bold text-base">{main}</span>
    <Delta value={delta} suffix={suffix} />
  </div>
);

const StaffRow = ({ member, isLast }) => (
  <div
    className={`flex items-center gap-6 px-6 py-5 transition-all duration-200 hover:bg-sky-50/60 group ${
      !isLast ? "border-b border-slate-100" : ""
    }`}
  >
    
    <div className="flex items-center gap-3 w-44 flex-shrink-0">
      <Avatar initials={member.initials} color={member.color} />
      <div>
        <p className="font-bold text-slate-800 text-sm leading-tight">
          {member.name}
        </p>
        <a
          href="#"
          className="text-[12px] text-custom-blue hover:text-sky-700 flex items-center gap-0.5 mt-0.5 transition-colors"
        >
          Personal dashboard
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>

    <div className="flex-1">
      <StatCell
        label="Services"
        main={fmt(member.services)}
        delta={member.servicesDelta}
      />
    </div>

    <div className="flex-1">
      <StatCell
        label="Products"
        main={fmt(member.products)}
        delta={member.productsDelta}
      />
    </div>

    <div className="flex-1">
      <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-1 block">
        Average Hour
      </span>
      <span className="text-slate-800 font-bold text-base">
        {member.avgHour === 0 ? "$0" : `$${member.avgHour}`}
      </span>
      <p className="text-[11px] text-slate-400 mt-0.5">
        {member.hours} hrs rostered
      </p>
      <Delta value={member.hourDelta} />
    </div>

    {/* Rebooked */}
    <div className="flex-1">
      <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-1 block">
        Rebooked
      </span>
      <span className="text-slate-800 font-bold text-base">
        {member.rebooked}%
      </span>
      <p className="text-[11px] text-slate-400 mt-0.5">
        of {member.appts} appts
      </p>
      <Delta value={member.rebookDelta} suffix="%" />
    </div>
  </div>
);

const Pagination = ({ current, total, onChange, totalStaff }) => {
  if (total === 0) return null;
  
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
      <span className="text-sm text-slate-400">
        Showing <span className="font-semibold text-slate-600">{Math.min(PER_PAGE, totalStaff)}</span>{" "}
        of{" "}
        <span className="font-semibold text-slate-600">{totalStaff}</span>{" "}
        staff members
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(1, current - 1))}
          disabled={current === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-sky-100 hover:text-sky-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
              p === current
                ? "bg-custom-blue text-white shadow-md shadow-sky-200"
                : "text-slate-500 hover:bg-sky-50 hover:text-sky-600"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onChange(Math.min(total, current + 1))}
          disabled={current === total}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-sky-100 hover:text-sky-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const TableHeader = () => (
  <div className="flex items-center gap-6 px-6 py-3 bg-slate-50 border-b border-slate-100 rounded-t-2xl">
    <div className="w-44 flex-shrink-0">
      <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
        Staff Member
      </span>
    </div>
    <div className="flex-1">
      <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
        Services
      </span>
    </div>
    <div className="flex-1">
      <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
        Products
      </span>
    </div>
    <div className="flex-1">
      <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
        Average Hour
      </span>
    </div>
    <div className="flex-1">
      <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
        Rebooked
      </span>
    </div>
  </div>
);

export default function StaffDashboard() {
  const dispatch = useDispatch();
  const { staffStats, loading } = useSelector((state) => state.staff);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadStaffStats();
  }, []);

  const loadStaffStats = async () => {
    try {
      await dispatch(fetchStaffStats());
    } catch (err) {
      console.error("Failed to fetch staff stats", err);
    }
  };

  const allStaff = staffStats || [];
  const totalPages = Math.ceil(allStaff.length / PER_PAGE);
  const paged = allStaff.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-blue mx-auto mb-4"></div>
          <p className="text-slate-600">Loading staff data...</p>
        </div>
      </div>
    );
  }

  if (allStaff.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-lg">No staff data available</p>
          <p className="text-slate-400 text-sm mt-2">Add staff members to see their performance</p>
          <p className="text-slate-500 text-xs mt-4">Check browser console for API response details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-100 flex items-start justify-center font-sans">
      <div className="w-full max-w-7xl">
       
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 ">
          <TableHeader />
          <div>
            {paged.map((member, idx) => (
              <StaffRow
                key={member.id}
                member={member}
                isLast={idx === paged.length - 1}
              />
            ))}
          </div>
          <Pagination current={page} total={totalPages} onChange={setPage} totalStaff={allStaff.length} />
        </div>
      </div>
    </div>
  );
}
