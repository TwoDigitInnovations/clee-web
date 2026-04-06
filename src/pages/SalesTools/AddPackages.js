import React, { useEffect, useState, useRef } from "react";
import { Check, Upload, Pencil, Trash2, Plus, X } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Api, ApiFormData } from "@/services/service";

const TAX_OPTIONS = [
  { label: "Standard (15%)", value: "standard_15" },
  { label: "Standard (10%)", value: "standard_10" },
  { label: "Zero Rated (0%)", value: "zero_0" },
  { label: "Exempt", value: "exempt" },
];

function getInitialState() {
  return {
    package_name: "",
    sku_handle: "",
    tax_status: "standard_15",
    description: "",
    cost_price: "",
    price: "",
    price_includes_tax: false,
    redemption_starts: "",
    redemption_ends: "",
    expiry_date_reminder: false,
    photo: null,
    photo_preview: null,
    package_item_type: "specific",
    specific_services: [],
    any_service_item: null,
    status: true,
  };
}

function validate(formData) {
  const errors = {};
  if (!formData.package_name.trim())
    errors.package_name = "Package name is required.";
  if (!formData.price) errors.price = "Price is required.";
  return { isValid: Object.keys(errors).length === 0, errors };
}

export default function AddPackages(props) {
  const [formData, setFormData] = useState(getInitialState());
  const [errors, setErrors] = useState({});
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [editModal, setEditModal] = useState(null);
  const fileRef = useRef(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await Api("get", "services/getAll", "", router);
        if (res?.status === true) {
          setServices(res.data?.data || []);
        }
      } catch {}
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchPackage = async () => {
      try {
        props.loader(true);
        const res = await Api("get", `packages/${id}`, "", router);
        props.loader(false);
        if (res?.status === true) {
          const d = res.data.data;
          setFormData({
            package_name: d.package_name || "",
            sku_handle: d.sku_handle || "",
            tax_status: d.tax_status || "standard_15",
            description: d.description || "",
            cost_price: d.cost_price || "",
            price: d.price || "",
            price_includes_tax: d.price_includes_tax || false,
            redemption_starts: d.redemption_starts?.slice(0, 10) || "",
            redemption_ends: d.redemption_ends?.slice(0, 10) || "",
            expiry_date_reminder: d.expiry_date_reminder || false,
            photo: null,
            photo_preview: d.photo_url || null,
            package_item_type: d.package_item_type || "specific",
            specific_services: d.specific_services || [],
            any_service_item: d.any_service_item || null,
            status: d.status ?? true,
          });
        } else {
          props.toaster("error", res?.message || "Failed to fetch package");
        }
      } catch {
        props.loader(false);
        props.toaster("error", "Server error");
      }
    };
    fetchPackage();
  }, [id]);

  const set = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    set("photo", file);
    set("photo_preview", URL.createObjectURL(file));
  };

  const addSpecificService = () => {
    if (!selectedServiceId) return;
    const svc = services.find((s) => s._id === selectedServiceId);
    if (!svc) return;
    const already = formData.specific_services.find(
      (s) => s.service_id === selectedServiceId,
    );
    if (already) {
      props.toaster("error", "Service already added");
      return;
    }
    set("specific_services", [
      ...formData.specific_services,
      {
        service_id: svc._id,
        service_name: svc.name,
        quantity: 1,
        type: "Visits",
      },
    ]);
    setSelectedServiceId("");
  };

  const removeSpecificService = (index) => {
    set(
      "specific_services",
      formData.specific_services.filter((_, i) => i !== index),
    );
  };

  const addAnyService = () => {
    set("any_service_item", { quantity: 1, type: "Visits" });
  };

  const removeAnyService = () => set("any_service_item", null);

  const saveEditModal = () => {
    if (editModal.index === "any") {
      set("any_service_item", {
        quantity: editModal.quantity,
        type: editModal.type,
      });
    } else {
      const updated = [...formData.specific_services];
      updated[editModal.index] = {
        ...updated[editModal.index],
        quantity: editModal.quantity,
        type: editModal.type,
      };
      set("specific_services", updated);
    }
    setEditModal(null);
  };

  const handleSubmit = async () => {
    const { isValid, errors: errs } = validate(formData);
    if (!isValid) {
      setErrors(errs);
      props.toaster("error", Object.values(errs)[0]);
      return;
    }
    setErrors({});

    const fd = new FormData();
    fd.append("package_name", formData.package_name);
    fd.append("sku_handle", formData.sku_handle);
    fd.append("tax_status", formData.tax_status);
    fd.append("description", formData.description);
    fd.append("cost_price", formData.cost_price);
    fd.append("price", formData.price);
    fd.append("price_includes_tax", formData.price_includes_tax);
    fd.append("redemption_starts", formData.redemption_starts);
    fd.append("redemption_ends", formData.redemption_ends);
    fd.append("expiry_date_reminder", formData.expiry_date_reminder);
    fd.append("package_item_type", formData.package_item_type);
    fd.append("specific_services", JSON.stringify(formData.specific_services));
    fd.append("any_service_item", JSON.stringify(formData.any_service_item));
    fd.append("status", formData.status);

    if (formData.photo) fd.append("photo", formData.photo);

    try {
      props.loader(true);
      let res;
      if (id) {
        res = await ApiFormData("put", `packages/${id}`, fd, router);
      } else {
        res = await ApiFormData("post", "packages", fd, router);
      }
      props.loader(false);

      if (res?.status === true) {
        props.toaster(
          "success",
          id ? "Package updated successfully" : "Package created successfully",
        );
        if (!id) setFormData(getInitialState());
        router.push("/SalesTools/Packages");
      } else {
        props.toaster("error", res?.message || "Something went wrong");
      }
    } catch {
      props.loader(false);
      props.toaster("error", "Server error");
    }
  };

  const descLen = formData.description.length;

  return (
    <>
      <DashboardHeader title="Sales Tools" />
      <div className="min-h-screen bg-custom-gray">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-1">
            <span
              className="hover:underline cursor-pointer"
              onClick={() => router.push("/SalesTools/Packages")}
            >
              Packages
            </span>
            <span className="mx-1">›</span>
            <span className="text-gray-700">
              {id ? "Edit Package" : "Add Packages"}
            </span>
          </div>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {id ? "Edit Package" : "Add Packages"}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/SalesTools/Packages")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-custom-blue rounded-lg hover:bg-custom-blue/90 transition"
              >
                Save
              </button>
            </div>
          </div>

          {/* ── Package Details ── */}
          <Section title="Package details">
            {/* Package Name */}
            <div className="mb-4">
              <Label required>Package name</Label>
              <input
                type="text"
                placeholder="e.g. Signature Wellness Series"
                value={formData.package_name}
                onChange={(e) => set("package_name", e.target.value)}
                className={inputCls(errors.package_name)}
              />
              {errors.package_name && <ErrMsg msg={errors.package_name} />}
            </div>

            {/* SKU / Tax Status */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>SKU / Handle</Label>
                <input
                  type="text"
                  placeholder="PKG-2024-SW"
                  value={formData.sku_handle}
                  onChange={(e) => set("sku_handle", e.target.value)}
                  className={inputCls()}
                />
              </div>
              <div>
                <Label>Tax status</Label>
                <select
                  value={formData.tax_status}
                  onChange={(e) => set("tax_status", e.target.value)}
                  className={inputCls()}
                >
                  {TAX_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <Label>Description</Label>
                <span className="text-xs text-gray-400">
                  {descLen}/1000 characters
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={1000}
                placeholder="Describe what's included in this package..."
                value={formData.description}
                onChange={(e) => set("description", e.target.value)}
                className={`${inputCls()} resize-none`}
              />
            </div>

            {/* Cost Price / Price */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <Label>Cost price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.cost_price}
                    onChange={(e) => set("cost_price", e.target.value)}
                    className={`${inputCls()} pl-7`}
                  />
                </div>
              </div>
              <div>
                <Label required>Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => set("price", e.target.value)}
                    className={`${inputCls(errors.price)} pl-7`}
                  />
                </div>
                {errors.price && <ErrMsg msg={errors.price} />}
              </div>
            </div>

            {/* Price includes tax */}
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
              <Checkbox
                checked={formData.price_includes_tax}
                onChange={(v) => set("price_includes_tax", v)}
              />
              Price includes tax
            </label>
          </Section>

          {/* ── Validity ── */}
          <Section title="Validity">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Redemption starts</Label>
                <input
                  type="date"
                  value={formData.redemption_starts}
                  onChange={(e) => set("redemption_starts", e.target.value)}
                  className={inputCls()}
                />
              </div>
              <div>
                <Label>Redemption ends</Label>
                <input
                  type="date"
                  value={formData.redemption_ends}
                  onChange={(e) => set("redemption_ends", e.target.value)}
                  className={inputCls()}
                />
              </div>
            </div>

            {/* Expiry Date Reminder */}
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Expiry Date Reminder
                  </p>
                  <p className="text-xs text-gray-500">
                    Send customers an email prior to expiry
                  </p>
                </div>
              </div>
              <Toggle
                checked={formData.expiry_date_reminder}
                onChange={(v) => set("expiry_date_reminder", v)}
              />
            </div>
          </Section>

          <Section
            title="Edit Service Package"
            subtitle="Configure package assets, services, and inventory associations."
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Photo upload */}
              <div className="col-span-1">
                <p className="text-sm font-medium text-gray-700 mb-2">Photo</p>
                <div
                  className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 cursor-pointer hover:border-custom-blue transition"
                  style={{ aspectRatio: "4/3" }}
                  onClick={() => fileRef.current?.click()}
                >
                  {formData.photo_preview ? (
                    <img
                      src={formData.photo_preview}
                      alt="Package"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2 p-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9ca3af"
                          strokeWidth="1.5"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-400 text-center">
                        Drop an image or click to upload
                      </p>
                    </div>
                  )}
                  {/* bookmark icon top right */}
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded flex items-center justify-center">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="2"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhoto}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Requirements: Minimum size 800x600px. JPG, PNG or HEIF formats
                  only. Max size 5MB.
                </p>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <Upload size={12} />
                  Upload new photo
                </button>
              </div>

             
              <div className="md:col-span-2">
                <div className="flex flex-col md:flex-row md:items-center items-start gap-1 justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700">
                    Package items
                  </p>
                  <p className="text-xs text-gray-500">
                    Define which services are included in this bundle.
                  </p>
                </div>

                {/* Tab: Specific / Any */}
                <div className="flex border-b border-gray-200 mb-4">
                  {["specific", "any"].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => set("package_item_type", tab)}
                      className={`px-5 py-2 text-sm font-medium border-b-2 transition -mb-px ${
                        formData.package_item_type === tab
                          ? "border-custom-blue text-custom-blue"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab === "specific" ? "Specific service" : "Any service"}
                    </button>
                  ))}
                </div>

                {/* Specific Service Tab */}
                {formData.package_item_type === "specific" && (
                  <div>
                    {/* Add service row */}
                    <div className="flex gap-2 mb-4">
                      <select
                        value={selectedServiceId}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                        className={`${inputCls()} flex-1`}
                      >
                        <option value="">Select a service to add...</option>
                        {services.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={addSpecificService}
                        className="flex items-center gap-1.5 px-2 md:px-4 py-2 text-sm font-medium text-white bg-custom-blue rounded-lg hover:bg-custom-blue/90 transition whitespace-nowrap"
                      >
                        <Plus size={14} />
                        Add service
                      </button>
                    </div>

                    {formData.specific_services.length === 0 ? (
                      <EmptyServices />
                    ) : (
                      <ServiceTable
                        items={formData.specific_services}
                        onEdit={(index) =>
                          setEditModal({
                            index,
                            quantity:
                              formData.specific_services[index].quantity,
                            type: formData.specific_services[index].type,
                          })
                        }
                        onDelete={removeSpecificService}
                        nameKey="service_name"
                      />
                    )}
                  </div>
                )}

                {/* Any Service Tab */}
                {formData.package_item_type === "any" && (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Add an item to this package that can be redeemed against
                      any service that you offer.
                    </p>
                    {!formData.any_service_item ? (
                      <button
                        type="button"
                        onClick={addAnyService}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-custom-blue rounded-lg hover:bg-custom-blue/90 transition mb-4"
                      >
                        Add "any service" item
                      </button>
                    ) : null}

                    {/* Table header */}
                    <div className="border-t border-gray-200 mt-2">
                      <div className="grid grid-cols-2 py-2 px-1">
                        <span className="text-sm font-semibold text-gray-700">
                          Name
                        </span>
                        <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                          Limit
                          <span className="w-4 h-4 rounded-full bg-gray-300 text-gray-600 text-xs flex items-center justify-center font-bold">
                            ?
                          </span>
                        </span>
                      </div>
                      <div className="border-t border-gray-200" />
                      {formData.any_service_item ? (
                        <div className="grid grid-cols-2 items-center py-3 px-1">
                          <span className="text-sm text-gray-700">
                            Any service
                          </span>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              {formData.any_service_item.quantity}{" "}
                              {formData.any_service_item.type} limit
                            </span>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditModal({
                                    index: "any",
                                    quantity:
                                      formData.any_service_item.quantity,
                                    type: formData.any_service_item.type,
                                  })
                                }
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-500"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={removeAnyService}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-red-50 transition text-gray-500 hover:text-red-500"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-3 px-1 text-sm text-gray-400">
                          No default limit
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Section>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => router.push("/SalesTools/Packages")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-custom-blue rounded-lg hover:bg-custom-blue/90 transition"
            >
              Save Change
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <EditPackageItemModal
          quantity={editModal.quantity}
          type={editModal.type}
          onChange={(field, val) =>
            setEditModal((prev) => ({ ...prev, [field]: val }))
          }
          onOk={saveEditModal}
          onClose={() => setEditModal(null)}
        />
      )}
    </>
  );
}

function EmptyServices() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="1.5"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">
        There are currently no items set up as part of this package
      </p>
      <p className="text-xs text-gray-400">
        Start by selecting a service from the dropdown above to build your
        bundle.
      </p>
    </div>
  );
}

function ServiceTable({ items, onEdit, onDelete, nameKey }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-2.5 font-semibold text-gray-700">
              Name
            </th>
            <th className="text-left px-4 py-2.5 font-semibold text-gray-700">
              <span className="flex items-center gap-1">
                Limit
                <span className="w-4 h-4 rounded-full bg-gray-300 text-gray-600 text-xs flex items-center justify-center font-bold">
                  ?
                </span>
              </span>
            </th>
            <th className="px-4 py-2.5 w-20" />
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={index}
              className="border-t border-gray-100 hover:bg-gray-50"
            >
              <td className="px-4 py-3 text-gray-700">{item[nameKey]}</td>
              <td className="px-4 py-3 text-gray-500">
                {item.quantity} {item.type}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1 justify-end">
                  <button
                    type="button"
                    onClick={() => onEdit(index)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-500"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(index)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-red-50 transition text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditPackageItemModal({ quantity, type, onChange, onOk, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-5 w-72"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Edit package item
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <Label>Quantity</Label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => onChange("quantity", Number(e.target.value))}
              className={inputCls()}
            />
          </div>
          <div>
            <Label>Type</Label>
            <select
              value={type}
              onChange={(e) => onChange("type", e.target.value)}
              className={inputCls()}
            >
              <option value="Visits">Visits</option>
              <option value="Hours">Hours</option>
              <option value="Minutes">Minutes</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onOk}
            className="px-6 py-2 text-sm font-semibold text-white bg-custom-blue rounded-lg hover:bg-custom-blue/90 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5 mb-4 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1 h-5 bg-custom-blue rounded-full" />
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-sm text-gray-500 mb-4 ml-3">{subtitle}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function ErrMsg({ msg }) {
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

function inputCls(err) {
  return `w-full border ${
    err ? "border-red-400" : "border-gray-300"
  } rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`;
}

function Checkbox({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-4 h-4 rounded flex items-center justify-center border-2 transition flex-shrink-0 ${
        checked
          ? "bg-custom-blue border-custom-blue"
          : "bg-white border-gray-300"
      }`}
    >
      {checked && <Check size={10} className="text-white" strokeWidth={3} />}
    </button>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
        checked ? "bg-custom-blue" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
