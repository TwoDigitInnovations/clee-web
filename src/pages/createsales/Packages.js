import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import { Package, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPackages } from "@/redux/actions/packageActions";
import { fetchCustomers } from "@/redux/actions/productActions";
import { useRouter } from "next/router";
import CheckoutSidebar from "@/components/CheckoutSidebar";

function Packages({ 
  onTabChange,
  selectedItems = [],
  setSelectedItems,
  selectedClient,
  setSelectedClient,
  customers = [],
  showClientSearch,
  setShowClientSearch,
  clientSearchQuery,
  setClientSearchQuery,
  showMobileCart,
  setShowMobileCart,
  overallDiscountValue,
  overallDiscountType,
  saleNote,
  setSaleNote,
  showNoteModal,
  setShowNoteModal,
  showOverallDiscountModal,
  setShowOverallDiscountModal,
  setShowCheckout,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { packages: packagesList, loading } = useSelector((state) => state.packages);
  
  const [activeTab, setActiveTab] = useState("packages");
  const [overallDiscountTypeLocal, setOverallDiscountTypeLocal] = useState(overallDiscountType || "percentage");
  const [overallDiscountValueLocal, setOverallDiscountValueLocal] = useState(overallDiscountValue || "");

  useEffect(() => {
    dispatch(fetchPackages(router));
  }, []);

  const tabs = [
    { id: "products", label: "Products" },
    { id: "services", label: "Services" },
    { id: "vouchers", label: "Vouchers" },
    { id: "credit", label: "Credit" },
    { id: "packages", label: "Packages" },
  ];

  const handleTabClick = (tabId) => {
    if (tabId !== "packages" && onTabChange) {
      onTabChange(tabId);
    } else {
      setActiveTab(tabId);
    }
  };

  const savedSales = [
    { name: "Elena Rodriguez", date: "Yesterday 4:35 PM", amount: 245.0 },
    { name: "Julian Thorne", date: "2 days ago", amount: 120.5 },
  ];

  const getTotal = () => {
    return selectedItems.reduce((sum, p) => sum + (p.price || 0), 0);
  };

  const getTotalWithOverallDiscount = () => {
    const subtotal = getTotal();
    if (!overallDiscountValue) return subtotal;
    
    if (overallDiscountType === "percentage") {
      return subtotal - (subtotal * parseFloat(overallDiscountValue)) / 100;
    } else {
      return subtotal - parseFloat(overallDiscountValue);
    }
  };

  const handlePackageClick = (pkg) => {
    const packageItem = {
      id: pkg._id,
      name: pkg.name || "Package",
      price: pkg.price || 0,
      type: 'package',
    };
    setSelectedItems([...selectedItems, packageItem]);
  };

  return (
    <>
      <DashboardHeader title="Create Sale" />
      
      <div className="min-h-screen bg-custom-gray flex flex-col lg:flex-row">
        <div className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
          <div className="bg-white border-b border-gray-200 mb-6">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "text-custom-blue border-b-2 border-custom-blue"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-custom-blue">Sale at Chebo Clinic</h2>
            <p className="text-sm text-gray-400 uppercase">Select a package to continue</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(packagesList) && packagesList.map((pkg) => (
              <div
                key={pkg._id}
                onClick={() => handlePackageClick(pkg)}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
              >
                <div className="flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-[#0A4D911A] rounded-lg flex items-center justify-center">
                      <Package size={24} className="text-custom-blue" />
                    </div>
                    <p className="text-xl font-bold text-custom-blue">
                      ${pkg.price ? pkg.price.toFixed(2) : "0.00"}
                    </p>
                  </div>
                  
                  <h3 className="font-semibold text-custom-blue mb-2 line-clamp-2">
                    {pkg.name || "Package"}
                  </h3>
                  
                  {pkg.description && (
                    <p className="text-sm text-custom-blue mb-3 line-clamp-2">
                      {pkg.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {pkg.services && pkg.services.length > 0 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {pkg.services.length} {pkg.services.length === 1 ? 'Service' : 'Services'}
                      </span>
                    )}
                    {pkg.sessions && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {pkg.sessions} Sessions
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading packages...</p>
            </div>
          )}

          {!loading && (!packagesList || packagesList.length === 0) && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No packages available</p>
            </div>
          )}
        </div>

        <CheckoutSidebar
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          showClientSearch={showClientSearch}
          setShowClientSearch={setShowClientSearch}
          clientSearchQuery={clientSearchQuery}
          setClientSearchQuery={setClientSearchQuery}
          customers={customers}
          selectedProducts={selectedItems}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          openProductDetail={(pkg) => console.log("Open package detail", pkg)}
          savedSales={savedSales}
          getTotal={getTotal}
          getTotalWithOverallDiscount={getTotalWithOverallDiscount}
          overallDiscountValue={overallDiscountValue}
          overallDiscountType={overallDiscountType}
          saleNote={saleNote}
          onAddNote={() => setShowNoteModal && setShowNoteModal(true)}
          onAddDiscount={() => setShowOverallDiscountModal && setShowOverallDiscountModal(true)}
          onCheckout={() => {
            if (!selectedClient) {
              setShowClientSearch(true);
            } else {
              setShowCheckout && setShowCheckout(true);
            }
          }}
          onCompleteSale={() => {
            console.log("Complete sale");
          }}
          showMobileCart={showMobileCart}
          setShowMobileCart={setShowMobileCart}
        />

        {/* Add Note Modal */}
        {showNoteModal && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowNoteModal(false)}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-50 w-full max-w-md shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Add note</h3>
                  <button
                    onClick={() => setShowNoteModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>

                <textarea
                  value={saleNote}
                  onChange={(e) => setSaleNote(e.target.value)}
                  placeholder="Add a note for this sale..."
                  rows={5}
                  className="w-full text-gray-700 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue focus:border-transparent outline-none resize-none"
                  autoFocus
                />

                <button
                  onClick={() => setShowNoteModal(false)}
                  className="w-full mt-4 bg-custom-blue text-white py-3 rounded-lg font-bold hover:bg-[#083d73] transition-colors"
                >
                  Save Note
                </button>
              </div>
            </div>
          </>
        )}

        {/* Overall Discount Modal */}
        {showOverallDiscountModal && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowOverallDiscountModal(false)}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-50 w-full max-w-md shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Overall discount
                  </h3>
                  <button
                    onClick={() => setShowOverallDiscountModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="bg-blue-50 border-l-4 border-custom-blue p-4 mb-6 rounded">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-custom-blue"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700">
                      Overall discounts override any individual discounts and
                      apply to all items on the sale.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
                  <label className="text-sm font-semibold text-gray-700 mb-4 block">
                    Discount
                  </label>
                  <div className="grid grid-cols-[auto_auto_1fr] gap-3 items-center">
                    <button
                      onClick={() => setOverallDiscountTypeLocal("percentage")}
                      className={`w-16 h-14 flex items-center justify-center rounded-lg font-bold text-2xl transition-colors ${
                        overallDiscountTypeLocal === "percentage"
                          ? "bg-gray-200 text-gray-900 border-2 border-gray-300"
                          : "bg-white text-gray-600 border-2 border-gray-300"
                      }`}
                    >
                      %
                    </button>
                    <button
                      onClick={() => setOverallDiscountTypeLocal("fixed")}
                      className={`w-16 h-14 flex items-center justify-center rounded-lg font-bold text-2xl transition-colors ${
                        overallDiscountTypeLocal === "fixed"
                          ? "bg-gray-200 text-gray-900 border-2 border-gray-300"
                          : "bg-white text-gray-600 border-2 border-gray-300"
                      }`}
                    >
                      $
                    </button>
                    <input
                      type="number"
                      value={overallDiscountValueLocal}
                      onChange={(e) => setOverallDiscountValueLocal(e.target.value)}
                      placeholder="0"
                      className="w-full h-14 px-4 border-2 border-gray-300 rounded-lg text-center font-bold text-2xl text-gray-900 focus:ring-2 focus:ring-custom-blue focus:border-custom-blue outline-none"
                    />
                  </div>
                </div>

                {overallDiscountValueLocal && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">
                        Total after discount
                      </p>
                      <p className="text-3xl font-bold text-custom-blue">
                        ${getTotalWithOverallDiscount().toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowOverallDiscountModal(false)}
                  className="w-full bg-custom-blue text-white py-3 rounded-lg font-bold hover:bg-[#083d73] transition-colors"
                >
                  Apply discount
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Packages;
