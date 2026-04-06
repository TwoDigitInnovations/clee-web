import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import { Plus, Info, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { createSupplier, updateSupplier, getSupplierById } from "@/redux/actions/supplierActions";
import { clearError, clearSuccess, clearCurrentSupplier } from "@/redux/slices/supplierSlice";
import Swal from "sweetalert2";

function AddSuppliers() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  
  const { loading, error, success, currentSupplier } = useSelector((state) => state.supplier);
  
  const [formData, setFormData] = useState({
    businessName: "",
    customerId: "",
    contactFirstName: "",
    contactLastName: "",
    telephone: "",
    mobile: "",
    email: "",
    website: "",
  });

  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(getSupplierById(id, router));
    }
    
    return () => {
      dispatch(clearCurrentSupplier());
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [id]);

  useEffect(() => {
    if (currentSupplier && id) {
      setFormData({
        businessName: currentSupplier.businessName || "",
        customerId: currentSupplier.customerId || "",
        contactFirstName: currentSupplier.contactFirstName || "",
        contactLastName: currentSupplier.contactLastName || "",
        telephone: currentSupplier.telephone || "",
        mobile: currentSupplier.mobile || "",
        email: currentSupplier.email || "",
        website: currentSupplier.website || "",
      });
      setAddresses(currentSupplier.addresses || []);
    }
  }, [currentSupplier, id]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error,
        confirmButtonColor: '#0A4D91',
      });
      dispatch(clearError());
    }
  }, [error]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index][field] = value;
    setAddresses(newAddresses);
  };

  const addAddress = () => {
    setAddresses([
      ...addresses,
      {
        physicalAddress1: "",
        physicalAddress2: "",
        physicalCity: "",
        physicalState: "",
        physicalPostcode: "",
        postalAddress1: "",
        postalAddress2: "",
        postalCity: "",
        postalState: "",
        postalPostcode: "",
      }
    ]);
  };

  const removeAddress = (index) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(newAddresses);
  };

  const handleSave = async () => {
    if (!formData.businessName) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Business name is required',
        confirmButtonColor: '#0A4D91',
      });
      return;
    }

    const supplierData = {
      ...formData,
      addresses,
    };

    try {
      let result;
      if (id) {
        result = await dispatch(updateSupplier(id, supplierData, router));
      } else {
        result = await dispatch(createSupplier(supplierData, router));
      }

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: result.message || (id ? 'Supplier updated successfully' : 'Supplier created successfully'),
          confirmButtonColor: '#0A4D91',
        }).then(() => {
          router.push("/stock/Suppliers");
        });
      }
    } catch (error) {
     
    }
  };

  const handleCancel = () => {
    router.push("/stock/Suppliers");
  };

  return (
    <>
      <DashboardHeader title="Stock" />

      <div className="min-h-screen bg-[#f0f1f5] text-slate-800 px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              <button 
                onClick={() => router.push("/stock/Suppliers")}
                className="hover:text-[#0A4D91] hover:underline transition-colors"
              >
                Suppliers
              </button>
              {" > Add Suppliers"}
            </p>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#0A4D91]">Suppliers</h1>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-[#0A4D91] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#083d73] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Details */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Details</h2>
                <p className="text-sm text-gray-600">
                  Add your main supplier contact for orders. This information will be used for automated procurement workflows.
                </p>
              </div>
            </div>

            {/* Right Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                {/* Business Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Suppliers business name (required)
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    placeholder="e.g. Atelier Textile Co."
                    className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                  />
                </div>

                {/* Customer ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your customer ID
                  </label>
                  <input
                    type="text"
                    value={formData.customerId}
                    onChange={(e) => handleInputChange("customerId", e.target.value)}
                    placeholder="e.g. CID-99821"
                    className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                  />
                </div>

                {/* Contact Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact first name
                    </label>
                    <input
                      type="text"
                      value={formData.contactFirstName}
                      onChange={(e) => handleInputChange("contactFirstName", e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact last name
                    </label>
                    <input
                      type="text"
                      value={formData.contactLastName}
                      onChange={(e) => handleInputChange("contactLastName", e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Phone Numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telephone
                    </label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => handleInputChange("telephone", e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="contact@supplier.com"
                    className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 py-2.5 bg-gray-200 border border-r-0 border-gray-200 rounded-l-lg text-gray-600 text-sm">
                      http://
                    </span>
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="www.example.com"
                      className="flex-1 px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Add Address Button - Only show if no address exists */}
                {addresses.length === 0 && (
                  <button
                    onClick={addAddress}
                    className="text-[#0A4D91] hover:underline font-medium text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add an address
                  </button>
                )}

                {/* Dynamic Address Fields */}
                {addresses.map((address, index) => (
                  <div key={index} className="border-t border-gray-200 pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Address</h3>
                      <button
                        onClick={() => removeAddress(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove address"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Physical Address */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700">Physical</h4>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Address</label>
                          <input
                            type="text"
                            value={address.physicalAddress1}
                            onChange={(e) => handleAddressChange(index, "physicalAddress1", e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                          />
                        </div>
                        
                        <div>
                          <input
                            type="text"
                            value={address.physicalAddress2}
                            onChange={(e) => handleAddressChange(index, "physicalAddress2", e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">City</label>
                          <input
                            type="text"
                            value={address.physicalCity}
                            onChange={(e) => handleAddressChange(index, "physicalCity", e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">State</label>
                            <input
                              type="text"
                              value={address.physicalState}
                              onChange={(e) => handleAddressChange(index, "physicalState", e.target.value)}
                              className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Postcode</label>
                            <input
                              type="text"
                              value={address.physicalPostcode}
                              onChange={(e) => handleAddressChange(index, "physicalPostcode", e.target.value)}
                              className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Postal Address */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700">Postal</h4>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Address</label>
                          <input
                            type="text"
                            value={address.postalAddress1}
                            onChange={(e) => handleAddressChange(index, "postalAddress1", e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                          />
                        </div>
                        
                        <div>
                          <input
                            type="text"
                            value={address.postalAddress2}
                            onChange={(e) => handleAddressChange(index, "postalAddress2", e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">City</label>
                          <input
                            type="text"
                            value={address.postalCity}
                            onChange={(e) => handleAddressChange(index, "postalCity", e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">State</label>
                            <input
                              type="text"
                              value={address.postalState}
                              onChange={(e) => handleAddressChange(index, "postalState", e.target.value)}
                              className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Postcode</label>
                            <input
                              type="text"
                              value={address.postalPostcode}
                              onChange={(e) => handleAddressChange(index, "postalPostcode", e.target.value)}
                              className="w-full px-4 py-2.5 bg-[#E1E3E4] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Information Security Notice */}
                <div className="bg-blue-50 border-l-4 border-[#0A4D91] p-4 rounded">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-[#0A4D91] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#0A4D91] mb-1">INFORMATION SECURITY</h4>
                      <p className="text-sm text-gray-600">
                        Your supplier data is encrypted and only visible to authorized procurement staff within the unit.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-2.5 bg-[#0A4D91] text-white font-semibold rounded-lg hover:bg-[#083d73] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading && (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddSuppliers;
