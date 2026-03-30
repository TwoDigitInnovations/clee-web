import React, { useEffect, useState } from "react";
import { MapPin, Smartphone, Phone, Check, Search } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Api } from "@/services/service";

const DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

const DUMMY_SERVICES = [
  { _id: "s1", category: "Hair", name: "Haircut" },
  { _id: "s2", category: "Hair", name: "Hair Coloring" },
  { _id: "s3", category: "Hair", name: "Blowout" },
  { _id: "s4", category: "Hair", name: "Hair Treatment" },
  { _id: "s5", category: "Skin", name: "Facial" },
  { _id: "s6", category: "Skin", name: "Microdermabrasion" },
  { _id: "s7", category: "Skin", name: "Chemical Peel" },
  { _id: "s8", category: "Nails", name: "Manicure" },
  { _id: "s9", category: "Nails", name: "Pedicure" },
  { _id: "s10", category: "Nails", name: "Gel Nails" },
  { _id: "s11", category: "Massage", name: "Swedish Massage" },
  { _id: "s12", category: "Massage", name: "Deep Tissue Massage" },
  { _id: "s13", category: "Waxing", name: "Full Body Wax" },
  { _id: "s14", category: "Waxing", name: "Eyebrow Wax" },
  { _id: "s15", category: "Makeup", name: "Bridal Makeup" },
  { _id: "s16", category: "Makeup", name: "Evening Makeup" },
];

function getInitialState() {
  return {
    staff_name: "",
    last_name: "",
    mobile: "",
    email: "",
    telephone: "",
    staff_type: "fixed",
    employment_status: "contract",
    employee_type: "self_employed",
    book_online: false,
    profile_booking: false,
    notification: false,
    street: "",
    apartment: "",
    suburb: "",
    city: "",
    state: "",
    postal_code: "",
    service_ids: [],
    hours: {
      Monday: { enabled: true, open: "9:00 am", close: "5:00 pm" },
      Tuesday: { enabled: true, open: "9:00 am", close: "5:00 pm" },
      Wednesday: { enabled: true, open: "9:00 am", close: "5:00 pm" },
      Thursday: { enabled: true, open: "9:00 am", close: "5:00 pm" },
      Friday: { enabled: true, open: "9:00 am", close: "5:00 pm" },
      Saturday: { enabled: false, open: "9:00 am", close: "5:00 pm" },
      Sunday: { enabled: false, open: "9:00 am", close: "5:00 pm" },
    },
  };
}

function validate(formData) {
  const errors = {};
  if (!formData.staff_name.trim()) errors.staff_name = "First name is required.";
  return { isValid: Object.keys(errors).length === 0, errors };
}

const TIME_OPTIONS = [
  "12:00 am","1:00 am","2:00 am","3:00 am","4:00 am","5:00 am","6:00 am",
  "7:00 am","8:00 am","9:00 am","10:00 am","11:00 am","12:00 pm","1:00 pm",
  "2:00 pm","3:00 pm","4:00 pm","5:00 pm","6:00 pm","7:00 pm","8:00 pm",
  "9:00 pm","10:00 pm","11:00 pm",
];

export default function AddStaff(props) {
  const [formData, setFormData] = useState(getInitialState());
  const [errors, setErrors] = useState({});
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Fetch services list
  useEffect(() => {
    const fetchServices = async () => {
      setServicesLoading(true);
      try {
        const res = await Api("get", "service", "", router);
        if (res?.status === true && res?.data?.data?.length > 0) {
          setServices(res.data.data);
        } else {
          setServices(DUMMY_SERVICES);
        }
      } catch {
        setServices(DUMMY_SERVICES);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Fetch staff if editing
  useEffect(() => {
    if (!id) return;
    const fetchStaff = async () => {
      try {
        props.loader(true);
        const res = await Api("get", `staff/${id}`, "", router);
        props.loader(false);
        if (res?.status === true) {
          const data = res.data.data;
          setFormData({
            staff_name: data.staff_name || "",
            last_name: data.last_name || "",
            mobile: data.mobile || "",
            email: data.email || "",
            telephone: data.telephone || "",
            staff_type: data.staff_type || "fixed",
            employment_status: data.employment_status || "contract",
            employee_type: data.employee_type || "self_employed",
            book_online: data.book_online || false,
            profile_booking: data.profile_booking || false,
            notification: data.notification || false,
            street: data.address?.street || "",
            apartment: data.address?.apartment || "",
            suburb: data.address?.suburb || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            postal_code: data.address?.postal_code || "",
            service_ids: data.service_ids || [],
            hours: data.hours || getInitialState().hours,
          });
        } else {
          props.toaster("error", res?.message || "Failed to fetch staff");
        }
      } catch {
        props.loader(false);
        props.toaster("error", "Server error");
      }
    };
    fetchStaff();
  }, [id]);

  const set = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const setHour = (day, key, value) =>
    setFormData((prev) => ({
      ...prev,
      hours: { ...prev.hours, [day]: { ...prev.hours[day], [key]: value } },
    }));

  const toggleService = (serviceId) => {
    setFormData((prev) => {
      const exists = prev.service_ids.includes(serviceId);
      return {
        ...prev,
        service_ids: exists
          ? prev.service_ids.filter((s) => s !== serviceId)
          : [...prev.service_ids, serviceId],
      };
    });
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
      staff_name: formData.staff_name,
      last_name: formData.last_name,
      mobile: formData.mobile,
      email: formData.email,
      telephone: formData.telephone,
      staff_type: formData.staff_type,
      employment_status: formData.employment_status,
      employee_type: formData.employee_type,
      book_online: formData.book_online,
      profile_booking: formData.profile_booking,
      notification: formData.notification,
      address: {
        street: formData.street,
        apartment: formData.apartment,
        suburb: formData.suburb,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
      },
      service_ids: formData.service_ids,
      hours: formData.hours,
    };

    try {
      props.loader(true);
      let res;
      if (id) {
        res = await Api("put", `staff/update/${id}`, payload, router);
      } else {
        res = await Api("post", "staff/create", payload, router);
      }
      props.loader(false);
      if (res?.status === true) {
        props.toaster("success", id ? "Staff updated successfully" : "Staff created successfully");
        if (!id) setFormData(getInitialState());
        router.push("/Business/staffs");
      } else {
        props.toaster("error", res?.message || "Something went wrong");
      }
    } catch {
      props.loader(false);
      props.toaster("error", "Server error");
    }
  };

  const isFixed = formData.staff_type === "fixed";

  // Group services by category
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    s.category?.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const groupedServices = filteredServices.reduce((acc, svc) => {
    const cat = svc.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(svc);
    return acc;
  }, {});

  return (
    <>
      <DashboardHeader title="Your Business" />
      <div className="min-h-screen bg-custom-gray">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-1">
            <span className="hover:underline cursor-pointer" onClick={() => router.push("/Business/staffs")}>
              Staff
            </span>
            <span className="mx-1">›</span>
            <span className="text-gray-700">{id ? "Edit staff" : "Add staff"}</span>
          </div>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/Business/staffs")}
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

          {/* Staff Details */}
          <Card
            title="Staff details"
            subtitle="Add basic details about this staff member."
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label required>First name</Label>
                <input
                  type="text"
                  placeholder="First name"
                  value={formData.staff_name}
                  onChange={(e) => set("staff_name", e.target.value)}
                  className={inputCls(errors.staff_name)}
                />
                {errors.staff_name && <ErrMsg msg={errors.staff_name} />}
              </div>
              <div>
                <Label>Last name</Label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={formData.last_name}
                  onChange={(e) => set("last_name", e.target.value)}
                  className={inputCls()}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Mobile</Label>
                <input
                  type="tel"
                  placeholder="Mobile number"
                  value={formData.mobile}
                  onChange={(e) => set("mobile", e.target.value)}
                  className={inputCls()}
                />
              </div>
              <div>
                <Label>Email</Label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={inputCls()}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Notes</Label>
                <input
                  type="text"
                  placeholder="Internal notes about this staff member"
                  className={inputCls()}
                />
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card title="Location" subtitle="Choose the location this staff member works at.">
            <div>
              <Label>Location</Label>
              <input type="text" placeholder="Select location" className={inputCls()} />
            </div>
          </Card>

          {/* Employment Status */}
          <Card title="Employment status" subtitle="Choose the employment status for this staff member.">
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => set("employment_status", "contract")}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition border ${
                  formData.employment_status === "contract"
                    ? "bg-custom-blue text-white border-custom-blue"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Contract
              </button>
              <button
                type="button"
                onClick={() => set("employment_status", "hourly")}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition border ${
                  formData.employment_status === "hourly"
                    ? "bg-custom-blue text-white border-custom-blue"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Hourly
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {["self_employed", "employee", "other"].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={formData.employee_type === type}
                    onChange={() => set("employee_type", type)}
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {type === "self_employed" ? "Self-employed" : type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          {/* Booking Options */}
          <Card title="Booking options" subtitle="Set the booking preferences for this staff member.">
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <Checkbox
                  checked={formData.profile_booking}
                  onChange={(v) => set("profile_booking", v)}
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">Profile online booking</p>
                  <p className="text-xs text-gray-500">Allow customers to book this staff member online through their profile.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <Checkbox
                  checked={formData.book_online}
                  onChange={(v) => set("book_online", v)}
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">Bookable online</p>
                  <p className="text-xs text-gray-500">Show this staff member as an option during the online booking flow.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <Checkbox
                  checked={formData.notification}
                  onChange={(v) => set("notification", v)}
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">Notification</p>
                  <p className="text-xs text-gray-500">Send appointment notifications to this staff member.</p>
                </div>
              </label>
            </div>
          </Card>

          {/* Services */}
          <Card
            title="Services"
            subtitle="Select the services this staff member can perform."
          >
            {/* Search */}
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {servicesLoading ? (
              <div className="text-sm text-gray-400 py-6 text-center">Loading services...</div>
            ) : Object.keys(groupedServices).length === 0 ? (
              <div className="text-sm text-gray-400 py-6 text-center">No services found.</div>
            ) : (
              <div className="space-y-5">
                {Object.entries(groupedServices).map(([category, items]) => (
                  <div key={category}>
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {category}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const allSelected = items.every((s) => formData.service_ids.includes(s._id));
                          if (allSelected) {
                            setFormData((prev) => ({
                              ...prev,
                              service_ids: prev.service_ids.filter(
                                (sid) => !items.find((s) => s._id === sid)
                              ),
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              service_ids: [
                                ...new Set([...prev.service_ids, ...items.map((s) => s._id)]),
                              ],
                            }));
                          }
                        }}
                        className="text-xs text-custom-blue hover:underline font-medium"
                      >
                        {items.every((s) => formData.service_ids.includes(s._id))
                          ? "Deselect all"
                          : "Select all"}
                      </button>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {items.map((svc) => {
                        const selected = formData.service_ids.includes(svc._id);
                        return (
                          <button
                            key={svc._id}
                            type="button"
                            onClick={() => toggleService(svc._id)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition ${
                              selected
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border-2 transition ${
                                selected
                                  ? "bg-custom-blue border-custom-blue"
                                  : "bg-white border-gray-300"
                              }`}
                            >
                              {selected && (
                                <Check size={10} className="text-white" strokeWidth={3} />
                              )}
                            </span>
                            <span
                              className={`text-sm font-medium truncate ${
                                selected ? "text-blue-700" : "text-gray-700"
                              }`}
                            >
                              {svc.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Selected count */}
            {formData.service_ids.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-custom-blue">{formData.service_ids.length}</span>{" "}
                  service{formData.service_ids.length > 1 ? "s" : ""} selected
                </p>
              </div>
            )}
          </Card>

          {/* Hours */}
          <Card title="Hours" subtitle="Set the working hours for this staff member.">
            <div className="space-y-2">
              {DAYS.map((day) => {
                const h = formData.hours[day];
                return (
                  <div key={day} className="flex items-center gap-4">
                    <label className="flex items-center gap-2 w-36 cursor-pointer select-none">
                      <Checkbox
                        checked={h.enabled}
                        onChange={(v) => setHour(day, "enabled", v)}
                      />
                      <span className={`text-sm ${h.enabled ? "text-gray-800 font-medium" : "text-gray-400"}`}>
                        {day}
                      </span>
                    </label>
                    {h.enabled ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={h.open}
                          onChange={(e) => setHour(day, "open", e.target.value)}
                          className="text-sm border border-gray-300 rounded-md px-2 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {TIME_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                        </select>
                        <span className="text-sm text-gray-500">to</span>
                        <select
                          value={h.close}
                          onChange={(e) => setHour(day, "close", e.target.value)}
                          className="text-sm border border-gray-300 rounded-md px-2 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {TIME_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Closed</span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Footer */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => router.push("/Business/staffs")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-custom-blue rounded-lg hover:bg-custom-blue/90 transition"
            >
              Save staff
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Sub-components ─── */

function Card({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-0.5">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {children}
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
  return `w-full border ${err ? "border-red-400" : "border-gray-300"} rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`;
}

function Checkbox({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-4 h-4 rounded flex items-center justify-center border-2 transition flex-shrink-0 ${
        checked ? "bg-custom-blue border-custom-blue" : "bg-white border-gray-300"
      }`}
    >
      {checked && <Check size={10} className="text-white" strokeWidth={3} />}
    </button>
  );
}