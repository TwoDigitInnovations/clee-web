import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import { Search, Gift } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVouchers } from "@/redux/actions/voucherActions";
import { fetchCustomers } from "@/redux/actions/productActions";
import { useRouter } from "next/router";
import CheckoutSidebar from "@/components/CheckoutSidebar";

function Vouchers({ 
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
  const { vouchers: vouchersList, loading } = useSelector((state) => state.vouchers);
  
  const [activeTab, setActiveTab] = useState("vouchers");
  const [showEnterAmountModal, setShowEnterAmountModal] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [voucherMessage, setVoucherMessage] = useState("");
  const [customVoucherCode, setCustomVoucherCode] = useState("");
  const [showVoucherDetailModal, setShowVoucherDetailModal] = useState(false);
  const [selectedVoucherDetail, setSelectedVoucherDetail] = useState(null);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [toSearchQuery, setToSearchQuery] = useState("");
  const [fromSearchQuery, setFromSearchQuery] = useState("");
  const [sendRecipientEmail, setSendRecipientEmail] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");

  useEffect(() => {
    dispatch(fetchVouchers(router));
  }, []);

  const tabs = [
    { id: "products", label: "Products" },
    { id: "services", label: "Services" },
    { id: "vouchers", label: "Vouchers" },
    { id: "credit", label: "Credit" },
    { id: "packages", label: "Packages" },
  ];

  const handleTabClick = (tabId) => {
    if (tabId !== "vouchers" && onTabChange) {
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
    return selectedItems.reduce((sum, v) => sum + (v.amount || v.price || 0), 0);
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

  const handleVoucherClick = (voucher) => {
    setSelectedVoucherDetail(voucher);
    setRecipientName("");
    setSenderName("");
    setVoucherMessage("");
    setCustomVoucherCode("");
    setToSearchQuery("");
    setFromSearchQuery("");
    setShowVoucherDetailModal(true);
  };

  const filteredToCustomers = Array.isArray(customers) ? customers.filter(customer =>
    customer.fullname?.toLowerCase().includes(toSearchQuery.toLowerCase()) ||
    customer.mobile?.includes(toSearchQuery) ||
    customer.email?.toLowerCase().includes(toSearchQuery.toLowerCase())
  ) : [];

  const filteredFromCustomers = Array.isArray(customers) ? customers.filter(customer =>
    customer.fullname?.toLowerCase().includes(fromSearchQuery.toLowerCase()) ||
    customer.mobile?.includes(fromSearchQuery) ||
    customer.email?.toLowerCase().includes(fromSearchQuery.toLowerCase())
  ) : [];

  const handleSelectToCustomer = (customer) => {
    setRecipientName(customer.fullname || customer.name);
    setToSearchQuery(customer.fullname || customer.name);
    setRecipientEmail(customer.email || "");
    setShowToDropdown(false);
  };

  const handleSelectFromCustomer = (customer) => {
    setSenderName(customer.fullname || customer.name);
    setFromSearchQuery(customer.fullname || customer.name);
    setShowFromDropdown(false);
  };

  const handleAddVoucherFromDetail = () => {
    if (!selectedVoucherDetail) return;

    const voucherItem = {
      id: selectedVoucherDetail._id,
      name: selectedVoucherDetail.GiftVoucher_name || "Voucher",
      amount: selectedVoucherDetail.amount || 0,
      price: selectedVoucherDetail.amount || 0,
      type: 'voucher',
      recipient: recipientName,
      sender: senderName,
      message: voucherMessage,
      code: customVoucherCode,
    };
    
    setSelectedItems([...selectedItems, voucherItem]);
    
    // Reset and close
    setRecipientName("");
    setSenderName("");
    setVoucherMessage("");
    setCustomVoucherCode("");
    setShowVoucherDetailModal(false);
    setSelectedVoucherDetail(null);
  };

  const handleAddCustomVoucher = () => {
    if (!customAmount || parseFloat(customAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const customVoucherItem = {
      id: Date.now(),
      name: `Custom Voucher - $${parseFloat(customAmount).toFixed(2)}`,
      amount: parseFloat(customAmount),
      price: parseFloat(customAmount),
      type: 'voucher',
      recipient: recipientName,
      sender: senderName,
      message: voucherMessage,
      code: customVoucherCode,
    };
    
    setSelectedItems([...selectedItems, customVoucherItem]);
    
    // Reset form
    setCustomAmount("");
    setRecipientName("");
    setSenderName("");
    setVoucherMessage("");
    setCustomVoucherCode("");
    setShowEnterAmountModal(false);
  };

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

          {/* Header with Title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#0A4D91]">Sale at Chebo Clinic</h2>
            <p className="text-sm text-gray-400 uppercase">Select a voucher to continue</p>
          </div>

          {/* Vouchers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Enter Amount Card */}
            <div 
              onClick={() => setShowEnterAmountModal(true)}
              className="bg-[#0A4D911A] rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-[#0A4D9133]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Gift size={32} className="text-[#0A4D91]" />
                </div>
                <h3 className="font-semibold text-[#0A4D91] mb-2">Enter an amount</h3>
                <p className="text-2xl font-bold text-[#0A4D91]">$0</p>
              </div>
            </div>

            {/* Dynamic Vouchers */}
            {Array.isArray(vouchersList) && vouchersList.map((voucher) => (
              <div
                key={voucher._id}
                onClick={() => handleVoucherClick(voucher)}
                className="bg-[#0A4D911A] rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-[#0A4D9133]"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                    <Gift size={32} className="text-[#0A4D91]" />
                  </div>
                  <h3 className="font-semibold text-[#0A4D91] mb-2 line-clamp-2">
                    {voucher.GiftVoucher_name || "Voucher"}
                  </h3>
                  <p className="text-2xl font-bold text-[#0A4D91]">
                    ${voucher.amount ? voucher.amount.toFixed(2) : "0.00"}
                  </p>
                  {voucher.sku_handle && (
                    <p className="text-xs text-gray-500 mt-2">{voucher.sku_handle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading vouchers...</p>
            </div>
          )}

          {!loading && (!vouchersList || vouchersList.length === 0) && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <Gift size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No vouchers available</p>
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
          openProductDetail={(voucher) => console.log("Open voucher detail", voucher)}
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

        {/* Enter Amount Modal */}
        {showEnterAmountModal && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowEnterAmountModal(false)}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-50 w-full max-w-md shadow-2xl">
              <div className="p-6 max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#0A4D91]">Enter an amount</h2>
                  <button
                    onClick={() => setShowEnterAmountModal(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-[#0A4D91] uppercase mb-3">Amount</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-400 mr-2">$</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={customAmount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          setCustomAmount(value);
                        }}
                        placeholder="0.00"
                        className="w-24 text-3xl font-bold text-gray-700 bg-transparent border-none outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        autoFocus
                      />
                    </div>
                  </div>
                </div>

                {/* To and From Fields */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="relative">
                    <label className="block text-xs font-bold text-[#0A4D91] uppercase mb-2">To</label>
                    <input
                      type="text"
                      value={toSearchQuery}
                      onChange={(e) => {
                        setToSearchQuery(e.target.value);
                        setRecipientName(e.target.value);
                        setShowToDropdown(true);
                      }}
                      onFocus={() => setShowToDropdown(true)}
                      placeholder="Recipient's name"
                      className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                    />
                    {showToDropdown && toSearchQuery && filteredToCustomers.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredToCustomers.map((customer) => (
                          <div
                            key={customer._id || customer.id}
                            onClick={() => handleSelectToCustomer(customer)}
                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <p className="text-sm font-medium text-gray-900">{customer.fullname || customer.name}</p>
                            <p className="text-xs text-gray-500">{customer.mobile || customer.phone}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-bold text-[#0A4D91] uppercase mb-2">From</label>
                    <input
                      type="text"
                      value={fromSearchQuery}
                      onChange={(e) => {
                        setFromSearchQuery(e.target.value);
                        setSenderName(e.target.value);
                        setShowFromDropdown(true);
                      }}
                      onFocus={() => setShowFromDropdown(true)}
                      placeholder="Sender's name"
                      className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                    />
                    {showFromDropdown && fromSearchQuery && filteredFromCustomers.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredFromCustomers.map((customer) => (
                          <div
                            key={customer._id || customer.id}
                            onClick={() => handleSelectFromCustomer(customer)}
                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <p className="text-sm font-medium text-gray-900">{customer.fullname || customer.name}</p>
                            <p className="text-xs text-gray-500">{customer.mobile || customer.phone}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Send Recipient Email Checkbox */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendRecipientEmail}
                      onChange={(e) => setSendRecipientEmail(e.target.checked)}
                      className="w-4 h-4 text-[#0A4D91] border-gray-300 rounded focus:ring-[#0A4D91]"
                    />
                    <span className="text-sm text-gray-700">Send recipient email</span>
                  </label>
                </div>

                {/* Email Field - Show when checkbox is checked */}
                {sendRecipientEmail && (
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-[#0A4D91] uppercase mb-2">Email</label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="Enter recipient's email"
                      className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                    />
                  </div>
                )}

                {/* Message Field */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-[#0A4D91] uppercase mb-2">Message</label>
                  <textarea
                    value={voucherMessage}
                    onChange={(e) => setVoucherMessage(e.target.value)}
                    placeholder="Optional message"
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none resize-none"
                  />
                </div>

                {/* Custom Voucher Code */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-[#0A4D91] uppercase mb-2">Custom Voucher Code</label>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                    <svg className="w-4 h-4 text-[#0A4D91] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <input
                      type="text"
                      value={customVoucherCode}
                      onChange={(e) => setCustomVoucherCode(e.target.value)}
                      placeholder="Leave blank for a generated code"
                      className="flex-1 text-sm bg-transparent text-gray-700 placeholder-gray-400 outline-none"
                    />
                  </div>
                </div>

                {/* Add to Sale Button */}
                <button
                  onClick={handleAddCustomVoucher}
                  className="w-full bg-[#0A4D91] text-white py-3.5 rounded-lg font-bold text-base hover:bg-[#083d73] transition-colors mb-3"
                >
                  Add to sale
                </button>

                {/* Info Text */}
                <p className="text-center text-[10px] text-gray-400 uppercase tracking-wider">
                  This voucher will be added as a separate line item
                </p>
              </div>
            </div>
          </>
        )}

        {/* Voucher Detail Modal */}
        {showVoucherDetailModal && selectedVoucherDetail && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => {
                setShowVoucherDetailModal(false);
                setSelectedVoucherDetail(null);
              }}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-50 w-full max-w-md shadow-2xl">
              <div className="p-6 max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#0A4D91]">{selectedVoucherDetail.GiftVoucher_name || "Voucher"}</h2>
                  <button
                    onClick={() => {
                      setShowVoucherDetailModal(false);
                      setSelectedVoucherDetail(null);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* To Field */}
                <div className="mb-4 relative">
                  <label className="block text-xs font-bold text-[#0A4D91] uppercase mb-2">To</label>
                  <input
                    type="text"
                    value={toSearchQuery}
                    onChange={(e) => {
                      setToSearchQuery(e.target.value);
                      setRecipientName(e.target.value);
                      setShowToDropdown(true);
                    }}
                    onFocus={() => setShowToDropdown(true)}
                    placeholder="Recipient's name"
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                  />
                  {showToDropdown && toSearchQuery && filteredToCustomers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredToCustomers.map((customer) => (
                        <div
                          key={customer._id || customer.id}
                          onClick={() => handleSelectToCustomer(customer)}
                          className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <p className="text-sm font-medium text-gray-900">{customer.fullname || customer.name}</p>
                          <p className="text-xs text-gray-500">{customer.mobile || customer.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* From Field */}
                <div className="mb-4 relative">
                  <label className="block text-xs font-bold text-[#0A4D91] uppercase mb-2">From</label>
                  <input
                    type="text"
                    value={fromSearchQuery}
                    onChange={(e) => {
                      setFromSearchQuery(e.target.value);
                      setSenderName(e.target.value);
                      setShowFromDropdown(true);
                    }}
                    onFocus={() => setShowFromDropdown(true)}
                    placeholder="Sender's name"
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                  />
                  {showFromDropdown && fromSearchQuery && filteredFromCustomers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredFromCustomers.map((customer) => (
                        <div
                          key={customer._id || customer.id}
                          onClick={() => handleSelectFromCustomer(customer)}
                          className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <p className="text-sm font-medium text-gray-900">{customer.fullname || customer.name}</p>
                          <p className="text-xs text-gray-500">{customer.mobile || customer.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Send Recipient Email Checkbox */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendRecipientEmail}
                      onChange={(e) => setSendRecipientEmail(e.target.checked)}
                      className="w-4 h-4 text-[#0A4D91] border-gray-300 rounded focus:ring-[#0A4D91]"
                    />
                    <span className="text-sm text-gray-700">Send recipient email</span>
                  </label>
                </div>

                {/* Email Field - Show when checkbox is checked */}
                {sendRecipientEmail && (
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-[#0A4D91] uppercase mb-2">Email</label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="Enter recipient's email"
                      className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                    />
                  </div>
                )}

                {/* Message Field */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-[#0A4D91] uppercase mb-2">Message</label>
                  <textarea
                    value={voucherMessage}
                    onChange={(e) => setVoucherMessage(e.target.value)}
                    placeholder="Optional message"
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none resize-none"
                  />
                </div>

                {/* Custom Voucher Code */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-[#0A4D91] uppercase mb-2">Custom Voucher Code</label>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                    <svg className="w-4 h-4 text-[#0A4D91] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <input
                      type="text"
                      value={customVoucherCode}
                      onChange={(e) => setCustomVoucherCode(e.target.value)}
                      placeholder="Leave blank for a generated code"
                      className="flex-1 text-sm bg-transparent text-gray-700 placeholder-gray-400 outline-none"
                    />
                  </div>
                </div>

                {/* Add to Sale Button */}
                <button
                  onClick={handleAddVoucherFromDetail}
                  className="w-full bg-[#0A4D91] text-white py-3.5 rounded-lg font-bold text-base hover:bg-[#083d73] transition-colors"
                >
                  Add to sale
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Vouchers;
