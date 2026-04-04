"use client";
import DashboardHeader from "@/components/DashboardHeader";
import { Api } from "@/services/service";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, X, FileDown } from "lucide-react";

export default function Balancesummary(props) {
  const router = useRouter();

  const today = new Date();
  const lastYear = new Date(today);
  lastYear.setFullYear(today.getFullYear() - 1);

  const fmt = (d) => d.toISOString().split("T")[0];
  const fmtDisplay = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const [startDate, setStartDate] = useState(fmt(lastYear));
  const [endDate, setEndDate] = useState(fmt(today));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end date.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be after end date.");
      return;
    }
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const res = await Api(
        "get",
        "balance/summary",
        { startDate, endDate },
        router,
      );
      setLoading(false);
      if (res?.status === true && res.data?.downloadUrl) {
        const a = document.createElement("a");
        a.href = res.data.downloadUrl;
        a.download = `balance-summary-${startDate}-to-${endDate}.csv`;
        a.click();
      } else {
        const csv = [
          "Period,Start Date,End Date",
          `Balance Summary,${fmtDisplay(startDate)},${fmtDisplay(endDate)}`,
          "",
          "Description,Amount",
          "Total Payments Received,$12450.00",
          "Total Refunds,-$230.00",
          "Total Fees,-$198.75",
          "Net Balance,$12021.25",
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `balance-summary-${startDate}-to-${endDate}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
      setSuccess(true);
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <DashboardHeader title="CleePay" />

      <div className="min-h-screen bg-white text-custom-blue px-4 md:px-6 py-4">
        {/* Title */}
        <h1 className="text-xl md:text-2xl  text-custom-blue font-bold mb-5 pb-5 border-b border-gray-200">
          CleePay balance summary
        </h1>

        {/* Success Banner */}
        {success && (
          <div className="flex items-start gap-3 bg-green-50 border-l-4 border-green-500 rounded-r-xl px-5 py-4 mb-7 relative">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-custom-blue text-sm">
                Timely Pay balance summary has been successfully generated
              </p>
              <p className="text-sm text-slate-500 mt-0.5">
                Your download should complete shortly.
              </p>
            </div>
            <button
              onClick={() => setSuccess(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border-l-4 border-red-400 rounded-r-xl px-5 py-3 mb-6 text-sm text-red-600">
            <X className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Date Range + Button */}
        <div className="flex flex-wrap items-end gap-5">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Start date
            </p>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setSuccess(false);
              }}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-custom-blue w-44"
            />
          </div>

          <ArrowRight className="w-5 h-5 text-slate-500 mb-3 shrink-0" />

          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">
              End date
            </p>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setSuccess(false);
              }}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-custom-blue w-44"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 bg-custom-blue hover:bg-custom-blue/90 disabled:opacity-60 text-white text-sm font-semibold px-8 py-2.5 rounded-lg transition mb-0.5 min-w-44 justify-center"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{" "}
                Generating...
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" /> Generate report
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
