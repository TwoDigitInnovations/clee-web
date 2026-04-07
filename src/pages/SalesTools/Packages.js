import DashboardHeader from "@/components/DashboardHeader";
import { ConfirmModal } from "@/components/deleteModel";
import { Api } from "@/services/service";
import React, { useEffect, useState } from "react";
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

function Packages(props) {
  const [packages, setPackages] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const router = useRouter();

  const dummyPackages = [
    {
      id: 1,
      name: "Reset Package",
      description: "Premium foundational treatment",
      services: "1 Service",
      price: "$2000.00",
    },
    {
      id: 2,
      name: "The Silk Barrier Program",
      description: "Intensive 4-stage rejuvenation",
      services: "4 Services",
      price: "$2990.00",
    },
    {
      id: 3,
      name: "4 Six Star Peel Mini (Valued at $1396 Yours For $1200)",
      description: "Value Savings: $196.00",
      services: "1 Service",
      price: "$1200.00",
      isPromo: true,
    },
    {
      id: 4,
      name: "4 High Frequency Lifting + Six Star Peel Mini (Face + Neck) Valued at $2396 Yours For $1990)",
      description: "Value Savings: $406.00",
      services: "1 Service",
      price: "$1990.00",
      isPromo: true,
    },
  ];

  console.log(packages);

  const fetchPackages = async () => {
    try {
      props.loader(true);
      // Replace with your actual endpoint
      const res = await Api("get", "packages", "", props.router);
      props.loader(false);

      if (res?.status === true) {
        setPackages(res?.data?.data?.packages || []);
      } else {
        setPackages(dummyPackages);
      }
    } catch {
      props.loader(false);
      setPackages(dummyPackages);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDeleteConfirm = () => {
    props?.loader?.(true);
    const id = selectedId;
    Api("delete", `packages/${id}`, "", router)
      .then((res) => {
        props?.loader?.(false);
        if (res?.status === true)
          props?.toaster?.({
            type: "success",
            message: "Deleted successfully",
          });
        fetchPackages();
        setOpen(false);
        setSelectedId(null);
      })
      .catch(() => {
        props?.loader?.(false);
        fetchDiscounts();
        setOpen(false);
      });
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-10">
      <DashboardHeader title="Sales Tools" />

      <div className="max-w-7xl mx-auto p-3 md:p-6">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-xl md:text-2xl font-semibold text-[#1e3a8a]">
            Packages
          </h1>
          <button
            className="bg-custom-blue text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-800 transition-colors"
            onClick={() => router.push("/SalesTools/AddPackages")}
          >
            Add Packages
          </button>
        </div>

        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Active Packages</h2>
          <p className="text-sm text-gray-500">
            Manage your service bundles, SKU counts, and promotional pricing.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {packages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
              <ImageIcon className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-sm text-gray-500">
                No packages found. Click "Add Packages" to create your first
                package.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#fcfcfc] border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        Photo
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        SKU / Services
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        Pricing
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {packages.map((pkg) => (
                      <tr
                        key={pkg.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-300">
                            <img src={pkg.photo} alt={pkg.name} />{" "}
                            <ImageIcon size={20} />
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-800 leading-tight">
                              {pkg.name}
                            </span>
                            <span
                              className={`text-xs mt-1 ${pkg.isPromo ? "text-[#a38a00] font-medium" : "text-gray-400"}`}
                            >
                              {pkg.description}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="bg-[#eef2ff] text-[#4f46e5] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#dbeafe]">
                            {pkg?.specific_services.length}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-bold text-gray-800">
                            {pkg.price}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end items-center gap-3">
                            <button
                              className="text-custom-blue text-xs font-bold border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50"
                              onClick={() =>
                                router.push(
                                  `/SalesTools/AddPackages?id=${pkg._id}`,
                                )
                              }
                            >
                              Edit
                            </button>
                            <button className="bg-[#dbeafe] text-[#1e3a8a] text-[11px] font-bold px-4 py-1.5 rounded hover:bg-blue-200">
                              Issue to customer
                            </button>
                            <button
                              onClick={() => {
                                setSelectedId(pkg._id);
                                setOpen(true);
                              }}
                              className="text-red-400 hover:text-red-600 ml-2"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View Fix: Wrapped in curly braces and added missing opening brace */}
              <div className="md:hidden divide-y divide-gray-100">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-300">
                        <ImageIcon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {pkg.package_name || pkg.name}
                        </p>
                        <p
                          className={`text-xs ${pkg.isPromo ? "text-[#a38a00] font-medium" : "text-gray-400"}`}
                        >
                          {pkg.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="bg-[#eef2ff] text-[#4f46e5] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#dbeafe]">
                        {pkg.services}
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {pkg.price}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button className="flex-1 text-xs font-bold border border-gray-200 px-3 py-2 rounded hover:bg-gray-50 text-black">
                        Edit
                      </button>
                      <button className="flex-1 bg-[#dbeafe] text-[#1e3a8a] text-xs font-bold px-3 py-2 rounded hover:bg-blue-200">
                        Issue
                      </button>
                      <button
                        onClick={() => {
                          setSelectedId(pkg._id);
                          setOpen(true);
                        }}
                        className="w-10 h-10 flex items-center justify-center border border-red-100 text-red-400 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-between items-center text-xs text-gray-400 font-medium">
          <span>
            Showing {packages.length} of {packages.length} packages
          </span>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-100 rounded border border-gray-100">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded border border-gray-100">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={open}
        setIsOpen={setOpen}
        title="Delete Package"
        message="Are you sure you want to delete this package? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        yesText="Yes, Delete"
        noText="Cancel"
      />
    </div>
  );
}

export default Packages;
