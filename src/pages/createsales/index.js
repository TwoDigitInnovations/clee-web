import DashboardHeader from "@/components/DashboardHeader";
import React, { useState } from "react";
import { Search, ShoppingCart, User, CreditCard, Package, Gift, Users } from "lucide-react";

function CreateSale() {
  const [activeTab, setActiveTab] = useState("products");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const tabs = [
    { id: "products", label: "Products", icon: <Package size={18} /> },
    { id: "services", label: "Services", icon: <Users size={18} /> },
    { id: "vouchers", label: "Vouchers", icon: <Gift size={18} /> },
    { id: "credit", label: "Credit", icon: <CreditCard size={18} /> },
    { id: "packages", label: "Packages", icon: <ShoppingCart size={18} /> },
  ];

  const products = [
    {
      id: 1,
      name: "Botanica Vitamin BCE Luxurious Gel Cleanser",
      sku: "BOT-4421",
      price: 65,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Clinical Grade Glycolic Resurfacing Serum",
      sku: "CLN-9820",
      price: 110,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Aqua-Infusion Deep Hydrating Overnight Mask",
      sku: "AQU-7275",
      price: 85,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
    },
    {
      id: 4,
      name: "Invisible Shield SPF 50+ Broad Spectrum",
      sku: "SUN-1102",
      price: 48,
      image: "https://images.unsplash.com/photo-1556228852-80a5e2c3e7b2?w=400&h=400&fit=crop"
    },
    {
      id: 5,
      name: "Peptide-Rich Advanced Eye Recovery Complex",
      sku: "EYE-3691",
      price: 92,
      image: "https://images.unsplash.com/photo-1583001809744-7b1c5b5e3f6e?w=400&h=400&fit=crop"
    },
    {
      id: 6,
      name: "Custom Compounded Treatment Serum",
      sku: "CUSTOM",
      price: 0,
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop"
    },
  ];

  const savedSales = [
    { name: "Elena Rodriguez", date: "Yesterday 4:35 PM", amount: 245.00 },
    { name: "Julian Thorne", date: "2 days ago", amount: 120.50 },
  ];

  const addToCart = (product) => {
    const existing = selectedProducts.find(p => p.id === product.id);
    if (existing) {
      setSelectedProducts(selectedProducts.map(p => 
        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const getTotal = () => {
    return selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  };

  return (
    <>
      <DashboardHeader title="Create Sale" />
      
      <div className="min-h-screen bg-custom-gray flex">
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "text-[#0A4D91] border-b-2 border-[#0A4D91]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

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

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Skincare Curator</h2>
                <p className="text-sm text-gray-500 mt-1">Select items for the current session</p>
              </div>
              <p className="text-sm text-gray-500">{products.length} PRODUCTS FOUND</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x400?text=Product+Image';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">SKU: {product.sku}</p>
                    <p className="text-xl font-bold text-gray-900">
                      {product.price > 0 ? `${product.price}` : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto max-h-screen">
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
                <button className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 mx-auto">
                  <Search size={16} />
                  Find Client
                </button>
              </div>
            ) : null}
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

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart className="text-[#0A4D91]" size={20} />
              <h4 className="font-semibold text-gray-900">Current Sale</h4>
            </div>
            {selectedProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ShoppingCart size={48} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm text-gray-700">No items added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-sm text-gray-900 mb-1">{product.name}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                      <p className="font-bold text-gray-900">${(product.price * product.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">SUBTOTAL</span>
              <span className="font-semibold text-gray-600">${getTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-sm text-gray-600">TAX</span>
              <span className="font-semibold text-gray-600">$0.00</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-[#0A4D91]">${getTotal().toFixed(2)}</span>
            </div>
            <button className="text-sm text-[#0A4D91] hover:underline mb-4">Add note or discount</button>
          </div>

          <button 
            disabled={selectedProducts.length === 0}
            className="w-full bg-[#0A4D91] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#083d73] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-3"
          >
            Checkout
          </button>
          <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            COMPLETE SALE
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateSale;
