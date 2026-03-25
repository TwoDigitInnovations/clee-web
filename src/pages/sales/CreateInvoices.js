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

function CreateInvoices(props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("create"); // "view" | "create"
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
      <DashboardHeader title="Create Invoices" />

      <div className="min-h-screen bg-[#f5f6fa] text-slate-800 px-4 py-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex rounded-md overflow-hidden border border-slate-300 bg-white text-sm font-medium shadow-sm">
            <button
              onClick={() => router.push("/sales/ViewInvoices")}
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
              onClick={() => setActiveTab("create")}
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

        {activeTab === "create" && (
          <div className="flex items-center justify-center mt-16 text-slate-400 text-sm">
            <CalendarDays size={18} className="mr-2" />
            Select appointments to generate invoices.
          </div>
        )}
      </div>
    </>
  );
}

export default CreateInvoices;
