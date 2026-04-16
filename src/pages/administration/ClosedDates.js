import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, X, Info, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Edit2, Trash2 } from "lucide-react";

import {
  createClosedDate,
  fetchClosedDates,
  deleteClosedDate,
  updateClosedDate,
} from "@/redux/actions/ClosedDatesActions";
import { ConfirmModal } from "@/components/deleteModel";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";

function ClosedDates({ toaster, loader }) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    description: "",
  });

  const closedDates = useSelector(
    (state) => state.closedDates?.closedDates || [],
  );

  useEffect(() => {
    dispatch(fetchClosedDates());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.startDate || !formData.endDate) {
      toaster({ type: "error", message: "Start and End dates are required" });
      return;
    }

    try {
      setLoading(true);
      loader(true);

      const payload = {
        start_date: formData.startDate,
        end_date: formData.endDate,
        description: formData.description,
      };
      let res;
      if (selectedId) {
        res = await dispatch(updateClosedDate(selectedId, payload, router));
      } else {
        res = await dispatch(createClosedDate(payload, router));
      }

      if (res?.success) {
        toaster({
          type: "success",
          message: selectedId
            ? "Closed date Updated successfully"
            : "Closed date added successfully",
        });
        setIsOpen(false);
        setFormData({ startDate: "", endDate: "", description: "" });
        setSelectedId("");
        dispatch(fetchClosedDates());
      } else {
        toaster({
          type: "error",
          message: res?.message || "Something went wrong",
        });
      }
    } catch (err) {
      toaster({ type: "error", message: "Server error" });
    } finally {
      setLoading(false);
      loader(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      loader(true);

      const res = await dispatch(deleteClosedDate(selectedId, router));

      loader(false);

      if (res?.success) {
        toaster({
          type: "success",
          message: "Close Date deleted successfully",
        });
        setIsOpen(false);
      } else {
        toaster({ type: "error", message: res.message });
      }
    } catch (err) {
      loader(false);
      console.log(err.message);

      toaster({ type: "error", message: "Server error" });
    }
  };

  const CloseDateCard = ({ item, onEdit }) => {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <CalendarIcon size={24} className="text-custom-blue/80" />
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {new Date(item.startDate).toLocaleDateString()} -{" "}
              {new Date(item.endDate).toLocaleDateString()}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {item.description || "No description"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 rounded-lg border text-sm border-gray-200 px-4 py-2.5 hover:bg-blue-50 text-blue-600"
          >
            Edit
          </button>

          <button
            onClick={() => {
              setSelectedId(item._id);
              setOpen(true);
            }}
            className="p-2 rounded-lg hover:bg-red-50 border border-gray-200 px-3 py-2.5 text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  };



  return (
    <>
      <DashboardHeader title="Administration" />
      <div className="min-h-screen bg-[#f8f9fa] pb-20">
        {/* Header Section */}
        <ConfirmModal
          isOpen={open}
          setIsOpen={setOpen}
          title="Delete Close Date"
          message="Are you sure you want to delete this Close Date? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          yesText="Yes, Delete"
          noText="Cancel"
        />

        <div className="max-w-7xl mx-auto md:p-6 p-4">
          <div className="flex flex-col md:flex-row gap-2 justify-between items-start mb-8">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#1a3a6b]">
                Closed dates
              </h1>
              <p className="text-gray-600 mt-2 max-w-xl text-sm leading-relaxed">
                List the dates your business is closed for public holidays,
                maintenance or any other reason. Customers will not be able to
                place online bookings during these dates.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-custom-blue hover:bg-custom-blue/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all"
            >
              <Plus size={18} /> Add closed date
            </button>
          </div>
          <div className=" justify-center ">
            {closedDates?.length > 0 ? (
              <div className="w-full grid gap-4">
                {closedDates.map((item) => (
                  <CloseDateCard
                    key={item._id}
                    item={item}
                    onEdit={(val) => {
                      setFormData({
                        startDate: val.startDate
                          ? new Date(val.startDate).toISOString().split("T")[0]
                          : "",
                        endDate: val.endDate
                          ? new Date(val.endDate).toISOString().split("T")[0]
                          : "",
                        description: val.description || "",
                      });

                      setIsOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[400px] text-center">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CalendarIcon size={40} className="text-blue-200" />
                </div>
                <h3 className="text-lg font-bold text-[#1a3a6b]">
                  No closed dates added yet
                </h3>
                <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                  Your calendar is currently open for all dates. Use this
                  section to block off time for holidays or renovation.
                </p>

                <div className="flex gap-4 mt-8 opacity-40 justify-center">
                  <div className="w-24 h-12 bg-gray-100 rounded-md"></div>
                  <div className="w-24 h-20 border-2 border-dashed border-blue-200 rounded-md bg-blue-50"></div>
                  <div className="w-24 h-12 bg-gray-100 rounded-md"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-50">
                <h2 className="text-xl font-bold text-gray-800">
                  Add closed date
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Info Alert */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-700">
                  <Info size={20} className="shrink-0" />
                  <p className="text-sm font-medium">
                    Online bookings can not be placed during closed dates
                  </p>
                </div>

                {/* Date Inputs */}
                <div className="grid grid-col-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-100 border-none rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-100 border-none rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="e.g. Annual summer retreat"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-100 border-none rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-gray-50/50 flex justify-end gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 text-[#1a3a6b] font-bold text-sm hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-2.5 bg-custom-blue text-white font-bold text-sm rounded-lg hover:bg-custom-blue/90 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ClosedDates;
