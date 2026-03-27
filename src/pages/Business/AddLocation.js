import React, { useEffect, useState } from "react";
import { MapPin, Smartphone, Phone, Check, X } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Api } from "@/services/service";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function getInitialState() {
  return {
    location_name: "",
    telephone: "",
    location_type: "fixed",
    book_online: false,
    street: "",
    apartment: "",
    suburb: "",
    city: "",
    state: "",
    postal_code: "",
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
  if (!formData.location_name.trim())
    errors.location_name = "Location name is required.";
  if (formData.location_type === "fixed") {
    if (!formData.city.trim()) errors.city = "City is required.";
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}

const TIME_OPTIONS = [
  "12:00 am",
  "1:00 am",
  "2:00 am",
  "3:00 am",
  "4:00 am",
  "5:00 am",
  "6:00 am",
  "7:00 am",
  "8:00 am",
  "9:00 am",
  "10:00 am",
  "11:00 am",
  "12:00 pm",
  "1:00 pm",
  "2:00 pm",
  "3:00 pm",
  "4:00 pm",
  "5:00 pm",
  "6:00 pm",
  "7:00 pm",
  "8:00 pm",
  "9:00 pm",
  "10:00 pm",
  "11:00 pm",
];

export default function AddLocation(props) {
  const [formData, setFormData] = useState(getInitialState());
  const [errors, setErrors] = useState({});

  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;

    const fetchLocation = async () => {
      try {
        props.loader(true);

        const res = await Api("get", `location/${id}`, "", router);

        props.loader(false);

        if (res?.status === true) {
          const data = res.data.data;

          setFormData({
            location_name: data.location_name || "",
            telephone: data.telephone || "",
            location_type: data.location_type || "fixed",
            book_online: data.book_online || false,

            street: data.address?.street || "",
            apartment: data.address?.apartment || "",
            suburb: data.address?.suburb || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            postal_code: data.address?.postal_code || "",

            hours: data.hours || getInitialState().hours,
          });
        } else {
          props.toaster("error", res?.message || "Failed to fetch location");
        }
      } catch (err) {
        props.loader(false);
        props.toaster("error", "Server error");
      }
    };

    fetchLocation();
  }, [id]);

  const set = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const setHour = (day, key, value) =>
    setFormData((prev) => ({
      ...prev,
      hours: { ...prev.hours, [day]: { ...prev.hours[day], [key]: value } },
    }));

  const handleSubmit = async () => {
    const { isValid, errors: errs } = validate(formData);
    console.log(isValid, errors);

    if (!isValid) {
      setErrors(errs);
      props.toaster("error", Object.values(errs)[0]);
      return;
    }

    setErrors({});

    const payload = {
      location_name: formData.location_name,
      telephone: formData.telephone,
      location_type: formData.location_type,
      book_online: formData.book_online,

      address: {
        street: formData.street,
        apartment: formData.apartment,
        suburb: formData.suburb,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
      },

      hours: formData.hours,
    };

    try {
      props.loader(true);

      let res;

      if (id) {
        res = await Api("put", `location/update/${id}`, payload, router);
      } else {
        res = await Api("post", `location/create`, payload, router);
      }

      props.loader(false);

      if (res?.status === true) {
        props.toaster(
          "success",
          id
            ? "Location updated successfully"
            : "Location created successfully",
        );

        if (!id) setFormData(getInitialState());
        router.push("/Business/Locations");
      } else {
        props.toaster("error", res?.message || "Something went wrong");
      }
    } catch (err) {
      props.loader(false);
      props.toaster("error", "Server error");
    }
  };

  const isFixed = formData.location_type === "fixed";

  return (
    <>
      <DashboardHeader title="Your Business" />{" "}
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-sm text-gray-500 mb-1">
            <span className="hover:underline cursor-pointer">Locations</span>
            <span className="mx-1">›</span>
            <span className="text-gray-700">Add location</span>
          </div>

          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold text-gray-900">Add location</h1>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/Business/Locations")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-custom-blue rounded-lg hover:bg-custom-blue/90 transition"
              >
                Save location
              </button>
            </div>
          </div>

          <Card
            title="Location details"
            subtitle="Choose whether your location is fixed or mobile, and enter in the location details."
          >
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <Label required>Location name</Label>
                <input
                  type="text"
                  placeholder="e.g. Downtown Studio"
                  value={formData.location_name}
                  onChange={(e) => set("location_name", e.target.value)}
                  className={inputCls(errors.location_name)}
                />
                {errors.location_name && <ErrMsg msg={errors.location_name} />}
              </div>
            </div>

            <Label>Location type</Label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <TypeCard
                selected={isFixed}
                icon={<MapPin size={16} />}
                title="Fixed"
                desc="I have a physical address where I provide services."
                onClick={() => set("location_type", "fixed")}
              />
              <TypeCard
                selected={!isFixed}
                icon={<Smartphone size={16} />}
                title="Mobile"
                desc="I travel to my customers to provide services."
                onClick={() => set("location_type", "mobile")}
              />
            </div>
            {!isFixed && (
              <div>
                <Label>Telephone</Label>
                <div className="relative">
                  <Phone
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.telephone}
                    onChange={(e) => set("telephone", e.target.value)}
                    className={`${inputCls()} pl-8`}
                  />
                </div>
              </div>
            )}

            {isFixed && (
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                <Checkbox
                  checked={formData.book_online}
                  onChange={(v) => set("book_online", v)}
                />
                Customers can book this location online
              </label>
            )}
          </Card>

          {/* Address Card — only for Fixed */}
          {isFixed && (
            <Card title="Address">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Street and number</Label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => set("street", e.target.value)}
                    className={inputCls()}
                    placeholder="Street and number"
                  />
                </div>
                <div>
                  <Label>Apartment, suite, unit, etc.</Label>
                  <input
                    type="text"
                    value={formData.apartment}
                    onChange={(e) => set("apartment", e.target.value)}
                    className={inputCls()}
                    placeholder="Apartment, suite, unit"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Suburb</Label>
                  <input
                    type="text"
                    value={formData.suburb}
                    onChange={(e) => set("suburb", e.target.value)}
                    className={inputCls()}
                    placeholder="Suburb"
                  />
                </div>
                <div>
                  <Label required>City</Label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => set("city", e.target.value)}
                    className={inputCls(errors.city)}
                    placeholder="City"
                  />
                  {errors.city && <ErrMsg msg={errors.city} />}
                </div>
                <div>
                  <Label>State / region</Label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => set("state", e.target.value)}
                    className={inputCls()}
                    placeholder="State / region"
                  />
                </div>
                <div>
                  <Label>Postal code</Label>
                  <input
                    type="number"
                    value={formData.postal_code}
                    onChange={(e) => set("postal_code", e.target.value)}
                    className={inputCls()}
                    placeholder="Postal code"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Hours Card */}
          <Card
            title="Hours"
            subtitle="Choose the standard opening times for this location."
          >
            <div className="space-y-2">
              {DAYS.map((day) => {
                const h = formData.hours[day];
                return (
                  <div key={day} className="flex items-center gap-4">
                    <label className="flex items-center gap-2 w-32 cursor-pointer select-none">
                      <Checkbox
                        checked={h.enabled}
                        onChange={(v) => setHour(day, "enabled", v)}
                      />
                      <span
                        className={`text-sm ${h.enabled ? "text-gray-800 font-medium" : "text-gray-400"}`}
                      >
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
                          {TIME_OPTIONS.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                        <span className="text-sm text-gray-500">to</span>
                        <select
                          value={h.close}
                          onChange={(e) =>
                            setHour(day, "close", e.target.value)
                          }
                          className="text-sm border border-gray-300 rounded-md px-2 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {TIME_OPTIONS.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
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

          {/* Footer buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => router.push("/Business/Locations")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-custom-blue rounded-lg hover:bg-custom-blue/90 transition"
            >
              Save location
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

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

function TypeCard({ selected, icon, title, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition w-full ${
        selected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <span
        className={`mt-0.5 ${selected ? "text-custom-blue" : "text-gray-400"}`}
      >
        {icon}
      </span>
      <div className="flex-1">
        <p
          className={`text-sm font-semibold ${selected ? "text-custom-blue/90" : "text-gray-700"}`}
        >
          {title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      {selected && (
        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-custom-blue flex items-center justify-center">
          <Check size={11} className="text-white" strokeWidth={3} />
        </span>
      )}
    </button>
  );
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
