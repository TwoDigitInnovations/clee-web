import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import { Upload, Plus, Minus, ChevronDown } from "lucide-react";
import { useRouter } from "next/router";
import { ApiFormData, Api } from "@/services/service";
import Swal from "sweetalert2";

function AddProduct() {
  const router = useRouter();
  const { type, id } = router.query;
  
  const [formData, setFormData] = useState({
    productName: "",
    skuHandle: "",
    barcode: "",
    description: "",
    costPrice: "0.00",
    retailPrice: "0.00",
    taxRate: "Standard (20%)",
    priceIncludesTax: false,
    primarySupplier: "",
    supplierProductCode: "",
    trackStock: true,
    allowOutOfStock: false,
    sendAlertEmails: false,
    locations: [
      { name: "Chebo Clinic", available: 0, alert: "", ideal: "" }
    ],
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Api("GET", `products/${id}`, {}, router);
      const product = response.data.data;
      
      setFormData({
        productName: product.productName || "",
        skuHandle: product.skuHandle || "",
        barcode: product.barcode || "",
        description: product.description || "",
        costPrice: product.costPrice?.toString() || "0.00",
        retailPrice: product.retailPrice?.toString() || "0.00",
        taxRate: product.taxRate || "Standard (20%)",
        priceIncludesTax: product.priceIncludesTax || false,
        primarySupplier: product.primarySupplier || "",
        supplierProductCode: product.supplierProductCode || "",
        trackStock: product.trackStock !== undefined ? product.trackStock : true,
        allowOutOfStock: product.allowOutOfStock || false,
        sendAlertEmails: product.sendAlertEmails || false,
        locations: product.locations || [{ name: "Chebo Clinic", available: 0, alert: "", ideal: "" }],
      });

      if (product.photo) {
        setImagePreview(product.photo);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to load product data',
        confirmButtonColor: '#0A4D91',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'warning',
          title: 'File Too Large',
          text: 'Image size should be less than 5MB',
          confirmButtonColor: '#0A4D91',
        });
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLocationChange = (index, field, value) => {
    const newLocations = [...formData.locations];
    newLocations[index][field] = value;
    setFormData({ ...formData, locations: newLocations });
  };

  const handleQuantityChange = (index, delta) => {
    const newLocations = [...formData.locations];
    newLocations[index].available = Math.max(0, newLocations[index].available + delta);
    setFormData({ ...formData, locations: newLocations });
  };

  const addLocation = () => {
    setFormData({
      ...formData,
      locations: [...formData.locations, { name: "", available: 0, alert: "", ideal: "" }]
    });
  };

  const handleSave = async () => {
    if (!formData.productName) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Product name is required',
        confirmButtonColor: '#0A4D91',
      });
      return;
    }

    setSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("productName", formData.productName);
      formDataToSend.append("type", type || "retail");
      formDataToSend.append("skuHandle", formData.skuHandle);
      formDataToSend.append("barcode", formData.barcode);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("costPrice", parseFloat(formData.costPrice));
      formDataToSend.append("retailPrice", parseFloat(formData.retailPrice));
      formDataToSend.append("taxRate", formData.taxRate);
      formDataToSend.append("priceIncludesTax", formData.priceIncludesTax);
      formDataToSend.append("primarySupplier", formData.primarySupplier);
      formDataToSend.append("supplierProductCode", formData.supplierProductCode);
      formDataToSend.append("trackStock", formData.trackStock);
      formDataToSend.append("allowOutOfStock", formData.allowOutOfStock);
      formDataToSend.append("sendAlertEmails", formData.sendAlertEmails);
      formDataToSend.append("locations", JSON.stringify(formData.locations));
      
      if (selectedImage) {
        formDataToSend.append("photo", selectedImage);
      }

      if (id) {
        await ApiFormData("PUT", `products/${id}`, formDataToSend, router);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Product updated successfully',
          confirmButtonColor: '#0A4D91',
        });
      } else {
        await ApiFormData("POST", "products", formDataToSend, router);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Product created successfully',
          confirmButtonColor: '#0A4D91',
        });
      }
      router.push("/stock/Products");
    } catch (error) {
      console.error("Error saving product:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || `Failed to ${id ? 'update' : 'create'} product`,
        confirmButtonColor: '#0A4D91',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/stock/Products");
  };

  return (
    <>
      <DashboardHeader title="Stock" />

      <div className="min-h-screen bg-[#f0f1f5] text-slate-800 px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              <button 
                onClick={() => router.push("/stock/Products")}
                className="hover:text-[#0A4D91] hover:underline transition-colors"
              >
                Products
              </button>
              {" > "}{id ? 'Edit' : 'Add'} {type === "retail" ? "Retail" : "Professional"} Stock
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">Products</h1>
          </div>

          <div className="space-y-6">
            {/* Product details section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Product details</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={formData.productName}
                      onChange={(e) => handleInputChange("productName", e.target.value)}
                      placeholder="e.g., Hydrating Facial Mist"
                      className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU/Handle
                      </label>
                      <input
                        type="text"
                        value={formData.skuHandle}
                        onChange={(e) => handleInputChange("skuHandle", e.target.value)}
                        placeholder="BTL-402-BM"
                        className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Barcode (EAN/UPC)
                      </label>
                      <input
                        type="text"
                        value={formData.barcode}
                        onChange={(e) => handleInputChange("barcode", e.target.value)}
                        placeholder="0 12345 67890 5"
                        className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Enter detailed product description..."
                      rows={4}
                      className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-5 space-y-4 h-fit">
                  <div className="flex items-center gap-2 text-[#0A4D91]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold">Financials</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="text"
                        value={formData.costPrice}
                        onChange={(e) => handleInputChange("costPrice", e.target.value)}
                        className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Retail Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="text"
                        value={formData.retailPrice}
                        onChange={(e) => handleInputChange("retailPrice", e.target.value)}
                        className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Rate (%)
                    </label>
                    <div className="relative">
                      <select
                        value={formData.taxRate}
                        onChange={(e) => handleInputChange("taxRate", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none appearance-none cursor-pointer"
                      >
                        <option>Standard (20%)</option>
                        <option>Reduced (5%)</option>
                        <option>Zero (0%)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="priceIncludesTax"
                      checked={formData.priceIncludesTax}
                      onChange={(e) => handleInputChange("priceIncludesTax", e.target.checked)}
                      className="w-4 h-4 text-[#0A4D91] border-gray-300 rounded focus:ring-[#0A4D91]"
                    />
                    <label htmlFor="priceIncludesTax" className="text-sm text-gray-700">
                      Price includes tax
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Supplier information and Stock control sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Supplier information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Supplier information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Supplier
                    </label>
                    <div className="relative">
                      <select
                        value={formData.primarySupplier}
                        onChange={(e) => handleInputChange("primarySupplier", e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Select a supplier...</option>
                        <option>Botanica Labs Inc.</option>
                        <option>Elite Beauty Co.</option>
                        <option>DermaPro Solutions</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier Product Code
                    </label>
                    <input
                      type="text"
                      value={formData.supplierProductCode}
                      onChange={(e) => handleInputChange("supplierProductCode", e.target.value)}
                      placeholder="SUP-X-0973"
                      className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Stock control */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Stock control</h2>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm text-gray-700 font-medium">Track stock</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.trackStock}
                        onChange={(e) => handleInputChange("trackStock", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0A4D91] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A4D91]"></div>
                    </div>
                  </label>
                </div>

                {formData.trackStock ? (
                  <div className="space-y-4">
                    {formData.locations.map((location, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <input
                              type="text"
                              value={location.name}
                              onChange={(e) => handleLocationChange(index, "name", e.target.value)}
                              placeholder="Location name"
                              className="text-base font-semibold text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-[#0A4D91] outline-none bg-transparent"
                            />
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-gray-500">Available</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleQuantityChange(index, -1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Minus className="w-4 h-4 text-gray-700" />
                            </button>
                            <span className="text-xl font-bold text-gray-900 min-w-[40px] text-center">
                              {location.available}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(index, 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Plus className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>
                        </div>

                        {/* Alert and Ideal fields */}
                        <div className="grid grid-cols-2 gap-3 pl-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Alert Level</label>
                            <input
                              type="number"
                              value={location.alert}
                              onChange={(e) => handleLocationChange(index, "alert", e.target.value)}
                              placeholder="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Ideal Level</label>
                            <input
                              type="number"
                              value={location.ideal}
                              onChange={(e) => handleLocationChange(index, "ideal", e.target.value)}
                              placeholder="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                        
                        {index < formData.locations.length - 1 && (
                          <div className="border-b border-gray-200 mt-3"></div>
                        )}
                      </div>
                    ))}

                    <button
                      onClick={addLocation}
                      className="text-sm text-[#0A4D91] hover:underline font-medium flex items-center gap-1 mt-4"
                    >
                      <Plus className="w-4 h-4" />
                      Add Location
                    </button>

                    <p className="text-xs text-gray-500 pt-2">
                      When 'Track stock' is disabled stock will be unlimited.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="allowOutOfStock"
                          checked={formData.allowOutOfStock}
                          onChange={(e) => handleInputChange("allowOutOfStock", e.target.checked)}
                          className="w-4 h-4 mt-0.5 text-[#0A4D91] border-gray-300 rounded focus:ring-[#0A4D91]"
                        />
                        <label htmlFor="allowOutOfStock" className="text-sm text-gray-700">
                          Allow product to be sold even when out of stock?
                        </label>
                      </div>

                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="sendAlertEmails"
                          checked={formData.sendAlertEmails}
                          onChange={(e) => handleInputChange("sendAlertEmails", e.target.checked)}
                          className="w-4 h-4 mt-0.5 text-[#0A4D91] border-gray-300 rounded focus:ring-[#0A4D91]"
                        />
                        <label htmlFor="sendAlertEmails" className="text-sm text-gray-700">
                          Send emails when available stock reaches the alert limit?
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    When 'Track stock' is disabled stock will be unlimited.
                  </p>
                )}
              </div>
            </div>

            {/* Photo section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-[#0A4D91]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900">Photo</h2>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img src={imagePreview} alt="Preview" className="w-48 h-48 object-cover mx-auto rounded-lg" />
                    <button 
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove photo
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="bg-[#0A4D91] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#083d73] transition-colors mb-2 inline-block cursor-pointer"
                    >
                      Upload new photo
                    </label>
                    <p className="text-xs text-gray-500">Accepted formats: jpg, png, webp (Max 5MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-[#0A4D91] text-white font-semibold rounded-lg hover:bg-[#083d73] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving && (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddProduct;
