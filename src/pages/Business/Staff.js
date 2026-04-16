import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/router";
import { Plus, Trash2, Search, UserPlus, CreditCard, User, CircleUserRound } from "lucide-react";
import { ConfirmModal } from "@/components/deleteModel";
import { Api } from "@/services/service";
import PriceTierModal from "@/components/Pricetier";
import { useDispatch, useSelector } from "react-redux";
import { deleteStaff, fetchStaff } from "@/redux/actions/staffActions";

function Staff(props) {
  const [tiers, setTiers] = useState([{ name: "", assignedStaffIds: [] }]);
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { staff, loading } = useSelector((state) => state.staff);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStaff());
  }, []);

  const fetchPriceTiers = async () => {
    try {
      props.loader(true);
      const res = await Api("get", `price-tiers/getAll`, "", router);
      props.loader(false);
      if (res?.status === true && res.data.data.length > 0) {
        const data = res.data.data;
        setTiers(
          data.map((item) => ({
            _id: item._id,
            name: item.name,
            assignedStaffIds: item.assignedStaffIds || [],
          })),
        );
      }
    } catch (err) {
      props.loader(false);
      props.toaster({ type: "error", message: "Failed to fetch Price Tiers" });
    }
  };

  useEffect(() => {
    fetchPriceTiers();
  }, []);

  const handlePriceTierSave = async (data) => {
    try {
      props.loader(true);
      const res = await Api("post", `price-tiers/save`, data, router);
      props.loader(false);
      if (res?.status === true) {
        props.toaster({ type: "success", message: "Price tier saved!" });
        setIsModalOpen(false);
        setTiers([]);
      }
    } catch (err) {
      props.loader(false);
      props.toaster({ type: "error", message: "Failed to save price tier" });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      props.loader(true);

      const res = await dispatch(deleteStaff(id, router));

      props.loader(false);

      if (res?.success) {
        props.toaster("success", "Staff deleted successfully");
        setOpen(false);
      } else {
        props.toaster("error", res.message);
      }
    } catch {
      props.loader(false);
      props.toaster("error", "Server error");
    }
  };

  return (
    <div className="bg-[#f8f9fb] min-h-screen">
      <DashboardHeader title="Your Business" />

      <div className="md:px-6 px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1e4e8c]">
              Staff Management
            </h1>
            <p className="text-gray-500 text-sm">
              View and manage your organizational team
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                fetchPriceTiers();
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-[#e2e8f0] text-custom-blue px-4 py-2.5 rounded-md text-sm font-semibold"
            >
              <CreditCard size={18} /> Add Price Tiers
            </button>
            <button
              onClick={() => router.push("/Business/AddStaffs")}
              className="bg-custom-blue text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-[#083a6f]"
            >
              Add New Staff
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search staff members..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-custom-blue bg-gray-50/50"
            />
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span> Total
              Staff: {staff.length}
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> On
              Leave: 2
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {staff.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 flex flex-col gap-4 border border-gray-100 shadow-sm hover:shadow-md transition"
            >
              {/* Top Section */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                  {item.photo ? (
                    <img
                      src={item.photo}
                      alt={item.fullname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 w-full h-full flex items-center justify-center">
                      <UserPlus size={20} />
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 flex-1">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Name
                    </label>
                    <p className="text-sm font-bold text-slate-700 break-words">
                      {item.fullname}
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Email
                    </label>
                    <p className="text-sm text-slate-600 break-all">
                      {item.email}
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Phone
                    </label>
                    <p className="text-sm text-slate-500">
                      {item.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      router.push(`/Business/AddStaffs?id=${item._id}`)
                    }
                    className="text-sm font-semibold text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button className="text-sm font-semibold text-gray-500 hover:text-gray-800">
                    Archive
                  </button>
                </div>

                <button
                  onClick={() => {
                    setId(item._id);
                    setOpen(true);
                  }}
                  className="p-2 rounded-md hover:bg-red-50 text-red-400 hover:text-red-600 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          <div
            onClick={() => router.push("/Business/StaffAnalytics")}
            className="border-2 border-dashed border-[#d1dbe5] rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/30 transition-colors"
          >
            <div className="bg-white p-3 rounded-xl shadow-sm mb-4 border border-gray-100">
              <CircleUserRound className="text-custom-blue" size={24} />
            </div>
            <h3 className="font-bold text-custom-blue max-w-xs text-center">
              Analytics for staff achievements/commissions
            </h3>
            <p className="text-gray-500 text-xs mt-1 text-center max-w-xs">
              Expanding your team? Invite new editors, writers, or managers to
              your workspace.
            </p>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={open}
        setIsOpen={setOpen}
        title="Delete Staff"
        message="Are you sure you want to delete this staff member?"
        onConfirm={handleDeleteConfirm}
        yesText="Yes, Delete"
        noText="Cancel"
      />

      <PriceTierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handlePriceTierSave}
        allStaff={staff}
        tiers={tiers}
        setTiers={setTiers}
      />
    </div>
  );
}

export default Staff;
