import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import { ShoppingCart, Store, X, MoreVertical, Edit2, Trash2, ChevronDown } from "lucide-react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuppliers } from "@/redux/actions/supplierActions";
import { fetchStockOrders, deleteStockOrder } from "@/redux/actions/stockOrderActions";
import Swal from "sweetalert2";

function StockOrders() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { suppliers } = useSelector((state) => state.supplier);
  const { stockOrders, loading } = useSelector((state) => state.stockOrder);
  const [showModal, setShowModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchSuppliers(router));
    dispatch(fetchStockOrders(router));
  }, []);

  const handleNewStockOrder = () => {
    if (suppliers.length === 0) {
      setShowModal(true);
    } else {
      router.push('/stock/NewStockOrder');
    }
  };

  const handleDeleteOrder = async (orderId) => {
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
        const deleteResult = await dispatch(deleteStockOrder(orderId, router));
        if (deleteResult.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Order has been deleted.',
            confirmButtonColor: '#0A4D91',
          });
          dispatch(fetchStockOrders(router));
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete order',
          confirmButtonColor: '#0A4D91',
        });
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'DRAFT' },
      sent: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'SENT' },
      received: { bg: 'bg-green-100', text: 'text-green-700', label: 'RECEIVED' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'CANCELLED' },
    };
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const filteredOrders = filterStatus === 'all' 
    ? stockOrders 
    : stockOrders.filter(order => order.status === filterStatus);

  const hasOrders = stockOrders.length > 0;

  const handleCreateSupplier = () => {
    setShowModal(false);
    router.push("/addsuppliers");
  };

  return (
    <>
      <DashboardHeader title="Stock" />

      <div className="min-h-screen bg-[#f0f1f5] text-slate-800 px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#0A4D91] mb-2">Stock Orders</h1>
              <p className="text-gray-500">Easily create, send and receive orders.</p>
            </div>
            <button
              onClick={handleNewStockOrder}
              className="bg-[#0A4D91] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#083d73] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <ShoppingCart className="w-5 h-5" />
              New stock order
            </button>
          </div>

          {hasOrders ? (
            /* Orders Table */
            <div className="bg-white rounded-xl shadow-sm">
              {/* Success Message */}
              <div className="p-4 bg-green-50 border-b border-green-100">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-green-800 font-semibold text-sm">Stock received!</h3>
                    <p className="text-green-700 text-sm">Added 1 item of new stock at Chebo Clinic.</p>
                  </div>
                </div>
              </div>

              {/* Filter */}
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="relative max-w-xs">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none appearance-none cursor-pointer"
                  >
                    <option value="all">All orders</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="received">Received</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#E2E8F0] border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">From supplier</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">For location</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Detail</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Sent</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                          Loading orders...
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr 
                          key={order._id} 
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => router.push(`/stock/OrderDetails?id=${order._id}`)}
                        >
                          <td className="px-4 py-4">
                            <p className="font-semibold text-sm text-gray-900">{order.orderNumber}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-gray-900">{order.supplierName}</p>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <p className="text-sm text-gray-600">Chebo Clinic</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-gray-600">
                              {order.items?.length} products ({order.items?.reduce((sum, item) => sum + item.quantity, 0)} items)
                            </p>
                            <p className="text-sm font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                          </td>
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <p className="text-sm text-gray-600">
                              {order.sentAt ? new Date(order.sentAt).toLocaleDateString('en-US', { 
                                day: 'numeric', 
                                month: 'short' 
                              }) : '-'}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="relative flex justify-center action-menu-container">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowActionMenu(showActionMenu === order._id ? null : order._id);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                              </button>
                              
                              {showActionMenu === order._id && (
                                <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/stock/OrderDetails?id=${order._id}`);
                                      setShowActionMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700 border-b border-gray-100 flex items-center gap-2 rounded-t-lg"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                    View/Edit Order
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteOrder(order._id);
                                      setShowActionMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm font-medium text-red-600 flex items-center gap-2 rounded-b-lg"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Order
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

              {/* Footer */}
              <div className="px-4 py-4 bg-[#E2E8F0] border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {filteredOrders.length} of {stockOrders.length} orders
                </p>
              </div>
            </div>
          ) : (
          
            <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12">
              <div className="max-w-2xl mx-auto text-center">
                <div className="flex justify-center mb-8">
                  <img 
                    src="/images/phones.png" 
                    alt="Stock Orders" 
                    className="w-64 h-64 sm:w-80 sm:h-80 object-contain"
                  />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-[#0A4D91] mb-3">
                  Stock running low?
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                  Easily create, send and receive orders.
                </p>

                <button
                  onClick={handleNewStockOrder}
                  className="bg-[#0A4D91] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#083d73] transition-colors inline-flex items-center gap-2 mb-4"
                >
                  <ShoppingCart className="w-5 h-5" />
                  New stock order
                </button>

                <p className="text-gray-400 text-sm uppercase tracking-wide">
                  Start by adding your first supplier
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* No Supplier Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
         
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Store className="w-10 h-10 text-[#0A4D91]" />
              </div>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
              First up, you'll need to add a supplier
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Once you add a supplier you can carry on creating stock orders.
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCreateSupplier}
                className="w-full bg-[#0A4D91] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#083d73] transition-colors"
              >
                Create supplier
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full text-[#0A4D91] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StockOrders;
