"use client";
import DashboardHeader from "@/components/DashboardHeader";
import { Api } from "@/services/service";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  Globe,
  User,
  Clock,
  Calendar,
  CheckSquare,
  Square,
  ChevronDown,
  Shield,
  Paintbrush,
  FileText,
  AlignLeft,
  Minimize2,
  SlidersHorizontal,
  Lock,
  Eye,
  EyeOff,
  Bold,
  Italic,
  Link2,
  Lightbulb,
  ExternalLink,
  Save,
  BookOpen,
  Users,
  AlertCircle,
  X,
} from "lucide-react";

/* ── Atoms ── */
function SCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-custom-blue" : "bg-gray-300"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : ""}`}
      />
    </button>
  );
}

function Checkbox({ checked, onChange, label, sublabel }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-start gap-3 text-left w-full group"
    >
      {checked ? (
        <CheckSquare className="w-4 h-4 text-custom-blue mt-0.5 shrink-0" />
      ) : (
        <Square className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
      )}
      <div>
        <p className="text-sm text-slate-700 font-medium leading-snug">
          {label}
        </p>
        {sublabel && (
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            {sublabel}
          </p>
        )}
      </div>
    </button>
  );
}

function RadioOption({ checked, onChange, label, sublabel }) {
  return (
    <button
      onClick={onChange}
      className={`w-full flex items-start gap-3 text-left p-3.5 rounded-xl border-2 transition-all ${checked ? "border-custom-blue bg-blue-50" : "border-gray-100 hover:border-gray-200"}`}
    >
      <div
        className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${checked ? "border-custom-blue" : "border-gray-300"}`}
      >
        {checked && <div className="w-2 h-2 rounded-full bg-custom-blue" />}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {sublabel && (
          <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>
        )}
      </div>
    </button>
  );
}

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div>
      {label && (
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
          {label}
        </p>
      )}
      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
        <p className="flex-1 px-3 py-2.5 text-sm text-slate-500 truncate bg-white">
          {value}
        </p>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border-l border-gray-200 text-sm font-semibold text-slate-600 hover:bg-gray-100 transition shrink-0"
        >
          <Copy className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Copy URL"}
        </button>
      </div>
    </div>
  );
}

function SelectDropdown({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 pr-8 focus:outline-none focus:border-custom-blue"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

function SmallSelect({ value, onChange, options, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 pr-6 focus:outline-none focus:border-custom-blue"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
    </div>
  );
}

function SectionTitle({ icon: Icon, title, color = "text-custom-blue" }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <h2 className="font-bold text-slate-800">{title}</h2>
    </div>
  );
}

/* ═══════════════════════════════════════ MAIN ═══════════════════════════════════════ */
export default function Onlinebookings(props) {
  const router = useRouter();

  // Global
  const [bookingsOn, setBookingsOn] = useState(true);

  // Booking Rules
  const [initialStatus, setInitialStatus] = useState("confirmed");
  const [staffSelection, setStaffSelection] = useState(
    "Clients can choose any staff",
  );
  const [clientDataReq, setClientDataReq] = useState(false);
  const [multiServiceBooking, setMultiServiceBooking] = useState(true);

  // Booking options
  const [multipleServices, setMultipleServices] = useState(false);
  const [multipleStaff, setMultipleStaff] = useState(true);
  const [allowTimezone, setAllowTimezone] = useState(true);

  // Calendar optimise
  const [calendarMode, setCalendarMode] = useState("minimise");

  // Client Login
  const [loginMode, setLoginMode] = useState("either");
  const [hideVIP, setHideVIP] = useState(false);
  const [loginMessage, setLoginMessage] = useState(
    "Having trouble accessing your account? Please contact our front desk at (555) 0123-4567 for immediate assistance with your booking credentials.",
  );

  // Booking Policy
  const [leadTime, setLeadTime] = useState("0 hours");
  const [futureMonths, setFutureMonths] = useState("12");
  const [futureUnit, setFutureUnit] = useState("months");
  const [cancelWindow, setCancelWindow] = useState("24 hours");

  // Appearance
  const [portalTheme, setPortalTheme] = useState("custom");
  const [btnColor, setBtnColor] = useState("#434C");
  const [btnText, setBtnText] = useState("#FFFFFF");
  const [linkColor, setLinkColor] = useState("#4D3D");

  // Custom text fields
  const [selectServiceText, setSelectServiceText] = useState(
    "Existing clients: Please book under General | New Clients: Book Under New Clients.",
  );
  const [selectStaffText, setSelectStaffText] = useState("");
  const [selectDateText, setSelectDateText] = useState(
    "Chebo Clinic is a private, child-free space designed for uninterrupted care. Please arrive 5 minutes early for your scheduled consultation.",
  );
  const [enterDetailsText, setEnterDetailsText] = useState(
    "Chebo Clinic rewards consistent, regular clients. Please ensure your contact details are accurate to receive appointment reminders.",
  );
  const [apptConfirmedText, setApptConfirmedText] = useState(
    "Chebo Clinic rewards consistent, regular clients. Please ensure your contact details are accurate to receive appointment reminders.",
  );
  const [noServiceText, setNoServiceText] = useState(
    "Chebo Clinic rewards consistent, regular clients. Please ensure your contact details are accurate to receive appointment reminders.",
  );
  const [privacyPolicy, setPrivacyPolicy] = useState("");

  const maxLoginMsg = 300;

  const handleSave = () => {
    props?.loader?.(true);
    Api(
      "post",
      "bookings/settings/save",
      {
        bookingsOn,
        initialStatus,
        staffSelection,
        clientDataReq,
        multiServiceBooking,
        multipleServices,
        multipleStaff,
        allowTimezone,
        calendarMode,
        loginMode,
        hideVIP,
        loginMessage,
        leadTime,
        futureMonths,
        futureUnit,
        cancelWindow,
        portalTheme,
        btnColor,
        btnText,
        linkColor,
        selectServiceText,
        selectStaffText,
        selectDateText,
        enterDetailsText,
        apptConfirmedText,
        noServiceText,
        privacyPolicy,
      },
      router,
    )
      .then((res) => {
        props?.loader?.(false);
        if (res?.status === true)
          props?.toaster?.({
            type: "success",
            message: "Settings saved successfully",
          });
      })
      .catch(() => props?.loader?.(false));
  };

  return (
    <>
      <DashboardHeader title="Your Business" />

      <div className="min-h-screen bg-[#f0f1f5] text-slate-800 px-4 md:px-6 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-800">Online Bookings</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
              <span className="text-sm text-slate-600 font-medium">
                {bookingsOn ? "On" : "Off"}
              </span>
              <Toggle checked={bookingsOn} onChange={setBookingsOn} />
            </div>
            <button
              onClick={handleSave}
              className="bg-custom-blue text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── LEFT ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Share booking link */}
            <SCard className="p-5">
              <p className="font-bold text-slate-800 mb-3">
                Share your online booking link with clients
              </p>
              <CopyField value="https://architectural.booking-engine.com/v1/book" />
            </SCard>

            {/* Client Login Portal */}
            <SCard className="p-5">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-custom-blue" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">
                    Client login: Empowering clients
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Let your clients manage their own appointments, update their
                    details, and handle payment methods through a secure,
                    private dashboard.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <CopyField
                  label="Main Booking Page"
                  value="https://architect-atelier.booking.io/portal/home"
                />
                <CopyField
                  label="Personal Details Update"
                  value="https://architect-atelier.booking.io/portal/details"
                />
                <CopyField
                  label="Manage Stored Cards"
                  value="https://architect-atelier.booking.io/portal/wallet"
                />
              </div>
            </SCard>

            {/* Bookings across time zones */}
            <SCard className="p-5">
              <SectionTitle icon={Globe} title="Bookings across time zones" />
              <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3.5">
                <Checkbox
                  checked={allowTimezone}
                  onChange={setAllowTimezone}
                  label="Allow customers to book appointments in their local time zone"
                  sublabel="The system will automatically detect the user's location and adjust your availability."
                />
              </div>
            </SCard>

            {/* Booking Options */}
            <SCard className="p-5">
              <SectionTitle icon={BookOpen} title="Booking options" />
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3.5">
                  <Checkbox
                    checked={multipleServices}
                    onChange={setMultipleServices}
                    label="Allow multiple services in an appointment"
                  />
                </div>
                <div className="bg-blue-50 rounded-xl border border-blue-100 px-4 py-3.5">
                  <Checkbox
                    checked={multipleStaff}
                    onChange={setMultipleStaff}
                    label="Allow multiple staff in an appointment"
                  />
                </div>
              </div>
            </SCard>

            {/* Optimise Calendar */}
            <SCard className="p-5">
              <SectionTitle icon={Calendar} title="Optimise your calendar" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    key: "all",
                    icon: AlignLeft,
                    label: "Show all available times",
                    desc: "Let clients choose from every single available slot in your calendar.",
                  },
                  {
                    key: "minimise",
                    icon: Minimize2,
                    label: "Minimise gaps",
                    desc: "Prioritize time slots that are adjacent to existing appointments.",
                    recommended: true,
                  },
                  {
                    key: "intervals",
                    icon: SlidersHorizontal,
                    label: "Specific intervals only",
                    desc: "Restrict bookings to start every 30, 60, or 90 minutes.",
                  },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setCalendarMode(opt.key)}
                    className={`relative flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all ${calendarMode === opt.key ? "border-custom-blue bg-blue-50" : "border-gray-100 hover:border-gray-200 bg-white"}`}
                  >
                    {opt.recommended && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-custom-blue text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
                        Recommended
                      </span>
                    )}
                    <opt.icon
                      className={`w-5 h-5 mb-2 ${calendarMode === opt.key ? "text-custom-blue" : "text-slate-400"}`}
                    />
                    <p className="text-xs font-semibold text-slate-700 mb-1">
                      {opt.label}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {opt.desc}
                    </p>
                    <div
                      className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${calendarMode === opt.key ? "border-custom-blue" : "border-gray-300"}`}
                    >
                      {calendarMode === opt.key && (
                        <div className="w-2 h-2 rounded-full bg-custom-blue" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </SCard>

            {/* Client Login Mode */}
            <SCard className="p-5">
              <SectionTitle icon={Lock} title="Client Login" />
              <div className="space-y-2">
                <RadioOption
                  checked={loginMode === "either"}
                  onChange={() => setLoginMode("either")}
                  label="Clients can either log in or continue as guest"
                  sublabel="Recommended for maximum conversion. Allows new users to book quickly."
                />
                <RadioOption
                  checked={loginMode === "must"}
                  onChange={() => setLoginMode("must")}
                  label="Clients must log in"
                  sublabel="Best for membership-based businesses or strict record keeping."
                />
                <RadioOption
                  checked={loginMode === "hide"}
                  onChange={() => setLoginMode("hide")}
                  label="Hide log in option"
                  sublabel="Bookings will be created without logging in."
                />
              </div>
            </SCard>

            {/* Portal Customisation */}
            <SCard className="p-5">
              <SectionTitle icon={FileText} title="Portal Customization" />

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-semibold text-slate-700">
                    Login Assistance Message
                  </p>
                  <span className="text-[11px] text-slate-400">
                    {loginMessage.length} / {maxLoginMsg} CHARACTERS
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={loginMessage}
                  onChange={(e) =>
                    setLoginMessage(e.target.value.slice(0, maxLoginMsg))
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-custom-blue resize-none bg-white"
                />
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-xl border border-gray-100 px-4 py-3.5">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Hide non-VIP services from VIP clients
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    When logged in, users tagged as VIP will only see exclusive
                    service tiers.
                  </p>
                </div>
                <Toggle checked={hideVIP} onChange={setHideVIP} />
              </div>
            </SCard>

            {/* Booking Policy */}
            <SCard className="p-5">
              <SectionTitle icon={Shield} title="Booking Policy" />

              <div className="space-y-5">
                {/* Lead times */}
                <div>
                  <p className="font-semibold text-slate-800 text-sm mb-1">
                    Booking lead times
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm text-slate-500">
                      Customers can book appointments up to:
                    </p>
                    <SmallSelect
                      value={leadTime}
                      onChange={setLeadTime}
                      options={[
                        "0 hours",
                        "1 hour",
                        "2 hours",
                        "4 hours",
                        "8 hours",
                        "12 hours",
                        "24 hours",
                        "48 hours",
                      ]}
                    />
                    <p className="text-sm text-slate-500">before start time.</p>
                  </div>
                </div>

                <div className="w-full h-px bg-gray-100" />

                {/* Future booking */}
                <div>
                  <p className="font-semibold text-slate-800 text-sm mb-1">
                    Future booking limits
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm text-slate-500">
                      Customers can book appointments up to:
                    </p>
                    <input
                      type="number"
                      value={futureMonths}
                      onChange={(e) => setFutureMonths(e.target.value)}
                      className="w-14 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-custom-blue text-center"
                    />
                    <SmallSelect
                      value={futureUnit}
                      onChange={setFutureUnit}
                      options={["days", "weeks", "months"]}
                    />
                    <p className="text-sm text-slate-500">in the future.</p>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Appointments will be able to be booked up to and including
                    Friday, 19 March, 2027.
                  </p>
                </div>

                <div className="w-full h-px bg-gray-100" />

                {/* Cancellations */}
                <div>
                  <p className="font-semibold text-slate-800 text-sm mb-1">
                    Cancellations and rescheduling
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm text-slate-500">
                      Customers can cancel or reschedule appointments up to:
                    </p>
                    <SmallSelect
                      value={cancelWindow}
                      onChange={setCancelWindow}
                      options={[
                        "1 hour",
                        "2 hours",
                        "4 hours",
                        "8 hours",
                        "12 hours",
                        "24 hours",
                        "48 hours",
                        "1 week",
                      ]}
                    />
                    <p className="text-sm text-slate-500">before start time.</p>
                  </div>
                </div>
              </div>
            </SCard>

            {/* Appearance */}
            <SCard className="p-5">
              <SectionTitle icon={Paintbrush} title="Appearance" />

              {/* Portal Theme */}
              <p className="text-sm font-bold text-slate-700 mb-3">
                Portal Theme
              </p>
              <div className="space-y-2 mb-5">
                {[
                  { key: "clee", label: 'Use the default "Clee" theme' },
                  { key: "neutral", label: 'Use the "Neutral" theme' },
                  { key: "custom", label: "Add custom colours" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setPortalTheme(t.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${portalTheme === t.key ? "border-custom-blue bg-blue-50" : "border-gray-100 hover:border-gray-200"}`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${portalTheme === t.key ? "border-custom-blue" : "border-gray-300"}`}
                    >
                      {portalTheme === t.key && (
                        <div className="w-2 h-2 rounded-full bg-custom-blue" />
                      )}
                    </div>
                    <span className="text-sm text-slate-700">{t.label}</span>
                  </button>
                ))}
              </div>

              {portalTheme === "custom" && (
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    {
                      label: "Button Colour",
                      value: btnColor,
                      onChange: setBtnColor,
                      bg: "#4CAF50",
                    },
                    {
                      label: "Button Text",
                      value: btnText,
                      onChange: setBtnText,
                      bg: "#FFFFFF",
                    },
                    {
                      label: "Link Colour",
                      value: linkColor,
                      onChange: setLinkColor,
                      bg: "#00BCD4",
                    },
                  ].map((c) => (
                    <div key={c.label}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                        {c.label}
                      </p>
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <div
                          className="w-10 h-9 shrink-0"
                          style={{ backgroundColor: c.bg }}
                        />
                        <input
                          value={c.value}
                          onChange={(e) => c.onChange(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm text-slate-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add your own text */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <AlignLeft className="w-3 h-3 text-custom-blue" />
                  </div>
                  <p className="font-bold text-slate-800 text-sm">
                    Add your own text
                  </p>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Personalize the messaging at each step of the booking process.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      label: '"Select service" step',
                      val: selectServiceText,
                      set: setSelectServiceText,
                    },
                    {
                      label: '"Select staff" step',
                      val: selectStaffText,
                      set: setSelectStaffText,
                      placeholder: "Leave empty for default…",
                    },
                    {
                      label: '"Select date/time" step',
                      val: selectDateText,
                      set: setSelectDateText,
                    },
                    {
                      label: '"Enter customer details" step',
                      val: enterDetailsText,
                      set: setEnterDetailsText,
                    },
                    {
                      label: '"Appointment confirmed" step',
                      val: apptConfirmedText,
                      set: setApptConfirmedText,
                    },
                    {
                      label: '"No service available" text',
                      val: noServiceText,
                      set: setNoServiceText,
                    },
                  ].map((f) => (
                    <div key={f.label}>
                      <p className="text-sm font-semibold text-slate-700 mb-1.5">
                        {f.label}
                      </p>
                      <textarea
                        rows={2}
                        value={f.val}
                        onChange={(e) => f.set(e.target.value)}
                        placeholder={f.placeholder || ""}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 focus:outline-none focus:border-custom-blue resize-none bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Policy */}
              <div className="border-t border-gray-100 pt-5 mt-5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-3 h-3 text-custom-blue" />
                  </div>
                  <p className="font-bold text-slate-800 text-sm">
                    Privacy policy
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  {/* Compliance note */}
                  <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Compliance Note
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      GDPR and other local data protection laws require you to
                      inform your clients about how you use their personal data.
                    </p>
                    <button className="flex items-center gap-1 text-custom-blue text-xs font-semibold hover:underline">
                      View compliance guide <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Editor */}
                  <div className="md:col-span-2">
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100 bg-gray-50">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Bold className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Italic className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Link2 className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                        <span className="text-xs text-slate-400">
                          Markdown supported
                        </span>
                      </div>
                      <textarea
                        rows={5}
                        value={privacyPolicy}
                        onChange={(e) => setPrivacyPolicy(e.target.value)}
                        placeholder="Enter your privacy policy details here..."
                        className="w-full px-4 py-3 text-sm text-slate-600 focus:outline-none resize-none bg-white"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">
                      You can apply formatting to your privacy policy using
                      these shortcuts:{" "}
                      <span className="font-mono">**bold**</span>,{" "}
                      <span className="font-mono">*italic*</span>,{" "}
                      <span className="font-mono">[link name](url)</span>
                    </p>

                    {/* Live Preview */}
                    <div className="mt-3 border border-gray-200 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Live Preview
                        </p>
                        <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Draft View
                        </span>
                      </div>
                      <div className="min-h-24 flex flex-col items-center justify-center py-8 bg-white">
                        {privacyPolicy ? (
                          <p className="text-sm text-slate-600 px-4 whitespace-pre-wrap">
                            {privacyPolicy}
                          </p>
                        ) : (
                          <>
                            <Eye className="w-6 h-6 text-gray-300 mb-2" />
                            <p className="text-sm font-semibold text-slate-400">
                              Nothing to preview yet...
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              Start typing above to see how it looks to your
                              clients.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SCard>

            {/* Bottom Save */}
            <div className="flex justify-end pb-4">
              <button
                onClick={handleSave}
                className="bg-custom-blue text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>

          {/* ── RIGHT: Booking Rules ── */}
          <div className="space-y-4">
            <SCard className="p-5 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-4 h-4 text-custom-blue" />
                <h2 className="font-bold text-slate-800">Booking Rules</h2>
              </div>

              {/* Initial Status */}
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Initial status for online bookings
              </p>
              <div className="grid grid-cols-2 rounded-xl overflow-hidden border border-gray-200 mb-4">
                {["confirmed", "pencilled-in"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setInitialStatus(s)}
                    className={`py-2 text-xs font-semibold capitalize transition ${initialStatus === s ? "bg-custom-blue text-white" : "bg-white text-slate-500 hover:bg-gray-50"} ${s === "pencilled-in" ? "border-l border-gray-200" : ""}`}
                  >
                    {s === "confirmed" ? "Confirmed" : "Pencilled-In"}
                  </button>
                ))}
              </div>

              {/* Selecting staff */}
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Selecting staff
              </p>
              <SelectDropdown
                value={staffSelection}
                onChange={setStaffSelection}
                options={[
                  "Clients can choose any staff",
                  "Assign automatically",
                  "No staff selection",
                ]}
              />

              {/* Checkboxes */}
              <div className="mt-4 space-y-3">
                <button
                  onClick={() => setClientDataReq(!clientDataReq)}
                  className="flex items-start gap-2.5 w-full text-left"
                >
                  {clientDataReq ? (
                    <CheckSquare className="w-4 h-4 text-custom-blue mt-0.5 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-custom-blue">
                      Client data requirement
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Force clients to provide phone number and address.
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setMultiServiceBooking(!multiServiceBooking)}
                  className="flex items-start gap-2.5 w-full text-left"
                >
                  {multiServiceBooking ? (
                    <CheckSquare className="w-4 h-4 text-custom-blue mt-0.5 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-custom-blue">
                      Multi-service booking
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Allow clients to book multiple services in a single
                      session.
                    </p>
                  </div>
                </button>
              </div>

              {/* Pro Tip */}
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                    Pro Tip
                  </p>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  You can customize the "Booking Policy" text in the Branding
                  section to match your atelier's specific guidelines.
                </p>
              </div>
            </SCard>
          </div>
        </div>
      </div>
    </>
  );
}
