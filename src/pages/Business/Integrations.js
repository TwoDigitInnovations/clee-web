import React, { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import {
  Settings,
  Mail,
  RefreshCw,
  Calendar,
  Chrome,
  BookOpen,
  Zap,
  Users,
  CheckSquare,
  Square,
  ExternalLink,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";

const integrations = {
  payment: {
    name: "CleePay",
    description:
      "Our built-in payment solution. Accept online payments, deposits, and sell gift vouchers instantly. Competitive rates with no hidden fees.",
    icon: <CreditCard className="w-6 h-6 text-white" />,
    active: true,
    recommended: true,
  },
  accounting: [
    { id: "xero", name: "Xero", label: "Xero" },
    { id: "quickbooks", name: "QuickBooks", label: "QuickBooks" },
  ],
  xeroFeatures: [
    { id: "post", label: "Post invoices automatically", checked: false },
    { id: "apply", label: "Apply payments to invoices", checked: true },
    { id: "onaccount", label: "Supports on-account payment", checked: false },
  ],
  email: {
    name: "MailChimp",
    description:
      "Grow your business with smart email marketing and automations.",
    features: [
      "Sync customer lists",
      "Automated follow-ups",
      "Birthday campaigns",
    ],
  },
  crm: {
    title: "Customer sync",
    tag: "CRM SYNC",
    description:
      "Keep your customer database unified. Any update in Google Contacts reflects here, ensuring your team always has the latest details.",
    features: [
      "Bi-directional contact updates",
      "Bulk import your existing mailing list",
    ],
  },
  scheduling: {
    title: "Google calendar sync",
    tag: "SCHEDULING",
    description: "",
    features: [
      "Sync your personal and professional calendars instantly.",
      "Prevent double-bookings across all platforms.",
      "Automatic reminders for upcoming integrations.",
    ],
  },
  chrome: {
    title: "Google Chrome app",
    description:
      "Access your dashboard features directly from any browser tab. Create appointments and manage tasks without switching windows.",
    features: ["Quick Access", "Desktop Alerts", "Performance Optimised"],
  },
};

function Badge({ children, variant = "green" }) {
  const colors = {
    green: "bg-green-100 text-green-700 border border-green-200",
    blue: "bg-blue-100 text-blue-700 border border-blue-200",
    gray: "bg-gray-100 text-gray-600 border border-gray-200",
  };
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${colors[variant]}`}
    >
      {children}
    </span>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10">
      <path
        fill="#EA4335"
        d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.1-6.1C34.46 3.1 29.5 1 24 1 14.82 1 7.07 6.7 3.84 14.69l7.09 5.5C12.64 14.1 17.87 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.7c-.55 2.97-2.18 5.48-4.65 7.17l7.18 5.57C43.24 37.5 46.5 31.5 46.5 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.93 28.19A14.6 14.6 0 0 1 9.5 24c0-1.45.25-2.85.68-4.17l-7.09-5.5A23.9 23.9 0 0 0 .5 24c0 3.87.93 7.53 2.58 10.74l7.85-6.55z"
      />
      <path
        fill="#34A853"
        d="M24 46.5c5.5 0 10.12-1.82 13.5-4.96l-7.18-5.57C28.52 37.7 26.38 38.5 24 38.5c-6.13 0-11.36-4.6-13.07-10.81l-7.85 6.55C6.35 41.8 14.5 46.5 24 46.5z"
      />
    </svg>
  );
}

function XeroLogo() {
  return (
    <div className="w-10 h-10 rounded-lg bg-[#1AB4D7] flex items-center justify-center">
      <span className="text-white font-bold text-sm">X</span>
    </div>
  );
}

function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 ${className}`}
    >
      {children}
    </div>
  );
}

function ActivateButton({
  label = "Activate",
  fullWidth = false,
  variant = "primary",
}) {
  const base = `rounded-xl font-semibold text-sm py-2.5 transition-all duration-200 cursor-pointer`;
  if (variant === "outline") {
    return (
      <button
        className={`${base} border-2 border-custom-blue text-custom-blue hover:bg-blue-50 px-5 ${fullWidth ? "w-full" : ""}`}
      >
        {label}
      </button>
    );
  }
  return (
    <button
      className={`${base} bg-custom-blue text-white hover:opacity-90 px-5 ${fullWidth ? "w-full" : ""}`}
    >
      {label}
    </button>
  );
}

export default function Integrations() {
  const [accountingTab, setAccountingTab] = useState("xero");
  const [xeroChecks, setXeroChecks] = useState({
    post: false,
    apply: true,
    onaccount: false,
  });
  const router = useRouter();
  const toggleCheck = (id) => {
    setXeroChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <DashboardHeader title="Your Business" />

      <div className="min-h-screen bg-custom-gray text-slate-800 px-6 py-6 space-y-5">
        {/* View Blog */}
        <div className="flex justify-end">
          <button
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-custom-blue border border-blue-200 rounded-xl px-4 py-2 hover:bg-Custom-blue/90 transition"
            onClick={() => router.push("/Business/IntegrationsLog")}
          >
            <BookOpen className="w-4 h-4" /> View log
          </button>
        </div>

        {/* CleePay */}
        <SectionCard>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-custom-blue flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-base text-slate-800">CleePay</h2>
                <p className="text-sm text-slate-500 mt-0.5 max-w-lg leading-relaxed">
                  Our built-in payment solution. Accept online payments,
                  deposits, and sell gift vouchers instantly. Competitive rates
                  with no hidden fees.
                </p>
                <div className="flex gap-2 mt-2.5">
                  <Badge variant="green">Active</Badge>
                  <Badge variant="gray">Recommended</Badge>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-1.5 text-sm font-semibold text-white bg-custom-blue rounded-xl px-4 py-2 hover:opacity-90 transition shrink-0">
              <Settings className="w-4 h-4" /> View Settings
            </button>
          </div>
        </SectionCard>

        {/* Accounting + Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Accounting & Invoicing */}
          <SectionCard>
            <h3 className="font-bold text-sm text-slate-700 mb-3">
              Accounting and invoicing
            </h3>
            <div className="flex gap-2 mb-4">
              {integrations.accounting.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAccountingTab(tab.id)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                    accountingTab === tab.id
                      ? "bg-custom-blue text-white border-custom-blue"
                      : "bg-white text-slate-600 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <XeroLogo />
              <div>
                <p className="font-semibold text-slate-800">Xero</p>
                <p className="text-xs text-slate-500">
                  Seamlessly sync your sales, invoices, and payments.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 mb-5">
              {integrations.xeroFeatures.map((f) => (
                <button
                  key={f.id}
                  onClick={() => toggleCheck(f.id)}
                  className="flex items-center gap-2.5 w-full text-left group"
                >
                  {xeroChecks[f.id] ? (
                    <CheckSquare className="w-4 h-4 text-custom-blue shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-300 shrink-0" />
                  )}
                  <span className="text-sm text-slate-700">{f.label}</span>
                </button>
              ))}
            </div>

            <ActivateButton label="Activate Xero Integration" fullWidth />
          </SectionCard>

          {/* Email Marketing */}
          <SectionCard>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-lg bg-yellow-400 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-sm text-slate-700">
                Email marketing
              </h3>
            </div>

            <p className="font-semibold text-slate-800 mt-3">MailChimp</p>
            <p className="text-sm text-slate-500 mt-0.5 mb-3">
              Grow your business with smart email marketing and automations.
            </p>

            <div className="bg-gray-50 rounded-xl p-3 mb-5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Key Features
              </p>
              <ul className="space-y-1.5">
                {integrations.email.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-custom-blue inline-block shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <ActivateButton
              label="Connect MailChimp"
              fullWidth
              variant="outline"
            />
          </SectionCard>
        </div>

        {/* CRM + Calendar Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Customer Sync */}
          <SectionCard>
            <div className="flex items-center justify-between mb-1">
              <GoogleLogo />
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                CRM Sync
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-800 mt-3">
              Customer sync
            </h3>
            <p className="text-sm text-slate-500 mt-1 mb-4 leading-relaxed">
              Keep your customer database unified. Any update in Google Contacts
              reflects here, ensuring your team always has the latest details.
            </p>

            <div className="space-y-2 mb-5">
              {integrations.crm.features.map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-2 text-sm text-slate-600 bg-gray-50 rounded-lg px-3 py-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-custom-blue shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <ActivateButton fullWidth />
              <button className="text-sm font-semibold text-custom-blue hover:underline px-3">
                More info
              </button>
            </div>
          </SectionCard>

          {/* Google Calendar */}
          <SectionCard>
            <div className="flex items-center justify-between mb-1">
              <GoogleLogo />
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                Scheduling
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-800 mt-3">
              Google calendar sync
            </h3>

            <div className="space-y-2.5 mt-3 mb-5">
              {integrations.scheduling.features.map((f) => (
                <div
                  key={f}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <div className="w-4 h-4 rounded-full bg-custom-blue flex items-center justify-center shrink-0 mt-0.5">
                    <svg viewBox="0 0 10 10" className="w-2.5 h-2.5">
                      <path
                        d="M2 5l2 2 4-4"
                        stroke="white"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {f}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <ActivateButton fullWidth />
              <button className="text-sm font-semibold text-custom-blue hover:underline px-3">
                More info
              </button>
            </div>
          </SectionCard>
        </div>

        {/* Google Chrome App */}
        <SectionCard>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Chrome className="w-10 h-10 text-[#4285F4]" />
              <div>
                <h3 className="font-bold text-base text-slate-800">
                  Google Chrome app
                </h3>
                <p className="text-sm text-slate-500 mt-0.5 max-w-lg">
                  Access your dashboard features directly from any browser tab.
                  Create appointments and manage tasks without switching
                  windows.
                </p>
                <div className="flex gap-3 mt-2">
                  {integrations.chrome.features.map((f) => (
                    <span
                      key={f}
                      className="text-xs text-slate-500 flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <ActivateButton label="Activate" />
          </div>
        </SectionCard>

        {/* Bottom View Blog */}
        <div className="flex justify-end pb-2">
          <button
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-custom-blue border border-blue-200 rounded-md px-4 py-2 hover:bg-Custom-blue/90 transition"
            onClick={() => router.push("/Business/IntegrationsLog")}
          >
            <BookOpen className="w-4 h-4" /> View log
          </button>
        </div>
      </div>
    </>
  );
}
