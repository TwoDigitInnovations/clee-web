"use client";
import DashboardHeader from "@/components/DashboardHeader";
import React, { useState } from "react";
import {
  FileText,
  Printer,
  Trash2,
  Plus,
  Info,
  GripVertical,
  CheckCircle2,
  X,
} from "lucide-react";
import { ApiFormData } from "@/services/service";

// ─── Add Tax Modal ────────────────────────────────────────────────────────────
function AddTaxModal({ onClose, onAdd }) {
  const [taxName, setTaxName] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!taxName.trim()) return setError("Tax name is required.");
    if (!taxRate || isNaN(taxRate) || Number(taxRate) < 0 || Number(taxRate) > 100)
      return setError("Enter a valid rate between 0 and 100.");
    setError("");
    onAdd({ name: taxName.trim(), rate: taxRate, usage: "0 items" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-bold text-custom-blue">Add New Tax</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
              Tax Name
            </label>
            <input
              type="text"
              placeholder="e.g. GST, VAT, HST"
              value={taxName}
              onChange={(e) => { setTaxName(e.target.value); setError(""); }}
              className="w-full bg-gray-100 border-none text-black rounded p-3 text-sm outline-none focus:ring-2 focus:ring-custom-blue/30"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
              Tax Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="e.g. 10"
                value={taxRate}
                min="0"
                max="100"
                onChange={(e) => { setTaxRate(e.target.value); setError(""); }}
                className="w-full bg-gray-100 border-none text-black rounded p-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-custom-blue/30"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">%</span>
            </div>
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-5 py-2 rounded text-sm font-bold bg-custom-blue text-white hover:bg-custom-blue/90"
          >
            Add Tax
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Payment Type Modal ───────────────────────────────────────────────────
function AddPaymentModal({ onClose, onAdd }) {
  const [paymentName, setPaymentName] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!paymentName.trim()) return setError("Payment type name is required.");
    setError("");
    onAdd(paymentName.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-bold text-custom-blue">Add Payment Type</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
            Payment Type Name
          </label>
          <input
            type="text"
            placeholder="e.g. Bank Transfer, Cheque"
            value={paymentName}
            onChange={(e) => { setPaymentName(e.target.value); setError(""); }}
            className="w-full bg-gray-100 border-none text-black rounded p-3 text-sm outline-none focus:ring-2 focus:ring-custom-blue/30"
          />
          {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-5 py-2 rounded text-sm font-bold bg-custom-blue text-white hover:bg-custom-blue/90"
          >
            Add Payment Type
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function Salessettings(props) {
  const { loader, toaster, router } = props;

  const [formData, setFormData] = useState({
    paymentTerms: "Immediately",
    invoiceTitle: "Receipt",
    businessRegType: "ACN",
    businessRegNumber: "133156377",
    paymentInstructions: "",
    nextInvoiceNumber: "89038",
    nextRefundNumber: "89038",
    hideBusinessDetails: false,
    hidePaymentHistory: true,
    location: "Chebo Clinic",
    printFormat: "PDF (Standard)",
    merchantId: "",
    apiKey: "••••••••••••••••",
  });

  // Taxes state
  const [taxes, setTaxes] = useState([
    { id: 1, name: "GST", rate: "10", usage: "250 items" },
  ]);
  const [showAddTax, setShowAddTax] = useState(false);

  // Payment types state
  const systemPayments = [
    "TimelyPay - Terminal",
    "TimelyPay - Tap to Pay",
    "On account",
    "Credit card",
    "Cash",
    "TimelyPay",
  ];
  const [customPayments, setCustomPayments] = useState(["Afterpay", "Laybuy"]);
  const [showAddPayment, setShowAddPayment] = useState(false);

  const handleDeleteTax = (id) => {
    setTaxes((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTax = (newTax) => {
    setTaxes((prev) => [...prev, { ...newTax, id: Date.now() }]);
  };

  const handleAddPayment = (name) => {
    setCustomPayments((prev) => [...prev, name]);
  };

  const handleDeletePayment = (name) => {
    setCustomPayments((prev) => prev.filter((p) => p !== name));
  };

  const handleSave = async () => {
    try {
      loader(true);
      const fd = new FormData();
      Object.keys(formData).forEach((key) => fd.append(key, formData[key]));
      const res = await ApiFormData("post", "sales-settings", fd, router);
      loader(false);
      if (res?.status === true) {
        toaster("success", "Settings updated successfully");
      } else {
        toaster("error", res?.message || "Something went wrong");
      }
    } catch {
      loader(false);
      toaster("error", "Server error");
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      <DashboardHeader title="Sales Tools" />

   
      {showAddTax && (
        <AddTaxModal onClose={() => setShowAddTax(false)} onAdd={handleAddTax} />
      )}
      {showAddPayment && (
        <AddPaymentModal onClose={() => setShowAddPayment(false)} onAdd={handleAddPayment} />
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-custom-blue">
            Sales Settings
          </h1>
          <button
            onClick={handleSave}
            className="bg-custom-blue text-white px-8 py-2 rounded font-medium flex items-center gap-2 hover:bg-custom-blue/90 transition-all"
          >
            Save
          </button>
        </div>

        {/* 1. Invoice Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 md:p-6 p-3 mb-6">
          <div className="flex items-center gap-2 mb-6 text-gray-700 font-bold">
            <FileText size={18} className="text-blue-500" />
            <span>Invoice Details</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] font-bold text-gray-500 uppercase mb-2">Payment Terms</label>
              <select
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="w-full bg-gray-100 text-black border-none rounded p-3 text-sm outline-none"
              >
                <option>Immediately</option>
                <option>Net 7</option>
                <option>Net 15</option>
                <option>Net 30</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-500 uppercase mb-2">Invoice Title</label>
              <input
                type="text"
                value={formData.invoiceTitle}
                onChange={(e) => setFormData({ ...formData, invoiceTitle: e.target.value })}
                className="w-full bg-gray-100 text-black border-none rounded p-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-500 uppercase mb-2">Business Registration Type</label>
              <select
                value={formData.businessRegType}
                onChange={(e) => setFormData({ ...formData, businessRegType: e.target.value })}
                className="w-full bg-gray-100 text-black border-none rounded p-3 text-sm outline-none"
              >
                <option>ACN</option>
                <option>ABN</option>
                <option>GST</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-500 uppercase mb-2">Business Registration Number</label>
              <input
                type="text"
                value={formData.businessRegNumber}
                onChange={(e) => setFormData({ ...formData, businessRegNumber: e.target.value })}
                className="w-full bg-gray-100 text-black border-none rounded p-3 text-sm outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[12px] font-bold text-gray-500 uppercase mb-2">Payment Instructions/Notes</label>
              <textarea
                placeholder="Enter bank details or special terms..."
                value={formData.paymentInstructions}
                onChange={(e) => setFormData({ ...formData, paymentInstructions: e.target.value })}
                className="w-full bg-gray-100 border-none text-black rounded p-3 text-sm outline-none h-24 resize-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-500 uppercase mb-2">Next Invoice Number</label>
              <input
                type="text"
                value={formData.nextInvoiceNumber}
                onChange={(e) => setFormData({ ...formData, nextInvoiceNumber: e.target.value })}
                className="w-full bg-gray-100 border-none text-black rounded p-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-500 uppercase mb-2">Next Refund Number</label>
              <input
                type="text"
                value={formData.nextRefundNumber}
                onChange={(e) => setFormData({ ...formData, nextRefundNumber: e.target.value })}
                className="w-full bg-gray-100 border-none text-black rounded p-3 text-sm outline-none"
              />
            </div>
          </div>

          <div className="mt-8 space-y-4 border-t pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-800">Hide business name, address, and logo</p>
                <p className="text-[12px] text-gray-400">Useful if you use pre-printed letterheads</p>
              </div>
              <div
                onClick={() => setFormData({ ...formData, hideBusinessDetails: !formData.hideBusinessDetails })}
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.hideBusinessDetails ? "bg-custom-blue" : "bg-gray-200"}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.hideBusinessDetails ? "right-1" : "left-1"}`} />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-800">Hide payment history on invoices</p>
                <p className="text-[12px] text-gray-400">Shows only the balance due</p>
              </div>
              <div
                onClick={() => setFormData({ ...formData, hidePaymentHistory: !formData.hidePaymentHistory })}
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.hidePaymentHistory ? "bg-custom-blue" : "bg-gray-200"}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.hidePaymentHistory ? "right-1" : "left-1"}`} />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Printing */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-2 mb-6 text-gray-700 font-bold">
            <Printer size={18} className="text-blue-500" />
            <span>Printing</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] font-bold text-custom-blue/90 uppercase mb-2">Location</label>
              <select className="w-full bg-gray-100 text-black border-none rounded p-3 text-sm outline-none">
                <option>Chebo Clinic</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-custom-blue/90 uppercase mb-2">Print Format</label>
              <select className="w-full bg-gray-100 text-black border-none rounded p-3 text-sm outline-none">
                <option>PDF (Standard)</option>
                <option>Thermal (80mm)</option>
                <option>A4</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Taxes */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-custom-blue mb-1">Taxes</h2>
          <p className="text-xs text-gray-500 mb-4">
            Set up taxes that can be applied to services and products.
          </p>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-3 gap-4 mb-4 px-4 text-[12px] font-bold text-gray-400 uppercase">
              <div>Tax Name</div>
              <div>Rate</div>
              <div>Usage</div>
            </div>

            {taxes.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-4">No taxes added yet.</p>
            )}

            {taxes.map((tax) => (
              <div key={tax.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg mb-2">
                <div className="flex-1 font-bold text-sm text-gray-700">{tax.name}</div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tax.rate}
                    onChange={(e) =>
                      setTaxes((prev) =>
                        prev.map((t) => t.id === tax.id ? { ...t, rate: e.target.value } : t)
                      )
                    }
                    className="w-12 text-center bg-white text-black border border-gray-200 rounded p-1 text-sm font-bold"
                  />
                  <span className="text-sm font-bold text-gray-600">%</span>
                </div>
                <div className="flex-1 flex justify-center">
                  <span className="bg-[#eef2ff] text-custom-blue/90 text-[12px] font-bold px-3 py-1 rounded">
                    {tax.usage}
                  </span>
                </div>
                <button onClick={() => handleDeleteTax(tax.id)}>
                  <Trash2 size={16} className="text-gray-400 hover:text-red-500 cursor-pointer" />
                </button>
              </div>
            ))}

            <button
              onClick={() => setShowAddTax(true)}
              className="mt-4 flex items-center gap-2 text-custom-blue/90 text-xs font-bold px-2 hover:underline"
            >
              <Plus size={14} /> Add another tax
            </button>
          </div>
        </div>

        {/* 4. Global Tax Override */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-l-custom-blue/90 p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Global Tax Override</h3>
              <p className="text-[11px] text-gray-500 mt-1">
                Override all of your services, classes, discounts, products and packages with one tax rate:
              </p>
            </div>
            <div className="flex gap-2">
              <select className="bg-gray-100 text-xs text-black font-bold p-2 rounded outline-none border-none">
                {taxes.map((t) => (
                  <option key={t.id}>{t.name} ({t.rate}%)</option>
                ))}
              </select>
              <button className="bg-custom-blue text-white text-xs px-4 py-2 rounded font-bold">Apply</button>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded flex items-center gap-3">
            <Info size={16} className="text-custom-blue/90 shrink-0" />
            <p className="text-[12px] text-custom-blue/90">
              Applying a global tax override will permanently update all current item rates. This action cannot be easily undone.
            </p>
          </div>
        </div>

        {/* 5. Payment Types */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Payment types</h2>
              <p className="text-[11px] text-blue-500">
                Manage the methods your clients can use to pay for services.
              </p>
            </div>
            <button
              onClick={() => setShowAddPayment(true)}
              className="bg-custom-blue text-white text-xs px-4 py-2 rounded font-bold flex items-center gap-2 uppercase tracking-tight hover:bg-custom-blue/90 transition-all"
            >
              <Plus size={14} /> Add payment type
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y overflow-hidden">
            {systemPayments.map((type) => (
              <div key={type} className="flex justify-between items-center p-4 hover:bg-gray-50">
                <div className="flex items-center gap-4 text-gray-400">
                  <GripVertical size={16} />
                  <span className="text-sm font-medium text-gray-700">{type}</span>
                </div>
                <span className="text-[9px] font-black text-gray-400 border border-gray-200 px-1 rounded uppercase tracking-widest">
                  System
                </span>
              </div>
            ))}
            {customPayments.map((type) => (
              <div key={type} className="flex justify-between items-center p-4 hover:bg-gray-50">
                <div className="flex items-center gap-4 text-gray-400">
                  <GripVertical size={16} />
                  <span className="text-sm font-medium text-gray-700">{type}</span>
                </div>
                <button onClick={() => handleDeletePayment(type)}>
                  <Trash2 size={16} className="text-gray-300 hover:text-red-500 cursor-pointer" />
                </button>
              </div>
            ))}
            {customPayments.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-400">No custom payment types added.</div>
            )}
          </div>
        </div>

        {/* 6. Laybuy Integration */}
        <div className="mb-20">
          <h2 className="text-lg font-bold text-gray-800">Laybuy integration</h2>
          <p className="text-[11px] text-blue-500 mb-4">
            Connect your Laybuy account to accept buy now, pay later payments.
          </p>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="bg-[#eef2ff] p-4 rounded-lg flex items-start gap-4 mb-8">
              <Info size={18} className="text-custom-blue/90 mt-1 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-800 mb-1">Setting up Laybuy</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  To integrate Laybuy, you'll need your Merchant ID and API Key from the Laybuy Merchant Dashboard.
                  Ensure your currency settings in Laybuy match your salon's currency.
                </p>
              </div>
            </div>
            <div className="mb-8">
              <p className="text-[12px] font-bold text-gray-500 uppercase mb-3">Locations using Laybuy</p>
              <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
                <CheckCircle2 size={14} className="text-custom-blue/90" />
                <span className="text-xs font-bold text-gray-700">Chebo Clinic</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-[12px] font-bold text-gray-500 uppercase mb-2">Merchant ID</label>
                <input
                  type="text"
                  placeholder="Enter your Laybuy Merchant ID"
                  value={formData.merchantId}
                  onChange={(e) => setFormData({ ...formData, merchantId: e.target.value })}
                  className="w-full bg-gray-100 border-none text-black rounded p-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-500 uppercase mb-2">API Key</label>
                <input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full bg-gray-100 border-none text-black rounded p-3 text-sm outline-none tracking-widest"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button className="bg-custom-blue text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-custom-blue/90 transition-all">
                Save Change
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Salessettings;