import DashboardHeader from "@/components/DashboardHeader";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Api } from "@/services/service";
import { Search, Ticket, ChevronRight } from "lucide-react";

function SearchGiftVouchers(props) {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [giftVouchers, setGiftVouchers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (filterText.trim()) {
      getGiftVouchers();
    } else {
      setGiftVouchers([]);
      setHasSearched(false);
    }
  }, [filterText]);

  const getGiftVouchers = async () => {
    props?.loader?.(true);
    setHasSearched(true);
    try {
      const params = {
        role: "user",
        ...(filterText && { key: filterText }),
      };
      const res = await Api("get", `invoice/GiftVouchers`, params, router);
      props?.loader?.(false);
      if (res?.status === true) {
        setGiftVouchers(res.data?.data || []);
      } else {
        props?.toaster?.({ type: "error", message: res?.message });
      }
    } catch (err) {
      props?.loader?.(false);
      props?.toaster?.({ type: "error", message: err?.message });
    }
  };

  return (
    <>
      <DashboardHeader title="Search Gift Vouchers" />

      <div className="min-h-screen bg-[#f0f1f5] text-slate-800 px-5 py-5">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm mb-4">
          <span className="text-blue-600 font-medium cursor-pointer hover:underline">
            Gift vouchers
          </span>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-slate-500">Search gift vouchers</span>
        </div>

        {/* Search bar */}
        <div className="relative max-w-2xl mb-6">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by gift voucher # or customer name"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-slate-400"
          />
        </div>

        {/* Results or empty state */}
        {!filterText.trim() && (
          /* Default empty state — matches screenshot exactly */
          <div className="flex flex-col items-center justify-center mt-10">
            {/* Card with ticket icon */}
            <div className="relative w-56 h-44 mb-6">
              {/* Shadow card behind */}
              <div className="absolute top-3 left-3 w-full h-full rounded-2xl bg-slate-200/60" />
              {/* Main card */}
              <div className="relative w-full h-full rounded-2xl bg-white/80 border border-slate-200 shadow flex items-center justify-center">
                <Ticket size={52} strokeWidth={1.5} className="text-slate-300" />
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Search for a gift voucher
            </h2>
            <p className="text-sm text-slate-400 text-center max-w-xs leading-relaxed">
              Enter a voucher number or customer name to find a specific gift
              voucher in your records.
            </p>
          </div>
        )}

        {/* No results after search */}
        {filterText.trim() && hasSearched && giftVouchers.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10">
            <div className="relative w-56 h-44 mb-6">
              <div className="absolute top-3 left-3 w-full h-full rounded-2xl bg-slate-200/60" />
              <div className="relative w-full h-full rounded-2xl bg-white/80 border border-slate-200 shadow flex items-center justify-center">
                <Ticket size={52} strokeWidth={1.5} className="text-slate-300" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              No results found
            </h2>
            <p className="text-sm text-slate-400 text-center max-w-xs leading-relaxed">
              No gift vouchers match{" "}
              <span className="font-medium text-slate-500">"{filterText}"</span>.
              Try a different voucher number or customer name.
            </p>
          </div>
        )}

        {/* Results table */}
        {giftVouchers.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-4xl">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-slate-500 font-semibold">
                  <th className="px-4 py-3">Voucher #</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Issued Date</th>
                  <th className="px-4 py-3">Expiry Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {giftVouchers.map((voucher, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-blue-600">
                      #{voucher.voucher_number}
                    </td>
                    <td className="px-4 py-3">{voucher.customer_name}</td>
                    <td className="px-4 py-3 text-slate-500">{voucher.issued_date}</td>
                    <td className="px-4 py-3 text-slate-500">{voucher.expiry_date}</td>
                    <td className="px-4 py-3 font-semibold">${voucher.amount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          voucher.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : voucher.status === "Used"
                            ? "bg-slate-100 text-slate-500"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {voucher.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default SearchGiftVouchers;