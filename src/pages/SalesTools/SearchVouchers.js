import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { Search, Ticket, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
const dummyData = [
  {
    id: "1",
    code: "0168A6",
    issued: "Fri, 9 May 2025",
    expires: "Never",
    from: "Kim Thai",
    to: "Linda Su",
    initialValue: "$1000.00",
    balance: "$301.00",
    status: "Active",
  },
  {
    id: "2",
    code: "01E3E6",
    issued: "Fri, 20 Dec 2024",
    expires: "Never",
    from: "Abbey Steadman",
    to: "Elese",
    initialValue: "$100.00",
    balance: "$0.00",
    status: "Redeemed",
  },
];

function SearchVoucher(props) {
  const [promocodes, setPromocodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const fetchPromocode = async () => {
    try {
      props.loader(true);
      const res = await Api("get", "promo-codes", "", router); // Uncomment this for real API
      //   const res = { status: false }; // Simulating API fail to use dummy data

      props.loader(false);
      if (res?.status === true) {
        setPromocodes(res.data.data.promoCodes || []);
      } else {
        setPromocodes(dummyData);
      }
    } catch {
      props.loader(false);
      setPromocodes(dummyData);
    }
  };

  useEffect(() => {
    fetchPromocode();
  }, [searchTerm]);

  return (
    <div className="bg-[#f0f2f5] min-h-screen pb-10">
      <DashboardHeader title="Sales Tools" />

      <div className="md:p-6 p-4 max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb & Search Bar Section */}
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
              className="w-full bg-white border text-sm border-slate-200 rounded-xl py-2 md:py-3 md:pl-12 pl-8 pr-4 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700"
            />
          </div>
        </div>

        {/* Data Display Logic */}
        {searchTerm === "" || promocodes.length === 0 ? (
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
                    <th className="px-6 py-4 text-slate-700 font-bold">
                      <div className="flex items-center gap-1 cursor-pointer">
                        From <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-slate-700 font-bold">
                      <div className="flex items-center gap-1 cursor-pointer">
                        To <ChevronDown className="w-4 h-4 text-slate-400" />
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
                  {promocodes.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b py-3 border-slate-50 hover:bg-slate-50 transition-colors group text-sm"
                    >
                      <td className="px-6 py-3 text-custom-blue font-medium">
                        {item.code}
                      </td>
                      <td className="px-6  text-slate-600">{item.issued}</td>
                      <td className="px-6  text-slate-600">{item.expires}</td>
                      <td className="px-6  text-slate-600">{item.from}</td>
                      <td className="px-6  text-slate-600">{item.to}</td>
                      <td className="px-6  text-slate-600 text-center">
                        {item.initialValue}
                      </td>
                      <td className="px-6  text-slate-600 text-center font-medium">
                        {item.balance}
                      </td>
                      <td className="px-6 ">
                        <span
                          className={`px-2 py-1 rounded text-[11px] font-bold uppercase ${
                            item.status === "Active"
                              ? "bg-green-700 text-white"
                              : "bg-slate-600 text-white"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
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
