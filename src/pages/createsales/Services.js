import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import { Search, Clock, ChevronDown, ChevronUp } from "lucide-react";
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
    // Add service to cart
    const existing = selectedItems.find(s => s.id === service.id);
    if (existing) {
      setSelectedItems(selectedItems.map(s => 
        s.id === service.id ? { ...s, quantity: (s.quantity || 1) + 1 } : s
      ));
    } else {
      setSelectedItems([...selectedItems, { ...service, quantity: 1 }]);
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
                      ? "text-[#0A4D91] border-b-2 border-[#0A4D91]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products, SKUs, or categories..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Services List */}
          <div className="space-y-4">
            {serviceCategories.map((category) => (
              <div key={category.id}>
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-[#0A4D91]">{category.name}</h2>
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

export default Services;
