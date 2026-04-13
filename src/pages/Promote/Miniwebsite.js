"use client";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Globe,
  Info,
  Pencil,
  CheckCircle2,
  XCircle,
  X,
  Upload,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  BookOpen,
  Save,
} from "lucide-react";

// import {
//   fetchMiniWebsite,
//   saveMiniWebsiteSettings,
//   uploadMiniWebsiteImage,
// } from "@/redux/actions/miniWebsiteActions";

const CHECKLIST_ITEMS = [
  { key: "cover_image", label: "Cover Image", hasModal: true },
  { key: "home", label: "Home", hasModal: false },
  { key: "logo", label: "Logo", hasModal: true },
  { key: "photo_carousel", label: "Photo carousel", hasModal: false },
  { key: "about_us", label: "About Us", hasModal: false },
  { key: "services", label: "Services", hasModal: false },
  { key: "gift_vouchers", label: "Gift Vouchers", hasModal: false },
  { key: "locations_hours", label: "Locations / Hours", hasModal: false },
  { key: "contact_us", label: "Contact Us", hasModal: false },
];

// ─── Image Upload Modal (Cover Image / Logo) ──────────────────────────────────
function ImageUploadModal({ title, aspect, onClose, onSave, existing }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(existing || null);
  const [file, setFile] = useState(null);
  const [zoom, setZoom] = useState(50);
  const [saving, setSaving] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(file, preview);
    setSaving(false);
    onClose();
  };

  // aspect label: "780 x 250" for cover, "200 x 200" for logo
  const dimLabel = aspect === "cover" ? "780 x 250" : "200 x 200";
  const previewH = aspect === "cover" ? "h-44" : "h-44";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Preview box */}
          <div
            className={`w-full ${previewH} rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative cursor-pointer`}
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover transition-transform duration-200"
                style={{ transform: `scale(${0.8 + zoom * 0.004})` }}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <BookOpen size={32} className="text-custom-blue/40" />
                <span className="text-sm font-semibold text-custom-blue/60">
                  {dimLabel}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-center text-slate-400">
            Accepted formats: PNG, GIF or JPG. Maximum file size is 2.0MB.
          </p>

          {/* Upload button */}
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/gif"
            className="hidden"
            onChange={handleFile}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 bg-custom-blue text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#0a3d75] transition-all"
          >
            <Upload size={15} />
            Upload new photo
          </button>

          {/* Zoom slider */}
          {preview && (
            <div className="flex items-center gap-3">
              <ZoomOut size={14} className="text-slate-400 flex-shrink-0" />
              <input
                type="range"
                min={0}
                max={100}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-custom-blue"
              />
              <ZoomIn size={14} className="text-slate-400 flex-shrink-0" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2.5 bg-custom-blue text-white text-sm font-semibold rounded-xl hover:bg-[#0a3d75] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Checklist Row ────────────────────────────────────────────────────────────
function ChecklistRow({ label, completed, onEdit }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-none">
      <div className="flex items-center gap-3">
        {completed ? (
          <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
        ) : (
          <XCircle size={18} className="text-red-400   flex-shrink-0" />
        )}
        <span className="text-sm text-slate-700">{label}</span>
      </div>
      <button
        onClick={onEdit}
        className="text-xs font-semibold text-custom-blue hover:underline px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
      >
        Edit
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Miniwebsite() {
  const dispatch = useDispatch();
  const router = useRouter();

  // ── Redux state (wire up selector to your slice) ──
  const { settings } = useSelector(
    (state) => state.miniWebsite ?? { settings: {} },
  );

  // ── Local state ──
  const [enabled, setEnabled] = useState(true);
  const [contactForm, setContactForm] = useState(false);
  const [completed, setCompleted] = useState({
    cover_image: false,
    home: false,
    logo: true,
    photo_carousel: true,
    about_us: false,
    services: true,
    gift_vouchers: true,
    locations_hours: true,
    contact_us: true,
  });
  const [images, setImages] = useState({ cover_image: null, logo: null });
  const [modal, setModal] = useState(null); // "cover_image" | "logo" | null
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // dispatch(fetchMiniWebsite(router));
  }, [dispatch]);

  // Sync redux settings if available
  useEffect(() => {
    if (settings) {
      if (settings.enabled !== undefined) setEnabled(settings.enabled);
      if (settings.completed !== undefined) setCompleted(settings.completed);
      if (settings.images !== undefined) setImages(settings.images);
      if (settings.contactForm !== undefined)
        setContactForm(settings.contactForm);
    }
  }, [settings]);

  // ── Handle Edit click per row ──
  const handleEdit = (key) => {
    if (key === "cover_image" || key === "logo") {
      setModal(key);
    }
    // for other items you can push to edit route:
    // else router.push(`/promote/mini-website/edit/${key}`);
  };

  // ── Image save from modal → formData → dispatch ──
  const handleImageSave = async (key, file, preview) => {
    // Update local preview
    setImages((prev) => ({ ...prev, [key]: preview }));
    setCompleted((prev) => ({ ...prev, [key]: !!preview }));

    if (file) {
      const formData = new FormData();
      formData.append("type", key);
      formData.append("image", file);
      //   await dispatch(uploadMiniWebsiteImage(formData, router));
    }

    // await handleSaveSettings({ [key]: preview });
  };

  const handleSaveSettings = async (extra = {}) => {
    setSaving(true);
    const payload = {
      enabled,
      contact_form: contactForm,
      completed,
      ...extra,
    };
    // await dispatch(saveMiniWebsiteSettings(payload, router));
    setSaving(false);
  };

  const websiteUrl = "https://salon-atelier.Clee.com";

  return (
    <>
      <DashboardHeader title="Promote" />

      <div className="min-h-screen bg-[#f3f4f8] md:p-6 p-3 pb-20">
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-custom-blue">
                Your free mini website
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Control the visibility of your online booking portal.
              </p>
            </div>

            <button
              onClick={() => setEnabled((e) => !e)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 flex-shrink-0 flex items-center ${enabled ? "bg-custom-blue" : "bg-slate-300"}`}
            >
              <span
                className={`absolute w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${enabled ? "translate-x-7" : "translate-x-1"}`}
              />
              <span
                className={`absolute right-2 text-[9px] font-bold transition-opacity ${enabled ? "text-white opacity-100" : "opacity-0"}`}
              >
                ON
              </span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4 flex gap-4">
            <div className="w-9 h-9 rounded-xl bg-[#e8eef8] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Info size={17} className="text-custom-blue" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 mb-0.5">
                Grow your business with Clee
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                All Clee plans include a free mini website. This helps clients
                find your services, see your availability, and book online 24/7
                without you lifting a finger.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Your Current Clee Website Address
            </p>
            <div className="flex items-center justify-between">
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-custom-blue font-semibold hover:underline flex items-center gap-1.5"
              >
                {websiteUrl}
                <ExternalLink size={13} />
              </a>
              <button className="flex items-center gap-1.5 text-xs text-custom-blue font-semibold hover:underline px-2 py-1 rounded hover:bg-indigo-50 transition-colors">
                <Pencil size={12} /> Edit
              </button>
            </div>
          </div>

          {/* ── Website Content Checklist ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-800">
                Website Content Checklist
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete these items to make your website look its best.
              </p>
            </div>
            <div className="px-5">
              {CHECKLIST_ITEMS.map((item) => (
                <ChecklistRow
                  key={item.key}
                  label={item.label}
                  completed={completed[item.key]}
                  onEdit={() => handleEdit(item.key)}
                />
              ))}
            </div>

            {/* Contact form checkbox */}
            <div className="px-5 py-4 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setContactForm((v) => !v)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${contactForm ? "bg-custom-blue border-custom-blue" : "border-slate-300 group-hover:border-custom-blue"}`}
                >
                  {contactForm && (
                    <svg
                      viewBox="0 0 10 10"
                      className="w-2.5 h-2.5"
                      fill="none"
                    >
                      <path
                        d="M1.5 5l2.5 2.5 4.5-4.5"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-slate-700">
                  Add a contact form for customer enquiries
                </span>
              </label>
            </div>
          </div>

          {/* ── Custom domain banner ── */}
          <div className="bg-[#e8eef8] rounded-2xl border border-[#c5d4ea] px-5 py-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-custom-blue/10 flex items-center justify-center flex-shrink-0">
              <Globe size={18} className="text-custom-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-custom-blue">
                Looking to use your own website domain?
              </p>
              <p className="text-xs text-custom-blue/70 mt-0.5 leading-relaxed">
                Elevate your brand by connecting your personal domain (e.g.,
                www.your-salon.com) to your mini website.
              </p>
            </div>
            <button className="flex-shrink-0 px-4 py-2 bg-custom-blue text-white text-xs font-bold rounded-xl hover:bg-[#0a3d75] transition-all">
              Learn More
            </button>
          </div>

          {/* ── Footer actions ── */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveSettings()}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-custom-blue text-white text-sm font-bold rounded-xl hover:bg-[#0a3d75] disabled:opacity-60 transition-all shadow-sm"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Saving...
                </>
              ) : (
                <>
                  <Save size={15} /> Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Image Upload Modal ── */}
      {modal === "cover_image" && (
        <ImageUploadModal
          title="Cover Image"
          aspect="cover"
          existing={images.cover_image}
          onClose={() => setModal(null)}
          onSave={(file, preview) =>
            handleImageSave("cover_image", file, preview)
          }
        />
      )}
      {modal === "logo" && (
        <ImageUploadModal
          title="Logo"
          aspect="logo"
          existing={images.logo}
          onClose={() => setModal(null)}
          onSave={(file, preview) => handleImageSave("logo", file, preview)}
        />
      )}
    </>
  );
}
