"use client";
import DashboardHeader from "@/components/DashboardHeader";
import { Api } from "@/services/service";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Download,
  Info,
  ArrowRight,
  ChevronDown,
  ArrowUpDown,
  ExternalLink,
  Banknote,
  Calendar,
  TrendingUp,
  Receipt,
  DollarSign,
  X,
} from "lucide-react";


const DUMMY_TRANSACTIONS = [
  {
    id: 1,
    date: "31 Mar 9:52pm",
    type: "ONLINE",
    customer: "Angelene Porter",
    location: "Chebo Clinic",
    amount: 99.0,
    feeRate: "1.75% + $0.30",
    fee: -2.03,
    net: 96.97,
    invoice: "89103",
  },
  {
    id: 2,
    date: "31 Mar 7:23pm",
    type: "ONLINE",
    customer: "Eliza Davies",
    location: "Chebo Clinic",
    amount: 198.0,
    feeRate: "1.75% + $0.30",
    fee: -3.76,
    net: 194.24,
    invoice: "89102",
  },
  {
    id: 3,
    date: "31 Mar 4:24pm",
    type: "ONLINE",
    customer: "eminie alameddine",
    location: "Chebo Clinic",
    amount: 99.0,
    feeRate: "1.75% + $0.30",
    fee: -2.03,
    net: 96.97,
    invoice: "89099",
  },
  {
    id: 4,
    date: "31 Mar 1:24pm",
    type: "ONLINE",
    customer: "BARRETT, NICOLE Barrett",
    location: "Chebo Clinic",
    amount: 99.0,
    feeRate: "1.75% + $0.30",
    fee: -2.03,
    net: 96.97,
    invoice: "89098",
  },
  {
    id: 5,
    date: "31 Mar 12:47pm",
    type: "ONLINE",
    customer: "Savvina Tzigkouras",
    location: "Chebo Clinic",
    amount: 169.0,
    feeRate: "1.75% + $0.30",
    fee: -3.26,
    net: 165.74,
    invoice: "89097",
  },
  {
    id: 6,
    date: "30 Mar 3:10pm",
    type: "IN-PERSON",
    customer: "James Holloway",
    location: "Chebo Clinic",
    amount: 250.0,
    feeRate: "1.6% + $0.10",
    fee: -4.1,
    net: 245.9,
    invoice: "89090",
  },
  {
    id: 7,
    date: "30 Mar 11:05am",
    type: "ONLINE",
    customer: "Priya Sharma",
    location: "Chebo Clinic",
    amount: 130.0,
    feeRate: "1.75% + $0.30",
    fee: -2.58,
    net: 127.42,
    invoice: "89085",
  },
];

const PAYOUT_OPTIONS = [
  { label: "Future payouts: $1157.62", value: "future" },
  { label: "Specific date range", value: "daterange" },
  { label: "Payout on 02 Apr: $387.88", value: "02Apr" },
  { label: "Payout on 01 Apr: $650.89", value: "01Apr" },
  { label: "Payout on 31 Mar: $193.94", value: "31Mar" },
  { label: "Payout on 30 Mar: $1135.74", value: "30Mar" },
  { label: "Payout on 27 Mar: $553.62", value: "27Mar" },
  { label: "Payout on 25 Mar: $292.19", value: "25Mar" },
  { label: "Payout on 24 Mar: $96.97", value: "24Mar" },
  { label: "Payout on 23 Mar: $387.88", value: "23Mar" },
  { label: "Payout on 20 Mar: $831.96", value: "20Mar" },
  { label: "Payout on 19 Mar: $290.91", value: "19Mar" },
  { label: "Payout on 18 Mar: $485.15", value: "18Mar" },
  { label: "Payout on 17 Mar: $361.94", value: "17Mar" },
  { label: "Payout on 16 Mar: $3781.60", value: "16Mar" },
  { label: "Payout on 13 Mar: $623.67", value: "13Mar" },
  { label: "Payout on 12 Mar: $144.81", value: "12Mar" },
  { label: "Payout on 11 Mar: $96.97", value: "11Mar" },
];


const fmt = (n) => `$${Math.abs(n).toFixed(2)}`;
const fmtSigned = (n) =>
  n < 0 ? `-$${Math.abs(n).toFixed(2)}` : `$${n.toFixed(2)}`;

function SortIcon() {
  return <ArrowUpDown className="w-3 h-3 inline ml-1 text-slate-400" />;
}

function Badge({ type }) {
  const cls =
    type === "ONLINE"
      ? "bg-green-100 text-green-700 border border-green-200"
      : "bg-blue-100 text-blue-700 border border-blue-200";
  return (
    <span
      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${cls}`}
    >
      {type}
    </span>
  );
}


function PayoutDropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative w-72" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-sm text-slate-700 hover:border-gray-400 transition focus:outline-none"
      >
        <span>{selected?.label || "Select filter"}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
      </button>
      {open && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-30 mt-1 overflow-hidden max-h-72 overflow-y-auto">
          {options.map((o, i) => (
            <React.Fragment key={o.value}>
              {i === 2 && <div className="h-px bg-gray-100 mx-3" />}
              <div
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition ${
                  value === o.value
                    ? "bg-custom-blue text-white font-semibold"
                    : "text-slate-700 hover:bg-blue-50"
                }`}
              >
                {o.label}
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════ MAIN ══════════════════════ */
export default function Transactionreport(props) {
  const router = useRouter();

  const [filter, setFilter] = useState("01Apr");
  const [startDate, setStartDate] = useState("2026-03-29");
  const [endDate, setEndDate] = useState("2026-04-04");
  const [transactions, setTransactions] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortCol, setSortCol] = useState("date");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params =
        filter === "daterange" ? { startDate, endDate } : { payout: filter };
      const res = await Api("get", "transactions/getAll", params, router);
      if (res?.status === true && res.data?.data?.length > 0) {
        setTransactions(res.data.data);
      } else {
        setTransactions(DUMMY_TRANSACTIONS);
      }
    } catch {
      setTransactions(DUMMY_TRANSACTIONS);
    }
    setLoading(false);
    setSearched(true);
  };

  const handleExport = () => {
    if (!transactions.length) return;
    const headers = [
      "Date",
      "Type",
      "Customer",
      "Location",
      "Amount",
      "Fee Rate",
      "Fee",
      "Net",
      "Invoice",
    ];
    const rows = transactions.map((t) =>
      [
        t.date,
        t.type,
        t.customer,
        t.location,
        t.amount,
        t.feeRate,
        t.fee,
        t.net,
        t.invoice,
      ].join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const sorted = [...transactions].sort((a, b) => {
    let av = a[sortCol],
      bv = b[sortCol];
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    return sortAsc ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
  });

  const totalAmount = transactions.reduce((s, t) => s + t.amount, 0);
  const totalFees = transactions.reduce((s, t) => s + t.fee, 0);
  const totalNet = transactions.reduce((s, t) => s + t.net, 0);
  const totalRefunded = 0;

  const thCls =
    "px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-custom-blue select-none whitespace-nowrap";
  const tdCls = "px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap";

  return (
    <>
      <DashboardHeader title="CleePay" />

      <div className="min-h-screen bg-white text-custom-blue px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-5 border-b border-gray-200">
          <h1
            className="text-xl font-bold md:text-2xl  text-custom-blue "
          
          >
            CleePay transaction history
          </h1>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 border border-gray-300 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition shrink-0"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-end gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <p className="text-sm font-semibold text-slate-700">
                Filter by payout or date range
              </p>
              <div className="group relative">
                <Info className="w-4 h-4 text-slate-400 cursor-pointer" />
                <div className="absolute left-6 top-0 w-64 bg-custom-blue text-white text-xs rounded-xl px-3 py-2 opacity-0 group-hover:opacity-100 pointer-events-none transition z-20 leading-relaxed">
                  Select a specific payout date to see which transactions
                  contributed to it, or choose a custom date range.
                </div>
              </div>
            </div>
            <PayoutDropdown
              value={filter}
              onChange={setFilter}
              options={PAYOUT_OPTIONS}
            />
          </div>

          {filter === "daterange" && (
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Start date
                </p>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-custom-blue"
                />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 mt-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  End date
                </p>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-custom-blue"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-2 bg-custom-blue hover:bg-custom-blue/90 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60 mb-0.5"
          >
            <Search className="w-4 h-4" />
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Empty / not searched state */}
        {!searched ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 mb-5 text-slate-300">
              <svg
                viewBox="0 0 80 80"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="10" y="20" width="60" height="45" rx="3" />
                <line x1="10" y1="32" x2="70" y2="32" />
                <line x1="10" y1="44" x2="70" y2="44" />
                <line x1="10" y1="56" x2="70" y2="56" />
                <line x1="28" y1="20" x2="28" y2="65" />
                <line x1="46" y1="20" x2="46" y2="65" />
                <circle cx="40" cy="42" r="10" fill="white" />
                <text
                  x="36"
                  y="46"
                  fontSize="12"
                  fill="currentColor"
                  stroke="none"
                  fontFamily="sans-serif"
                >
                  $
                </text>
              </svg>
            </div>
            <p
              className="text-2xl font-light text-slate-500"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Please select a filter and search to begin
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {[
                      { key: "date", label: "Date" },
                      { key: "type", label: "Transaction" },
                      { key: "customer", label: "Customer name" },
                      { key: "location", label: "Location" },
                      { key: "amount", label: "Amount" },
                      { key: "feeRate", label: "Fee rate" },
                      { key: "fee", label: "Fee" },
                      { key: "net", label: "Net" },
                      { key: "invoice", label: "Invoice" },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className={thCls}
                        onClick={() => {
                          setSortCol(col.key);
                          setSortAsc(sortCol === col.key ? !sortAsc : true);
                        }}
                      >
                        {col.label} <SortIcon />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sorted.map((t, i) => (
                    <tr
                      key={t.id}
                      className={`transition hover:bg-blue-50/30 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
                    >
                      <td className={tdCls}>{t.date}</td>
                      <td className={tdCls}>
                        <Badge type={t.type} />
                      </td>
                      <td
                        className={`${tdCls} text-custom-blue font-medium cursor-pointer hover:underline`}
                      >
                        {t.customer}
                      </td>
                      <td className={tdCls}>{t.location}</td>
                      <td className={`${tdCls} font-semibold text-custom-blue`}>
                        {fmt(t.amount)}
                      </td>
                      <td className={`${tdCls} text-slate-500`}>{t.feeRate}</td>
                      <td className={`${tdCls} text-red-500 font-medium`}>
                        {fmtSigned(t.fee)}
                      </td>
                      <td className={`${tdCls} font-semibold text-custom-blue`}>
                        {fmt(t.net)}
                      </td>
                      <td className={tdCls}>
                        <span className="text-custom-blue font-semibold hover:underline cursor-pointer">
                          {t.invoice}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Entries count */}
            <p className="text-sm text-slate-500 mt-3 mb-6">
              Showing 1 to {sorted.length} of {sorted.length} entries
            </p>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 space-y-2 min-w-64 shadow-sm">
                {[
                  {
                    label: "Total amount:",
                    value: `$${totalAmount.toFixed(2)}`,
                    color: "text-custom-blue",
                  },
                  {
                    label: "Total refunded:",
                    value: `$${totalRefunded.toFixed(2)}`,
                    color: "text-custom-blue",
                  },
                  {
                    label: "Total fees:",
                    value: fmtSigned(totalFees),
                    color: "text-red-500",
                  },
                  {
                    label: "Total net:",
                    value: `$${totalNet.toFixed(2)}`,
                    color: "text-custom-blue font-bold",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-8"
                  >
                    <span className="text-sm font-semibold text-slate-600">
                      {row.label}
                    </span>
                    <span className={`text-sm ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
