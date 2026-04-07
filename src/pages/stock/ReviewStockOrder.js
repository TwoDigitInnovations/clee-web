import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Minus, X } from "lucide-react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { createStockOrder } from "@/redux/actions/stockOrderActions";
import Swal from "sweetalert2";

function ReviewStockOrder() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { suppliers } = useSelector((state) => state.supplier);
  const { loading } = useSelector((state) => state.stockOrder);
  
  const [orderItems, setOrderItems] = useState([]);
  const [notes, setNotes] = useState('');
  const [supplier, setSupplier] = useState(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(false);

  useEffect(() => {
    const { supplier: supplierId, orderNumber: orderNum, items, notes: orderNotes } = router.query;
    
    if (!supplierId || !items) {
      router.push('/stock/NewStockOrder');
      return;
    }

    try {
      const parsedItems = JSON.parse(items);
      setOrderItems(parsedItems);
      setOrderNumber(orderNum || '');
      setNotes(orderNotes || '');
      
      const supplierData = suppliers.find(s => s._id === supplierId);
      setSupplier(supplierData);
    } catch (error) {
      console.error("Error parsing order data:", error);
      router.push('/stock/NewStockOrder');
    }
  }, [router.query, suppliers]);

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
    const updatedItems = orderItems.filter(item => item.product !== productId);
    setOrderItems(updatedItems);
    
    if (updatedItems.length === 0) {
      router.push('/stock/NewStockOrder');
    }
  };

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  const getTotalItems = () => {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCreateOrder = async () => {
    try {
      const orderData = {
        supplier: supplier._id,
        items: orderItems.map(item => ({
          product: item.product,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        notes: notes,
      };

      const result = await dispatch(createStockOrder(orderData, router));
      
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Order Created!',
          text: 'Stock order has been created successfully',
          confirmButtonColor: '#0A4D91',
        }).then(() => {
          router.push(`/stock/OrderDetails?id=${result.data._id}`);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: result.message || 'Failed to create order',
          confirmButtonColor: '#0A4D91',
        });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to create order',
        confirmButtonColor: '#0A4D91',
      });
    }
  };

  const handleAddMoreToOrder = () => {
    router.push({
      pathname: '/stock/NewStockOrder',
      query: {
        supplier: supplier._id,
        orderNumber: orderNumber,
        existingItems: JSON.stringify(orderItems),
        notes: notes,
      }
    });
  };

  if (!supplier) {
    return (
      <>
        <DashboardHeader title="Stock" />
        <div className="min-h-screen bg-[#f0f1f5] flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title="Stock" />

      <div className="min-h-screen bg-[#f0f1f5] text-slate-800 px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleAddMoreToOrder}
              className="flex items-center gap-2 text-[#0A4D91] hover:text-[#083d73] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Add more to order</span>
            </button>
            
            <button
              onClick={handleCreateOrder}
              disabled={loading || orderItems.length === 0}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
                loading || orderItems.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#0A4D91] text-white hover:bg-[#083d73]'
              }`}
            >
              {loading ? 'Creating...' : 'Create order'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <h1 className="text-xl font-bold text-gray-600 mb-6 text-center uppercase tracking-wide">
              REVIEW ORDER
            </h1>

            <div className="mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Stock order #{orderNumber}
                  </h2>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Supplier</span>
                    </p>
                    <p className="text-base font-semibold text-gray-900">{supplier.businessName}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date().toLocaleDateString('en-US', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold">Deliver to</p>
                    <p className="font-bold text-gray-900">Chebo Clinic</p>
                    <p className="text-xs mt-1">59 Montgomery Street Kogarah</p>
                    <p className="text-xs">Sydney</p>
                    <p className="text-xs">NSW</p>
                    <p className="text-xs">Sydney 2217</p>
                    <p className="text-xs">DM Instagram</p>
                  </div>
                </div>
              </div>

              {!showNotesInput && !notes && (
                <button
                  onClick={() => setShowNotesInput(true)}
                  className="text-sm text-[#0A4D91] hover:text-[#083d73] font-semibold"
                >
                  + Add a note (optional)
                </button>
              )}

              {(showNotesInput || notes) && (
                <div className="mt-4">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any special instructions or notes..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none resize-none"
                    rows="3"
                  />
                </div>
              )}
            </div>


            <div className="overflow-x-auto mb-6">
              <table className="w-full">
                <thead className="border-b-2 border-gray-200">
                  <tr>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden sm:table-cell">Stock levels</th>
                    <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Order</th>
                    <th className="px-2 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Cost</th>
                    <th className="px-2 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orderItems.map((item) => {
                    const total = item.quantity * item.unitPrice;
                    
                    return (
                      <tr key={item.product} className="hover:bg-gray-50">
                        <td className="px-2 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.photo || "https://via.placeholder.com/48/4A90A4/ffffff?text=P"}
                              alt={item.productName}
                              className="w-12 h-12 rounded-lg object-cover bg-pink-100"
                            />
                            <div>
                              <p className="font-semibold text-sm text-gray-900">{item.productName}</p>
                              <p className="text-xs text-gray-500">{item.skuHandle || '-'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-4 hidden sm:table-cell">
                          <p className="text-sm text-gray-600">5 / 1</p>
                        </td>
                        <td className="px-2 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product, parseInt(e.target.value) || 0)}
                              className="w-12 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none text-sm"
                              min="0"
                            />
                            <button
                              onClick={() => updateQuantity(item.product, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Plus className="w-3 h-3 text-gray-600" />
                            </button>
                            <button
                              onClick={() => removeFromOrder(item.product)}
                              className="w-7 h-7 flex items-center justify-center text-red-600 hover:bg-red-50 rounded transition-colors ml-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-2 py-4 text-right">
                          <p className="text-sm text-gray-900">${item.unitPrice.toFixed(2)}</p>
                        </td>
                        <td className="px-2 py-4 text-right">
                          <p className="text-sm font-semibold text-gray-900">${total.toFixed(2)}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t-2 border-gray-200 pt-4">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">
                  {getTotalItems()} products ({orderItems.length} items)
                </span>
                <span className="text-xl font-bold text-gray-900">${getTotalAmount().toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={() => router.push('/stock/NewStockOrder')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={loading || orderItems.length === 0}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  loading || orderItems.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#0A4D91] text-white hover:bg-[#083d73]'
                }`}
              >
                {loading ? 'Creating...' : 'Create order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewStockOrder;
