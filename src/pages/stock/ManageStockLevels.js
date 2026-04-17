import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Search, Plus, Minus, X, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/actions/productActions";
import { Api } from "@/services/service";
import Swal from "sweetalert2";

function ManageStockLevels() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { products: productsList } = useSelector((state) => state.product);

  const [adjustmentType, setAdjustmentType] = useState("increase");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts(router));
  }, []);

  const products = Array.isArray(productsList)
    ? productsList.map((product) => ({
        id: product._id,
        name: product.productName || product.name,
        sku: product.skuHandle || product.sku,
        currentStock: product.stock || 0,
        image: product.photo,
      }))
    : [];

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addProduct = (product) => {
    if (!selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts([
        ...selectedProducts,
        { ...product, adjustmentAmount: 1 },
      ]);
    }
    setSearchQuery("");
    setShowProductDropdown(false);
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const updateAdjustmentAmount = (productId, amount) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.id === productId ? { ...p, adjustmentAmount: Math.max(1, amount) } : p
      )
    );
  };

  const handleSave = async () => {
    if (selectedProducts.length === 0) {
      Swal.fire("Error", "Please select at least one product", "error");
      return;
    }

    if (!adjustmentReason) {
      Swal.fire("Error", "Please select an adjustment reason", "error");
      return;
    }

    try {
      setLoading(true);
      const adjustments = selectedProducts.map((product) => ({
        productId: product.id,
        type: adjustmentType,
        amount: product.adjustmentAmount,
        reason: adjustmentReason,
      }));

      await Api("post", "products/bulk-adjust-stock", { adjustments }, router);

      Swal.fire("Success", "Stock levels updated successfully", "success");
      setSelectedProducts([]);
      setAdjustmentReason("");
      dispatch(fetchProducts(router));
    } catch (error) {
      Swal.fire("Error", "Failed to update stock levels", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardHeader title="Manage Stock Levels" />

      <div className="min-h-screen bg-custom-gray p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
            <div className="mb-6">
              <button
                onClick={() => router.push("/stock/Products")}
                className="text-[#0A4D91] hover:underline text-sm mb-4"
              >
                ← Back to Products
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Bulk Stock Adjustment
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAdjustmentType("increase")}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      adjustmentType === "increase"
                        ? "bg-[#0A4D91] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Increase
                  </button>
                  <button
                    onClick={() => setAdjustmentType("decrease")}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      adjustmentType === "decrease"
                        ? "bg-[#0A4D91] text-white"
                        : "bg-gray-400 text-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    Decrease
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Why
                </label>
                <div className="relative">
                  <select
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                  >
                    <option value="">Choose adjustment reason</option>
                    <option value="damaged">Damaged</option>
                    <option value="lost">Lost</option>
                    <option value="stolen">Stolen</option>
                    <option value="recount">Recount</option>
                    <option value="returned">Returned</option>
                    <option value="received">Received</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search for products
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowProductDropdown(true);
                    }}
                    onFocus={() => setShowProductDropdown(true)}
                    placeholder="Search by product name or scan product barcode"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                  />
                </div>

                {showProductDropdown && searchQuery && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowProductDropdown(false)}
                    />
                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => addProduct(product)}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                          >
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              SKU: {product.sku} • Stock: {product.currentStock}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          No products found
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {selectedProducts.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    {adjustmentType === "increase" ? "Increase" : "Reduce"}{" "}
                    stock by {selectedProducts.length} item
                    {selectedProducts.length > 1 ? "s" : ""}
                  </h3>
                  <button
                    onClick={() => setSelectedProducts([])}
                    className="text-sm text-[#0A4D91] hover:underline"
                  >
                    Clear all
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No img
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Current: {product.currentStock} → New:{" "}
                          {adjustmentType === "increase"
                            ? product.currentStock + product.adjustmentAmount
                            : Math.max(
                                0,
                                product.currentStock - product.adjustmentAmount
                              )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateAdjustmentAmount(
                              product.id,
                              product.adjustmentAmount - 1
                            )
                          }
                          className="w-8 h-8 text-gray-700 flex items-center justify-center border border-gray-600 rounded hover:bg-gray-500"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value={product.adjustmentAmount}
                          onChange={(e) =>
                            updateAdjustmentAmount(
                              product.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-16 text-gray-700 text-center border border-gray-600 rounded py-1 font-semibold"
                        />
                        <button
                          onClick={() =>
                            updateAdjustmentAmount(
                              product.id,
                              product.adjustmentAmount + 1
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center border border-gray-500 rounded hover:bg-gray-400"
                        >
                          <Plus className="w-4 h-4 text-black" />
                        </button>
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded ml-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No products selected.</p>
                <p className="text-sm mt-1">
                  Search and select products to adjust stock levels
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => router.push("/stock/Products")}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || selectedProducts.length === 0}
              className="px-6 py-3 bg-[#0A4D91] text-white rounded-lg font-semibold hover:bg-[#083d73] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageStockLevels;
