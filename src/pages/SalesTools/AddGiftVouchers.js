import React, { useEffect, useState, useRef } from "react";
import {
  Check,
  Upload,
  Pencil,
  Trash2,
  Plus,
  X,
  ChevronRight,
  Gift,
  CheckCircle2,
  Info,
  Clock,
  FileText,
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Api } from "@/services/service";

function getInitialState() {
  return {
    GiftVoucher_name: "",
    sku_handle: "",
    amount: "",
    description: "",
    tax_status: "taxable",
    cost_price: "",
    price: "",
    price_includes_tax: false,
    selected_template: "signature_atelier",
    custom_amount_online: true,
    expiry_type: "after",
    expiry_value: 12,
    expiry_unit: "Months",
    terms_template: "default",
    termsValue: "",
  };
}

function validate(formData) {
  const errors = {};
  if (!formData.GiftVoucher_name.trim())
    errors.GiftVoucher_name = "GiftVoucher name is required.";
  if (!formData.price) errors.price = "Price is required.";
  return { isValid: Object.keys(errors).length === 0, errors };
}

export default function AddGiftVouchers(props) {
  const [formData, setFormData] = useState(getInitialState());
  const [errors, setErrors] = useState({});
  const [services, setServices] = useState([]);

  const [selectedTemplate, setSelectedTemplate] = useState("signature");
  const [expiryType, setExpiryType] = useState("after");

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
    const fetchGiftVoucher = async () => {
      try {
        props.loader(true);
        const res = await Api("get", `gift-vouchers/${id}`, "", router);
        props.loader(false);
        if (res?.status === true) {
          const d = res.data.data;
          setFormData({
            ...getInitialState(),
            ...d,
          });
        } else {
          props.toaster("error", res?.message || "Failed to fetch GiftVoucher");
        }
      } catch {
        props.loader(false);
        props.toaster("error", "Server error");
      }
    };
    fetchGiftVoucher();
  }, [id]);

  const set = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    // const { isValid, errors: errs } = validate(formData);
    // if (!isValid) {
    //   setErrors(errs);
    //   props.toaster("error", Object.values(errs)[0]);
    //   return;
    // }
    // setErrors({});

    try {
      props.loader(true);
      let res;
      if (id) {
        res = await Api("put", `gift-vouchers/update/${id}`, formData, router);
      } else {
        res = await Api("post", "gift-vouchers/create", formData, router);
      }
      props.loader(false);

      if (res?.status === true) {
        props.toaster(
          "success",
          id
            ? "GiftVoucher updated successfully"
            : "GiftVoucher created successfully",
        );
        if (!id) setFormData(getInitialState());
        router.push("/SalesTools/GiftVouchers");
      } else {
        props.toaster("error", res?.message || "Something went wrong");
      }
    } catch {
      props.loader(false);
      props.toaster("error", "Server error");
    }
  };

  const templates = [
    {
      id: "modern",
      name: "Modern Minimalist",
      desc: "Clean aesthetics for any occasion",
      image: "/images/template-1.png",
    },
    {
      id: "signature",
      name: "Signature Atelier",
      desc: "Our premium branded experience",
      image: "/images/template-2.png",
    },
    {
      id: "seasonal",
      name: "Seasonal Botanicals",
      desc: "Elegant floral patterns",
      image: "/images/template-3.png",
    },
  ];

  return (
    <>
      <DashboardHeader title="Sales Tools" />
      <div className="min-h-screen bg-custom-gray text-slate-900">
        <div className=" px-5 py-3 flex items-center justify-between ">
          <div>
            <div className="text-[11px] text-gray-500 flex items-center gap-1">
              <span className="text-custom-blue hover:underline cursor-pointer">
                Gift Vouchers
              </span>
              <ChevronRight size={10} />
              Add Gift Voucher
            </div>
            <h1 className="text-xl font-medium">Gift Vouchers</h1>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button className="px-5 py-1.5 bg-custom-blue text-white rounded-md text-sm font-medium hover:bg-[#132a4e] transition-colors">
              Save
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 pb-16 space-y-4">
          <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Gift size={18} className="text-gray-500" />
              <h2 className="text-sm font-semibold">Gift voucher settings</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => set("amount", e.target.value)}
                    className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:border-custom-blue focus:ring-2 focus:ring-custom-blue/10 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase">
                  Gift Voucher Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Birthday Special"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-custom-blue outline-none"
                  value={formData.GiftVoucher_name}
                  onChange={(e) => set("GiftVoucher_name", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase">
                SKU / Handle
              </label>
              <input
                type="text"
                placeholder="GV-2024-XXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-custom-blue outline-none"
                value={formData.sku_handle}
                onChange={(e) => set("sku_handle", e.target.value)}
              />
            </div>
          </section>

          {/* Templates Card */}
          <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-gray-500" />
                <h2 className="text-sm font-semibold">Choose a template</h2>
              </div>
              <button className="text-xs text-custom-blue font-medium">
                Manage All Templates
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => {
                    set("selected_template", tpl.id);
                    setSelectedTemplate(tpl.id);
                  }}
                  className={`cursor-pointer group border-2 rounded-lg overflow-hidden transition-all ${
                    selectedTemplate === tpl.id
                      ? "border-custom-blue"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <img
                    src={tpl.image}
                    alt={tpl.label}
                    className="w-full h-32 rounded-lg object-cover"
                  />
                  <div className="p-1.5 text-center">
                    <div
                      className={`text-[11px] font-bold leading-tight ${selectedTemplate === tpl.id ? "text-blue-700" : "text-gray-700"}`}
                    >
                      {tpl.name}
                    </div>
                    <div className="text-[9px] text-gray-500 mt-0.5 leading-tight">
                      {tpl.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={18} className="text-gray-500" />
              <h2 className="text-sm font-semibold">Online Purchase Rules</h2>
            </div>
            <div className="flex gap-3 p-3 bg-gray-50 rounded-lg mb-3">
              <div className="w-4 h-4 bg-custom-blue rounded flex items-center justify-center mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  onClick={() =>
                    set("custom_amount_online", !formData.custom_amount_online)
                  }
                  className=""
                />
              </div>
              <div>
                <div className="text-sm font-semibold">
                  Custom amount vouchers can be purchased online
                </div>
                <div className="text-[11px] text-gray-500">
                  Allows clients to define their own value between your minimum
                  and maximum limits.
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <Info size={14} className="text-custom-blue mt-0.5 shrink-0" />
              <p className="text-[12px] text-blue-700">
                Note:{" "}
                <span className="font-bold underline cursor-pointer">
                  Full online payment must be taken for the purchase of a
                  voucher.
                </span>
              </p>
            </div>
          </section>

          {/* Expiry Card */}
          <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-gray-500" />
              <h2 className="text-sm font-semibold">Voucher Expiry</h2>
            </div>
            <div className="flex gap-6 mb-4">
              <label
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => {
                  set("expiry_type", "never");
                  setExpiryType("never");
                }}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${expiryType === "never" ? "border-custom-blue" : "border-gray-300"}`}
                >
                  {expiryType === "never" && (
                    <div className="w-2 h-2 bg-custom-blue rounded-full" />
                  )}
                </div>
                <span className="text-sm">Never expires</span>
              </label>
              <label
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  set("expiry_type", "after");
                }}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${expiryType === "after" ? "border-custom-blue" : "border-gray-300"}`}
                >
                  {expiryType === "after" && (
                    <div className="w-2 h-2 bg-custom-blue rounded-full" />
                  )}
                </div>
                <span className="text-sm">After</span>
                <div className="flex items-center gap-2 ml-1">
                  <input
                    type="number"
                    defaultValue={12}
                    value={formData.expiry_value}
                    onChange={(e) => set("expiry_value", e.target.value)}
                    className="w-14 text-center py-1 border border-gray-300 rounded text-sm focus:border-custom-blue outline-none"
                  />
                  <select
                    className="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:border-custom-blue outline-none"
                    value={formData.expiry_unit}
                    onChange={(e) => set("expiry_unit", e.target.value)}
                  >
                    <option>Months</option>
                    <option>Years</option>
                    <option>Days</option>
                  </select>
                </div>
              </label>
            </div>
            <div className="flex gap-2 p-3 bg-gray-50 border border-gray-100 rounded-lg">
              <Info size={14} className="text-gray-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Please check with the laws of your country, as some prohibit the
                use of expiry dates or mandate minimum durations for gift
                vouchers.
              </p>
            </div>
          </section>

          {/* T&C Card */}
          <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} className="text-gray-500" />
              <h2 className="text-sm font-semibold">
                Standard Terms & Conditions
              </h2>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase">
                Select Template
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-custom-blue outline-none bg-white"
                value={formData.terms_template}
                onChange={(e) => set("terms_template", e.target.value)}
              >
                <option>Default </option>
                <option>None </option>
                <option>Custom </option>
              </select>
            </div>
            {formData.terms_template === "Custom" && (
              <textarea
                value={formData.termsValue}
                rows={3}
                placeholder=""
                onChange={(e) => set("termsValue", e.target.value)}
                className=" mt-8 w-full appearance-none border border-gray-300 rounded pl-3 pr-8 py-2 text-[13px] text-gray-900 bg-white cursor-pointer focus:border-custom-blue outline-none"
              />
            )}
          </section>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button className="px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button className="px-5 py-1.5 bg-custom-blue text-white rounded-md text-sm font-medium hover:bg-[#132a4e] transition-colors shadow-lg shadow-blue-900/10"
            onClick={handleSubmit}
            >
              Save Change
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
