import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Search, ShoppingCart, BarChart3, ChevronDown, MoreVertical, Smartphone, X, Archive, Edit2, Trash2 } from "lucide-react";
import { Api } from "@/services/service";
import Swal from "sweetalert2";

function Products() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("retail");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustTab, setAdjustTab] = useState("set");
  const [stockAmount, setStockAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showActionMenu, setShowActionMenu] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [activeTab, router.asPath]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
    
      const allResponse = await Api("GET", `products`, {}, router);
      setAllProducts(allResponse.data.data || []);
      
   
      const response = await Api("GET", `products?type=${activeTab}`, {}, router);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to fetch products',
        confirmButtonColor: '#0A4D91',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStockLevel = (product) => {
    if (!product.trackStock) return "Unlimited";
    const totalStock = product.locations?.reduce((sum, loc) => sum + (loc.available || 0), 0) || 0;
    return totalStock;
  };

  const getStockStatus = (product) => {
    if (!product.trackStock) return "IN STOCK";
    const totalStock = getStockLevel(product);
    if (totalStock === 0) return "OUT OF STOCK";
    if (totalStock < 20) return "LOW STOCK";
    return "IN STOCK";
  };

  const handleAdjustStock = async () => {
    if (!stockAmount || !adjustReason || selectedLocation === "") {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill all fields',
        confirmButtonColor: '#0A4D91',
      });
      return;
    }

    try {
      const locationIndex = parseInt(selectedLocation);
      const locationName = selectedProduct.locations[locationIndex].name;
      
      await Api(
        "POST",
        `products/${selectedProduct._id}/adjust-stock`,
        {
          adjustmentType: adjustTab,
          amount: Number(stockAmount),
          reason: adjustReason,
          location: locationName,
        },
        router
      );
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Stock adjusted successfully',
        confirmButtonColor: '#0A4D91',
      });
      setShowAdjustModal(false);
      setStockAmount("");
      setAdjustReason("");
      setSelectedLocation("");
      fetchProducts();
    } catch (error) {
      console.error("Error adjusting stock:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to adjust stock',
        confirmButtonColor: '#0A4D91',
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await Api("DELETE", `products/${productId}`, {}, router);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Product has been deleted.',
          confirmButtonColor: '#0A4D91',
        });
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete product',
          confirmButtonColor: '#0A4D91',
        });
      }
    }
  };

  const filteredProducts = Array.isArray(products) ? products.filter((product) =>
    product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.skuHandle?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <>
      <DashboardHeader title="Stock" />

      <div className="min-h-screen bg-[#f0f1f5] text-slate-800 px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="bg-gradient-to-r from-[#0A4D91] to-[#0d5fb8] rounded-2xl p-6 sm:p-8 md:p-10 text-white relative overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6 items-center relative z-10">
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  Manage stock like a pro
                </h1>
                <p className="text-sm sm:text-base text-blue-100 max-w-md">
                  Scan, update and manage your inventory with our powerful mobile suite. Track product movement across all your locations in real-time.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button className="bg-white text-[#0A4D91] px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Learn more
                  </button>
                  <button className="bg-[#083d73] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#072f5a] transition-colors flex items-center justify-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Download on the App Store
                  </button>
                </div>
              </div>
              
              <div className="hidden md:flex justify-center items-center">
                <div className="relative">
                  <img 
                    src="/images/mobile.png" 
                    alt="Mobile App" 
                    className="w-64 h-auto object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Products</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your retail and professional inventory units.</p>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="bg-[#0A4D91] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#083d73] transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    New product
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <button 
                        onClick={() => {
                          router.push("/stock/AddProduct?type=retail");
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700 border-b border-gray-100"
                      >
                        New retail product
                      </button>
                      <button 
                        onClick={() => {
                          router.push("/stock/AddProduct?type=professional");
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700"
                      >
                        New Professional product
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-6 border-b border-gray-200 mb-4">
                <button
                  onClick={() => setActiveTab("retail")}
                  className={`pb-3 px-1 font-semibold text-sm transition-colors relative ${
                    activeTab === "retail"
                      ? "text-[#0A4D91] border-b-2 border-[#0A4D91]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Retail stock
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                    {Array.isArray(allProducts) ? allProducts.filter(p => p.type === "retail").length : 0}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("professional")}
                  className={`pb-3 px-1 font-semibold text-sm transition-colors relative ${
                    activeTab === "professional"
                      ? "text-[#0A4D91] border-b-2 border-[#0A4D91]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Professional stock
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                    {Array.isArray(allProducts) ? allProducts.filter(p => p.type === "professional").length : 0}
                  </span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, SKU or brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="hidden sm:inline">Stock orders</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Manage stock levels</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#E2E8F0] border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Photo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Supplier</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock Levels</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Retail Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                        Loading products...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <img
                            src={product.photo || "https://via.placeholder.com/60/4A90A4/ffffff?text=P"}
                            alt={product.productName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="max-w-xs">
                            <p className="font-semibold text-sm text-gray-900 line-clamp-2">{product.productName}</p>
                            <p className="text-xs text-gray-500 mt-1">{product.description?.substring(0, 50)}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <p className="text-sm text-gray-600 font-mono">{product.skuHandle || "-"}</p>
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <p className="text-sm text-gray-600">{product.primarySupplier || "-"}</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-center space-y-2">
                            <div className="flex items-center justify-center gap-3">
                              <div>
                                <p className="text-lg font-bold text-gray-900">{getStockLevel(product)}</p>
                                <span
                                  className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                                    getStockStatus(product) === "IN STOCK"
                                      ? "bg-blue-100 text-blue-700"
                                      : getStockStatus(product) === "LOW STOCK"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {getStockStatus(product)}
                                </span>
                              </div>
                              {product.trackStock && (
                                <button 
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setShowAdjustModal(true);
                                    setStockAmount("");
                                    setAdjustReason("");
                                    setSelectedLocation("0");
                                  }}
                                  className="bg-gray-100 text-[#0A4D91] px-4 py-1.5 rounded text-sm font-semibold hover:bg-gray-200 transition-colors whitespace-nowrap"
                                >
                                  Adjust
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold text-gray-900">${product.retailPrice?.toFixed(2)}</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="relative">
                            <button 
                              onClick={() => setShowActionMenu(showActionMenu === product._id ? null : product._id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                            
                            {showActionMenu === product._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <button
                                  onClick={() => {
                                    router.push(`/stock/AddProduct?type=${product.type}&id=${product._id}`);
                                    setShowActionMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700 border-b border-gray-100 flex items-center gap-2"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Edit Product
                                </button>
                                <button
                                  onClick={() => {
                                    handleDeleteProduct(product._id);
                                    setShowActionMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm font-medium text-red-600 flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete Product
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-4 bg-[#E2E8F0] border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">Showing {filteredProducts.length} entries</p>
            </div>
          </div>
        </div>
      </div>

      {showAdjustModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg my-8 max-h-[90vh] overflow-hidden flex flex-col">
            <style jsx>{`
              .modal-content::-webkit-scrollbar {
                width: 6px;
              }
              .modal-content::-webkit-scrollbar-track {
                background: #f1f1f1;
              }
              .modal-content::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 10px;
              }
              .modal-content::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
              }
              .modal-content {
                scrollbar-width: thin;
                scrollbar-color: #cbd5e1 #f1f1f1;
              }
            `}</style>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Adjust stock levels</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedProduct.productName}</p>
              </div>
              <button
                onClick={() => setShowAdjustModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 modal-content">
              <div className="flex gap-2 bg-[#E2E8F0] p-2 mx-6 mt-4 rounded-lg flex-shrink-0">
              <button
                onClick={() => setAdjustTab("set")}
                className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  adjustTab === "set"
                    ? "bg-white text-[#0A4D91] shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Set stock level
              </button>
              <button
                onClick={() => setAdjustTab("add")}
                className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  adjustTab === "add"
                    ? "bg-white text-[#0A4D91] shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Add stock
              </button>
              <button
                onClick={() => setAdjustTab("reduce")}
                className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  adjustTab === "reduce"
                    ? "bg-white text-[#0A4D91] shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Reduce stock
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Current Stock Level</p>
                  <p className="text-2xl font-bold text-gray-900">{getStockLevel(selectedProduct)}</p>
                </div>
                <button className="p-2 bg-[#DCE2F34D] hover:bg-[#DCE2F366] rounded-lg transition-colors">
                  <Archive className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Location
                </label>
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none appearance-none cursor-pointer text-gray-700"
                  >
                    <option value="">Select a location...</option>
                    {selectedProduct.locations?.map((loc, idx) => (
                      <option key={idx} value={idx}>{loc.name} (Current: {loc.available})</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={stockAmount}
                    onChange={(e) => setStockAmount(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none text-lg text-gray-700"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-yellow-800">
                    {adjustTab === "set" && "This will set the stock to the exact amount entered."}
                    {adjustTab === "add" && "This will add the entered amount to current stock."}
                    {adjustTab === "reduce" && "This will reduce the entered amount from current stock."}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Choose adjustment reason
                </label>
                <div className="relative">
                  <select
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full px-4 py-3 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none appearance-none cursor-pointer text-gray-700"
                  >
                    <option value="">Select a reason...</option>
                    <option value="new-stock">New Stock</option>
                    <option value="return">Return</option>
                    <option value="transfer">Transfer</option>
                    <option value="adjustment">Adjustment</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setShowAdjustModal(false)}
                className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustStock}
                className="px-6 py-2.5 bg-[#0A4D91] text-white font-semibold rounded-lg hover:bg-[#083d73] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Products;
