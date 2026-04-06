import DashboardHeader from "@/components/DashboardHeader";
import { Api } from "@/services/service";
import React, { useEffect, useState } from "react";
import { Plus, Trash2, Info, RefreshCcw } from "lucide-react"; // Using lucide-react for icons
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/deleteModel";

function Promocode(props) {
  const [loading, setLoading] = useState(false);
  const [promocodes, setPromocodes] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const dummyData = [
    {
      id: 1,
      code: "SUMMER2027",
      discount: "2.00%",
      usageCount: 0,
      status: "Active",
    },
  ];

  const fetchPromocode = async () => {
    try {
      props.loader(true);
      const res = await Api("get", "promo-codes", "", router);
      props.loader(false);

      if (res?.status === true) {
        setPromocodes(res.data.data.promoCodes || []);
      } else {
        setPromocodes(dummyData);
      }
    } catch {
      props.loader(false);
    }
  };

  useEffect(() => {
    fetchPromocode();
  }, []);

  const handleDeleteConfirm = () => {
    try {
      props.loader(true);
      Api("delete", `promo-codes/${id}`, "", router).then((res) => {
        props.loader(false);
        if (res?.status === true) {
          props.toaster({ type: "success", message: "Promo code deleted" });
          fetchPromocode();
          setOpen(false);
        }
      });
    } catch {
      props.loader(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <DashboardHeader title="Sales Tools" />

      <div className="md:p-6 p-4 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-custom-blue">
            Promo Code
          </h1>
          <button
            className="bg-custom-blue text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 flex items-center gap-2"
            onClick={() => router.push("/SalesTools/AddPromoCode")}
          >
            Add New Promo Code
          </button>
        </div>

        <div className="bg-[#0A4D911A] border border-gray-200 rounded-lg p-4 md:p-8 mb-6 flex justify-between items-center relative overflow-hidden">
          <div className="max-w-2xl z-10">
            <span className="bg-custom-blue text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
              New Feature
            </span>
            <h2 className="text-xl font-bold text-custom-blue mt-3">
              Try new promo codes
            </h2>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              Create effective, goal-driven promo codes to be used during online
              booking by your clients. This is just the start, with more promo
              code options and capabilities coming soon!{" "}
              <a href="#" className="text-blue-600 underline">
                Learn more about promo codes
              </a>
            </p>
            <div className="mt-6 flex gap-4 items-center">
              <button className="bg-custom-blue text-white px-6 py-2 rounded text-sm font-medium">
                Give it a try
              </button>
              <button className="text-gray-500 text-sm font-medium hover:text-gray-700">
                Dismiss
              </button>
            </div>
          </div>

          {/* Decorative Graphic (Simplified Representation) */}
          <div className="hidden md:block relative mr-10">
            <div className="rotate-12 w-32 h-40 bg-white rounded shadow-sm border border-gray-100 p-2 flex flex-col gap-3 relative">
              <div className="w-full h-2 bg-gray-100 rounded"></div>
              <div className="w-3/4 h-2 bg-gray-100 rounded"></div>
              <div className="w-2/4 h-2 bg-gray-100 rounded"></div>
              <div className="absolute bottom-8 right-10 w-10 h-10 rounded-[12px] bg-custom-blue flex items-center justify-center text-white">
                ✓
              </div>
              <div className="absolute top-2 -right-4 w-10 h-10 rounded-[12px] bg-custom-blue flex items-center justify-center text-white">
                <img
                  src="/images/Container.png"
                  alt="Container"
                  className="p-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Conditional Content: Table or Empty State */}
        {promocodes.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Promo code
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Discount
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Usage count
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {promocodes.map((promo, key) => (
                  <tr key={key} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {promo.voucher_code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {promo.discount_value}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {promo.total_uses | 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#2e7d32] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                        {promo.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        className="border text-black border-gray-300 px-4 py-1 rounded text-sm hover:bg-gray-50"
                        onClick={() =>
                          router.push(
                            `/SalesTools/AddPromoCode?id=${promo._id}`,
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="border border-gray-300 p-1.5 rounded text-gray-500 hover:text-red-600"
                        onClick={() => {
                          setOpen(true);
                          setId(promo._id);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-full">
                <Info size={18} className="text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">
                No promo codes have been set up yet. Click 'Create Code' to
                launch your first promotional campaign.
              </p>
            </div>
            <button
              onClick={fetchPromocode}
              className="text-xs flex items-center gap-1 text-gray-500 font-bold uppercase tracking-wider hover:text-blue-600"
            >
              <RefreshCcw size={12} /> REFRESH
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={open}
        setIsOpen={setOpen}
        title="Delete Staff"
        message="Are you sure you want to delete this staff member?"
        onConfirm={handleDeleteConfirm}
        yesText="Yes, Delete"
        noText="Cancel"
      />
    </div>
  );
}

export default Promocode;
