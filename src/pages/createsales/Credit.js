import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import { Trash2, CreditCard, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchCustomers } from "@/redux/actions/productActions";
import { useRouter } from "next/router";
import CheckoutSidebar from "@/components/CheckoutSidebar";

function Credit({ 
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
  
  const [activeTab, setActiveTab] = useState("credit");
  const [creditAmount, setCreditAmount] = useState("0.00");
  const [reason, setReason] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [showVariablePriceModal, setShowVariablePriceModal] = useState(false);
  const [variableCreditAmount, setVariableCreditAmount] = useState("0");
  const [overallDiscountTypeLocal, setOverallDiscountTypeLocal] = useState(overallDiscountType || "percentage");
  const [overallDiscountValueLocal, setOverallDiscountValueLocal] = useState(overallDiscountValue || "");

  useEffect(() => {
    
  }, []);

  const tabs = [
    { id: "products", label: "Products" },
    { id: "services", label: "Services" },
    { id: "vouchers", label: "Vouchers" },
    { id: "credit", label: "Credit" },
    { id: "packages", label: "Packages" },
  ];

  const handleTabClick = (tabId) => {
    if (tabId !== "credit" && onTabChange) {
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
    return selectedItems.reduce((sum, c) => sum + (parseFloat(c.amount) || parseFloat(c.price) || 0), 0);
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

  const handleAddCredit = () => {
    
    const amount = parseFloat(creditAmount);
    if (!creditAmount || creditAmount === "0.00" || amount === 0 || isNaN(amount)) {
      setShowVariablePriceModal(true);
      return;
    }
    
    
    const creditItem = {
      id: Date.now(),
      name: `Credit ${reason ? `- ${reason}` : ""}`,
      amount: creditAmount,
      price: parseFloat(creditAmount),
      type: 'credit',
      expiryDate: expiryDate,
    };
    setSelectedItems([...selectedItems, creditItem]);
    
    // Reset form
    setCreditAmount("0.00");
    setReason("");
    setExpiryDate("");
  };

  const handleSaveVariableCredit = () => {
    const amount = parseFloat(variableCreditAmount);
    if (amount > 0) {
      setCreditAmount(amount.toFixed(2));
      setShowVariablePriceModal(false);
      setVariableCreditAmount("0");
    }
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

       
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-[#0A4D91] mb-2">Add Credit</h2>
                <p className="text-sm text-gray-500">Assign store credit to the current transaction</p>
              </div>

             
              <div className="bg-gray-50 rounded-xl p-8 mb-6 text-center">
                <div className="flex items-center justify-center">
                  <span className="text-5xl md:text-6xl font-bold text-[#0A4D91]">$</span>
                  <input
                    type="text"
                    value={creditAmount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      setCreditAmount(value);
                    }}
                    className="text-5xl md:text-6xl font-bold text-[#0A4D91] bg-transparent border-none outline-none text-center w-48"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Reason and Expires Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    Reason (Optional)
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Client loyalty, refund..."
                    className="w-full px-4 py-2.5 border text-gray-700 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    Expires
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                  />
                  {expiryDate && (
                    <button 
                      onClick={() => setExpiryDate("")}
                      className="mt-2 text-red-500 hover:text-red-600 text-xs flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                      Remove expiry
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddCredit}
                  className="w-full bg-[#0A4D91] text-white py-3.5 rounded-lg font-semibold hover:bg-[#083a6e] transition-colors text-sm"
                >
                  Add credit to sale
                </button>
                <button
                  onClick={() => onTabChange && onTabChange("products")}
                  className="w-full text-gray-600 py-2 rounded-lg font-medium hover:text-gray-800 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
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
          openProductDetail={(credit) => console.log("Open credit detail", credit)}
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

        {/* Variable Price Modal */}
        {showVariablePriceModal && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowVariablePriceModal(false)}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-50 w-full max-w-lg shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#0A4D91]">Set variable prices</h2>
                  <button
                    onClick={() => setShowVariablePriceModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="text-[#0A4D91]" size={20} />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Credit Amount</span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 mb-4">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-4xl font-bold text-[#0A4D91]">$</span>
                      <input
                        type="text"
                        value={variableCreditAmount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setVariableCreditAmount(value);
                        }}
                        className="text-4xl font-bold text-[#0A4D91] bg-transparent border-none outline-none w-16 text-center"
                        placeholder="0"
                        autoFocus
                      />
                      <div className="flex flex-col gap-0.5">
                        <button 
                          onClick={() => setVariableCreditAmount(String(Math.min(9999, parseInt(variableCreditAmount || "0") + 1)))}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                            <path d="M8 1L13 9H3L8 1Z" fill="#0A4D91"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => setVariableCreditAmount(String(Math.max(0, parseInt(variableCreditAmount || "0") - 1)))}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                            <path d="M8 9L3 1H13L8 9Z" fill="#0A4D91"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-xs text-gray-500 mb-6 px-4">
                    Enter the custom credit amount to be added to the clinician's wallet. This variable price will bypass standard package constraints.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleSaveVariableCredit}
                    className="w-full bg-[#0A4D91] text-white py-3.5 rounded-lg font-semibold hover:bg-[#083a6e] transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" stroke="white" strokeWidth="2"/>
                      <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Save Variable Credit
                  </button>
                  <button
                    onClick={() => {
                      setShowVariablePriceModal(false);
                      setVariableCreditAmount("0");
                    }}
                    className="w-full text-gray-600 py-2 rounded-lg font-medium hover:text-gray-800 transition-colors text-sm"
                  >
                    Cancel and Return
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

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
                  className="w-full text-gray-700 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none resize-none"
                  autoFocus
                />

                <button
                  onClick={() => setShowNoteModal(false)}
                  className="w-full mt-4 bg-[#0A4D91] text-white py-3 rounded-lg font-bold hover:bg-[#083d73] transition-colors"
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

                <div className="bg-blue-50 border-l-4 border-[#0A4D91] p-4 mb-6 rounded">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-[#0A4D91]"
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
                      className="w-full h-14 px-4 border-2 border-gray-300 rounded-lg text-center font-bold text-2xl text-gray-900 focus:ring-2 focus:ring-[#0A4D91] focus:border-[#0A4D91] outline-none"
                    />
                  </div>
                </div>

                {overallDiscountValueLocal && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">
                        Total after discount
                      </p>
                      <p className="text-3xl font-bold text-[#0A4D91]">
                        ${getTotalWithOverallDiscount().toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowOverallDiscountModal(false)}
                  className="w-full bg-[#0A4D91] text-white py-3 rounded-lg font-bold hover:bg-[#083d73] transition-colors"
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

export default Credit;
