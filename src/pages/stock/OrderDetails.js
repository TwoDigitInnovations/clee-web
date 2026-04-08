import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Send, Download, X } from "lucide-react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { getStockOrderById, sendStockOrder, receiveStockOrder } from "@/redux/actions/stockOrderActions";
import Swal from "sweetalert2";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function OrderDetails() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendData, setSendData] = useState({ email: '', name: '' });
  const [sendLoading, setSendLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const { id } = router.query;
    if (id) {
      fetchOrderDetails(id);
    }
  }, [router.query]);

  const fetchOrderDetails = async (id) => {
    try {
      setLoading(true);
      const result = await dispatch(getStockOrderById(id, router));
      if (result.success) {
        setOrder(result.data);
        if (result.data.supplier?.email) {
          setSendData({
            email: result.data.supplier.email,
            name: result.data.supplier.contactFirstName || result.data.supplier.businessName,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to fetch order details',
        confirmButtonColor: '#0A4D91',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOrder = async () => {
    if (!sendData.email || !sendData.name) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in email and name',
        confirmButtonColor: '#0A4D91',
      });
      return;
    }

    try {
      setSendLoading(true);
      const result = await dispatch(sendStockOrder(order._id, sendData, router));
      
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Order Sent!',
          text: `Order has been sent to ${sendData.email}`,
          confirmButtonColor: '#0A4D91',
        });
        setShowSendModal(false);
        fetchOrderDetails(order._id);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: result.message || 'Failed to send order',
          confirmButtonColor: '#0A4D91',
        });
      }
    } catch (error) {
      console.error("Error sending order:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to send order',
        confirmButtonColor: '#0A4D91',
      });
    } finally {
      setSendLoading(false);
    }
  };

  const handleReceiveStock = async () => {
    const result = await Swal.fire({
      title: 'Receive Stock?',
      text: 'This will update inventory levels for all items in this order',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0A4D91',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, receive stock'
    });

    if (result.isConfirmed) {
      try {
        const receiveResult = await dispatch(receiveStockOrder(order._id, router));
        
        if (receiveResult.success) {
          Swal.fire({
            icon: 'success',
            title: 'Stock Received!',
            text: 'Inventory has been updated successfully',
            confirmButtonColor: '#0A4D91',
          });
          fetchOrderDetails(order._id);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: receiveResult.message || 'Failed to receive stock',
            confirmButtonColor: '#0A4D91',
          });
        }
      } catch (error) {
        console.error("Error receiving stock:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to receive stock',
          confirmButtonColor: '#0A4D91',
        });
      }
    }
  };

  const getTotalItems = () => {
    return order?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = 20;

      pdf.setFillColor(10, 77, 145);
      pdf.rect(0, 0, pageWidth, 30, 'F');
      
      pdf.setFontSize(20);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`Stock Order #${order.orderNumber}`, pageWidth / 2, 18, { align: 'center' });
      
      yPosition = 45;

      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`, margin, yPosition);
      yPosition += 5;
      pdf.text(`Supplier: ${order.supplierName}`, margin, yPosition);

      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Deliver to:', pageWidth - margin - 50, 45);
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(9);
      pdf.text('Chebo Clinic', pageWidth - margin - 50, 50);
      pdf.text('59 Montgomery Street Kogarah', pageWidth - margin - 50, 55);
      pdf.text('Sydney, NSW 2217', pageWidth - margin - 50, 60);
      pdf.text('DM Instagram', pageWidth - margin - 50, 65);

      yPosition = 75;

      if (order.notes) {
        pdf.setFillColor(250, 250, 250);
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, 15, 'F');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Notes:', margin + 3, yPosition + 5);
        pdf.setTextColor(80, 80, 80);
        const splitNotes = pdf.splitTextToSize(order.notes, pageWidth - 2 * margin - 6);
        pdf.text(splitNotes, margin + 3, yPosition + 10);
        yPosition += 20;
      }

      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
      
      pdf.setFontSize(9);
      pdf.setTextColor(80, 80, 80);
      pdf.setFont(undefined, 'bold');
      pdf.text('PRODUCT', margin + 25, yPosition + 5);
      pdf.text('QTY', pageWidth - 80, yPosition + 5);
      pdf.text('UNIT COST', pageWidth - 55, yPosition + 5);
      pdf.text('TOTAL', pageWidth - margin - 5, yPosition + 5, { align: 'right' });
      yPosition += 12;

      pdf.setFont(undefined, 'normal');

      for (const item of order.items) {
        const productImage = item.product?.photo;
        
        if (productImage) {
          try {
            const imgData = await loadImage(productImage);
            pdf.addImage(imgData, 'JPEG', margin + 2, yPosition - 2, 20, 20);
          } catch (error) {
            pdf.setDrawColor(220, 220, 220);
            pdf.rect(margin + 2, yPosition - 2, 20, 20);
          }
        } else {
          pdf.setDrawColor(220, 220, 220);
          pdf.rect(margin + 2, yPosition - 2, 20, 20);
        }

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(item.productName, margin + 25, yPosition + 5);
        
        if (item.product?.skuHandle) {
          pdf.setFontSize(8);
          pdf.setTextColor(140, 140, 140);
          pdf.text(`SKU: ${item.product.skuHandle}`, margin + 25, yPosition + 10);
        }

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(item.quantity.toString(), pageWidth - 80, yPosition + 8, { align: 'center' });
        pdf.text(`$${item.unitPrice.toFixed(2)}`, pageWidth - 55, yPosition + 8);
        pdf.setFont(undefined, 'bold');
        pdf.text(`$${item.totalPrice.toFixed(2)}`, pageWidth - margin - 5, yPosition + 8, { align: 'right' });
        pdf.setFont(undefined, 'normal');
        
        yPosition += 25;
      }

      yPosition += 5;
      pdf.setDrawColor(10, 77, 145);
      pdf.setLineWidth(0.8);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${getTotalItems()} products (${order.items?.length} items)`, margin, yPosition);
      
      pdf.setFontSize(14);
      pdf.setTextColor(10, 77, 145);
      pdf.setFont(undefined, 'bold');
      pdf.text(`Total: $${order.totalAmount.toFixed(2)}`, pageWidth - margin - 5, yPosition, { align: 'right' });

      pdf.save(`Stock-Order-${order.orderNumber}.pdf`);
      
      Swal.fire({
        icon: 'success',
        title: 'Downloaded!',
        text: 'PDF has been downloaded successfully',
        confirmButtonColor: '#0A4D91',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to generate PDF',
        confirmButtonColor: '#0A4D91',
      });
    } finally {
      setDownloading(false);
    }
  };

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  const handleEditOrder = () => {
  
    router.push({
      pathname: '/stock/NewStockOrder',
      query: {
        editMode: 'true',
        orderId: order._id,
        supplier: order.supplier._id,
        orderNumber: order.orderNumber,
        existingItems: JSON.stringify(order.items.map(item => ({
          product: item.product._id || item.product,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          photo: item.product?.photo || '',
          skuHandle: item.product?.skuHandle || '',
        }))),
        notes: order.notes,
      }
    });
  };

  if (loading) {
    return (
      <>
        <DashboardHeader title="Stock" />
        <div className="min-h-screen bg-[#f0f1f5] flex items-center justify-center">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <DashboardHeader title="Stock" />
        <div className="min-h-screen bg-[#f0f1f5] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Order not found</p>
            <button
              onClick={() => router.push('/stock/StockOrders')}
              className="text-[#0A4D91] hover:text-[#083d73] font-semibold"
            >
              Back to orders
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title="Stock" />

      <div className="min-h-screen bg-[#f0f1f5] text-slate-800 px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-green-800 font-semibold">Order created.</h3>
                <p className="text-green-700 text-sm mt-1">Send it when you're ready.</p>
                <p className="text-green-700 text-sm">Easily update stock levels when the order arrives, by tapping 'Receive stock'.</p>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/stock/StockOrders')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to orders</span>
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={handleEditOrder}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Edit Order
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className={`px-4 py-2 border border-gray-300 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                  downloading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Download className="w-4 h-4" />
                {downloading ? 'Downloading...' : 'Download'}
              </button>
              <button
                onClick={() => setShowSendModal(true)}
                className="px-4 py-2 bg-[#0A4D91] text-white rounded-lg font-semibold hover:bg-[#083d73] transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
              <button
                onClick={handleReceiveStock}
                disabled={order.status === 'received'}
                className={`px-4 py-2 border border-gray-300 rounded-lg font-semibold transition-colors ${
                  order.status === 'received'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {order.status === 'received' ? 'Stock Received' : 'Receive stock'}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
            {/* Order Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Stock order #{order.orderNumber}
                  </h2>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Supplier</span>
                    </p>
                    <p className="text-base font-semibold text-gray-900">{order.supplierName}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { 
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

              {/* Notes */}
              {order.notes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Notes:</p>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Order Items Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full">
                <thead className="border-b-2 border-gray-200">
                  <tr>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden sm:table-cell">Code</th>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">SKU</th>
                    <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                    <th className="px-2 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Unit cost</th>
                    <th className="px-2 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-2 py-4">
                        <p className="font-semibold text-sm text-gray-900">{item.productName}</p>
                      </td>
                      <td className="px-2 py-4 hidden sm:table-cell">
                        <p className="text-sm text-gray-600">345</p>
                      </td>
                      <td className="px-2 py-4 hidden md:table-cell">
                        <p className="text-sm text-gray-600">abc</p>
                      </td>
                      <td className="px-2 py-4 text-center">
                        <p className="text-sm text-gray-900">{item.quantity}</p>
                      </td>
                      <td className="px-2 py-4 text-right">
                        <p className="text-sm text-gray-900">${item.unitPrice.toFixed(2)}</p>
                      </td>
                      <td className="px-2 py-4 text-right">
                        <p className="text-sm font-semibold text-gray-900">${item.totalPrice.toFixed(2)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Summary */}
            <div className="border-t-2 border-gray-200 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {getTotalItems()} products ({order.items?.length} items)
                </span>
                <span className="text-xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Send stock order</h2>
              <button
                onClick={() => setShowSendModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To
                </label>
                <input
                  type="email"
                  value={sendData.email}
                  onChange={(e) => setSendData({ ...sendData, email: e.target.value })}
                  placeholder="james@gmail.com"
                  className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  From: Chebo Clinic
                </label>
                <p className="text-sm text-gray-500">Reply to: info@cheboclinic.com</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  defaultValue="Hi, We'd like to order some stock, please.\nAttached is an order sheet and our delivery information.\nThanks"
                  className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none resize-none"
                  rows="4"
                />
                <p className="text-xs text-gray-500 mt-1">Characters left: 0/21</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Options
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#0A4D91] border-gray-300 rounded focus:ring-[#0A4D91]"
                    />
                    Hide Prices
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#0A4D91] border-gray-300 rounded focus:ring-[#0A4D91]"
                    />
                    Hide SKUs
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowSendModal(false)}
                className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendOrder}
                disabled={sendLoading}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                  sendLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#0A4D91] text-white hover:bg-[#083d73]'
                }`}
              >
                <Send className="w-4 h-4" />
                {sendLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderDetails;
