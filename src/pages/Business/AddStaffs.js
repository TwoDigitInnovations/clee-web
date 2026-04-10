import React, { useEffect, useState } from "react";
import { Check, Search } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Api } from "@/services/service";
import { Globe, Eye, Lock } from "lucide-react";
import { Camera, Plus, ChevronDown, Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaff } from "@/redux/actions/staffActions";
import { saveTemplate } from "@/redux/actions/templateActions";
import { fetchServices } from "@/redux/actions/servicesActions";

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
    city: "",
    state: "",
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
    nickName: "Jules",
    jobTitle: "",
    referenceType: "Employee ID",
    referenceNumber: "",
    bio: "",
    customMessage: "",
    syncCalendar: true,
    photo: null,
  };
}

function validate(formData) {
  const errors = {};
  if (!formData.staff_name.trim())
    errors.staff_name = "First name is required.";
  return { isValid: Object.keys(errors).length === 0, errors };
}

export default function AddStaff(props) {
  const [formData, setFormData] = useState(getInitialState());
  const [errors, setErrors] = useState({});
  const [serviceSearch, setServiceSearch] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { services: services, loading } = useSelector(
    (state) => state.services,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchServices(router));
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchStaff = async () => {
      try {
        props.loader(true);
        const res = await Api("get", `Staff/${id}`, "", router);
        props.loader(false);
        if (res?.status === true) {
          const data = res.data.data;
          const fullName = res.data.data.fullname || "";
          const nameParts = fullName.trim().split(" ");

          setFormData({
            staff_name: nameParts[0] || "",
            last_name: nameParts.slice(1).join(" ") || "",
            mobile: data.phone || "",
            email: data.email || "",
            telephone: data.telephone || "",
            staff_type: data.staff_type || "fixed",
            employment_status: data.employment_status || "contract",
            employee_type: data.employee_type || "self_employed",
            book_online: data.book_online || false,
            profile_booking: data.profile_booking || false,
            notification: data.notification || false,
            street: data.address?.street || "",
            city: data.address?.city || "",
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

  const set = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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
      name: `${formData.staff_name} ${formData.last_name}`.trim(),
      phone: formData.mobile,
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
        city: formData.city,
      },
      service_ids: formData.service_ids,
      hours: formData.hours,
    };

    try {
      props.loader(true);

      const res = await dispatch(saveTemplate(id, payload, router));

      props.loader(false);
      if (res?.status === true) {
        props.toaster(
          "success",
          id ? "Staff updated successfully" : "Staff created successfully",
        );
        if (!id) setFormData(getInitialState());
        router.push("/Business/Staff");
      } else {
        props.toaster("error", res?.message || "Something went wrong");
      }
    } catch {
      props.loader(false);
      props.toaster("error", "Server error");
    }
  };

  const isFixed = formData.staff_type === "fixed";

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.category?.toLowerCase().includes(serviceSearch.toLowerCase()),
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
        <div className="max-w-7xl mx-auto md:px-6 px-4 py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-1">
            <span
              className="hover:underline cursor-pointer"
              onClick={() => router.push("/Business/staffs")}
            >
              Staff
            </span>
            <span className="mx-1">›</span>
            <span className="text-gray-700">
              {id ? "Edit staff" : "Add staff"}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-1 justify-between mb-5">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Staff Management
            </h1>
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
          <div className="px-0 py-6 flex  grid md:grid-cols-3 grid-cols-1">
            <SectionLabel
              title="Details"
              description="Basic information used for client communications and internal records."
            />
            <div className="bg-white md:p-6 p-4 col-span-2 flex-1 flex flex-col gap-4 max-w-full">
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
            </div>
          </div>
          <div className="px-0 py-6 flex grid md:grid-cols-3 grid-cols-1">
            <SectionLabel
              title="Location"
              description="The staff member's residential or primary working address."
            />
            <div className="bg-white md:p-6 p-4 col-span-2 flex-1 flex flex-col gap-4 max-w-full">
              <Label>Address</Label>
              <input
                type="text"
                placeholder="Street name and number"
                className={inputCls()}
              />
              <Label>City</Label>
              <input type="text" placeholder="City" className={inputCls()} />
            </div>
          </div>
          <div className="px-0 py-6 flex  grid md:grid-cols-3 grid-cols-1">
            <SectionLabel
              title="Employment status"
              description="Define the contractual nature of the staff
member's relationship."
            />
            <div className="bg-white md:p-6 p-4 col-span-2 flex-1 flex flex-col gap-4 max-w-full">
              <div className="grid grid-cols-2 gap-3">
                {["self_employed", "employee", "Renter", "other"].map(
                  (type) => {
                    const isSelected = formData.employee_type === type;

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => set("employee_type", type)}
                        className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition border flex items-center gap-3 ${
                          isSelected
                            ? "bg-custom-blue text-white border-custom-blue"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className={`w-4 h-4 flex items-center justify-center rounded border ${
                            isSelected
                              ? "bg-white border-white"
                              : "border-gray-400 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 bg-custom-blue rounded-sm" />
                          )}
                        </div>

                        {/* Text */}
                        <span>
                          {type === "self_employed"
                            ? "Self-employed"
                            : type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </div>
          <div className="px-0 py-6 flex  grid md:grid-cols-3 grid-cols-1">
            <SectionLabel
              title="Booking options"
              description="Determine how clients and managers can interact with this staff member's calendar."
            />
            <div className=" col-span-2 flex-1 flex flex-col gap-4 max-w-full">
              <div className="space-y-3">
                <div
                  onClick={() =>
                    set("profile_booking", !formData.profile_booking)
                  }
                  className="flex items-center justify-between bg-white rounded-xl p-4 cursor-pointer hover:bg-gray-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <Globe size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Enable online booking
                      </p>
                      <p className="text-xs text-gray-500">
                        Allow clients to book services directly via the portal
                      </p>
                    </div>
                  </div>

                  <Checkbox
                    checked={formData.profile_booking}
                    onChange={(v) => set("profile_booking", v)}
                  />
                </div>

                <div
                  onClick={() => set("book_online", !formData.book_online)}
                  className="flex items-center justify-between bg-white rounded-xl p-4 cursor-pointer hover:bg-gray-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <Eye size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Show on website
                      </p>
                      <p className="text-xs text-gray-500">
                        Display staff profile on public website
                      </p>
                    </div>
                  </div>

                  <Checkbox
                    checked={formData.book_online}
                    onChange={(v) => set("book_online", v)}
                  />
                </div>

                <div
                  onClick={() => set("notification", !formData.notification)}
                  className="flex items-center justify-between bg-white rounded-xl p-4 cursor-pointer hover:bg-gray-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <Lock size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Restrict access
                      </p>
                      <p className="text-xs text-gray-500">
                        Only management can view detailed performance metrics
                      </p>
                    </div>
                  </div>

                  <Checkbox
                    checked={formData.notification}
                    onChange={(v) => set("notification", v)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-0 py-6 flex  grid md:grid-cols-3 grid-cols-1">
            <SectionLabel
              title="Price tier"
              description="Charge for services based on a staff members level of experience."
            />
            <div className="bg-white col-span-2 flex-1 flex flex-col gap-4 max-w-full"></div>
          </div>
          <div className="px-0 py-6 flex  grid md:grid-cols-3 grid-cols-1">
            <SectionLabel
              title="Services"
              description="Choose which services this staff member is able to perform."
            />
            <div className=" col-span-2 flex-1 flex flex-col gap-4 max-w-full">
              <div className="relative mb-4">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {loading ? (
                <div className="text-sm text-gray-400 py-6 text-center">
                  Loading services...
                </div>
              ) : Object.keys(groupedServices).length === 0 ? (
                <div className="text-sm text-gray-400 py-6 text-center">
                  No services found.
                </div>
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
                            const allSelected = items.every((s) =>
                              formData.service_ids.includes(s._id),
                            );
                            if (allSelected) {
                              setFormData((prev) => ({
                                ...prev,
                                service_ids: prev.service_ids.filter(
                                  (sid) => !items.find((s) => s._id === sid),
                                ),
                              }));
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                service_ids: [
                                  ...new Set([
                                    ...prev.service_ids,
                                    ...items.map((s) => s._id),
                                  ]),
                                ],
                              }));
                            }
                          }}
                          className="text-xs text-custom-blue hover:underline font-medium"
                        >
                          {items.every((s) =>
                            formData.service_ids.includes(s._id),
                          )
                            ? "Deselect all"
                            : "Select all"}
                        </button>
                      </div>

                      {/* Services Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {items.map((svc) => {
                          const selected = formData.service_ids.includes(
                            svc._id,
                          );
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
                                  <Check
                                    size={10}
                                    className="text-white"
                                    strokeWidth={3}
                                  />
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

              {formData.service_ids.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold text-custom-blue">
                      {formData.service_ids.length}
                    </span>{" "}
                    service{formData.service_ids.length > 1 ? "s" : ""} selected
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl  font-semibold text-gray-900">
                Personal info
              </h2>
              <p className="text-gray-500  text-sm mt-1">
                Update employee identity details and professional biographical
                information.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Left Side: Form Fields */}
              <div className="flex-1 bg-white md:p-6 p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 uppercase mb-1">
                      alias/Nickname
                    </label>
                    <input
                      type="text"
                      name="nickName"
                      value={formData.nickName}
                      onChange={handleChange}
                      className="w-full text-[14px] bg-gray-100 border-none rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 uppercase mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      placeholder="e.g. Senior Designer"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className="w-full text-[14px] bg-gray-100 border-none rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="relative">
                    <label className="block text-[12px] font-bold text-gray-500 uppercase mb-1">
                      Reference Number Type
                    </label>
                    <select
                      name="referenceType"
                      value={formData.referenceType}
                      onChange={handleChange}
                      className="w-full text-[14px] bg-gray-100 border-none rounded-lg p-3 text-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option>Employee ID</option>
                      <option>National ID</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-8 w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 uppercase mb-1">
                      Reference Number
                    </label>
                    <input
                      type="text"
                      name="referenceNumber"
                      placeholder="Enter number"
                      value={formData.referenceNumber}
                      onChange={handleChange}
                      className="w-full text-[14px] bg-gray-100 border-none rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="mb-6 relative">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[12px] font-bold text-gray-500 uppercase">
                      Bio
                    </label>
                    <span className="text-[12px] text-gray-400">
                      {formData?.bio?.length} / 500
                    </span>
                  </div>
                  <textarea
                    name="bio"
                    rows="4"
                    placeholder="Tell us about your professional background..."
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full text-[14px] bg-gray-100 border-none rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                <div className="relative">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[12px] font-bold text-gray-500 uppercase">
                      Message for Confirmation & Reminder Emails
                    </label>
                    <span className="text-[12px] text-gray-400">
                      {formData?.customMessage?.length} / 1000
                    </span>
                  </div>
                  <textarea
                    name="customMessage"
                    rows="4"
                    placeholder="Custom message for client communications..."
                    value={formData.customMessage}
                    onChange={handleChange}
                    className="w-full text-[14px] bg-gray-100 border-none rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
              </div>

              {/* Plus Divider */}
              <div className="hidden md:flex self-center">
                <div className="p-1 bg-blue-100 rounded text-blue-600">
                  <Plus size={20} />
                </div>
              </div>

              {/* Right Side: Photo Upload */}
              <div className="w-full md:w-[420px] bg-gray-100/50  rounded-xl border border-gray-100 flex flex-col items-center">
                <h3 className="text-gray-800 font-medium mb-1 text-lg">
                  Staff Photo
                </h3>
                <p className="text-sm text-gray-500 mb-6 text-center">
                  This image will be visible to clients.
                </p>

                <div className="md:w-[320px] w-full aspect-square border-2 border-dashed border-gray-300 rounded-xl bg-white flex flex-col items-center justify-center mb-6 p-4">
                  <div className="bg-blue-50 p-4 rounded-xl mb-4">
                    <Camera className="text-blue-600" size={32} />
                  </div>
                  <p className="md:text-[12px] text-sm text-gray-500 text-center leading-relaxed">
                    Accepted formats:{" "}
                    <span className="font-bold">PNG, GIF or JPG.</span>
                    <br />
                    Maximum file size is{" "}
                    <span className="font-bold">2.0MB.</span>
                  </p>
                </div>

                <button className="w-full bg-[#00478F] text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors">
                  <Upload size={18} />
                  Upload new photo
                </button>

                <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Image Recommended Ratio: 1:1
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Calendar sync
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Choose how to sync Clee appointments with Outlook, Google, or
                Apple calendars.
              </p>

              <label className="flex items-start gap-4 bg-white p-4 rounded-lg border border-gray-100 cursor-pointer shadow-sm">
                <div className="mt-1">
                  <input
                    type="checkbox"
                    name="syncCalendar"
                    checked={formData.syncCalendar}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    Sync Clee appointments with Outlook, Google or Apple
                    calendars
                  </p>
                  <p className="text-xs text-gray-500">
                    Updates will automatically reflect across all your connected
                    devices in real-time.
                  </p>
                </div>
              </label>
            </div>
          </div>

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
        checked
          ? "bg-custom-blue border-custom-blue"
          : "bg-white border-gray-300"
      }`}
    >
      {checked && <Check size={10} className="text-white" strokeWidth={3} />}
    </button>
  );
}
function SectionLabel({ title, description }) {
  return (
    <div className="md:w-64 flex-shrink-0 mb-2">
      <p className="text-[15px] font-semibold text-slate-800">{title}</p>
      {description && (
        <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
