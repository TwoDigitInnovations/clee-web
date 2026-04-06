import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import { ShoppingCart, Store, X } from "lucide-react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuppliers } from "@/redux/actions/supplierActions";

function StockOrders() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { suppliers } = useSelector((state) => state.supplier);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchSuppliers(router));
  }, []);

  const handleNewStockOrder = () => {
    if (suppliers.length === 0) {
      setShowModal(true);
    } else {
      // Navigate to create stock order page
      console.log("Navigate to create stock order");
    }
  };

  const handleCreateSupplier = () => {
    setShowModal(false);
    router.push("/addsuppliers");
  };

  return (
    <>
      <DashboardHeader title="Stock" />

      <div className="min-h-screen bg-[#f0f1f5] text-slate-800 px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0A4D91] mb-2">Stock Orders</h1>
            <p className="text-gray-500">Easily create, send and receive orders. New stock order</p>
          </div>

          {/* Empty State Card */}
          <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12">
            <div className="max-w-2xl mx-auto text-center">
              {/* Phones Image */}
              <div className="flex justify-center mb-8">
                <img 
                  src="/images/phones.png" 
                  alt="Stock Orders" 
                  className="w-64 h-64 sm:w-80 sm:h-80 object-contain"
                />
              </div>

              {/* Main Message */}
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A4D91] mb-3">
                Stock running low?
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Easily create, send and receive orders.
              </p>

              {/* New Stock Order Button */}
              <button
                onClick={handleNewStockOrder}
                className="bg-[#0A4D91] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#083d73] transition-colors inline-flex items-center gap-2 mb-4"
              >
                <ShoppingCart className="w-5 h-5" />
                New stock order
              </button>

              {/* Helper Text */}
              <p className="text-gray-400 text-sm uppercase tracking-wide">
                Start by adding your first supplier
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* No Supplier Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Store className="w-10 h-10 text-[#0A4D91]" />
              </div>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
              First up, you'll need to add a supplier
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Once you add a supplier you can carry on creating stock orders.
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCreateSupplier}
                className="w-full bg-[#0A4D91] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#083d73] transition-colors"
              >
                Create supplier
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full text-[#0A4D91] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StockOrders;
