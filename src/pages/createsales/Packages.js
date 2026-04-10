import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import { Package } from "lucide-react";
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
                      ? "text-[#0A4D91] border-b-2 border-[#0A4D91]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#0A4D91]">Sale at Chebo Clinic</h2>
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
                      <Package size={24} className="text-[#0A4D91]" />
                    </div>
                    <p className="text-xl font-bold text-[#0A4D91]">
                      ${pkg.price ? pkg.price.toFixed(2) : "0.00"}
                    </p>
                  </div>
                  
                  <h3 className="font-semibold text-[#0A4D91] mb-2 line-clamp-2">
                    {pkg.name || "Package"}
                  </h3>
                  
                  {pkg.description && (
                    <p className="text-sm text-[#0A4D91] mb-3 line-clamp-2">
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
      </div>
    </>
  );
}

export default Packages;
