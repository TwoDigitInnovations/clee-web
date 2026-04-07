import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { Search, Ticket, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Api } from "@/services/service";

function SearchVoucher(props) {
  const [promocodes, setPromocodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const fetchPromocode = async () => {
    try {
      props.loader(true);

      const res = await Api(
        "get",
        `gift-vouchers/getAll?key=${searchTerm}`,
        "",
        router,
      );

      if (res?.status === true) {
        setPromocodes(res.data.data || []);
      } else {
        setPromocodes([]);
      }

      props.loader(false);
    } catch {
      props.loader(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPromocode();
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <div className="bg-[#f0f2f5] min-h-screen pb-10">
      <DashboardHeader title="Sales Tools" />

      <div className="md:p-6 p-4 max-w-7xl mx-auto space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span
              className="text-custom-blue font-medium cursor-pointer hover:underline"
              onClick={() => router.push("/SalesTools/GiftVouchers")}
            >
              Gift vouchers
            </span>
            <span>/</span>
            <span>Search gift vouchers</span>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by gift voucher # or customer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border text-sm border-slate-200 rounded-xl py-2 md:py-3 md:pl-12 pl-10 pr-4 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700"
            />
          </div>
        </div>

        {/* Data Display Logic */}
        {promocodes.length === 0 ? (
          /* Empty State (Screenshot 2) */
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
              <Ticket className="w-20 h-20 text-blue-100" strokeWidth={1} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mt-4">
              Search for a gift voucher
            </h2>
            <p className="text-slate-500 text-sm max-w-sm">
              Enter a voucher number or customer name to find a specific gift
              voucher in your records.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-slate-700 font-bold flex items-center gap-1 cursor-pointer">
                      Code <ChevronUp className="w-4 h-4" />
                    </th>
                    <th className="px-6 py-4 text-slate-700 font-bold">
                      <div className="flex items-center gap-1 cursor-pointer">
                        Issued{" "}
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-slate-700 font-bold">
                      <div className="flex items-center gap-1 cursor-pointer">
                        Expires{" "}
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-slate-700 font-bold text-center">
                      <div className="flex items-center justify-center gap-1 cursor-pointer">
                        From <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-slate-700 font-bold text-center">
                      <div className="flex items-center justify-center gap-1 cursor-pointer">
                        Initial value{" "}
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-slate-700 font-bold text-center">
                      <div className="flex items-center justify-center gap-1 cursor-pointer">
                        Balance{" "}
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-slate-700 font-bold">
                      <div className="flex items-center gap-1 cursor-pointer">
                        Status{" "}
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {promocodes.map((item, index) => {
                    // ✅ Expiry Calculate
                    let expiryDate = "";
                    if (item.expiry_type === "after") {
                      const date = new Date(item.createdAt);

                      if (item.expiry_unit === "Months") {
                        date.setMonth(date.getMonth() + item.expiry_value);
                      } else if (item.expiry_unit === "Days") {
                        date.setDate(date.getDate() + item.expiry_value);
                      } else if (item.expiry_unit === "Years") {
                        date.setFullYear(
                          date.getFullYear() + item.expiry_value,
                        );
                      }

                      expiryDate = date.toLocaleDateString();
                    } else {
                      expiryDate = "Never";
                    }

                    return (
                      <tr
                        key={index}
                        className="border-b border-slate-50 hover:bg-slate-50 text-sm"
                      >
                        <td className="px-6 py-3 text-custom-blue font-medium">
                          {item.sku_handle}
                        </td>

                        <td className="px-6 text-slate-600">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-6 text-slate-600">{expiryDate}</td>

                        <td className="px-6 text-slate-600">
                          {item?.user?.fullname}
                        </td>

                        <td className="px-6 text-slate-600">{item?.amount}</td>

                        <td className="px-6 text-slate-600">{item?.price}</td>

                        <td className="px-6">
                          <span
                            className={`px-2 py-1 rounded text-[11px] font-bold uppercase ${
                              item.status
                                ? "bg-green-700 text-white"
                                : "bg-slate-600 text-white"
                            }`}
                          >
                            {item.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchVoucher;
