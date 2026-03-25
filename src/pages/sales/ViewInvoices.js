import DashboardHeader from "@/components/DashboardHeader";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Api } from "@/services/service";
import {
  Search,
  FileText,
  FilePlus,
  ChevronDown,
  CalendarDays,
  Info,
} from "lucide-react";

function ViewInvoices(props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("view"); // "view" | "create"
  const [filterDate, setFilterDate] = useState("today");
  const [filterText, setFilterText] = useState("");
  const [invoiceData, setInvoiceData] = useState([]);

  const dateOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "this_week", label: "This Week" },
    { value: "last_week", label: "Last Week" },
    { value: "this_month", label: "This Month" },
    { value: "last_month", label: "Last Month" },
    { value: "custom", label: "Custom Range" },
  ];

  useEffect(() => {
    if (activeTab === "view") {
      getInvoices();
    }
  }, [filterText, filterDate, activeTab]);

  const getInvoices = async () => {
    props?.loader?.(true);
    try {
      const params = {
        role: "user",
        date_filter: filterDate,
        ...(filterText && { key: filterText }),
      };
      const res = await Api("get", `invoice/getAll`, params, router);
      props?.loader?.(false);
      if (res?.status === true) {
        setInvoiceData(res.data?.data || []);
      } else {
        props?.toaster?.({ type: "error", message: res?.message });
      }
    } catch (err) {
      props?.loader?.(false);
      props?.toaster?.({ type: "error", message: err?.message });
    }
  };

  const getEmptyStateLabel = () => {
    const today = new Date();
    const map = {
      today: `${today.toLocaleDateString("en-US", {
        weekday: "short",
      })}, ${today.getDate()} ${today.toLocaleDateString("en-US", {
        month: "short",
      })} ${today.getFullYear()}`,
      yesterday: "yesterday",
      this_week: "this week",
      last_week: "last week",
      this_month: "this month",
      last_month: "last month",
      custom: "the selected range",
    };
    return map[filterDate] || "the selected date";
  };

  return (
    <>
      <DashboardHeader title="View Invoices" />

      <div className="min-h-screen bg-[#f5f6fa] text-slate-800 px-4 py-4">
        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* Tab switcher */}
          <div className="flex rounded-md overflow-hidden border border-slate-300 bg-white text-sm font-medium shadow-sm">
            <button
              onClick={() => setActiveTab("view")}
              className={`flex items-center gap-1.5 px-4 py-2 transition-colors ${
                activeTab === "view"
                  ? "bg-custom-blue text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FileText size={14} />
              View invoices
            </button>
            <button
              onClick={() => router.push("/sales/CreateInvoices")}
              className={`flex items-center gap-1.5 px-4 py-2 transition-colors border-l border-slate-300 ${
                activeTab === "create"
                  ? "bg-custom-blue text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FilePlus size={14} />
              Create invoices
            </button>
          </div>

          <span className="text-sm text-slate-500 font-medium">for</span>

          <div className="relative">
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-md border border-slate-300 bg-white text-sm text-custom-blue shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
            >
              {dateOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

        
          <button
            onClick={getInvoices}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-custom-blue text-white text-sm font-medium shadow-sm hover:bg-slate-800 transition-colors"
          >
            <Search size={14} />
            View
          </button>

    
          <div className="flex-1" />

         
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by invoice #"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-md border border-slate-300 bg-white text-sm text-custom-blue shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 w-52"
            />
          </div>
        </div>

     
        {activeTab === "view" && (
          <>
            {invoiceData.length === 0 ? (
              /* Empty state — matches screenshot */
              <div className="flex items-start gap-2 text-sm text-slate-600 mt-2">
                <Info size={16} className="mt-0.5 text-blue-500 shrink-0" />
                <span>
                  No invoices found for{" "}
                  <strong>{getEmptyStateLabel()}</strong>.{" "}
                  <button
                    onClick={() => setActiveTab("create")}
                    className="text-blue-600 underline hover:text-blue-800 transition-colors"
                  >
                    create invoices
                  </button>{" "}
                  from your existing appointments
                </span>
              </div>
            ) : (
              /* Invoice table (populated state) */
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-left text-slate-500 font-semibold">
                      <th className="px-4 py-3">Invoice #</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.map((inv, i) => (
                      <tr
                        key={i}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-blue-600">
                          #{inv.invoice_number}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {inv.date}
                        </td>
                        <td className="px-4 py-3">{inv.customer_name}</td>
                        <td className="px-4 py-3 font-semibold">
                          ${inv.amount}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              inv.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : inv.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

      </div>
    </>
  );
}

export default ViewInvoices;