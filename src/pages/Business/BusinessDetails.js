import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useRef, useEffect } from "react";
import {
  Globe,
  Phone,
  User,
  Tag,
  Twitter,
  Instagram,
  Facebook,
  Upload,
  Trash2,
  X,
  Pencil,
} from "lucide-react";
import { Api } from "@/services/service"; // adjust import as needed
import InputField from "@/components/UI/InputField";
import SelectField from "@/components/UI/SelectField";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateCustomerById } from "@/redux/actions/userActions";
const COUNTRIES = [
  "Australia",
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "New Zealand",
];

const CURRENCIES = [
  "Australian Dollar",
  "Indian Rupee",
  "US Dollar",
  "British Pound",
  "Canadian Dollar",
];

const TIMEZONES = [
  "(GMT+11:00) Canberra, Melbourne, Sydney",
  "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
  "(GMT+00:00) London",
  "(GMT-05:00) Eastern Time (US & Canada)",
];

const DATE_FORMATS = ["18 Mar 2026", "03/18/2026", "2026-03-18"];
const TIME_FORMATS = ["6:39PM", "18:39", "6:39 PM"];
const CATEGORIES = [
  "Beauty",
  "Health & Wellness",
  "Fitness",
  "Spa",
  "Salon",
  "Other",
];

function LogoModal({ logo, onClose, onUpload, onDelete }) {
  const fileRef = useRef();
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-fit md:w-[500px] p-6 relative">
        <div className="flex items-center gap-2 mb-5">
          <div className="bg-custom-blue rounded p-1">
            <User size={14} className="text-white" />
          </div>
          <span className="font-semibold text-slate-800 text-sm">
            Business logo
          </span>
          <button
            onClick={onClose}
            className="ml-auto text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center bg-slate-50 h-44 mb-3">
          {logo ? (
            <img
              src={logo}
              alt="logo"
              className="max-h-36 max-w-36 object-contain"
            />
          ) : (
            <span className="text-slate-400 text-sm">No logo uploaded</span>
          )}
        </div>
        <p className="text-xs text-slate-400 text-center mb-5">
          Accepted formats: PNG, GIF or JPG. Maximum file size is 2.0MB.
        </p>
        <div className="flex gap-3 justify-center mb-5">
          <button
            onClick={() => fileRef.current.click()}
            className="flex items-center gap-2 bg-custom-blue text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Upload size={14} /> Upload new photo
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-2 border border-red-400 text-red-500 text-sm px-4 py-2 rounded-lg hover:bg-red-50 transition"
          >
            <Trash2 size={14} /> Delete
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onUpload}
          />
        </div>
        <div className="flex justify-end gap-2 border-t pt-4">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 rounded-lg bg-custom-blue text-white hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ title, description }) {
  return (
    <div className="w-48 flex-shrink-0">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      {description && (
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

function Divider() {
  return <hr className="border-slate-200 my-1" />;
}

function BusinessDetails({ loader, toaster }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    businessName: "",
    websiteProtocol: "https://",
    websiteUrl: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    businessCategory: "Beauty",
    updateBilling: false,
    country: "",
    currency: "",
    timezone: "",
    dateFormat: "",
    timeFormat: "",
    businessDescription: "",
    twitter: "",
    instagram: "",
    facebookPage: "",
  });

  const [errors, setErrors] = useState({});
  const [logo, setLogo] = useState(null);
  const router = useRouter();
  const [editId, setEditId] = useState("");
  const [showLogoModal, setShowLogoModal] = useState(false);

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      setEditId(user._id);
      const fullName = user.fullname || "";
      const nameParts = fullName.trim().split(" ");

      setFormData((prev) => ({
        ...prev,

        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        phoneNumber: user.phone || "",
        timezone: user.timezone || "",

        // business fields
        businessName: user.business?.name || "",
        BusinessLogo: user.business?.logo || "",
        businessCategory: user.business?.category || "",
        businessDescription: user.business?.description || "",

        // website
        websiteProtocol: user.business?.website?.protocol || "https://",
        websiteUrl: user.business?.website?.url || "",

        // social
        twitter: user.business?.socialLinks?.twitter || "",
        instagram: user.business?.socialLinks?.instagram || "",
        facebookPage: user.business?.socialLinks?.facebookPage || "",

        // settings
        updateBilling: user.business?.settings?.updateBilling || false,
        country: user.business?.settings?.country || "",
        currency: user.business?.settings?.currency || "",
        dateFormat: user.business?.settings?.dateFormat || "",
        timeFormat: user.business?.settings?.timeFormat || "",
      }));
    }
    dispatch(fetchProfile);
  }, []);

  const set = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!formData.businessName.trim())
      errs.businessName = "Business name is required";
    if (!formData.firstName.trim()) errs.firstName = "First name is required";
    if (!formData.lastName.trim()) errs.lastName = "Last name is required";
    if (!formData.businessCategory)
      errs.businessCategory = "Please select a category";
    if (
      formData.websiteUrl &&
      !/^(www\.)?[\w-]+(\.[\w-]+)+/.test(formData.websiteUrl)
    )
      errs.websiteUrl = "Invalid website URL";
    if (
      formData.phoneNumber &&
      !/^\+?[\d\s\-()]{7,}$/.test(formData.phoneNumber)
    )
      errs.phoneNumber = "Invalid phone number";
    return errs;
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toaster({ type: "error", message: "Logo must be under 2MB" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      const errorMessages = Object.values(errs).join(", ");

      toaster({
        type: "error",
        message: errorMessages,
      });

      setErrors(errs);
      return;
    }

    setErrors({});
    try {
      loader(true);
      const payload = {
        fullname: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phoneNumber,
        timezone: formData.timezone,

        business: {
          name: formData.businessName,
          logo: formData.BusinessLogo,

          category: formData.businessCategory,
          description: formData.businessDescription,

          website: {
            protocol: formData.websiteProtocol,
            url: formData.websiteUrl,
          },

          socialLinks: {
            twitter: formData.twitter,
            instagram: formData.instagram,
            facebookPage: formData.facebookPage,
          },

          settings: {
            updateBilling: formData.updateBilling,
            country: formData.country,
            currency: formData.currency,
            dateFormat: formData.dateFormat,
            timeFormat: formData.timeFormat,
          },
        },
      };

      const form = new FormData();

      Object.keys(payload).forEach((key) => {
        form.append(key, payload[key]);
      });

      if (logo) {
        form.append("logo", logo);
      }
      let res;

      if (editId) {
        res = await dispatch(updateCustomerById(editId, form, router));
      }
      loader(false);
      if (res?.status === true) {
        toaster({
          type: "success",
          message: "Business details saved successfully",
        });
      } else {
        toaster({
          type: "error",
          message: res?.message || "Something went wrong",
        });
      }
    } catch (err) {
      loader(false);
      console.log(err.message);

      toaster({ type: "error", message: "Server error" });
    }
  };

  return (
    <>
      <DashboardHeader title="Your Business" />

      <div className="min-h-screen bg-custom-gray text-slate-800 ">
        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-slate-200 overflow-hidden">
            {/* Top bar: title + save */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h1 className="text-base font-semibold text-slate-800">
                Business details
              </h1>
              <button
                type="submit"
                className="bg-custom-blue text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>

            <div className="px-6 py-6 flex  grid md:grid-cols-3 grid-cols-1">
              <SectionLabel
                title="Details"
                description="Basic information about you and your business."
              />
              <div className="col-span-2 flex-1 flex flex-col gap-4 max-w-lg">
                {/* Business name */}
                <InputField
                  label="Business name *"
                  placeholder="Business name "
                  value={formData.businessName}
                  onChange={set("businessName")}
                  error={errors.businessName}
                />

                {/* Website */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">
                    Business website ?
                  </label>
                  <div className="flex gap-0">
                    <select
                      value={formData.websiteProtocol}
                      onChange={set("websiteProtocol")}
                      className="border border-r-0 rounded-l-md px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 border-slate-300"
                    >
                      <option value="https://">https://</option>
                      <option value="http://">http://</option>
                    </select>
                    <input
                      type="text"
                      value={formData.websiteUrl}
                      onChange={set("websiteUrl")}
                      placeholder="www.example.com"
                      className={`flex-1 border rounded-r-md px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        errors.websiteUrl
                          ? "border-red-400"
                          : "border-slate-300"
                      }`}
                    />
                  </div>
                  {errors.websiteUrl && (
                    <p className="text-xs text-red-500">{errors.websiteUrl}</p>
                  )}
                </div>

                {/* Phone */}
                <InputField
                  label="Business phone number"
                  value={formData.phoneNumber}
                  onChange={set("phoneNumber")}
                  placeholder="e.g. +61 2 0000 0000"
                  error={errors.phoneNumber}
                />

                <div className="flex gap-3">
                  <InputField
                    label="Your first name"
                    value={formData.firstName}
                    onChange={set("firstName")}
                    placeholder="e.g. Jane"
                    error={errors.firstName}
                  />
                  <InputField
                    label="Your last name"
                    value={formData.lastName}
                    onChange={set("lastName")}
                    placeholder="e.g. Smith"
                    error={errors.lastName}
                  />
                </div>

                <SelectField
                  label="Business category"
                  value={formData.businessCategory}
                  onChange={set("businessCategory")}
                  options={CATEGORIES}
                  error={errors.businessCategory}
                />

                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.updateBilling}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        updateBilling: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  Update my Dee billing details with these settings ?
                </label>
              </div>
            </div>

            <Divider />

            <div className="px-6 py-6 flex grid md:grid-cols-3 grid-cols-1">
              <SectionLabel
                title="Regional settings"
                description="Specify region specific settings for your business."
              />
              <div className="col-span-2 flex-1 flex flex-col gap-4 max-w-lg">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-start gap-3">
                  <div className="mt-0.5 bg-custom-blue text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    i
                  </div>
                  <div className="text-xs text-blue-700">
                    <strong>Clee Pay is setup</strong> — Your region and
                    currency determine your eligibility for ClaePay; to change
                    country or currency you'll need to{" "}
                    <a href="#" className="underline">
                      deactivate ClaePay
                    </a>
                    .
                  </div>
                </div>

                {/* Country + Currency */}
                <div className="flex gap-3">
                  <SelectField
                    label="Country"
                    value={formData.country}
                    onChange={set("country")}
                    options={COUNTRIES}
                  />
                  <SelectField
                    label="Currency"
                    value={formData.currency}
                    onChange={set("currency")}
                    options={CURRENCIES}
                  />
                </div>

                <SelectField
                  label="Time zone"
                  value={formData.timezone}
                  onChange={set("timezone")}
                  options={TIMEZONES}
                />

                <div className="flex gap-3">
                  <SelectField
                    label="Date format"
                    value={formData.dateFormat}
                    onChange={set("dateFormat")}
                    options={DATE_FORMATS}
                  />
                  <SelectField
                    label="Time format"
                    value={formData.timeFormat}
                    onChange={set("timeFormat")}
                    options={TIME_FORMATS}
                  />
                </div>
              </div>
            </div>

            <Divider />

            <div className="px-6 py-6 flex grid md:grid-cols-3 grid-cols-1">
              <SectionLabel
                title="Business description"
                description={
                  <>
                    Enter an optional description of your business for use on
                    your{" "}
                    <a href="#" className="text-blue-500 underline text-xs">
                      mini website
                    </a>
                    .
                    <br />
                    <br />
                    <span className="text-slate-400">
                      The use of formatting tags, and HTML for styling in the
                      Business description field is no longer supported by Clae.
                    </span>
                  </>
                }
              />
              <div className="col-span-2 flex-1 max-w-lg">
                <textarea
                  value={formData.businessDescription}
                  onChange={set("businessDescription")}
                  rows={5}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>
            </div>

            <Divider />

            {/* ── Business Logo ── */}
            <div className="grid md:grid-cols-3 grid-cols-1 px-6 py-6 flex gap-8">
              <SectionLabel
                title="Business logo"
                description="Upload a logo to appear on your emails, invoices and mini website."
              />
              <div className="col-span-2 flex-1 max-w-lg flex flex-col items-start gap-3">
                <div className="w-24 h-24 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                  {logo ? (
                    <img
                      src={logo}
                      alt="logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-blue-400 rounded-full opacity-70" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowLogoModal(true)}
                  className="flex items-center gap-2 bg-custom-blue text-white text-xs px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <Pencil size={12} /> Edit logo
                </button>
              </div>
            </div>

            <Divider />

            <div className="grid md:grid-cols-3 grid-cols-1 px-6 py-6 flex gap-8">
              <SectionLabel
                title="Get social!"
                description="Enter your social networking accounts and we'll help you promote your business."
              />
              <div className="col-span-2 flex-1 flex flex-col gap-4 max-w-lg">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">
                    Twitter account
                  </label>
                  <div className="flex items-center border border-slate-300 rounded-md overflow-hidden">
                    <span className="px-3 text-slate-400">
                      <Twitter size={14} />
                    </span>
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={set("twitter")}
                      placeholder="e.g. Clinic"
                      className="flex-1 py-2 pr-3 text-sm text-slate-800 bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">
                    Instagram account
                  </label>
                  <div className="flex items-center border border-slate-300 rounded-md overflow-hidden">
                    <span className="px-3 text-slate-400">
                      <Instagram size={14} />
                    </span>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={set("instagram")}
                      placeholder="e.g. @clinic"
                      className="flex-1 py-2 pr-3 text-sm text-slate-800 bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Facebook */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">
                    Facebook page
                  </label>
                  <input
                    type="text"
                    value={formData.facebookPage}
                    onChange={set("facebookPage")}
                    placeholder="e.g. http://www.facebook.com/theclinic"
                    className="border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-slate-200">
              <button
                type="submit"
                className="bg-custom-blue text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Logo Modal */}
      {showLogoModal && (
        <LogoModal
          logo={logo}
          onClose={() => setShowLogoModal(false)}
          onUpload={handleLogoUpload}
          onDelete={() => setLogo(null)}
        />
      )}
    </>
  );
}

export default BusinessDetails;
