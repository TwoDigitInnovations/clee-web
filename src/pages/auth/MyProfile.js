import DashboardHeader from "@/components/DashboardHeader";
import React, { useState, useEffect, useRef } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import {
  MdEmail,
  MdPhone,
  MdPerson,
  MdEdit,
  MdCheck,
  MdClose,
  MdCameraAlt,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "@/redux/actions/userActions";

function MyProfile(props) {
  const router = useRouter();
  const fileRef = useRef();

  const [profile, setProfile] = useState({
    fullname: "",
    email: "",
    phone: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setProfile({
        fullname: user.fullname || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setForm({
        fullname: user.fullname || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  useEffect(() => {
    dispatch(fetchProfile(router));
  }, []);

  const validate = (data = form) => {
    const errs = {};
    if (!data.fullname.trim()) errs.fullname = "Full name is required";
    if (!data.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errs.email = "Enter a valid email";
    if (!data.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^\+?[0-9\s\-]{7,15}$/.test(data.phone))
      errs.phone = "Enter a valid phone number";
    return errs;
  };

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (submitted) setErrors(validate(updated));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSubmitted(true);
    const errs = validate();

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      props.toaster({ type: "error", message: "Please fix the errors below" });
      return;
    }

    try {
      props.loader(true);

      const payload = new FormData();
      payload.append("fullname", form.fullname);
      payload.append("email", form.email);
      payload.append("phone", form.phone);

      if (imageFile) {
        payload.append("photo", imageFile);
      }

      const res = await dispatch(updateProfile(payload, router));

      if (res?.status) {
        setProfile({ ...form });
        setEditMode(false);
        setSubmitted(false);
        setImageFile(null);

        props.toaster({
          type: "success",
          message: "Profile updated successfully!",
        });
      } else {
        props.toaster({
          type: "error",
          message: res?.message || "Update failed.",
        });
      }
    } catch (err) {
      props.toaster({
        type: "error",
        message: err?.message || "Something went wrong.",
      });
    } finally {
      props.loader(false);
    }
  };

  const handleCancel = () => {
    setForm({ ...profile });
    setErrors({});
    setSubmitted(false);
    setEditMode(false);
    setPreviewImage(null);
    setImageFile(null);
  };

  // ─── Input style ──────────────────────────────────────────────
  const inputCls = (hasError) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
      hasError
        ? "bg-red-50 border border-red-300"
        : editMode
          ? "bg-white border border-[#0A4D91]/30 shadow-sm"
          : "bg-[#F4F8FF] border border-transparent"
    }`;

  const currentImage = previewImage || profile.profileImage;

  return (
    <>
      <DashboardHeader title="My Profile" />

      <div className="min-h-screen bg-custom-gray p-4 md:p-6 text-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div
              className="h-32 w-full relative"
              style={{
                background:
                  "linear-gradient(135deg, #0A4D91 0%, #1a6bbf 50%, #65ADF5 100%)",
              }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            <div className="md:px-8 px-4 pb-6">
              <div className="relative -mt-14 mb-4 w-fit">
                <div
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #0A4D91, #65ADF5)",
                  }}
                >
                  {" "}
                  {profile?.photo ? (
                    <img
                      src={profile.photo}
                      alt="profile"
                      className="object-contain"
                    />
                  ) : (
                    <MdPerson className="text-white text-5xl" />
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  {profile.fullname || "Your Name"}
                </h2>
                <p className="text-sm text-slate-400">
                  {profile.email || "your@email.com"}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100 mb-6" />

              {/* Section label + edit button */}
              <div className="flex md:flex-row flex-col gap-2 md:items-center justify-between mb-5">
                <p className="text-xs font-semibold text-[#0A4D91] uppercase tracking-widest">
                  Personal Information
                </p>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="w-fit flex items-center gap-2 text-xs font-semibold text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 shadow-sm"
                    style={{
                      background:
                        "linear-gradient(135deg, #0A4D91 0%, #65ADF5 100%)",
                    }}
                  >
                    <MdEdit className="text-sm" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 border border-slate-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-all"
                    >
                      <MdClose className="text-sm" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-2 rounded-lg cursor-pointer shadow-sm transition-all"
                      style={{
                        background:
                          "linear-gradient(135deg, #0A4D91 0%, #65ADF5 100%)",
                      }}
                    >
                      <MdCheck className="text-sm" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {/* ── Fields ── */}
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                    Full Name
                  </label>
                  <div className={inputCls(submitted && errors.fullname)}>
                    <MdPerson
                      className="text-lg flex-shrink-0"
                      style={{ color: "#0A4D91" }}
                    />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="bg-transparent outline-none w-full text-sm text-slate-700 placeholder-slate-300"
                      value={form.fullname}
                      disabled={!editMode}
                      onChange={(e) => handleChange("fullname", e.target.value)}
                    />
                  </div>
                  {submitted && errors.fullname && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fullname}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                    Email Address
                  </label>
                  <div className={inputCls(submitted && errors.email)}>
                    <MdEmail
                      className="text-lg flex-shrink-0"
                      style={{ color: "#0A4D91" }}
                    />
                    <input
                      type="email"
                      placeholder="name@email.com"
                      className="bg-transparent outline-none w-full text-sm text-slate-700 placeholder-slate-300"
                      value={form.email}
                      disabled={!editMode}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                  {submitted && errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                    Phone Number
                  </label>
                  <div className={inputCls(submitted && errors.phone)}>
                    <MdPhone
                      className="text-lg flex-shrink-0"
                      style={{ color: "#0A4D91" }}
                    />
                    <input
                      type="tel"
                      placeholder="+1 234 567 8900"
                      className="bg-transparent outline-none w-full text-sm text-slate-700 placeholder-slate-300"
                      value={form.phone}
                      disabled={!editMode}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                  {submitted && errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyProfile;
