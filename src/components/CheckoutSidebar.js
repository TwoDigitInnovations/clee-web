import React from "react";
import { ShoppingCart, User, CreditCard, Search, X, Trash2 } from "lucide-react";

const CheckoutSidebar = ({
  selectedClient,
  setSelectedClient,
  showClientSearch,
  setShowClientSearch,
  clientSearchQuery,
  setClientSearchQuery,
  customers = [],
  selectedProducts = [],
  openProductDetail,
  savedSales = [],
  onLoadSale,
  onSaveSale,
  onDeleteSale,
  getTotal,
  getTotalWithOverallDiscount,
  overallDiscountValue,
  overallDiscountType,
  saleNote = "",
  onAddNote,
  onAddDiscount,
  onCheckout,
  onCompleteSale,
  showMobileCart,
  setShowMobileCart,
  selectedItems = [], // For updating items
  setSelectedItems, // For updating items
}) => {
  const [selectedProductDetail, setSelectedProductDetail] = React.useState(null);
  const [modalQuantity, setModalQuantity] = React.useState(1);
  const [modalDiscount, setModalDiscount] = React.useState("no-discount");
  const [discountType, setDiscountType] = React.useState("percentage");
  const [discountValue, setDiscountValue] = React.useState("");

  const handleProductClick = (product) => {
    setSelectedProductDetail(product);
    setModalQuantity(product.quantity || 1);
    setModalDiscount("no-discount");
    setDiscountType("percentage");
    setDiscountValue("");
  };

  const closeProductDetail = () => {
    setSelectedProductDetail(null);
  };

  const calculateDiscountedPrice = () => {
    if (!selectedProductDetail) return 0;
    if (modalDiscount === "no-discount" || !discountValue) {
      return selectedProductDetail.price * modalQuantity;
    }
    
    const basePrice = selectedProductDetail.price * modalQuantity;
    if (discountType === "percentage") {
      const discount = (basePrice * parseFloat(discountValue)) / 100;
      return basePrice - discount;
    } else {
      return basePrice - parseFloat(discountValue);
    }
  };

  const saveProductToCart = () => {
    if (selectedProductDetail && setSelectedItems) {
      const existing = selectedItems.find(p => p.id === selectedProductDetail.id);
      if (existing) {
        setSelectedItems(selectedItems.map(p => 
          p.id === selectedProductDetail.id ? { ...p, quantity: modalQuantity, discount: modalDiscount } : p
        ));
      } else {
        setSelectedItems([...selectedItems, { ...selectedProductDetail, quantity: modalQuantity, discount: modalDiscount }]);
      }
      closeProductDetail();
    }
  };

  const removeFromCart = () => {
    if (selectedProductDetail && setSelectedItems) {
      setSelectedItems(selectedItems.filter(p => p.id !== selectedProductDetail.id));
      closeProductDetail();
    }
  };

  const filteredClients = Array.isArray(customers)
    ? customers.filter(
        (client) =>
          client.fullname?.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
          client.mobile?.includes(clientSearchQuery) ||
          client.email?.toLowerCase().includes(clientSearchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto max-h-screen">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart className="text-[#0A4D91]" size={24} />
          <div>
            <h3 className="text-lg font-bold text-[#0A4D91]">Current Sale</h3>
            <p className="text-xs text-gray-500">New Session</p>
          </div>
        </div>

        {/* Select Client Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <User className="text-[#0A4D91]" size={20} />
            <h4 className="font-semibold text-gray-900">Select Client</h4>
          </div>
          {!selectedClient ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-3">No client selected for this transaction</p>
              <button
                onClick={() => setShowClientSearch(true)}
                className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 mx-auto"
              >
                <Search size={16} />
                Find Client
              </button>
            </div>
          ) : (
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{selectedClient.fullname || selectedClient.name}</p>
                  <p className="text-sm text-gray-500">{selectedClient.mobile || selectedClient.phone}</p>
                </div>
                <button onClick={() => setSelectedClient(null)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Products Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="text-[#0A4D91]" size={20} />
            <h4 className="font-semibold text-gray-900">Selected Items</h4>
          </div>
          {selectedProducts.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <ShoppingCart size={48} className="mx-auto mb-2 opacity-20 text-gray-400" />
              <p className="text-sm text-gray-500">No items added yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-[#0A4D91] transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <ShoppingCart size={20} className="text-gray-400 mt-1" />
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      <p className="font-semibold text-sm text-gray-900 mb-1">{product.name}</p>
                      <p className="text-xs text-gray-500 italic">Qty: {product.quantity || 1}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-lg text-gray-900">${(product.price * (product.quantity || 1)).toFixed(2)}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItems && setSelectedItems(selectedItems.filter(item => item.id !== product.id));
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Sales Section */}
        {savedSales && savedSales.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="text-[#0A4D91]" size={20} />
              <h4 className="font-semibold text-gray-900">Saved Sales</h4>
            </div>
            <div className="space-y-2">
              {savedSales.map((sale, index) => (
                <div
                  key={sale.id || index}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 border border-transparent hover:border-[#0A4D91] transition-colors group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => onLoadSale && onLoadSale(sale)}
                    >
                      <p className="font-semibold text-sm text-gray-900">
                        {sale.client?.fullname || sale.client?.name || "Walk-in Customer"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {sale.date} • {sale.items?.length || 0} items
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#0A4D91]">
                        ${(sale.total || 0).toFixed(2)}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this saved sale?')) {
                            onDeleteSale && onDeleteSale(sale.id);
                          }
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sale Note Section */}
        {saleNote && (
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-yellow-800 uppercase mb-1">Sale Note</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{saleNote}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Total Section */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">SUBTOTAL</span>
            <span className="font-semibold text-gray-600">${getTotal().toFixed(2)}</span>
          </div>
          {overallDiscountValue && (
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">DISCOUNT</span>
              <span className="font-semibold text-red-500">
                -{overallDiscountType === "percentage" ? `${overallDiscountValue}%` : `$${overallDiscountValue}`}
              </span>
            </div>
          )}
          <div className="flex justify-between mb-4">
            <span className="text-sm text-gray-600">TAX</span>
            <span className="font-semibold text-gray-600">$0.00</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-[#0A4D91]">${getTotalWithOverallDiscount().toFixed(2)}</span>
          </div>
          <div className="flex gap-2 mb-4">
            <button
              onClick={onAddNote}
              className="flex-1 text-sm text-[#0A4D91] hover:underline py-2 border border-[#0A4D91] rounded-lg hover:bg-blue-50 transition-colors"
            >
              Add note
            </button>
            <button
              onClick={onAddDiscount}
              className="flex-1 text-sm text-[#0A4D91] hover:underline py-2 border border-[#0A4D91] rounded-lg hover:bg-blue-50 transition-colors"
            >
              Add discount
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <button
          disabled={selectedProducts.length === 0}
          onClick={onCheckout}
          className="w-full bg-[#0A4D91] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#083d73] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-3"
        >
          Checkout
        </button>
        <button
          onClick={onCompleteSale}
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          COMPLETE SALE
        </button>
      </div>

      {/* Mobile Cart Button - Fixed at bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
        <button
          onClick={() => setShowMobileCart(true)}
          className="w-full bg-[#0A4D91] text-white py-4 rounded-lg font-bold text-lg flex items-center justify-between px-6"
        >
          <div className="flex items-center gap-2">
            <ShoppingCart size={24} />
            <span>View Cart</span>
            {selectedProducts.length > 0 && (
              <span className="bg-white text-[#0A4D91] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {selectedProducts.length}
              </span>
            )}
          </div>
          <span className="text-xl font-bold">${getTotal().toFixed(2)}</span>
        </button>
      </div>

      {/* Mobile Cart Overlay */}
      {showMobileCart && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowMobileCart(false)} />
          <div className="lg:hidden fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="text-[#0A4D91]" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-[#0A4D91]">Current Sale</h3>
                  <p className="text-xs text-gray-500">New Session</p>
                </div>
              </div>
              <button onClick={() => setShowMobileCart(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Select Client Section - Mobile */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <User className="text-[#0A4D91]" size={20} />
                  <h4 className="font-semibold text-gray-900">Select Client</h4>
                </div>
                {!selectedClient ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-3">No client selected for this transaction</p>
                    <button
                      onClick={() => {
                        setShowClientSearch(true);
                        setShowMobileCart(false);
                      }}
                      className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 mx-auto"
                    >
                      <Search size={16} />
                      Find Client
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{selectedClient.fullname || selectedClient.name}</p>
                        <p className="text-sm text-gray-500">{selectedClient.mobile || selectedClient.phone}</p>
                      </div>
                      <button onClick={() => setSelectedClient(null)} className="p-1 hover:bg-gray-100 rounded-full">
                        <X size={18} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Products Section - Mobile */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingCart className="text-[#0A4D91]" size={20} />
                  <h4 className="font-semibold text-gray-900">Selected Items</h4>
                </div>
                {selectedProducts.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <ShoppingCart size={48} className="mx-auto mb-2 opacity-20 text-gray-400" />
                    <p className="text-sm text-gray-500">No items added yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="p-4 bg-white border border-gray-200 rounded-lg hover:border-[#0A4D91] transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          <ShoppingCart size={20} className="text-gray-400 mt-1" />
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => {
                              handleProductClick(product);
                              setShowMobileCart(false);
                            }}
                          >
                            <p className="font-semibold text-sm text-gray-900 mb-1">{product.name}</p>
                            <p className="text-xs text-gray-500 italic">Qty: {product.quantity || 1}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-lg text-gray-900">${(product.price * (product.quantity || 1)).toFixed(2)}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItems && setSelectedItems(selectedItems.filter(item => item.id !== product.id));
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Saved Sales Section - Mobile */}
              {savedSales && savedSales.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="text-[#0A4D91]" size={20} />
                    <h4 className="font-semibold text-gray-900">Saved Sales</h4>
                  </div>
                  <div className="space-y-2">
                    {savedSales.map((sale, index) => (
                      <div
                        key={sale.id || index}
                        className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 border border-transparent hover:border-[#0A4D91] transition-colors group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => {
                              onLoadSale && onLoadSale(sale);
                              setShowMobileCart(false);
                            }}
                          >
                            <p className="font-semibold text-sm text-gray-900">
                              {sale.client?.fullname || sale.client?.name || "Walk-in Customer"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {sale.date} • {sale.items?.length || 0} items
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-[#0A4D91]">
                              ${(sale.total || 0).toFixed(2)}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to delete this saved sale?')) {
                                  onDeleteSale && onDeleteSale(sale.id);
                                }
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sale Note Section - Mobile */}
              {saleNote && (
                <div className="mb-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-yellow-800 uppercase mb-1">Sale Note</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{saleNote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Total Section - Mobile */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">SUBTOTAL</span>
                  <span className="font-semibold text-gray-600">${getTotal().toFixed(2)}</span>
                </div>
                {overallDiscountValue && (
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">DISCOUNT</span>
                    <span className="font-semibold text-red-500">
                      -{overallDiscountType === "percentage" ? `${overallDiscountValue}%` : `$${overallDiscountValue}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-gray-600">TAX</span>
                  <span className="font-semibold text-gray-600">$0.00</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#0A4D91]">${getTotalWithOverallDiscount().toFixed(2)}</span>
                </div>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => {
                      onAddNote();
                      setShowMobileCart(false);
                    }}
                    className="flex-1 text-sm text-[#0A4D91] hover:underline py-2 border border-[#0A4D91] rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Add note
                  </button>
                  <button
                    onClick={() => {
                      onAddDiscount();
                      setShowMobileCart(false);
                    }}
                    className="flex-1 text-sm text-[#0A4D91] hover:underline py-2 border border-[#0A4D91] rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Add discount
                  </button>
                </div>
              </div>

              {/* Action Buttons - Mobile */}
              <button
                disabled={selectedProducts.length === 0}
                onClick={() => {
                  onCheckout();
                  setShowMobileCart(false);
                }}
                className="w-full bg-[#0A4D91] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#083d73] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-3"
              >
                Checkout
              </button>
              <button
                onClick={() => {
                  onCompleteSale();
                  setShowMobileCart(false);
                }}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                COMPLETE SALE
              </button>
            </div>
          </div>
        </>
      )}

     
      {showClientSearch && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowClientSearch(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-50 w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Select client</h3>
                <button onClick={() => setShowClientSearch(false)} className="p-2 hover:bg-gray-400 text-gray-500 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
                <input
                  type="text"
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                  placeholder="Search clients..."
                  className="w-full pl-10 text-gray-700 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                  autoFocus
                />
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredClients.map((client) => (
                  <div
                    key={client._id || client.id}
                    onClick={() => {
                      setSelectedClient(client);
                      setShowClientSearch(false);
                      setClientSearchQuery("");
                    }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-[#0A4D91] hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <p className="font-semibold text-gray-900">{client.fullname || client.name}</p>
                    <p className="text-sm text-gray-500">{client.mobile || client.phone}</p>
                  </div>
                ))}
                {filteredClients.length === 0 && <p className="text-center text-gray-500 py-8">No clients found</p>}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Product Detail Modal */}
      {selectedProductDetail && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeProductDetail}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-50 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <button
              onClick={closeProductDetail}
              className="absolute top-4 right-4 z-10 p-2 bg-white hover:bg-gray-100 rounded-full transition-colors shadow-md"
            >
              <X size={20} className="text-gray-600" />
            </button>

            <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
              {/* Conditionally show image only for products, not for services */}
              {selectedProductDetail.image && (
                <div className="w-full bg-gray-50 rounded-xl overflow-hidden mb-4 p-6 flex items-center justify-center" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={selectedProductDetail.image}
                    alt={selectedProductDetail.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x400?text=Product+Image';
                    }}
                  />
                </div>
              )}

              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2 font-medium">ITEM DETAILS</p>
              <h2 className="text-xl font-bold text-[#0A4D91] mb-5 leading-snug">{selectedProductDetail.name}</h2>

              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-[#0A4D91] uppercase">Quantity</label>
                  <label className="text-xs font-bold text-[#0A4D91] uppercase">Price</label>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 hover:border-[#0A4D91] rounded text-[#0A4D91] font-bold text-xl transition-colors"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-[#0A4D91] w-12 text-center">{modalQuantity}</span>
                    <button
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 hover:border-[#0A4D91] rounded text-[#0A4D91] font-bold text-xl transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-2xl font-bold text-[#0A4D91]">$ {(selectedProductDetail.price || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-5">
                <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Discount</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                    </svg>
                  </div>
                  <select
                    value={modalDiscount}
                    onChange={(e) => {
                      setModalDiscount(e.target.value);
                      if (e.target.value === "no-discount") {
                        setDiscountValue("");
                      }
                    }}
                    className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-[#0A4D91] focus:border-[#0A4D91] outline-none text-gray-600 text-sm"
                  >
                    <option value="no-discount">No discount</option>
                    <option value="discount">Discount</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {modalDiscount === "discount" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        onClick={() => setDiscountType("percentage")}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          discountType === "percentage"
                            ? "bg-[#0A4D91] text-white"
                            : "bg-white text-gray-600 border border-gray-300"
                        }`}
                      >
                        %
                      </button>
                      <button
                        onClick={() => setDiscountType("fixed")}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          discountType === "fixed"
                            ? "bg-[#0A4D91] text-white"
                            : "bg-white text-gray-600 border border-gray-300"
                        }`}
                      >
                        $
                      </button>
                      <input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        placeholder="0"
                        className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-center font-bold text-gray-900 focus:ring-2 focus:ring-[#0A4D91] focus:border-[#0A4D91] outline-none"
                      />
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Original Price:</span>
                        <span className="font-medium">${((selectedProductDetail.price || 0) * modalQuantity).toFixed(2)}</span>
                      </div>
                      {discountValue && (
                        <>
                          <div className="flex justify-between text-gray-600">
                            <span>Discount:</span>
                            <span className="font-medium text-red-500">
                              -{discountType === "percentage" ? `${discountValue}%` : `$${discountValue}`}
                            </span>
                          </div>
                          <div className="flex justify-between text-lg font-bold text-[#0A4D91] pt-2 border-t border-gray-300">
                            <span>Final Price:</span>
                            <span>${calculateDiscountedPrice().toFixed(2)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={saveProductToCart}
                className="w-full bg-[#0A4D91] text-white py-3.5 rounded-lg font-bold text-base hover:bg-[#083d73] transition-colors mb-3"
              >
                Save
              </button>

              <button
                onClick={removeFromCart}
                className="w-full text-red-500 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove from sale
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CheckoutSidebar;
