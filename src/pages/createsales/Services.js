import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import { Search, Clock, ChevronDown, ChevronUp, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "@/redux/actions/servicesActions";
import { fetchCustomers } from "@/redux/actions/productActions";
import { useRouter } from "next/router";
import CheckoutSidebar from "@/components/CheckoutSidebar";

function Services({ 
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
  const { services: servicesList, loading } = useSelector((state) => state.services);
  
  const [activeTab, setActiveTab] = useState("services");
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [overallDiscountTypeLocal, setOverallDiscountTypeLocal] = useState(overallDiscountType || "percentage");
  const [overallDiscountValueLocal, setOverallDiscountValueLocal] = useState(overallDiscountValue || "");

  useEffect(() => {
    dispatch(fetchServices(router));
  }, []);

  useEffect(() => {
    if (Array.isArray(servicesList) && servicesList.length > 0) {
      const categories = [...new Set(servicesList.map(service => 
        (service.category?.name || "General").toLowerCase().replace(/\s+/g, '-')
      ))];
      setExpandedCategories(categories);
    }
  }, [servicesList]);

  const tabs = [
    { id: "products", label: "Products" },
    { id: "services", label: "Services" },
    { id: "vouchers", label: "Vouchers" },
    { id: "credit", label: "Credit" },
    { id: "packages", label: "Packages" },
  ];

  const handleTabClick = (tabId) => {
    if (tabId !== "services" && onTabChange) {
      onTabChange(tabId);
    } else {
      setActiveTab(tabId);
    }
  };

  const groupedServices = Array.isArray(servicesList)
    ? servicesList.reduce((acc, service) => {
        const groupName = service.category?.name || "General";
        if (!acc[groupName]) {
          acc[groupName] = [];
        }
        acc[groupName].push(service);
        return acc;
      }, {})
    : {};

  const serviceCategories = Object.keys(groupedServices).map((groupName) => ({
    id: groupName.toLowerCase().replace(/\s+/g, "-"),
    name: groupName,
    count: groupedServices[groupName].length,
    services: groupedServices[groupName].map((service) => ({
      id: service._id,
      name: service.name,
      duration: `${service.duration || 0} mins`,
      price: service.price || 0,
    })),
  }));

  const savedSales = [
    { name: "Elena Rodriguez", date: "Yesterday 4:35 PM", amount: 245.0 },
    { name: "Julian Thorne", date: "2 days ago", amount: 120.5 },
  ];

  const getTotal = () => {
    return selectedItems.reduce((sum, s) => sum + (s.price * (s.quantity || 1)), 0);
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

  const openServiceDetail = (service) => {
    // Add service to cart with type field
    const existing = selectedItems.find(s => s.id === service.id);
    if (existing) {
      setSelectedItems(selectedItems.map(s => 
        s.id === service.id ? { ...s, quantity: (s.quantity || 1) + 1 } : s
      ));
    } else {
      setSelectedItems([...selectedItems, { ...service, type: 'service', quantity: 1 }]);
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredClients = Array.isArray(customers) ? customers.filter(client =>
    client.fullname?.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    client.mobile?.includes(clientSearchQuery) ||
    client.email?.toLowerCase().includes(clientSearchQuery.toLowerCase())
  ) : [];

  return (
    <>
      <DashboardHeader title="Create Sale" />
      
      <div className="min-h-screen bg-custom-gray flex flex-col lg:flex-row">
        <div className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
          {/* Tabs Section */}
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

        

          
          <div className="space-y-4">
            {serviceCategories.map((category) => (
              <div key={category.id}>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-custom-blue">{category.name}</h2>
                    <span className="text-sm text-gray-500">{category.count} SERVICES AVAILABLE</span>
                  </div>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center gap-2 text-xs text-gray-400 uppercase hover:text-gray-600 transition-colors"
                  >
                    {expandedCategories.includes(category.id) ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                </div>

                {/* Services Cards */}
                {expandedCategories.includes(category.id) && (
                  <div className="space-y-3 mb-6">
                    {category.services.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => openServiceDetail(service)}
                        className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{service.name}</h3>
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                              <Clock size={14} />
                              <span>{service.duration}</span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-lg font-bold text-gray-900">
                              ${service.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
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
          openProductDetail={openServiceDetail}
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

export default Services;
