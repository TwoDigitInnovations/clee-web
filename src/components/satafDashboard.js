import { useState } from "react";

const allStaff = [
  {
    id: 1,
    initials: "JD",
    color: "#6C8EBF",
    name: "Staff 1",
    services: 0,
    servicesDelta: -4742,
    products: 0,
    productsDelta: -3224,
    avgHour: 0,
    hours: 30,
    hourDelta: -266,
    rebooked: 0,
    appts: 6,
    rebookDelta: -50,
  },
  {
    id: 2,
    initials: "SM",
    color: "#E07A5F",
    name: "Staff 2",
    services: 1200,
    servicesDelta: 200,
    products: 450,
    productsDelta: 50,
    avgHour: 40,
    hours: 35,
    hourDelta: 19,
    rebooked: 45,
    appts: 12,
    rebookDelta: 9,
  },
  {
    id: 3,
    initials: "AK",
    color: "#81B29A",
    name: "Staff 3",
    services: 3450,
    servicesDelta: 840,
    products: 120,
    productsDelta: -30,
    avgHour: 85,
    hours: 40,
    hourDelta: 15,
    rebooked: 78,
    appts: 22,
    rebookDelta: 12,
  },
  {
    id: 4,
    initials: "MR",
    color: "#F2CC8F",
    name: "Staff 4",
    services: 2100,
    servicesDelta: 310,
    products: 890,
    productsDelta: 120,
    avgHour: 60,
    hours: 38,
    hourDelta: 8,
    rebooked: 62,
    appts: 18,
    rebookDelta: 5,
  },
  {
    id: 5,
    initials: "PK",
    color: "#9B8EA8",
    name: "Staff 5",
    services: 500,
    servicesDelta: -200,
    products: 300,
    productsDelta: -80,
    avgHour: 25,
    hours: 28,
    hourDelta: -12,
    rebooked: 30,
    appts: 10,
    rebookDelta: -15,
  },
  {
    id: 6,
    initials: "LN",
    color: "#E9C46A",
    name: "Staff 6",
    services: 4200,
    servicesDelta: 1100,
    products: 670,
    productsDelta: 90,
    avgHour: 95,
    hours: 42,
    hourDelta: 22,
    rebooked: 88,
    appts: 25,
    rebookDelta: 18,
  },
  {
    id: 7,
    initials: "TS",
    color: "#264653",
    name: "Staff 7",
    services: 750,
    servicesDelta: -50,
    products: 200,
    productsDelta: 40,
    avgHour: 35,
    hours: 32,
    hourDelta: 3,
    rebooked: 41,
    appts: 14,
    rebookDelta: 2,
  },
  {
    id: 8,
    initials: "BR",
    color: "#2A9D8F",
    name: "Staff 8",
    services: 3000,
    servicesDelta: 700,
    products: 540,
    productsDelta: 110,
    avgHour: 75,
    hours: 39,
    hourDelta: 14,
    rebooked: 70,
    appts: 20,
    rebookDelta: 10,
  },
  {
    id: 9,
    initials: "CP",
    color: "#E76F51",
    name: "Staff 9",
    services: 1800,
    servicesDelta: 250,
    products: 380,
    productsDelta: -20,
    avgHour: 55,
    hours: 36,
    hourDelta: 6,
    rebooked: 55,
    appts: 16,
    rebookDelta: 4,
  },
  {
    id: 10,
    initials: "VG",
    color: "#A8DADC",
    name: "Staff 10",
    services: 900,
    servicesDelta: -100,
    products: 160,
    productsDelta: 30,
    avgHour: 45,
    hours: 33,
    hourDelta: -5,
    rebooked: 48,
    appts: 13,
    rebookDelta: -3,
  },
  {
    id: 11,
    initials: "HJ",
    color: "#457B9D",
    name: "Staff 11",
    services: 2700,
    servicesDelta: 500,
    products: 720,
    productsDelta: 150,
    avgHour: 70,
    hours: 41,
    hourDelta: 17,
    rebooked: 74,
    appts: 21,
    rebookDelta: 14,
  },
  {
    id: 12,
    initials: "NK",
    color: "#1D3557",
    name: "Staff 12",
    services: 4800,
    servicesDelta: 1300,
    products: 950,
    productsDelta: 200,
    avgHour: 105,
    hours: 44,
    hourDelta: 28,
    rebooked: 92,
    appts: 28,
    rebookDelta: 22,
  },
];

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

const Avatar = ({ initials, color }) => (
  <div
    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md"
    style={{ backgroundColor: color }}
  >
    {initials}
  </div>
);

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

const Pagination = ({ current, total, onChange }) => {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
      <span className="text-sm text-slate-400">
        Showing <span className="font-semibold text-slate-600">{PER_PAGE}</span>{" "}
        of{" "}
        <span className="font-semibold text-slate-600">{allStaff.length}</span>{" "}
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
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(allStaff.length / PER_PAGE);
  const paged = allStaff.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
