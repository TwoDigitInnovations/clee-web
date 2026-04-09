import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import { Search, Clock, ChevronDown, ChevronUp, ShoppingCart, User, CreditCard, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "@/redux/actions/serviceActions";
import { fetchCustomers } from "@/redux/actions/productActions";
import { useRouter } from "next/router";

function Services({ onTabChange }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { services: servicesList, loading } = useSelector((state) => state.service);
  
  const [activeTab, setActiveTab] = useState("services");
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    dispatch(fetchServices(router));
    loadCustomers();
  }, []);

  useEffect(() => {
    if (Array.isArray(servicesList) && servicesList.length > 0) {
      const categories = [...new Set(servicesList.map(service => 
        (service.category?.name || "General").toLowerCase().replace(/\s+/g, '-')
      ))];
      setExpandedCategories(categories);
    }
  }, [servicesList]);

  const loadCustomers = async () => {
    const customersList = await dispatch(fetchCustomers(router));
    setCustomers(customersList);
  };

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

        {/* Right Sidebar - Same as index.js */}
        <div className="hidden lg:block lg:w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto max-h-screen">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart className="text-[#0A4D91]" size={24} />
            <div>
              <h3 className="text-lg font-bold text-[#0A4D91]">Current Sale</h3>
              <p className="text-xs text-gray-500">New Session</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <User className="text-[#0A4D91]" size={20} />
              <h4 className="font-semibold text-gray-900">Select Client</h4>
            </div>
            {!selectedClient ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-3">No client selected for this transaction</p>
                <button 
                  onClick={() => setShowClientSearch(true)}
                  className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Search size={16} />
                  Find Client
                </button>
              </div>
            ) : (
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{selectedClient.fullname || selectedClient.name}</p>
                    <p className="text-sm text-gray-500">{selectedClient.mobile || selectedClient.phone}</p>
                  </div>
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="text-[#0A4D91]" size={20} />
              <h4 className="font-semibold text-gray-900">Saved Sales</h4>
            </div>
            <div className="space-y-2">
              {savedSales.map((sale, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <p className="font-semibold text-sm text-gray-900">{sale.name}</p>
                  <p className="text-xs text-gray-500">{sale.date} • ${sale.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Search Modal */}
        {showClientSearch && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowClientSearch(false)}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-50 w-full max-w-md shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Find Client</h2>
                  <button
                    onClick={() => setShowClientSearch(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={clientSearchQuery}
                    onChange={(e) => setClientSearchQuery(e.target.value)}
                    placeholder="Search by name or phone..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4D91] outline-none"
                  />
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredClients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => {
                        setSelectedClient(client);
                        setShowClientSearch(false);
                        setClientSearchQuery("");
                      }}
                      className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <p className="font-semibold text-gray-900">{client.fullname || client.name}</p>
                      <p className="text-sm text-gray-500">{client.mobile || client.phone}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Services;
