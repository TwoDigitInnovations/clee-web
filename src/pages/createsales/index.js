import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import { Search, Package, X } from "lucide-react";
import CheckoutPayment from "./CheckoutPayment";
import Services from "./Services";
import Vouchers from "./Vouchers";
import Packages from "./Packages";
import Credit from "./Credit";
import CheckoutSidebar from "@/components/CheckoutSidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchCustomers } from "@/redux/actions/productActions";
import { useRouter } from "next/router";
import isAuth from "@/components/isAuth";

function CreateSale() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { products: productsList } = useSelector((state) => state.product);

  const [activeTab, setActiveTab] = useState("products");
  const [selectedItems, setSelectedItems] = useState([]); // Shared cart for all tabs
  const [selectedClient, setSelectedClient] = useState(null);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalDiscount, setModalDiscount] = useState("no-discount");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [saleNote, setSaleNote] = useState("");
  const [showOverallDiscountModal, setShowOverallDiscountModal] =
    useState(false);
  const [overallDiscountType, setOverallDiscountType] = useState("percentage");
  const [overallDiscountValue, setOverallDiscountValue] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts(router));
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const customersList = await dispatch(fetchCustomers(router));
    setCustomers(customersList);
  };

  const tabs = [
    { id: "products", label: "Products" },
    { id: "services", label: "Services" },
    { id: "vouchers", label: "Vouchers" },
    { id: "credit", label: "Credit" },
    { id: "packages", label: "Packages" },
  ];

  const products = Array.isArray(productsList)
    ? productsList.map((product) => ({
        id: product._id,
        name: product.productName || product.name,
        sku: product.skuHandle || product.sku || "N/A",
        price: product.retailPrice || 0,
        image:
          product.photo || "https://via.placeholder.com/400x400?text=Product",
        stock: product.stock || 0,
      }))
    : [];

  const savedSales = [
    { name: "Elena Rodriguez", date: "Yesterday 4:35 PM", amount: 245.0 },
    { name: "Julian Thorne", date: "2 days ago", amount: 120.5 },
  ];

  const addToCart = (item) => {
    const existing = selectedItems.find((p) => p.id === item.id);
    if (existing) {
      setSelectedItems(
        selectedItems.map((p) =>
          p.id === item.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p,
        ),
      );
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const openProductDetail = (product) => {
    setSelectedProductDetail(product);
    setModalQuantity(1);
    setModalDiscount("no-discount");
    setDiscountType("percentage");
    setDiscountValue("");
  };

  const closeProductDetail = () => {
    setSelectedProductDetail(null);
  };

  const calculateDiscountedPrice = () => {
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
    if (selectedProductDetail) {
      const existing = selectedItems.find(
        (p) => p.id === selectedProductDetail.id,
      );
      if (existing) {
        setSelectedItems(
          selectedItems.map((p) =>
            p.id === selectedProductDetail.id
              ? { ...p, quantity: modalQuantity, discount: modalDiscount }
              : p,
          ),
        );
      } else {
        setSelectedItems([
          ...selectedItems,
          {
            ...selectedProductDetail,
            quantity: modalQuantity,
            discount: modalDiscount,
          },
        ]);
      }
      closeProductDetail();
    }
  };

  const removeFromCart = () => {
    if (selectedProductDetail) {
      setSelectedItems(
        selectedItems.filter((p) => p.id !== selectedProductDetail.id),
      );
      closeProductDetail();
    }
  };

  const getTotal = () => {
    return selectedItems.reduce(
      (sum, p) => sum + p.price * (p.quantity || 1),
      0,
    );
  };

  const getTotalWithOverallDiscount = () => {
    const subtotal = getTotal();
    if (!overallDiscountValue) return subtotal;

    if (overallDiscountType === "percentage") {
      return subtotal - (subtotal * parseFloat(overallDiscountValue)) / 100;
    } else {
      return subtotal - parseFloat(overallDiscountValue);
    }
  };

  // Show checkout page if checkout is clicked
  if (showCheckout) {
    return (
      <CheckoutPayment
        selectedClient={selectedClient}
        selectedProducts={selectedItems}
        totalAmount={getTotalWithOverallDiscount()}
        onBack={() => setShowCheckout(false)}
      />
    );
  }

  // Show Services page if services tab is active
  if (activeTab === "services") {
    return (
      <Services
        onTabChange={(tab) => setActiveTab(tab)}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        customers={customers}
        showClientSearch={showClientSearch}
        setShowClientSearch={setShowClientSearch}
        clientSearchQuery={clientSearchQuery}
        setClientSearchQuery={setClientSearchQuery}
        showMobileCart={showMobileCart}
        setShowMobileCart={setShowMobileCart}
        overallDiscountValue={overallDiscountValue}
        overallDiscountType={overallDiscountType}
        showNoteModal={showNoteModal}
        setShowNoteModal={setShowNoteModal}
        showOverallDiscountModal={showOverallDiscountModal}
        setShowOverallDiscountModal={setShowOverallDiscountModal}
        setShowCheckout={setShowCheckout}
      />
    );
  }

  // Show Vouchers page if vouchers tab is active
  if (activeTab === "vouchers") {
    return (
      <Vouchers
        onTabChange={(tab) => setActiveTab(tab)}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        customers={customers}
        showClientSearch={showClientSearch}
        setShowClientSearch={setShowClientSearch}
        clientSearchQuery={clientSearchQuery}
        setClientSearchQuery={setClientSearchQuery}
        showMobileCart={showMobileCart}
        setShowMobileCart={setShowMobileCart}
        overallDiscountValue={overallDiscountValue}
        overallDiscountType={overallDiscountType}
        showNoteModal={showNoteModal}
        setShowNoteModal={setShowNoteModal}
        showOverallDiscountModal={showOverallDiscountModal}
        setShowOverallDiscountModal={setShowOverallDiscountModal}
        setShowCheckout={setShowCheckout}
      />
    );
  }

  // Show Credit page if credit tab is active
  if (activeTab === "credit") {
    return (
      <Credit
        onTabChange={(tab) => setActiveTab(tab)}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        customers={customers}
        showClientSearch={showClientSearch}
        setShowClientSearch={setShowClientSearch}
        clientSearchQuery={clientSearchQuery}
        setClientSearchQuery={setClientSearchQuery}
        showMobileCart={showMobileCart}
        setShowMobileCart={setShowMobileCart}
        overallDiscountValue={overallDiscountValue}
        overallDiscountType={overallDiscountType}
        showNoteModal={showNoteModal}
        setShowNoteModal={setShowNoteModal}
        showOverallDiscountModal={showOverallDiscountModal}
        setShowOverallDiscountModal={setShowOverallDiscountModal}
        setShowCheckout={setShowCheckout}
      />
    );
  }

  if (activeTab === "packages") {
    return (
      <Packages
        onTabChange={(tab) => setActiveTab(tab)}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        customers={customers}
        showClientSearch={showClientSearch}
        setShowClientSearch={setShowClientSearch}
        clientSearchQuery={clientSearchQuery}
        setClientSearchQuery={setClientSearchQuery}
        showMobileCart={showMobileCart}
        setShowMobileCart={setShowMobileCart}
        overallDiscountValue={overallDiscountValue}
        overallDiscountType={overallDiscountType}
        showNoteModal={showNoteModal}
        setShowNoteModal={setShowNoteModal}
        showOverallDiscountModal={showOverallDiscountModal}
        setShowOverallDiscountModal={setShowOverallDiscountModal}
        setShowCheckout={setShowCheckout}
      />
    );
  }

  return (
    <>
      <DashboardHeader title="Create Sale" />

      <div className="min-h-screen bg-custom-gray flex flex-col lg:flex-row">
        <div className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
          <div className="bg-white border-b border-gray-200 mb-6">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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

          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
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
                <h2 className="text-2xl font-bold text-gray-900">
                  Skincare Curator
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Select items for the current session
                </p>
              </div>
              <p className="text-sm text-gray-500">
                {products.length} PRODUCTS FOUND
              </p>
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
                        e.target.src =
                          "https://via.placeholder.com/400x400?text=Product+Image";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      SKU: {product.sku}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {product.price > 0 ? `${product.price}` : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <CheckoutSidebar
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          showClientSearch={showClientSearch}
          setShowClientSearch={setShowClientSearch}
          clientSearchQuery={clientSearchQuery}
          setClientSearchQuery={setClientSearchQuery}
          customers={customers}
          selectedProducts={selectedItems}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          openProductDetail={openProductDetail}
          savedSales={savedSales}
          getTotal={getTotal}
          getTotalWithOverallDiscount={getTotalWithOverallDiscount}
          overallDiscountValue={overallDiscountValue}
          overallDiscountType={overallDiscountType}
          onAddNote={() => setShowNoteModal(true)}
          onAddDiscount={() => setShowOverallDiscountModal(true)}
          onCheckout={() => {
            if (!selectedClient) {
              setShowClientSearch(true);
            } else {
              setShowCheckout(true);
            }
          }}
          onCompleteSale={() => {
            console.log("Complete sale");
          }}
          showMobileCart={showMobileCart}
          setShowMobileCart={setShowMobileCart}
        />

        {/* Product Detail Modal */}
        {selectedProductDetail && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={closeProductDetail}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-50 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Close Button - Top Right */}
              <button
                onClick={closeProductDetail}
                className="absolute top-4 right-4 z-10 p-2 bg-white hover:bg-gray-100 rounded-full transition-colors shadow-md"
              >
                <X size={20} className="text-gray-600" />
              </button>

              <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
                {/* Product Image */}
                <div
                  className="w-full bg-gray-50 rounded-xl overflow-hidden mb-4 p-6 flex items-center justify-center"
                  style={{ aspectRatio: "4/3" }}
                >
                  <img
                    src={selectedProductDetail.image}
                    alt={selectedProductDetail.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x400?text=Product+Image";
                    }}
                  />
                </div>

                {/* Brand */}
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2 font-medium">
                  BOTANICA SKINCARE
                </p>

                {/* Product Name */}
                <h2 className="text-xl font-bold text-[#0A4D91] mb-5 leading-snug">
                  {selectedProductDetail.name}
                </h2>

                {/* Quantity Section */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-[#0A4D91] uppercase">
                      Quantity
                    </label>
                    <label className="text-xs font-bold text-[#0A4D91] uppercase">
                      Price
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          setModalQuantity(Math.max(1, modalQuantity - 1))
                        }
                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 hover:border-[#0A4D91] rounded text-[#0A4D91] font-bold text-xl transition-colors"
                      >
                        −
                      </button>
                      <span className="text-2xl font-bold text-[#0A4D91] w-12 text-center">
                        {modalQuantity}
                      </span>
                      <button
                        onClick={() => setModalQuantity(modalQuantity + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 hover:border-[#0A4D91] rounded text-[#0A4D91] font-bold text-xl transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-2xl font-bold text-[#0A4D91]">
                      $ {selectedProductDetail.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Discount Section */}
                <div className="mb-5">
                  <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">
                    Discount
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
                        />
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
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Discount Input Fields - Show when Discount is selected */}
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

                      {/* Price Breakdown */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                          <span>Original Price:</span>
                          <span className="font-medium">
                            $
                            {(
                              selectedProductDetail.price * modalQuantity
                            ).toFixed(2)}
                          </span>
                        </div>
                        {discountValue && (
                          <>
                            <div className="flex justify-between text-gray-600">
                              <span>Discount:</span>
                              <span className="font-medium text-red-500">
                                -
                                {discountType === "percentage"
                                  ? `${discountValue}%`
                                  : `${discountValue}`}
                              </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-[#0A4D91] pt-2 border-t border-gray-300">
                              <span>Final Price:</span>
                              <span>
                                ${calculateDiscountedPrice().toFixed(2)}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <button
                  onClick={saveProductToCart}
                  className="w-full bg-[#0A4D91] text-white py-3.5 rounded-lg font-bold text-base hover:bg-[#083d73] transition-colors mb-3"
                >
                  Save
                </button>

                {/* Remove Button */}
                <button
                  onClick={removeFromCart}
                  className="w-full text-red-500 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Remove from sale
                </button>
              </div>
            </div>
          </>
        )}

        {/* Add Note Modal */}
        {showNoteModal && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowNoteModal(false)}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-50 w-full max-w-md shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Add note</h3>
                  <button
                    onClick={() => setShowNoteModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>

                <textarea
                  value={saleNote}
                  onChange={(e) => setSaleNote(e.target.value)}
                  placeholder="Add a note for this sale..."
                  rows={5}
                  className="w-full text-gray-700 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none resize-none"
                  autoFocus
                />

                <button
                  onClick={() => setShowNoteModal(false)}
                  className="w-full mt-4 bg-[#0A4D91] text-white py-3 rounded-lg font-bold hover:bg-[#083d73] transition-colors"
                >
                  Save Note
                </button>
              </div>
            </div>
          </>
        )}

        {/* Overall Discount Modal */}
        {showOverallDiscountModal && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowOverallDiscountModal(false)}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-50 w-full max-w-md shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Overall discount
                  </h3>
                  <button
                    onClick={() => setShowOverallDiscountModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="bg-blue-50 border-l-4 border-[#0A4D91] p-4 mb-6 rounded">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-[#0A4D91]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700">
                      Overall discounts override any individual discounts and
                      apply to all items on the sale.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
                  <label className="text-sm font-semibold text-gray-700 mb-4 block">
                    Discount
                  </label>
                  <div className="grid grid-cols-[auto_auto_1fr] gap-3 items-center">
                    <button
                      onClick={() => setOverallDiscountType("percentage")}
                      className={`w-16 h-14 flex items-center justify-center rounded-lg font-bold text-2xl transition-colors ${
                        overallDiscountType === "percentage"
                          ? "bg-gray-200 text-gray-900 border-2 border-gray-300"
                          : "bg-white text-gray-600 border-2 border-gray-300"
                      }`}
                    >
                      %
                    </button>
                    <button
                      onClick={() => setOverallDiscountType("fixed")}
                      className={`w-16 h-14 flex items-center justify-center rounded-lg font-bold text-2xl transition-colors ${
                        overallDiscountType === "fixed"
                          ? "bg-gray-200 text-gray-900 border-2 border-gray-300"
                          : "bg-white text-gray-600 border-2 border-gray-300"
                      }`}
                    >
                      $
                    </button>
                    <input
                      type="number"
                      value={overallDiscountValue}
                      onChange={(e) => setOverallDiscountValue(e.target.value)}
                      placeholder="0"
                      className="w-full h-14 px-4 border-2 border-gray-300 rounded-lg text-center font-bold text-2xl text-gray-900 focus:ring-2 focus:ring-[#0A4D91] focus:border-[#0A4D91] outline-none"
                    />
                  </div>
                </div>

                {overallDiscountValue && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">
                        Total after discount
                      </p>
                      <p className="text-3xl font-bold text-[#0A4D91]">
                        ${getTotalWithOverallDiscount().toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowOverallDiscountModal(false)}
                  className="w-full bg-[#0A4D91] text-white py-3 rounded-lg font-bold hover:bg-[#083d73] transition-colors"
                >
                  Apply discount
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default isAuth(CreateSale);
