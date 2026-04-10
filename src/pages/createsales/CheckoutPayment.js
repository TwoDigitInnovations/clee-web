import React, { useState } from "react";
import { CreditCard, DollarSign, Gift, Mail, User, X, Shield, Clock } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useDispatch } from "react-redux";
import { createSale } from "@/redux/actions/saleActions";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

function CheckoutPayment({ selectedClient, selectedProducts, totalAmount, onBack }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("products");
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const handlePaymentMethodSelect = (paymentMethod, label) => {
   
    if (paymentMethod === 'credit-card') {
      setShowAddCardModal(true);
      setSelectedPaymentMethod({ method: paymentMethod, label: label });
    } else {
     
      setSelectedPaymentMethod({ method: paymentMethod, label: label });
      setShowReviewScreen(true);
    }
  };

  const handleCompletePayment = async () => {
    if (processing) return;
    
    try {
      setProcessing(true);
      
      const saleData = {
        customer: selectedClient?._id || null,
        items: selectedProducts.map(product => ({
          itemType: product.type || 'product', // product, service, voucher, credit, package
          product: product.id,
          productName: product.name,
          quantity: product.quantity || 1,
          price: product.price,
          discount: 0
        })),
        subtotal: totalAmount,
        tax: totalAmount * 0.1,
        discount: 0,
        total: totalAmount * 1.1,
        paymentMethod: selectedPaymentMethod?.method || 'cash'
      };

      const response = await dispatch(createSale(saleData, router));
      
      if (response?.status) {
        Swal.fire({
          icon: 'success',
          title: 'Sale Created!',
          text: 'Sale has been created successfully.',
          confirmButtonColor: '#0A4D91'
        }).then(() => {
          if (onBack) {
            onBack();
          } else {
            router.push("/createsales");
          }
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to create sale. Please try again.',
        confirmButtonColor: '#0A4D91'
      });
      console.error("Sale creation error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const tabs = [
    { id: "products", label: "Products" },
    { id: "services", label: "Services" },
    { id: "vouchers", label: "Vouchers" },
    { id: "credit", label: "Credit" },
    { id: "packages", label: "Packages" },
  ];

  const handleTabClick = (tabId) => {
    if (tabId !== activeTab && onBack) {
      onBack();
    }
  };

  const paymentMethods = [
    { id: "credit-card", label: "Credit card", icon: <CreditCard size={32} />, subtitle: "SAVE CARD" },
    { id: "cash", label: "Cash", icon: <DollarSign size={32} />, subtitle: "SAVE CARD" },
    { id: "afterpay", label: "Afterpay", icon: <CreditCard size={32} />, subtitle: "EXTERNAL APP" },
    { id: "laybuy", label: "Laybuy", icon: <CreditCard size={32} />, subtitle: "EXTERNAL APP" },
    { id: "gift-voucher", label: "Gift voucher", icon: <Gift size={32} />, subtitle: "REDEEM ONCE" },
    { id: "request-payment", label: "Request payment", icon: <Mail size={32} />, subtitle: "SEND LINK" },
  ];

  // Show Review Screen
  if (showReviewScreen && selectedPaymentMethod) {
    return (
      <>
        <DashboardHeader title="Review and Complete" />
        
        <div className="min-h-screen bg-custom-gray">
          <div className="max-w-4xl mx-auto p-4 md:p-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setShowReviewScreen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           
              <div className="space-y-4">
              
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <h3 className="text-sm font-bold text-[#0A4D91] mb-3">{selectedClient?.fullname || selectedClient?.name || "Walk-in"}</h3>
                  <p className="text-xs text-gray-500">{selectedClient?.mobile || selectedClient?.phone || ""}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4">
                  <div className="space-y-3">
                    {selectedProducts.map((product, index) => (
                      <div key={product.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-gray-600">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">Qty: {product.quantity || 1}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

             
                  <div className="mt-4 pt-4 border-t-2 border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total</span>
                      <span className="font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-gray-700">{selectedPaymentMethod.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
                        <button
                          onClick={() => setShowReviewScreen(false)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <X size={16} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-center text-sm font-bold text-[#0A4D91]">Paid in full</p>
                    </div>
                  </div>
                </div>
              </div>

            
              <div className="flex flex-col">
                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 flex-1 flex flex-col items-center justify-center text-center">
                  <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-8 italic">Review and complete</h2>
                  
                  <button
                    onClick={handleCompletePayment}
                    disabled={processing}
                    className="w-full max-w-md bg-[#0A4D91] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#083d73] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {processing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Tap to complete"
                    )}
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <button className="text-sm text-gray-500 hover:text-[#0A4D91] hover:underline flex items-center gap-1 mx-auto">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Sale options
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title="Checkout Payment" />
      
      <div className="min-h-screen bg-custom-gray">
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
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

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
          <div className="lg:col-span-1 space-y-6">
          
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xs font-bold text-[#0A4D91] uppercase mb-4">Client</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#E2E8F0] rounded-full flex items-center justify-center">
                  <User size={24} className="text-[#0A4D91]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selectedClient?.name || "Walk-in"}</p>
                  <p className="text-sm text-gray-500">{selectedClient?.phone || ""}</p>
                </div>
              </div>
            </div>

            {/* Sale Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xs font-bold text-[#0A4D91] uppercase mb-4">Sale Summary</h3>
              <div className="space-y-3 mb-4">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="flex justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        {product.quantity || 1}x • SKU {product.sku}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">${product.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-600">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (GST 10%)</span>
                  <span className="font-semibold text-gray-600">${(totalAmount * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-bold text-[#0A4D91]">Total Amount</span>
                  <span className="text-xl font-bold text-[#0A4D91]">
                    ${(totalAmount * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

      
          <div className="lg:col-span-2 space-y-6">
          
            <div className=" p-6 text-center">
              <p className="text-xs font-bold text-[#0A4D91] uppercase mb-2">Amount to Pay</p>
              <p className="text-5xl font-bold text-[#0A4D91] mb-2">
                ${(totalAmount * 1.1).toFixed(2)}
              </p>
              <button className="text-sm text-[#0A4D91] hover:underline">
                Edit to make partial payment
              </button>
            </div>

            {/* Payment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => handlePaymentMethodSelect('credit-card', 'Credit card')}
                className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-200 hover:border-[#0A4D91] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#E2E8F0] rounded-full flex items-center justify-center">
                    <CreditCard size={24} className="text-[#0A4D91]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Take card payment</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Process via connected terminal terminal_id_G2E
                </p>
              </div>

              <div 
                onClick={() => handlePaymentMethodSelect('cash', 'Cash')}
                className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-200 hover:border-[#0A4D91] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#E2E8F0] rounded-full flex items-center justify-center">
                    <DollarSign size={24} className="text-[#0A4D91]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Cash</h3>
                </div>
                <p className="text-sm text-gray-500">Complete sale with cash payment</p>
              </div>
            </div>

            {/* Other Payment Methods */}
            <div>
              <h3 className="text-xs font-bold text-[#0A4D91] uppercase mb-4">
                Other Payment Methods
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handlePaymentMethodSelect(method.id, method.label)}
                    disabled={processing}
                    className="bg-[#E2E8F0] rounded-xl p-6 hover:bg-[#d1dce8] transition-colors text-center disabled:opacity-50"
                  >
                    <div className="flex justify-center mb-3 text-[#0A4D91]">
                      {method.icon}
                    </div>
                    <p className="font-bold text-[#0A4D91] mb-1">{method.label}</p>
                    <p className="text-xs text-gray-600">{method.subtitle}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Charge to Account */}
            <div className="text-center">
              <button 
                onClick={() => handlePaymentMethodSelect('account', 'Account')}
                disabled={processing}
                className="text-sm text-gray-500 hover:text-[#0A4D91] hover:underline disabled:opacity-50"
              >
                Charge to account (no payment)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCardModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowAddCardModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-50 w-full max-w-xl shadow-2xl">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900">Add card details</h2>
                <button
                  onClick={() => setShowAddCardModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-[#0A4D91] mb-5">Please enter the secure payment information.</p>

              {/* Card Number */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#0A4D91] uppercase">Card Number</label>
                  <span className="text-xs text-gray-500">Autofill from secure vault</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full px-4 py-3 bg-[#E2E8F0] border-0 rounded-lg text-gray-400 focus:ring-2 focus:ring-[#0A4D91] outline-none"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <CreditCard size={20} className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Expiry and CVC */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-[#0A4D91] uppercase mb-2 block">Expiry</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-3 bg-[#E2E8F0] border-0 rounded-lg text-gray-400 focus:ring-2 focus:ring-[#0A4D91] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0A4D91] uppercase mb-2 block">CVC</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-4 py-3 bg-[#E2E8F0] border-0 rounded-lg text-gray-400 focus:ring-2 focus:ring-[#0A4D91] outline-none"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Shield size={18} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Card Checkbox */}
              <div className="mb-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-[#0A4D91] border-gray-300 rounded focus:ring-[#0A4D91]"
                  />
                  <span className="text-sm text-gray-700">
                    Save card details on customer's behalf for future clinical purchases
                  </span>
                </label>
              </div>

              {/* Info Box */}
              <div className="bg-[#E2E8F0] border-l-4 border-[#0A4D91] rounded-lg p-3 mb-4">
                <div className="flex gap-3">
                  <Shield size={18} className="text-[#0A4D91] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700 mb-2">
                      By clicking 'Save and review', you confirm that the client has provided verbal or written consent to securely store their payment information in accordance with our PCI-compliant data privacy policy.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock size={12} />
                      <span>Authorized/recorded: Oct 24, 2025 - 16:32:08 EST</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={() => {
                  // Validate card details
                  if (!cardNumber || !expiry || !cvc) {
                    alert('Please fill in all card details');
                    return;
                  }
                  // Close modal and show review screen
                  setShowAddCardModal(false);
                  setShowReviewScreen(true);
                }}
                className="w-full bg-[#0A4D91] text-white py-3 rounded-lg font-bold hover:bg-[#083d73] transition-colors mb-3"
              >
                Save and review
              </button>

              {/* Cancel Link */}
              <button
                onClick={() => {
                  setShowAddCardModal(false);
                  setSelectedPaymentMethod(null);
                }}
                className="w-full text-[#0A4D91] hover:underline font-medium text-sm"
              >
                Cancel and return to checkout
              </button>
            </div>
          </div>
        </>
      )}
      </div>
    </>
  );
}

export default CheckoutPayment;
