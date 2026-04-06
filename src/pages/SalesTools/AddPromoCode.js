import React, { useEffect, useState } from "react";
import { Check, Tag, Calendar, Settings, Users, Zap } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Api } from "@/services/service";

function getInitialState() {
  return {
    promo_name: "",
    voucher_code: "",
    discount_type: "percentage",
    discount_value: "",
    tax_treatment: "before",
    limit_per_customer: "1",
    total_uses: "",
    min_spend: "",
    validity_start: "",
    validity_end: "",
    appointment_date_start: "",
    appointment_date_end: "",
    applies_to_staff: "all",
    applies_to_customers: "vip",
    selected_services: ["Premium Hair Styling", "Color & Highlights"],
    combine_with_promos: false,
    status: true,
  };
}

function validate(formData) {
  const errors = {};
  if (!formData.promo_name.trim())
    errors.promo_name = "Promo code name is required.";
  if (!formData.voucher_code.trim())
    errors.voucher_code = "Voucher code is required.";
  if (!formData.discount_value)
    errors.discount_value = "Discount value is required.";
  return { isValid: Object.keys(errors).length === 0, errors };
}

export default function AddPromoCode(props) {
  const [formData, setFormData] = useState(getInitialState());
  const [errors, setErrors] = useState({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;

    const fetchPromoCode = async () => {
      try {
        props.loader(true);
        const res = await Api("get", `promo-codes/${id}`, "", router);
        props.loader(false);

        if (res?.status === true) {
          const data = res.data.data;
          setFormData({
            promo_name: data.promo_name || "",
            voucher_code: data.voucher_code || "",
            discount_type: data.discount_type || "percentage",
            discount_value: data.discount_value || "",
            tax_treatment: data.tax_treatment || "before",
            limit_per_customer: data.limit_per_customer || "1",
            total_uses: data.total_uses || "",
            min_spend: data.min_spend || "",
            validity_start: data.validity_start || "",
            validity_end: data.validity_end || "",
            appointment_date_start: data.appointment_date_start || "",
            appointment_date_end: data.appointment_date_end || "",
            applies_to_staff: data.applies_to_staff || "all",
            applies_to_customers: data.applies_to_customers || "vip",
            selected_services: data.selected_services || [],
            combine_with_promos: data.combine_with_promos || false,
            status: data.status ?? true,
          });
        } else {
          props.toaster("error", res?.message || "Failed to fetch promo code");
        }
      } catch (err) {
        props.loader(false);
        props.toaster("error", "Server error");
      }
    };

    fetchPromoCode();
  }, [id]);

  const set = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    set("voucher_code", code);
  };

  const handleSubmit = async () => {
    const { isValid, errors: errs } = validate(formData);
    if (!isValid) {
      setErrors(errs);
      props.toaster("error", Object.values(errs)[0]);
      return;
    }
    setErrors({});

    const payload = {
      promo_name: formData.promo_name,
      voucher_code: formData.voucher_code,
      discount_type: formData.discount_type,
      discount_value: formData.discount_value,
      tax_treatment: formData.tax_treatment,
      limit_per_customer: formData.limit_per_customer,
      total_uses: formData.total_uses,
      min_spend: formData.min_spend,
      validity_start: formData.validity_start,
      validity_end: formData.validity_end,
      appointment_date_start: formData.appointment_date_start,
      appointment_date_end: formData.appointment_date_end,
      applies_to_staff: formData.applies_to_staff,
      applies_to_customers: formData.applies_to_customers,
      selected_services: formData.selected_services,
      combine_with_promos: formData.combine_with_promos,
      status: formData.status,
    };

    try {
      props.loader(true);
      let res;
      if (id) {
        res = await Api("put", `promo-codes/${id}`, payload, router);
      } else {
        res = await Api("post", `promo-codes`, payload, router);
      }
      props.loader(false);

      if (res?.status === true) {
        props.toaster(
          "success",
          id
            ? "Promo code updated successfully"
            : "Promo code created successfully",
        );
        if (!id) setFormData(getInitialState());
        router.push("/SalesTools/Promocode");
      } else {
        props.toaster("error", res?.message || "Something went wrong");
      }
    } catch (err) {
      props.loader(false);
      props.toaster("error", "Server error");
    }
  };

  const discountSuffix = formData.discount_type === "percentage" ? "%" : "$";

  const livePreviewServices = formData.selected_services.join(", ");

  return (
    <>
      <DashboardHeader title="Sales Tools" />
      <div className="min-h-screen bg-custom-gray">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-sm text-gray-500 mb-1">
            <span
              className="hover:underline cursor-pointer"
              onClick={() => router.push("/SalesTools/Promocode")}
            >
              Promo codes
            </span>
            <span className="mx-1">›</span>
            <span className="text-gray-700">
              {id ? "Edit promo code" : "Add promo code"}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {id ? "Edit promo code" : "Add promo code"}
              </h1>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                <button
                  type="button"
                  onClick={() => set("status", !formData.status)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.status ? "bg-custom-blue" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.status ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span
                  className={`text-sm font-medium ${
                    formData.status ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {formData.status ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/SalesTools/Promocode")}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
            <div className="lg:col-span-2 space-y-4">
           
              <Card title="Promo Code Name" icon={<Tag size={16} />}>
                <div>
                  <Label required>Voucher code</Label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SUMMER24"
                      value={formData.voucher_code}
                      onChange={(e) =>
                        set("voucher_code", e.target.value.toUpperCase())
                      }
                      className={inputCls(errors.voucher_code)}
                    />
                    <button
                      type="button"
                      onClick={generateCode}
                      className="px-4 py-2 text-sm font-medium text-custom-blue border border-custom-blue rounded-lg hover:bg-blue-50 transition whitespace-nowrap"
                    >
                      Generate
                    </button>
                  </div>
                  {errors.voucher_code && <ErrMsg msg={errors.voucher_code} />}
                </div>

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
                  <span className="text-blue-400 mt-0.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-blue-700 mb-0.5">
                      Make it memorable
                    </p>
                    <p className="text-xs text-blue-600">
                      Customers are 20% more likely to use codes that are short
                      (6-8 characters) and thematic. For example: NEWCLIENT,
                      SPRING20, or E99.
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Label required>Promo code name</Label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Sale 2024"
                    value={formData.promo_name}
                    onChange={(e) => set("promo_name", e.target.value)}
                    className={inputCls(errors.promo_name)}
                  />
                  {errors.promo_name && <ErrMsg msg={errors.promo_name} />}
                </div>
              </Card>

             
              <Card
                title="Discount Details"
                icon={
                  <span className="text-gray-500 font-bold text-sm">%</span>
                }
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Discount type</Label>
                    <select
                      value={formData.discount_type}
                      onChange={(e) => set("discount_type", e.target.value)}
                      className={inputCls()}
                    >
                      <option value="percentage">Percentage off</option>
                      <option value="fixed">Fixed amount off</option>
                      <option value="free">Free service</option>
                    </select>
                  </div>
                  <div>
                    <Label>Discount value</Label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.discount_value}
                        onChange={(e) => set("discount_value", e.target.value)}
                        className={`${inputCls(errors.discount_value)} pr-8`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        {discountSuffix}
                      </span>
                    </div>
                    {errors.discount_value && (
                      <ErrMsg msg={errors.discount_value} />
                    )}
                  </div>
                </div>

                <div>
                  <Label>Tax rate treatment</Label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <RadioButton
                        checked={formData.tax_treatment === "before"}
                        onChange={() => set("tax_treatment", "before")}
                      />
                      Apply before tax
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <RadioButton
                        checked={formData.tax_treatment === "after"}
                        onChange={() => set("tax_treatment", "after")}
                      />
                      Apply after tax
                    </label>
                  </div>
                </div>
              </Card>

            
              <Card title="Usage Settings" icon={<Settings size={16} />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Limit per customer</Label>
                    <input
                      type="number"
                      placeholder="1"
                      value={formData.limit_per_customer}
                      onChange={(e) =>
                        set("limit_per_customer", e.target.value)
                      }
                      className={inputCls()}
                    />
                  </div>
                  <div>
                    <Label>Total uses</Label>
                    <input
                      type="text"
                      placeholder="No limit"
                      value={formData.total_uses}
                      onChange={(e) => set("total_uses", e.target.value)}
                      className={inputCls()}
                    />
                  </div>
                  <div>
                    <Label>Min. spend</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={formData.min_spend}
                        onChange={(e) => set("min_spend", e.target.value)}
                        className={`${inputCls()} pl-7`}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                title="Active Dates & Scheduling"
                icon={<Calendar size={16} />}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Validity range</Label>
                    <div className="flex items-center gap-1">
                      <input
                        type="date"
                        value={formData.validity_start}
                        onChange={(e) => set("validity_start", e.target.value)}
                        className={inputCls()}
                      />
                      <span className="text-gray-400 text-sm">–</span>
                      <input
                        type="date"
                        value={formData.validity_end}
                        onChange={(e) => set("validity_end", e.target.value)}
                        className={inputCls()}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Appointment date range</Label>
                    <div className="flex items-center gap-1">
                      <input
                        type="date"
                        value={formData.appointment_date_start}
                        onChange={(e) =>
                          set("appointment_date_start", e.target.value)
                        }
                        className={inputCls()}
                        placeholder="No restriction on booking dates"
                      />
                      <span className="text-gray-400 text-sm">–</span>
                      <input
                        type="date"
                        value={formData.appointment_date_end}
                        onChange={(e) =>
                          set("appointment_date_end", e.target.value)
                        }
                        className={inputCls()}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* RIGHT: Applies To sidebar (1/3 width) */}
            <div className="space-y-4">
              {/* Applies To */}
              <Card title="Applies To" icon={<Users size={16} />}>
                {/* Staff */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Staff Members
                    </span>
                    <button className="text-xs text-custom-blue hover:underline">
                      Select
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      selected={formData.applies_to_staff === "all"}
                      onClick={() => set("applies_to_staff", "all")}
                    >
                      All Staff
                    </Badge>
                  </div>
                </div>

                {/* Customers */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Customers
                    </span>
                    <button className="text-xs text-custom-blue hover:underline">
                      Edit
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      selected={formData.applies_to_customers === "all"}
                      onClick={() => set("applies_to_customers", "all")}
                    >
                      All
                    </Badge>
                    <Badge
                      selected={formData.applies_to_customers === "vip"}
                      onClick={() => set("applies_to_customers", "vip")}
                      color="purple"
                    >
                      VIP Members
                    </Badge>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Services
                    </span>
                    <button className="text-xs text-custom-blue hover:underline">
                      Browse
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {formData.selected_services.map((service) => (
                      <div
                        key={service}
                        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                      >
                        <span className="text-sm text-gray-700">{service}</span>
                        <button
                          onClick={() =>
                            set(
                              "selected_services",
                              formData.selected_services.filter(
                                (s) => s !== service,
                              ),
                            )
                          }
                          className="text-gray-400 hover:text-red-500 transition"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Combine with promos */}
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={formData.combine_with_promos}
                    onChange={(v) => set("combine_with_promos", v)}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Combine with other promos
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Allow customers to stack this VA code with additional
                      discounts.
                    </p>
                  </div>
                </label>
              </Card>

              {/* Live Preview */}
              <div className="bg-custom-blue rounded-xl p-4 text-white">
                <div className="flex items-center gap-1.5 mb-3">
                  <Zap size={14} className="text-blue-200" />
                  <span className="text-xs font-semibold text-blue-200 uppercase tracking-wide">
                    Live Preview
                  </span>
                </div>
                <div className="text-3xl font-bold mb-1">
                  {formData.discount_value
                    ? `${formData.discount_value}${discountSuffix} OFF`
                    : "-- OFF"}
                </div>
                {livePreviewServices && (
                  <div className="text-sm text-blue-200 mb-3">
                    on {livePreviewServices}
                  </div>
                )}
                <div className="bg-blue-700/50 rounded-lg p-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-blue-300">Code: </span>
                    <span className="text-sm font-mono font-bold">
                      {formData.voucher_code || "XXXXXXXX"}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      formData.status
                        ? "bg-green-500/20 text-green-300"
                        : "bg-gray-500/20 text-gray-300"
                    }`}
                  >
                    {formData.status ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

         
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => router.push("/SalesTools/Promocode")}
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
    </>
  );
}



function Card({ title, subtitle, icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-0.5">
        {icon && <span className="text-gray-500">{icon}</span>}
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
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
      className={`w-4 h-4 rounded flex items-center justify-center border-2 transition flex-shrink-0 mt-0.5 ${
        checked
          ? "bg-custom-blue border-custom-blue"
          : "bg-white border-gray-300"
      }`}
    >
      {checked && <Check size={10} className="text-white" strokeWidth={3} />}
    </button>
  );
}

function RadioButton({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
        checked ? "border-custom-blue" : "border-gray-300"
      }`}
    >
      {checked && (
        <span className="w-2 h-2 rounded-full bg-custom-blue block" />
      )}
    </button>
  );
}

function Badge({ children, selected, onClick, color }) {
  const colorMap = {
    purple: selected
      ? "bg-purple-100 text-purple-700 border-purple-300"
      : "bg-gray-100 text-gray-600 border-gray-200",
    default: selected
      ? "bg-blue-100 text-custom-blue border-blue-300"
      : "bg-gray-100 text-gray-600 border-gray-200",
  };
  const cls = colorMap[color] || colorMap.default;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-3 py-1 rounded-full border font-medium transition ${cls}`}
    >
      {children}
    </button>
  );
}
