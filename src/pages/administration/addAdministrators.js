import { useState, useRef } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  ShieldCheck,
  Camera,
  ChevronRight,
  CheckCircle2,
  Info,
  X,
  Save,
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";

function Field({
  label,
  placeholder,
  type = "text",
  required,
  value,
  onChange,
  colSpan = 1,
}) {
  return (
    <div className={colSpan === 2 ? "col-span-2" : ""}>
      <label className="block text-[12px] font-bold text-slate-500 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50/60 focus:outline-none focus:ring-1 focus:ring-custom-blue/80 focus:border-custom-blue/60 focus:bg-white transition-all duration-200"
      />
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Icon size={16} className="text-custom-blue" />
        </div>
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export default function Administrators() {
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    telephone: "",
    sms: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    role: "view-only",
  });

  const router = useRouter();
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    // console.log("Submit", form);
  };

  return (
    <>
      <DashboardHeader title="Administration" />
      <div className="min-h-screen bg-[#f3f4f8] font-sans pb-20">
        <div className="max-w-7xl mx-auto md:px-6 px-4 py-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <span
              className="hover:text-custom-blue cursor-pointer transition-colors"
              onClick={() => router.push("/administration/Administrators")}
            >
              Administrators
            </span>
            <ChevronRight size={12} />
            <span className="text-slate-600 font-medium">
              Add Administrators
            </span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900">Administrators</h1>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2.5 bg-custom-blue text-white text-sm font-semibold rounded-xl hover:bg-custom-blue/90 active:scale-95 transition-all shadow-sm"
            >
              <Save size={15} />
              Save
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto md:px-6 px-4 py-4 flex gap-6 items-start">
          <div className=" md:col-span-2 flex-1 min-w-0 space-y-5">
            {/* Personal Information */}
            <SectionCard icon={User} title="Personal Information">
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="First Name"
                  placeholder="e.g. Julianne"
                  required
                  value={form.firstName}
                  onChange={set("firstName")}
                />
                <Field
                  label="Last Name"
                  placeholder="e.g. Moore"
                  required
                  value={form.lastName}
                  onChange={set("lastName")}
                />
                <Field
                  label="Telephone"
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  value={form.telephone}
                  onChange={set("telephone")}
                />
                <Field
                  label="SMS Number"
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  value={form.sms}
                  onChange={set("sms")}
                />
                <Field
                  label="Email Address"
                  placeholder="julianne.m@lumieresalon.pro"
                  type="email"
                  required
                  colSpan={2}
                  value={form.email}
                  onChange={set("email")}
                />
              </div>

              {/* Info banner */}
              <div className="mt-5 flex gap-3 bg-indigo-50/70 border border-indigo-100 rounded-xl px-4 py-3.5">
                <Info
                  size={16}
                  className="text-indigo-500 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs font-bold text-custom-blue mb-0.5">
                    Access & Setup
                  </p>
                  <p className="text-xs text-custom-blue/80 leading-relaxed">
                    An automated invitation email will be sent to this address
                    with secure password setup instructions. By default, new
                    administrators are granted view-only access to the central
                    salon calendars.
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* Address & Location */}
            <SectionCard icon={MapPin} title="Address & Location">
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Street Address"
                  placeholder="123 Atelier Way, Suite 400"
                  colSpan={2}
                  value={form.street}
                  onChange={set("street")}
                />
                <Field
                  label="City"
                  placeholder="New York"
                  value={form.city}
                  onChange={set("city")}
                />
                <Field
                  label="State / Province"
                  placeholder="NY"
                  value={form.state}
                  onChange={set("state")}
                />
                <Field
                  label="ZIP / Postal Code"
                  placeholder="10001"
                  value={form.zip}
                  onChange={set("zip")}
                />
                <Field
                  label="Country"
                  placeholder="United States"
                  value={form.country}
                  onChange={set("country")}
                />
              </div>
            </SectionCard>

            {/* Role & Permissions */}
            <SectionCard icon={ShieldCheck} title="Role & Permissions">
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    val: "view-only",
                    label: "View Only",
                    desc: "Read access to calendars and reports",
                  },
                  {
                    val: "editor",
                    label: "Editor",
                    desc: "Can edit bookings and client info",
                  },
                  {
                    val: "manager",
                    label: "Manager",
                    desc: "Full access except billing settings",
                  },
                  {
                    val: "super-admin",
                    label: "Super Admin",
                    desc: "Unrestricted access to all areas",
                  },
                ].map((r) => (
                  <button
                    key={r.val}
                    onClick={() => setForm((f) => ({ ...f, role: r.val }))}
                    className={`text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-150
                    ${
                      form.role === r.val
                        ? "border-indigo-500 bg-indigo-50/60"
                        : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-bold text-slate-800">
                        {r.label}
                      </span>
                      {form.role === r.val && (
                        <CheckCircle2 size={15} className="text-indigo-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{r.desc}</p>
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="w-full flex-shrink-0 space-y-4 sticky top-24">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col items-center text-center">
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/gif"
                className="hidden"
                onChange={handlePhoto}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="relative w-28 h-28 rounded-full border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/40 flex items-center justify-center transition-all duration-200 overflow-hidden group mb-3"
              >
                {photoPreview ? (
                  <>
                    <img
                      src={photoPreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={20} className="text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Camera
                      size={20}
                      className="text-slate-400 group-hover:text-indigo-500 transition-colors"
                    />
                    <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400 group-hover:text-indigo-500 transition-colors">
                      Upload Photo
                    </span>
                  </div>
                )}
              </button>
              {photoPreview && (
                <button
                  onClick={() => setPhotoPreview(null)}
                  className="mb-2 text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <X size={11} /> Remove photo
                </button>
              )}
              <p className="text-sm font-bold text-slate-800 mb-1">
                Profile Identity
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Accepted: PNG, JPG, GIF
                <br />
                Max size: 2.0 MB
              </p>
            </div>

            {/* Secure Access Protocol */}
            <div className="bg-custom-blue/90 rounded-2xl p-5 text-white shadow-md">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                <ShieldCheck size={18} className="text-white" />
              </div>
              <p className="text-sm font-bold mb-2 leading-tight">
                Secure Access Protocol
              </p>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Administrators handle sensitive client data. Ensure you have
                verified their professional credentials before finalizing the
                invitation.
              </p>
            </div>

            {/* Action buttons */}
            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-custom-blue text-white text-sm font-bold rounded-xl hover:bg-custom-blue/90 active:scale-95 transition-all shadow-sm"
            >
              <CheckCircle2 size={16} />
              Save & Invite Admin
            </button>
            <button className="w-full px-4 py-3 border-2 border-slate-200 text-custom-blue text-sm font-bold rounded-xl hover:bg-slate-50 active:scale-95 transition-all">
              Discard Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
