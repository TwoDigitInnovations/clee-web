import DashboardHeader from "@/components/DashboardHeader";
import React, { useEffect, useState } from "react";
import { UserPlus, Award, Zap, Edit2, Trash2, Search } from "lucide-react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuppliers, deleteSupplier } from "@/redux/actions/supplierActions";
import { ConfirmModal } from "@/components/deleteModel";
import Swal from "sweetalert2";

function Suppliers() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { suppliers, loading } = useSelector((state) => state.supplier);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    dispatch(fetchSuppliers(router));
  }, []);

  const handleDelete = async () => {
    if (!selectedSupplier) return;

    try {
      const result = await dispatch(deleteSupplier(selectedSupplier._id, router));
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Supplier has been deleted successfully',
          confirmButtonColor: '#0A4D91',
        });
        dispatch(fetchSuppliers(router));
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to delete supplier',
        confirmButtonColor: '#0A4D91',
      });
    }
  };

  const openDeleteModal = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.customerId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasSuppliers = suppliers.length > 0;

  return (
    <>
      <DashboardHeader title="Stock" />

      <div className="min-h-screen bg-[#f0f1f5] text-slate-800 px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#0A4D91] mb-2">Suppliers</h1>
              <p className="text-gray-500">Manage your global network of architectural resource partners.</p>
            </div>
            <button 
              onClick={() => router.push("/addsuppliers")}
              className="bg-[#0A4D91] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#083d73] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <UserPlus className="w-5 h-5" />
              Add a supplier
            </button>
          </div>

          {hasSuppliers ? (
            /* Suppliers Table */
            <div className="bg-white rounded-xl shadow-sm">
              {/* Search Bar */}
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by business name, email, or customer ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4D91] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#E2E8F0] border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Business Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Customer ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                          Loading suppliers...
                        </td>
                      </tr>
                    ) : filteredSuppliers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                          No suppliers found
                        </td>
                      </tr>
                    ) : (
                      filteredSuppliers.map((supplier) => (
                        <tr key={supplier._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            <p className="font-semibold text-sm text-gray-900">{supplier.businessName}</p>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <p className="text-sm text-gray-600">{supplier.customerId || '-'}</p>
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            <p className="text-sm text-gray-600">
                              {supplier.contactFirstName || supplier.contactLastName
                                ? `${supplier.contactFirstName || ''} ${supplier.contactLastName || ''}`.trim()
                                : '-'}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-gray-600">{supplier.email || '-'}</p>
                          </td>
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <p className="text-sm text-gray-600">{supplier.telephone || supplier.mobile || '-'}</p>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => router.push(`/addsuppliers?id=${supplier._id}`)}
                                className="p-2 text-[#0A4D91] hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit supplier"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(supplier)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete supplier"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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
                  Showing {filteredSuppliers.length} of {suppliers.length} suppliers
                </p>
              </div>
            </div>
          ) : (
            /* Empty State Card */
            <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12">
              <div className="max-w-2xl mx-auto text-center">
                {/* Icon Container */}
                <div className="flex justify-center mb-8">
                  <img 
                    src="/images/Margin.png" 
                    alt="Suppliers" 
                    className="w-48 h-48 sm:w-64 sm:h-64"
                  />
                </div>

                {/* Main Message */}
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Everyone needs stuff
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                  Who supplies yours?
                </p>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-xl mx-auto">
                  {/* Vetted Partners Card */}
                  <div className="bg-gray-50 rounded-xl p-6 text-left hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-[#0A4D91] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                      <Award className="w-6 h-6 text-[#0A4D91]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0A4D91] mb-2">
                      Vetted Partners
                    </h3>
                    <p className="text-sm text-gray-500">
                      Only verified architectural sources appear here.
                    </p>
                  </div>

                  {/* Active Supply Card */}
                  <div className="bg-gray-50 rounded-xl p-6 text-left hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-[#0A4D91] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-[#0A4D91]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0A4D91] mb-2">
                      Active Supply
                    </h3>
                    <p className="text-sm text-gray-500">
                      Track logistics and delivery chains in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Supplier"
        message={`Are you sure you want to delete "${selectedSupplier?.businessName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        yesText="Delete"
        noText="Cancel"
      />
    </>
  );
}

export default Suppliers;
