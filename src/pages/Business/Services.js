import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Settings,
  Clock,
  CreditCard,
  X,
  FolderPlus,
  Tag,
} from "lucide-react";
import { Api } from "@/services/service";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/deleteModel";
import { useDispatch, useSelector } from "react-redux";
import { deleteService, fetchServices } from "@/redux/actions/servicesActions";

function AddCategoryModal({
  isOpen,
  onClose,
  onSave,
  loader,
  toaster,
  router,
  fetchCategories,
}) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toaster({ type: "error", message: "Category name is required" });
      return;
    }
    setSubmitting(true);
    loader(true);
    try {
      const res = await Api(
        "post",
        "category/create",
        { name: name.trim() },
        router,
      );
      loader(false);
      setSubmitting(false);

      toaster({ type: "success", message: "Category added successfully!" });
      fetchCategories();
      onClose();
    } catch {
      loader(false);
      setSubmitting(false);
      toaster({ type: "error", message: "Failed to add category" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-modal-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <FolderPlus size={18} className="text-[#1e4e8c]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1e2d3d]">
                Add Category
              </h2>
              <p className="text-xs text-gray-400">
                Organize your services into groups
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Category Name
          </label>
          <div className="relative">
            <Tag
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="e.g. New Clients, Memberships..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-slate-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e4e8c]/20 focus:border-[#1e4e8c] bg-gray-50 transition"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-2 ml-1">
            Categories help group related services together for easier
            navigation.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 bg-[#1e4e8c] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#163d6e] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus size={15} />
            )}
            {submitting ? "Saving…" : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Services(props) {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState("");
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await Api("get", "category/getAll", "", null);
      setLoading(false);
      if (res?.status === true && res.data?.data?.length > 0) {
        setCategories(res.data.data);
      }
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]._id);
    }
  }, [categories]);

  const { services: services } = useSelector((state) => state.services);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchServices(router));
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategorySave = (newCat) => {
    const newEntry = { id: Date.now(), name: newCat.name };
    setCategories((prev) => [...prev, newEntry]);
  };

  const handleDeleteService = async () => {
    try {
      loader(true);

      const res = await dispatch(deleteService(serviceToDelete, router));

      loader(false);

      if (res?.success) {
        toaster("success", "Services deleted successfully");
        setOpen(false);
      } else {
        toaster("error", res.message);
      }
    } catch {
      loader(false);
      toaster("error", "Server error");
    }
  };

  const filteredServices = services.filter(
    (s) => s.category?._id?.toString() === activeCategory?.toString(),
  );

  const activeLabel =
    categories.find((c) => c._id === activeCategory)?.name ?? "";

  return (
    <>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in { animation: modal-in 0.18s ease-out both; }
      `}</style>

      <DashboardHeader title="Your Business" />

      <div className="flex flex-col md:flex-row min-h-[680px] bg-[#f4f7fb] ">
        <aside className="md:w-56 w-full shrink-0 bg-white border-r border-gray-100 flex flex-col py-4 md:py-6 px-3 gap-2 relative">
          {/* Title */}
          <p className="md:text-[11px] text-sm uppercase font-bold tracking-widest text-gray-400 px-1 md:px-3 mb-1 md:mb-2">
            Categories
          </p>

          <div className="md:hidden">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full p-2 text-black border border-gray-300 rounded-lg text-sm outline-none bg-white"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden md:flex flex-col gap-1">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat._id
                    ? "bg-[#1e4e8c] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-xs font-bold rounded-full px-1.5 py-0.5 ${
                    activeCategory === cat._id
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {
                    services.filter(
                      (s) => s.category?._id?.toString() === cat._id.toString(),
                    ).length
                  }
                </span>
              </button>
            ))}
          </div>

          {/* ➕ Add Category Button (same for both) */}
          <div className="mt-3 md:absolute md:bottom-0 md:left-0 w-full px-1 md:px-3">
            <button
              onClick={() => setAddCategoryOpen(true)}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-2.5 px-4 text-sm font-semibold text-[#1e4e8c] hover:border-[#1e4e8c] hover:bg-blue-50/40 transition-colors"
            >
              <Plus size={15} /> Add category
            </button>
          </div>
        </aside>

        <main className="w-[400px] md:flex-1 md:px-6 px-4 py-8">
          <div className="flex md:flex-row flex-col gap-2 md:items-start justify-between mb-7">
            <div>
              <h1 className="text-2xl font-bold text-[#1e2d3d]">Services</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Manage and organize your service offerings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 border border-[#1e4e8c] text-[#1e4e8c] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
                onClick={() => router.push("/Business/AddServicesGroup")}
              >
                <CreditCard size={15} /> Add service group
              </button>
              <button
                className="flex items-center gap-2 bg-[#1e4e8c] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#163d6e] transition-colors shadow-sm"
                onClick={() => router.push("/Business/AddServices")}
              >
                <Plus size={15} /> Add service
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
              <FolderPlus size={16} className="text-[#1e4e8c]" />
              <span className="font-bold text-[#1e2d3d] text-sm">
                {activeLabel}
              </span>
            </div>

            {filteredServices.length === 0 ? (
              <div className="min-h-[450px] flex flex-col items-center justify-center text-center text-gray-400 text-sm">
                <Settings size={40} className="mx-auto mb-3 text-gray-300" />
                <p>No services in this category yet. </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredServices.map((svc) => (
                  <div
                    key={svc.id}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition-colors group"
                  >
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Settings size={14} className="text-gray-400" />
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1e2d3d] truncate">
                        {svc.name}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={11} /> {svc.duration}
                        </span>
                        <span
                          className={`flex items-center gap-1 text-xs font-bold ${
                            svc.isFree ? "text-emerald-500" : "text-[#1e4e8c]"
                          }`}
                        >
                          <CreditCard size={11} /> {svc.price}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-100 group-hover:opacity-90 transition-opacity">
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#1e4e8c] hover:bg-blue-50 transition-colors"
                        onClick={() =>
                          router.push(`/Business/AddServices?id=${svc._id}`)
                        }
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="w-4 h-4"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setOpen(true);
                          setServiceToDelete(svc._id);
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <AddCategoryModal
        isOpen={addCategoryOpen}
        onClose={() => setAddCategoryOpen(false)}
        onSave={handleCategorySave}
        loader={setLoading}
        toaster={props.toaster}
        fetchCategories={fetchCategories}
        router={router}
      />

      <ConfirmModal
        isOpen={open}
        setIsOpen={setOpen}
        title="Delete Service"
        message={`Are you sure you want to delete this service?`}
        onConfirm={handleDeleteService}
        yesText="Yes, Delete"
        noText="Cancel"
      />

      {loading && (
        <div className="fixed inset-0 z-40 bg-white/60 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#1e4e8c]/20 border-t-[#1e4e8c] rounded-full animate-spin" />
        </div>
      )}
    </>
  );
}
