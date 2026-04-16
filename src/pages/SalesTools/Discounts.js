"use client";
import DashboardHeader from "@/components/DashboardHeader";
import { Api } from "@/services/service";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Scissors,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  FileText,
} from "lucide-react";

function Select({ value, onChange, options }) {
  const [open, setOpen] = useState(false);

  // 👇 current selected label find karo
  const selectedLabel =
    options.find((o) => o.value === value)?.label || "Select";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm text-slate-700"
      >
        <span>{selectedLabel}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {open && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-20 mt-1 overflow-hidden">
          {options.map((o) => (
            <div
              key={o.value}
              onClick={() => {
                onChange(o.value); // ✅ sirf value bhejo
                setOpen(false);
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition ${
                value === o.value
                  ? "bg-custom-blue text-white font-semibold"
                  : "text-slate-700 hover:bg-blue-50"
              }`}
            >
              {o.label} {/* ✅ label show karo */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

function DeleteModal({ open, onClose, onConfirm, name }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4 mx-auto">
          <Trash2 className="w-5 h-5 text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 text-center mb-1">
          Delete Discount
        </h2>
        <p className="text-sm text-slate-500 text-center mb-6">
          Are you sure you want to delete <strong>{name}</strong>? This action
          cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-slate-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const TAX_OPTIONS = [
  {
    label: "GST",
    value: "GST",
  },
  {
    label: "Not Applicable",
    value: "Not Applicable",
  },
];

const DISCOUNT_TYPES = [
  {
    label: "Generic (specify discount when applying)",
    value: "generic",
  },
  {
    label: "Percentage",
    value: "percentage",
  },
  {
    label: "Fixed amount",
    value: "fixed",
  },
];

const EMPTY_FORM = {
  name: "",
  tax: "GST",
  discountType: "Generic (specify discount when applying)",
  value: "",
};

export default function Discounts(props) {
  const router = useRouter();

  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const res = await Api("get", "discounts", "", router);
      setLoading(false);
      if (res?.status === true) setDiscounts(res.data.data);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    props?.loader?.(true);
    Api("post", "discounts", form, router)
      .then((res) => {
        props?.loader?.(false);
        if (res?.status === true) {
          props?.toaster?.({
            type: "success",
            message: "Discount added successfully",
          });
          fetchDiscounts();
        }
        setAddModal(false);
        setForm(EMPTY_FORM);
        setErrors({});
      })
      .catch(() => {
        props?.loader?.(false);

        setAddModal(false);
        setForm(EMPTY_FORM);
      });
  };

  const openEdit = (d) => {
    setForm({
      name: d.name,
      tax: d.tax,
      discountType: d.discountType,
      value: d.value,
    });
    setEditId(d._id);
    setEditModal(true);
    setErrors({});
  };

  const handleEdit = () => {
    if (!validate()) return;
    props?.loader?.(true);
    const id = editId;
    Api("put", `discounts/${id}`, form, router)
      .then((res) => {
        props?.loader?.(false);
        if (res?.status === true)
          props?.toaster?.({
            type: "success",
            message: "Discount updated successfully",
          });
        fetchDiscounts();
        setEditModal(false);
        setForm(EMPTY_FORM);
        setErrors({});
      })
      .catch(() => {
        props?.loader?.(false);
        setEditModal(false);
        setForm(EMPTY_FORM);
      });
  };

  const openDelete = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    props?.loader?.(true);
    const id = deleteId;
    Api("delete", `discounts/${id}`, "", router)
      .then((res) => {
        props?.loader?.(false);
        if (res?.status === true)
          props?.toaster?.({
            type: "success",
            message: "Deleted successfully",
          });
        fetchDiscounts();
        setDeleteModal(false);
        setDeleteId(null);
      })
      .catch(() => {
        props?.loader?.(false);
        fetchDiscounts();
        setDeleteModal(false);
      });
  };

  const deleteName = discounts.find((d) => d.id === deleteId)?.name || "";

  const FormBody = (
    <div className="space-y-5 mt-5">
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
          Name<span className="text-red-500">*</span>
        </label>
        <input
          value={form.name}
          onChange={(e) => {
            setForm((p) => ({ ...p, name: e.target.value }));
            setErrors((p) => ({ ...p, name: "" }));
          }}
          placeholder="e.g. Summer Special 2024"
          className={`w-full border rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-custom-blue transition bg-gray-50 placeholder:text-gray-400 ${errors.name ? "border-red-400" : "border-gray-300"}`}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
          Tax
        </label>
        <div className="flex items-center gap-3">
          <div className="w-44">
            <Select
              value={form.tax}
              onChange={(v) => setForm((p) => ({ ...p, tax: v }))}
              options={TAX_OPTIONS}
            />
          </div>
          <span className="text-xs text-slate-400">
            Default tax rates apply
          </span>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
          Discount type
        </label>
        <Select
          value={form.discountType}
          onChange={(v) => setForm((p) => ({ ...p, discountType: v }))}
          options={DISCOUNT_TYPES}
        />
      </div>
      {(form.discountType === "percentage" ||
        form.discountType === "fixed") && (
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
            Discount Value
          </label>
          <div className="flex items-center justify-center rounded-lg border border-gray-300 ">
            {form.discountType !== "Percentage" && (
              <div className="px-4 py-2  bg-gray-200 flex justify-center items-center">
                <span className="text-md text-slate-400 mr-1">$</span>
              </div>
            )}

            <input
              value={form.value}
              onChange={(e) =>
                setForm((p) => ({ ...p, value: e.target.value }))
              }
              className={`w-full   px-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-custom-blue transition bg-gray-50 placeholder:text-gray-400`}
            />

            {form.discountType === "Percentage" && (
              <div className="px-4 py-2  bg-gray-200 flex justify-center items-center">
                <span className="text-md text-slate-400 mr-1">%</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
  const formatDiscount = (d) => {
    if (d.discountType === "percentage") {
      return `${d.value || 0}%`;
    }
    if (d.discountType === "fixed") {
      return `$${d.value || 0}`;
    }
    return "Custom";
  };

  return (
    <>
      <DashboardHeader title="Sales Tools" />

      <Modal
        open={addModal}
        onClose={() => {
          setAddModal(false);
          setForm(EMPTY_FORM);
          setErrors({});
        }}
      >
        <h2 className="text-lg font-bold text-slate-800">Add discount</h2>
        {FormBody}
        <div className="flex justify-end gap-3 mt-7">
          <button
            onClick={() => {
              setAddModal(false);
              setForm(EMPTY_FORM);
              setErrors({});
            }}
            className="px-5 py-2.5 text-sm font-semibold text-custom-blue hover:underline transition border border-custom-blue rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-6 py-2.5 bg-custom-blue hover:opacity-90 text-white text-sm font-semibold rounded-xl transition"
          >
            Save
          </button>
        </div>
      </Modal>

      <Modal
        open={editModal}
        onClose={() => {
          setEditModal(false);
          setForm(EMPTY_FORM);
          setErrors({});
        }}
      >
        <h2 className="text-lg font-bold text-slate-800">Edit discount</h2>
        {FormBody}
        <div className="flex justify-end gap-3 mt-7">
          <button
            onClick={() => {
              setEditModal(false);
              setForm(EMPTY_FORM);
              setErrors({});
            }}
            className="px-5 py-2.5 text-sm font-semibold text-custom-blue hover:underline transition border border-custom-blue rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleEdit}
            className="px-6 py-2.5 bg-custom-blue hover:opacity-90 text-white text-sm font-semibold rounded-xl transition"
          >
            Save
          </button>
        </div>
      </Modal>

      <DeleteModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        name={deleteName}
      />

      {/* ── Page ── */}
      <div className="min-h-screen bg-[#f0f1f5] text-slate-800 px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-custom-blue">Discounts</h1>
          <button
            onClick={() => {
              setForm(EMPTY_FORM);
              setErrors({});
              setAddModal(true);
            }}
            className="flex items-center gap-2 bg-custom-blue hover:opacity-90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            <Plus className="w-4 h-4" /> Add Discounts
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Sub-header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-bold text-slate-700">Active Coupons</p>
            <p className="text-sm text-slate-500">
              Showing {discounts.length} item{discounts.length !== 1 ? "s" : ""}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <span className="w-6 h-6 border-2 border-custom-blue/30 border-t-custom-blue rounded-full animate-spin" />
            </div>
          ) : discounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[550px] text-center">
              <FileText className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-sm text-slate-400">
                No discounts yet. Create one to get started.
              </p>
            </div>
          ) : (
            <>
              {discounts.map((d, i) => (
                <div
                  key={d.id}
                  className={`flex items-center justify-between px-5 py-4 transition hover:bg-blue-50/30 ${i !== 0 ? "border-t border-gray-50" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border-l-4 border-custom-blue">
                      <Scissors className="w-4 h-4 text-custom-blue" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        {d.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {d.discountType}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {d.discountType === "percentage" && (
                          <span className="text-green-600 font-medium">
                            {d.value}% OFF
                          </span>
                        )}
                        {d.discountType === "fixed" && (
                          <span className="text-blue-600 font-medium">
                            ₹{d.value} OFF
                          </span>
                        )}
                        {d.discountType === "generic" && (
                          <span className="text-gray-500 italic">
                            Custom Discount
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(d)}
                      className="border border-gray-200 text-slate-600 text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-gray-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDelete(d._id)}
                      className="w-8 h-8 flex items-center justify-center border border-red-100 text-red-400 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex flex-col items-center min-h-[450px] justify-center border-t border-dashed border-gray-100">
                <FileText className="w-8 h-8 text-gray-200 mb-2" />
                <p className="text-xs text-slate-400">
                  Create more discounts to see them here
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
