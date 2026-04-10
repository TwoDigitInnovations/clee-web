"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  User,
  MapPin,
  Info,
  CreditCard,
  Bell,
  Camera,
  Plus,
  Minus,
  Upload,
  Shield,
  Copy,
} from "lucide-react";
import InputField from "./UI/InputField";
import SelectField from "./UI/SelectField";
import TextareaField from "./UI/TextAreaField";
import { useRouter } from "next/router";
import { Api, ApiFormData } from "@/services/service";
import {
  createCustomer,
  updateCustomerById,
} from "@/redux/actions/userActions";
import { useDispatch } from "react-redux";

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-2 cursor-pointer select-none">
    <div
      onClick={onChange}
      className={`relative w-10 h-6 rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-gray-300"}`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`}
      />
    </div>
    {label && <span className="text-sm text-gray-700">{label}</span>}
  </label>
);

const SectionHeader = ({ icon: Icon, text }) => (
  <div className="col-span-2 flex items-center gap-2 text-xs font-bold text-custom-blue uppercase tracking-wider mt-3 mb-1 border-b border-blue-50 pb-2">
    {Icon && <Icon size={14} />}
    {text}
  </div>
);

const AddressBlock = ({ prefix, title, data, onChange, onCopy, copyLabel }) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-gray-800">{title}</span>
      <button
        type="button"
        onClick={onCopy}
        className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
      >
        <Copy size={12} /> {copyLabel}
      </button>
    </div>
    <InputField
      label="Address"
      name={`${prefix}_address`}
      value={data.address}
      onChange={onChange}
      placeholder="Street address, P.O. box, company name"
    />
    <InputField
      label="Suburb"
      name={`${prefix}_suburb`}
      value={data.suburb}
      onChange={onChange}
      placeholder="Suburb"
    />
    <div className="grid grid-cols-2 gap-3">
      <InputField
        label="City"
        name={`${prefix}_city`}
        value={data.city}
        onChange={onChange}
        placeholder="City"
      />
      <InputField
        label="State"
        name={`${prefix}_state`}
        value={data.state}
        onChange={onChange}
        placeholder="State/Province"
      />
    </div>
    <InputField
      label="Post code"
      name={`${prefix}_postcode`}
      value={data.postcode}
      onChange={onChange}
      placeholder="ZIP / Postal code"
    />
  </div>
);

const TABS = [
  { id: "details", label: "Details", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "more_info", label: "More info", icon: Info },
  { id: "cards", label: "Cards", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "photo", label: "Photo", icon: Camera },
];

const getInitialState = () => ({
  first_name: "",
  last_name: "",
  telephone: "",
  mobile: "",
  email: "",
  occupation: "",
  customer_type: "New",

  physical_address: {
    physical_address: "",
    physical_suburb: "",
    physical_city: "",
    physical_state: "",
    physical_postcode: "",
  },

  postal_address: {
    postal_address: "",
    postal_suburb: "",
    postal_city: "",
    postal_state: "",
    postal_postcode: "",
  },

  gender: "",
  dob: "",
  referred_by: "",
  timezone: "(GMT-08:00) Pacific Time",
  alerts: "",
  is_active: true,
  no_shows: 0,
  // Cards
  card_number: "",
  card_expiry: "",
  card_cvc: "",
  save_card: false,
  // Notifications
  booking_change_email: true,
  booking_change_sms: true,
  followup_email: false,
  rebooking_reminder: false,
  email_reminder: "default",
  sms_reminder: "default",
  sms_marketing: false,
  // Photo
  photo: null,
  photo_preview: null,
});

const validateCustomerForm = (form) => {
  const errors = {};

  if (!form.first_name?.trim()) {
    errors.first_name = "First name is required";
  }

  if (!form.mobile?.trim()) {
    errors.mobile = "Mobile number is required";
  }

  if (!form.email?.trim()) {
    errors.email = "Email is required";
  }

  if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = "Invalid email format";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const AddCustomer = ({
  onClose,
  shouldRefresh,
  setEditId = null,
  loader,
  toaster,
  editId = null,
  getCustomer,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState(getInitialState());
  const router = useRouter();
  const dispatch = useDispatch();

  console.log(formData);

  useEffect(() => {
    if (!editId) return;
    const fetchCustomer = async () => {
      try {
        loader(true);
        const res = await Api("get", `auth/getUserInfo/${editId}`, "", router);
        loader(false);
        if (res?.status === true && res?.data) {
          const fullName = res.data.data.fullname || "";
          const nameParts = fullName.trim().split(" ");

          setFormData((prev) => ({
            ...prev,
            ...res.data.data,
            first_name: nameParts[0] || "",
            last_name: nameParts.slice(1).join(" ") || "",
          }));
        } else {
          toaster({
            type: "error",
            message: res?.message || "Failed to load customer",
          });
        }
      } catch {
        loader(false);
        toaster({ type: "error", message: "Server error" });
      }
    };
    fetchCustomer();
  }, [editId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleToggle = (name) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setFormData((prev) => ({
        ...prev,
        photo: file,
        photo_preview: ev.target.result,
      }));
    reader.readAsDataURL(file);
  };

  const copyPhysicalToPostal = () => {
    setFormData((prev) => ({
      ...prev,
      postal_address: prev.physical_address,
      postal_suburb: prev.physical_suburb,
      postal_city: prev.physical_city,
      postal_state: prev.physical_state,
      postal_postcode: prev.physical_postcode,
    }));
  };

  const copyPostalToPhysical = () => {
    setFormData((prev) => ({
      ...prev,
      physical_address: prev.postal_address,
      physical_suburb: prev.postal_suburb,
      physical_city: prev.postal_city,
      physical_state: prev.postal_state,
      physical_postcode: prev.postal_postcode,
    }));
  };

  const handleAddressChange = (e, section) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleSubmit = async () => {
    const { isValid, errors } = validateCustomerForm(formData);

    if (!isValid) {
      toaster({
        type: "error",
        message: Object.values(errors)[0],
      });
      return;
    }

    const data = { ...formData, photo_preview: null, role: "user" };

    const form = new FormData();

    Object.keys(data).forEach((key) => {
      form.append(key, data[key]);
    });

    if (formData.photo) {
      form.append("photo", formData.photo);
    }

    try {
      loader(true);

      let res;

      if (editId) {
        res = await dispatch(updateCustomerById(editId, form, router));
      } else {
        res = await dispatch(createCustomer(form, router));
      }

      loader(false);

      if (res?.status === true) {
        toaster({
          type: "success",
          message: editId
            ? "Customer updated successfully"
            : "Customer added successfully",
        });

        setFormData(getInitialState());
        onClose();
        getCustomer?.();
        setEditId("");
      } else {
        toaster({
          type: "error",
          message: res?.message || "Something went wrong",
        });
      }
    } catch (error) {
      loader(false);

      console.log("ERROR:", error);

      toaster({
        type: "error",
        message: error?.response?.data?.message || "Server error",
      });
    }
  };

  const renderDetails = () => (
    <div className="grid grid-cols-2 gap-4">
      <InputField
        label="First name"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        placeholder="Enter first name"
      />
      <InputField
        label="Last name"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        placeholder="Enter last name"
      />
      <InputField
        label="Telephone"
        name="telephone"
        value={formData.telephone}
        onChange={handleChange}
        placeholder="Enter telephone"
      />
      <InputField
        label="Mobile number"
        name="mobile"
        value={formData.mobile}
        onChange={handleChange}
        placeholder="+61"
      />
      <InputField
        label="Email address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="example@domain.com"
      />
      <InputField
        label="Occupation"
        name="occupation"
        value={formData.occupation}
        onChange={handleChange}
        placeholder="Enter occupation"
      />
      <div className="col-span-2">
        <SelectField
          label="Customer type"
          name="customer_type"
          value={formData.customer_type}
          onChange={handleChange}
          options={["New", "Regular", "VIP", "Blacklisted"]}
        />
      </div>
    </div>
  );

  const renderAddresses = () => (
    <div className="grid grid-cols-2 gap-6">
      <AddressBlock
        prefix="physical"
        title="Physical address"
        data={{
          address: formData.physical_address?.physical_address,
          suburb: formData.physical_address?.physical_suburb,
          city: formData.physical_address?.physical_city,
          state: formData.physical_address?.physical_state,
          postcode: formData.physical_address?.physical_postcode,
        }}
        onChange={(e) => handleAddressChange(e, "physical_address")}
        onCopy={copyPhysicalToPostal}
        copyLabel="Copy postal address"
      />
      <AddressBlock
        prefix="postal"
        title="Postal address"
        data={{
          address: formData.postal_address?.postal_address,
          suburb: formData.postal_address?.postal_suburb,
          city: formData.postal_address?.postal_city,
          state: formData.postal_address?.postal_state,
          postcode: formData.postal_address?.postal_postcode,
        }}
        onChange={(e) => handleAddressChange(e, "postal_address")}
        onCopy={copyPostalToPhysical}
        copyLabel="Copy physical address"
      />
    </div>
  );

  const renderMoreInfo = () => (
    <div className="grid grid-cols-2 gap-4">
      <SelectField
        label="Gender"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        options={[
          "Select gender",
          "Male",
          "Female",
          "Non-binary",
          "Prefer not to say",
        ]}
      />
      <InputField
        label="Date of birth"
        name="dob"
        type="date"
        value={formData.dob}
        onChange={handleChange}
        placeholder="MM/DD/YYYY"
      />
      <InputField
        label="Referred by"
        name="referred_by"
        value={formData.referred_by}
        onChange={handleChange}
        placeholder="Enter name"
      />
      <InputField
        label="Customer's time zone"
        name="timezone"
        value={formData.timezone}
        onChange={handleChange}
        placeholder="(GMT-08:00) Pacific Time"
      />
      <TextareaField
        label="Alerts"
        name="alerts"
        value={formData.alerts}
        onChange={handleChange}
        placeholder="Add any special alerts or notes about this customer..."
        rows={3}
      />
      <div className="col-span-2 flex items-center justify-between pt-2">
        <Toggle
          checked={formData.is_active}
          onChange={() => handleToggle("is_active")}
          label="Active Customer"
        />
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 font-medium">
            Number of no-shows
          </span>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1">
            <button
              type="button"
              onClick={() =>
                setFormData((p) => ({
                  ...p,
                  no_shows: Math.max(0, p.no_shows - 1),
                }))
              }
              className="text-gray-500 hover:text-gray-800"
            >
              <Minus size={14} />
            </button>
            <span className="text-sm font-semibold w-6 text-center">
              {formData.no_shows}
            </span>
            <button
              type="button"
              onClick={() =>
                setFormData((p) => ({ ...p, no_shows: p.no_shows + 1 }))
              }
              className="text-gray-500 hover:text-gray-800"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCards = () => (
    <div className="flex flex-col gap-4">
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
        <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Recommended for easy billing
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Saving card details allows for automatic recurring payments and
            faster checkout.
          </p>
          <button className="text-xs text-blue-600 mt-1 hover:underline">
            Learn more →
          </button>
        </div>
      </div>
      <InputField
        label="Card number"
        name="card_number"
        value={formData.card_number}
        onChange={handleChange}
        placeholder="0000 0000 0000 0000"
      />
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Expiry date"
          name="card_expiry"
          value={formData.card_expiry}
          onChange={handleChange}
          placeholder="MM / YY"
        />
        <InputField
          label="CVC"
          name="card_cvc"
          value={formData.card_cvc}
          onChange={handleChange}
          placeholder="123"
        />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="save_card"
          checked={formData.save_card}
          onChange={handleChange}
          className="rounded"
        />
        <span className="text-sm text-gray-700">
          Save card details on customer's behalf
        </span>
      </label>
      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
        <Shield size={13} />
        Your customer's data is safe. We use industry-standard encryption to
        protect all sensitive information.
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="flex flex-col gap-5">
      <SectionHeader icon={Bell} text="Appointment Notifications" />
      {[
        { key: "booking_change_email", label: "Booking change (Email)" },
        { key: "booking_change_sms", label: "Booking change (SMS)" },
        { key: "followup_email", label: "Follow-up email" },
        { key: "rebooking_reminder", label: "Rebooking reminder (Email)" },
      ].map(({ key, label }) => (
        <label
          key={key}
          className="flex items-center justify-between cursor-pointer"
        >
          <span className="text-sm text-gray-700">{label}</span>
          <input
            type="checkbox"
            name={key}
            checked={formData[key]}
            onChange={handleChange}
            className="w-4 h-4 accent-blue-600"
          />
        </label>
      ))}

      <SectionHeader text="Appointment Reminders" />
      <div className="grid grid-cols-2 gap-6">
        {[
          {
            prefix: "email_reminder",
            title: "Email Reminder Timing",
            default_label: "Use business defaults (24h before)",
          },
          {
            prefix: "sms_reminder",
            title: "SMS Reminder Timing",
            default_label: "Use business defaults (1h before)",
          },
        ].map(({ prefix, title, default_label }) => (
          <div key={prefix} className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              {title}
            </p>
            {["default", "custom"].map((val) => (
              <label
                key={val}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={prefix}
                  value={val}
                  checked={formData[prefix] === val}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700">
                  {val === "default" ? default_label : "Custom intervals"}
                </span>
              </label>
            ))}
          </div>
        ))}
      </div>

      <SectionHeader text="Marketing Preferences" />
      <label className="flex items-start gap-3 border border-gray-100 rounded-xl p-3 cursor-pointer hover:bg-gray-50 transition">
        <input
          type="checkbox"
          name="sms_marketing"
          checked={formData.sms_marketing}
          onChange={handleChange}
          className="mt-0.5 accent-blue-600"
        />
        <div>
          <p className="text-sm font-semibold text-gray-800">
            SMS/Text Marketing Opt-in
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Customer has provided explicit consent to receive promotional text
            messages according to local regulations.
          </p>
        </div>
      </label>
    </div>
  );

  const renderPhoto = () => (
    <div className="flex flex-col items-center justify-center py-4">
      <label className="w-full cursor-pointer">
        <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center py-14 gap-3 hover:bg-blue-50/50 hover:border-blue-300 transition">
          {formData.photo_preview ? (
            <img
              src={formData.photo_preview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
            />
          ) : (
            <>
              <div className="bg-gray-100 rounded-full p-4">
                <Upload size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                No photo uploaded
              </p>
              <p className="text-xs text-gray-400 text-center">
                Drag and drop or click the button below to
                <br />
                upload a profile photo for this customer
              </p>
            </>
          )}
        </div>
        <input
          type="file"
          accept="image/jpg,image/jpeg,image/png,image/gif"
          onChange={handlePhotoChange}
          className="hidden"
        />
      </label>
      <button
        type="button"
        onClick={() => document.querySelector('input[type="file"]')?.click()}
        className="mt-4 flex items-center gap-2 px-4 py-2 bg-custom-blue text-white text-sm rounded-lg hover:bg-blue-800 transition"
      >
        <Camera size={15} /> Upload new photo
      </button>
      <p className="text-xs text-gray-400 mt-3">
        Accepted formats: JPG, PNG, GIF. Maximum file size: 5MB.
      </p>
    </div>
  );

  const tabContent = {
    details: renderDetails,
    addresses: renderAddresses,
    more_info: renderMoreInfo,
    cards: renderCards,
    notifications: renderNotifications,
    photo: renderPhoto,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          onClose();
          if (shouldRefresh) {
            setEditId("");
          }

          setFormData(getInitialState());
        }}
      />
      <div className="relative z-50 w-[95%] max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {editId ? "Edit Customer" : "Add Customer"}
          </h2>
          <button
            onClick={() => {
              setFormData(getInitialState());
              onClose();
              if (shouldRefresh) {
                setEditId("");
              }
            }}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-gray-100 px-6 gap-1 overflow-x-auto">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`text-sm px-3 py-2.5 whitespace-nowrap transition font-medium border-b-2 -mb-px ${
                activeTab === id
                  ? "border-blue-600 text-custom-blue"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tabContent[activeTab]?.()}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={() => {
              setFormData(getInitialState());
              onClose();
              if (shouldRefresh) {
                setEditId("");
              }
            }}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm rounded-lg bg-custom-blue text-white hover:bg-blue-800 transition font-medium"
          >
            {editId ? "Save Customer" : "Add Customer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
