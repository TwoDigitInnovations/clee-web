import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import { ChevronDown, Plus, Minus, ArrowLeft, X, Search } from "lucide-react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuppliers } from "@/redux/actions/supplierActions";
import { createStockOrder } from "@/redux/actions/stockOrderActions";
import { clearSupplierProducts } from "@/redux/slices/stockOrderSlice";
import { Api } from "@/services/service";
import Swal from "sweetalert2";

function NewStockOrder() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { suppliers } = useSelector((state) => state.supplier);
  const { loading } = useSelector((state) => state.stockOrder);
  
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [notes, setNotes] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    dispatch(fetchSuppliers(router));
    generateOrderNumber();
  }, []);

 
  useEffect(() => {
    const { editMode, supplier, orderNumber: orderNum, existingItems, notes: orderNotes } = router.query;
    
    if (editMode === 'true' && supplier && existingItems) {
      try {
        setSelectedSupplier(supplier);
        setOrderNumber(orderNum || '');
        setNotes(orderNotes || '');
        
        const parsedItems = JSON.parse(existingItems);
        setOrderItems(parsedItems);
      } catch (error) {
        console.error("Error loading edit data:", error);
      }
    }
  }, [router.query, suppliers]);

  const generateOrderNumber = async () => {
    try {
      const response = await Api("GET", "stock-orders", {}, router);
      const orders = response.data?.data || [];
      
      // Find the highest order number
      let maxOrderNumber = 0;
      orders.forEach(order => {
        const orderNum = parseInt(order.orderNumber);
        if (!isNaN(orderNum) && orderNum > maxOrderNumber) {
          maxOrderNumber = orderNum;
        }
      });
      
      setOrderNumber(maxOrderNumber + 1);
    } catch (error) {
    
      setOrderNumber(Date.now().toString().slice(-6));
    }
  };

  useEffect(() => {
    if (selectedSupplier) {
      fetchSupplierProducts();
    } else {
      setSupplierProducts([]);
      setOrderItems([]);
    }
  }, [selectedSupplier]);

  const fetchSupplierProducts = async () => {
    try {
      setLoadingProducts(true);
      const supplier = suppliers.find(s => s._id === selectedSupplier);
      if (!supplier) return;

      const response = await Api("GET", "products", {}, router);
      const allProducts = response.data?.data || [];
      
      const filtered = allProducts.filter(
        product => product.primarySupplier === supplier.businessName
      );
      
      setSupplierProducts(filtered);
    } catch (error) {
      console.error("Error fetching products:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to fetch products',
        confirmButtonColor: '#0A4D91',
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  const addToOrder = (product) => {
    const existingItem = orderItems.find(item => item.product === product._id);
    if (existingItem) {
      setOrderItems(orderItems.map(item => 
        item.product === product._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        product: product._id,
        productName: product.productName,
        quantity: 1,
        unitPrice: product.costPrice || 0,
        photo: product.photo,
        skuHandle: product.skuHandle,
      }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromOrder(productId);
      return;
    }
    setOrderItems(orderItems.map(item => 
      item.product === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromOrder = (productId) => {
    setOrderItems(orderItems.filter(item => item.product !== productId));
  };

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  const getTotalItems = () => {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleReviewOrder = () => {
    if (!selectedSupplier) {
      Swal.fire({
        icon: 'warning',
        title: 'No Supplier Selected',
        text: 'Please select a supplier',
        confirmButtonColor: '#0A4D91',
      });
      return;
    }
    if (orderItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Items',
        text: 'Please add at least one item to the order',
        confirmButtonColor: '#0A4D91',
      });
      return;
    }
    router.push({
      pathname: '/stock/ReviewStockOrder',
      query: {
        supplier: selectedSupplier,
        orderNumber: orderNumber,
        items: JSON.stringify(orderItems),
        notes: notes,
      }
    });
  };

  const selectedSupplierData = suppliers.find(s => s._id === selectedSupplier);

  const filteredProducts = supplierProducts.filter(product =>
    product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.skuHandle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockLevel = (product) => {
    if (!product.trackStock) return "Unlimited";
    const totalStock = product.locations?.reduce((sum, loc) => sum + (loc.available || 0), 0) || 0;
    return totalStock;
  };

  return (
    <>
      <DashboardHeader title="Stock" />

      <div className="min-h-screen bg-[#f0f1f5] text-slate-800 px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/stock/StockOrders')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Cancel</span>
            </button>
            
            <button
              onClick={handleReviewOrder}
              disabled={orderItems.length === 0}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
                orderItems.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#0A4D91] text-white hover:bg-[#083d73]'
              }`}
            >
              Review order: {getTotalItems()}
            </button>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">NEW STOCK ORDER</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Supplier Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    From
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSupplier}
                      onChange={(e) => setSelectedSupplier(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none appearance-none cursor-pointer text-gray-700"
                    >
                      <option value="">Select supplier...</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier._id} value={supplier._id}>
                          {supplier.businessName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {selectedSupplier && (
                    <label className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={true}
                        readOnly
                        className="w-4 h-4 text-[#0A4D91] border-gray-300 rounded focus:ring-[#0A4D91]"
                      />
                      Only show products for this supplier
                    </label>
                  )}
                </div>

                {/* Order Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Order number
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Search Products */}
              {selectedSupplier && (
                <div className="mt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                    />
                  </div>
                  
                  {supplierProducts.length > 0 && (
                    <button
                      onClick={() => {
                        supplierProducts.forEach(product => addToOrder(product));
                      }}
                      className="mt-3 text-sm text-[#0A4D91] hover:text-[#083d73] font-semibold"
                    >
                      Add all to order
                    </button>
                  )}
                </div>
              )}
            </div>


            {/* Products Table */}
            {selectedSupplier && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#E2E8F0] border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Stock levels</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cost</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loadingProducts ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                          Loading products...
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                          {searchQuery ? 'No products found matching your search' : 'No products available for this supplier'}
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => {
                        const orderItem = orderItems.find(item => item.product === product._id);
                        const quantity = orderItem?.quantity || 0;
                        const total = quantity * (product.costPrice || 0);

                        return (
                          <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.photo || "https://via.placeholder.com/48/4A90A4/ffffff?text=P"}
                                  alt={product.productName}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                  <p className="font-semibold text-sm text-gray-900">{product.productName}</p>
                                  <p className="text-xs text-gray-500">{product.skuHandle || '-'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 hidden md:table-cell">
                              <p className="text-sm text-gray-600">{getStockLevel(product)} / 1</p>
                            </td>
                            <td className="px-4 py-4">
                              {quantity > 0 ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => updateQuantity(product._id, quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                  >
                                    <Minus className="w-4 h-4 text-gray-600" />
                                  </button>
                                  <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => updateQuantity(product._id, parseInt(e.target.value) || 0)}
                                    className="w-16 px-2 py-1 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                                    min="0"
                                  />
                                  <button
                                    onClick={() => updateQuantity(product._id, quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                  >
                                    <Plus className="w-4 h-4 text-gray-600" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToOrder(product)}
                                  className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                                >
                                  Add to order
                                </button>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <p className="text-sm text-gray-900">${(product.costPrice || 0).toFixed(2)}</p>
                            </td>
                            <td className="px-4 py-4">
                              <p className="text-sm font-semibold text-gray-900">
                                {quantity > 0 ? `$${total.toFixed(2)}` : '$0'}
                              </p>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {!selectedSupplier && (
              <div className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChevronDown className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a supplier to get started</h3>
                  <p className="text-gray-500 text-sm">Choose a supplier from the dropdown above to view their products</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default NewStockOrder;
