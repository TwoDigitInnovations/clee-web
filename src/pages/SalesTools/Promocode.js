import DashboardHeader from "@/components/DashboardHeader";
import { Api } from "@/services/service";
import React, { useEffect, useState } from "react";
import { Plus, Trash2, Info, RefreshCcw } from "lucide-react"; // Using lucide-react for icons
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/deleteModel";
import {
  deletePromoCode,
  fetchPromoCodes,
} from "@/redux/actions/PromoCodeActions";
import { useDispatch, useSelector } from "react-redux";

function Promocode(props) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const promocodes = useSelector((state) => state?.promoCode);
  const PromoCode = useSelector((state) => state.promoCode);
  console.log(PromoCode);

  useEffect(() => {
    dispatch(fetchPromoCodes(router));
  }, [dispatch]);

  const handleDeleteConfirm = async () => {
    try {
      props.loader(true);

      const res = await dispatch(deletePromoCode(id, router));

      props.loader(false);
      console.log(res);

      if (res?.success) {
        props.toaster({ type: "success", message: "Promo code deleted" });
        setOpen(false);
      } else {
        props.toaster({ type: "error", message: res.message });
      }
    } catch (err) {
      props.loader(false);
      props.toaster({
        type: "error",
        message:
          err.message ||
          err.data.message ||
          err.data.data.message ||
          "Server error",
      });
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
              <button
                className="bg-custom-blue text-white px-6 py-2 rounded text-sm font-medium"
                onClick={() => router.push("/SalesTools/AddPromoCode")}
              >
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

        {promocodes?.promoCodes?.length > 0 ? (
          <div>
            {/* Desktop Table View (Visible on sm and above) */}
            <div className="hidden sm:block bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50">
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
                  {promocodes?.promoCodes?.map((promo, key) => (
                    <tr
                      key={key}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {promo.voucher_code}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {promo.discount_value}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {promo.total_uses || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-[#2e7d32] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                          {promo.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex justify-end gap-2">
                        {/* Desktop Buttons */}
                        <button
                          className="border border-gray-300 text-gray-600 px-4 py-1 rounded text-sm"
                          onClick={() =>
                            router.push(
                              `/SalesTools/AddPromoCode?id=${promo._id}`,
                            )
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="border border-gray-300 text-gray-600 p-1.5 rounded"
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

            {/* Mobile Card View (Visible only on small screens) */}
            <div className="sm:hidden space-y-3">
              {promocodes?.promoCodes?.map((promo, key) => (
                <div
                  key={key}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                        Promo Code
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {promo.voucher_code}
                      </div>
                    </div>
                    <span
                      className={`${promo.status ? "bg-green-600" : "bg-gray-400"} text-white text-[10px] font-bold px-2 py-0.5 rounded`}
                    >
                      {promo.status ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500">Discount</div>
                      <div className="text-sm font-medium text-gray-600">
                        {promo.discount_value}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Usage</div>
                      <div className="text-sm font-medium text-gray-600">
                        {promo.total_uses || 0}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      className="flex-1 border border-gray-300 text-gray-600 py-2 rounded text-sm font-semibold"
                      onClick={() =>
                        router.push(`/SalesTools/AddPromoCode?id=${promo._id}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 border border-gray-300 rounded text-gray-500"
                      onClick={() => {
                        setOpen(true);
                        setId(promo._id);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={open}
        setIsOpen={setOpen}
        title="Delete Promo Codes "
        message="Are you sure you want to delete this Promo Codes ?"
        onConfirm={handleDeleteConfirm}
        yesText="Yes, Delete"
        noText="Cancel"
      />
    </div>
  );
}

export default Promocode;
