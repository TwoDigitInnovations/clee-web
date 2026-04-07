"use client";
import React, { useEffect, useState } from "react";
import {
  Copy,
  Edit,
  Link as LinkIcon,
  Trash2,
  Info,
  ChevronDown,
  Plus,
  Search,
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import { Api } from "@/services/service";
import { ConfirmModal } from "@/components/deleteModel";

function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex items-start gap-2 cursor-pointer text-[13px] text-gray-700">
      <div
        onClick={onChange}
        className={`w-4 h-4 min-w-[16px] rounded-[3px] border flex items-center justify-center mt-0.5 transition-all ${
          checked
            ? `bg-custom-blue border-custom-blue`
            : "bg-white border-gray-300"
        }`}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" />
          </svg>
        )}
      </div>
      <span>{label}</span>
    </label>
  );
}

function Radio({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-700">
      <div
        onClick={onChange}
        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
          checked ? `border-custom-blue` : "border-gray-300"
        }`}
      >
        {checked && <div className="w-2 h-2 rounded-full bg-custom-blue" />}
      </div>
      {label}
    </label>
  );
}

function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg px-4 md:px-6 py-5 mb-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ number, title }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-6 h-6 rounded-full bg-custom-blue text-white flex items-center justify-center text-[14px] font-bold flex-shrink-0">
        {number}
      </div>
      <span className="font-semibold text-[16px] text-gray-900">{title}</span>
    </div>
  );
}

function InfoBanner({ text, linkText }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md px-3.5 py-2.5 text-[12px] text-blue-800 flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Info size={14} />
        <span>{text}</span>
      </div>
      {linkText && (
        <span className="text-custom-blue font-semibold cursor-pointer whitespace-nowrap ml-3 hover:underline">
          {linkText}
        </span>
      )}
    </div>
  );
}

const templates = [
  {
    id: "modern",
    label: "Modern Minimalist",
    desc: "Clean and simple for any occasion",
    bg: "bg-[#f3ede8]",
    accent: "bg-[#c9a882]",
    image: "/images/template-1.png",
  },
  {
    id: "signature",
    label: "Signature Atelier",
    desc: "An almost unforgettable experience",
    bg: "bg-[#1a1a2e]",
    accent: "bg-[#c9a052]",
    dark: true,
    image: "/images/template-2.png",
  },
  {
    id: "seasonal",
    label: "Seasonal Botanicals",
    desc: "Elegant floral/botanical theme",
    bg: "bg-[#f5f0eb]",
    accent: "bg-[#8b7355]",
    image: "/images/template-3.png",
  },
];

// const vouchers = [
//   {
//     id: 1,
//     name: "Elite Skin Retreat Pass",
//     code: "elite-skin-retreat",
//     amount: 5500.0,
//   },
//   {
//     id: 2,
//     name: "Artisan Styling Voucher",
//     code: "artisan-styling",
//     amount: 600.0,
//   },
//   {
//     id: 3,
//     name: "Atelier Signature Day Spa",
//     code: "signature-day-spa",
//     amount: 1250.0,
//   },
// ];

function GiftVouchers(props) {
  const [selectedTemplate, setSelectedTemplate] = useState("signature");
  const [expiryType, setExpiryType] = useState("after");
  const [expiryValue, setExpiryValue] = useState(12);
  const [expiryUnit, setExpiryUnit] = useState("Months");
  const [vouchers, setVouchers] = useState([]);
  const [cb1, setCb1] = useState(true);
  const [cb2, setCb2] = useState(true);
  const [cb3, setCb3] = useState(false);
  const [cbOnlinePurchase, setCbOnlinePurchase] = useState(true);
  const [cbFullPayment, setCbFullPayment] = useState(false);
  const [cbShowBiz, setCbShowBiz] = useState(true);
  const [cbShowLogo, setCbShowLogo] = useState(true);
  const [open, setOpen] = useState(false);
  const [cbShowLinks, setCbShowLinks] = useState(true);
  const [cbCustomCodes, setCbCustomCodes] = useState(false);
  const [termsTemplate, setTermsTemplate] = useState("Default");
  const [termsValue, setTermsValue] = useState("");
  const [id, setId] = useState(null);
  const [defaultTerms, setDefaultTerms] = useState(
    "This voucher is valid until the expiry date specified and cannot be redeemed or replaced after this date. Chebo Clinic is not responsible for lost / stolen vouchers, and is not responsible for replacing a voucher that has been lost / stolen. This voucher is non-refundable and cannot be exchanged for cash. This voucher is not valid with any other offer and / or special at Chebo Clinic. This voucher must be used by one person. You can use this voucher in-between multiple visits or in one sitting. Please note this voucher can't be used for online purchases, it can only be redeemed instore. .",
  );

  const router = useRouter();

  useEffect(() => {
    fetchGiftVoucher();
  }, []);

  const fetchGiftVoucher = async () => {
    try {
      props.loader(true);
      const res = await Api("get", `gift-vouchers/getAll`, "", router);
      props.loader(false);
      if (res?.status === true) {
        const d = res.data.data;
        setVouchers(d);
      } else {
        props.toaster("error", res?.message || "Failed to fetch GiftVoucher");
      }
    } catch {
      props.loader(false);
      props.toaster("error", "Server error");
    }
  };

  const handleDeleteConfirm = () => {
    try {
      props.loader(true);
      Api("delete", `gift-vouchers/delete/${id}`, "", router).then((res) => {
        props.loader(false);
        if (res?.status === true) {
          props.toaster({ type: "success", message: "Gift voucher deleted" });
          fetchGiftVoucher();
          setOpen(false);
        }
      });
    } catch {
      props.loader(false);
      props.toaster("error", "Server error");
    }
  };

  return (
    <>
      <DashboardHeader title="Sales Tools" />

      <div className=" bg-custom-gray min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex md:flex-row flex-col gap-2 md:items-center justify-between ">
          <h1 className="text-[20px] font-bold text-custom-blue m-0">
            Gift vouchers
          </h1>
          <div className="flex gap-2">
            <button
              className="bg-custom-blue text-white rounded-md px-4 py-2 text-[13px] font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2"
              onClick={() => router.push("/SalesTools/SearchVouchers")}
            >
              <Search size={14} /> Search Voucher code
            </button>
            <button className="bg-custom-blue text-white rounded-md px-5 py-2 text-[13px] font-semibold hover:bg-opacity-90 transition-all">
              Save
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 md:p-6 md:px-4">
          <InfoBanner
            text="Client Direct Purchase — Share direct links to buy gift vouchers online via your website or social media."
            linkText="Free Trial ↗"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Online Voucher Links */}
            <SectionCard className="mb-0">
              <div className="font-semibold text-[14px] text-custom-blue mb-1 flex items-center gap-1.5">
                <LinkIcon size={14} /> Online Voucher Links
              </div>
              <div className="text-[11px] text-gray-500 mb-3.5 uppercase tracking-wider">
                ALL ONLINE VOUCHERS
              </div>
              {[
                "https://miraebeauty.com/vouchers/checkout/purchase",
                "https://mirae.beauty.com/shop/vouchers/buy-voucher",
              ].map((url, i) => (
                <div key={i} className="mb-2.5">
                  <div className="flex gap-1.5">
                    <input
                      readOnly
                      value={url}
                      className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-[11px] text-gray-700 bg-gray-50 outline-none focus:border-custom-blue"
                    />
                    <button className="bg-custom-blue text-white rounded px-2.5 py-1.5 text-[11px] flex items-center gap-1 hover:bg-opacity-90 transition-all">
                      <Copy size={12} /> Copy
                    </button>
                  </div>
                </div>
              ))}
            </SectionCard>

            {/* Voucher Settings */}
            <SectionCard className="mb-0">
              <div className="font-semibold text-[14px] text-custom-blue mb-3.5">
                Voucher Settings
              </div>
              <div className="flex flex-col gap-2.5">
                <Checkbox
                  checked={cb1}
                  onChange={() => setCb1(!cb1)}
                  label="Allow sale of vouchers — Amount vouchers. Clients can buy any value for someone as a gift."
                />
                <Checkbox
                  checked={cb2}
                  onChange={() => setCb2(!cb2)}
                  label="Allow these vouchers to be redeemed online — Allow clients to redeem email vouchers."
                />
                <Checkbox
                  checked={cb3}
                  onChange={() => setCb3(!cb3)}
                  label="Allow these vouchers to be visible — Show in checkout / email vouchers."
                />
              </div>
            </SectionCard>
          </div>

          <SectionCard>
            <div className="flex justify-between items-center mb-4">
              <div className="font-semibold text-[15px] text-custom-blue flex items-center gap-2">
                <span className="w-[22px] h-[22px] rounded-full bg-custom-blue text-white flex items-center justify-center text-[11px] font-bold">
                  ◈
                </span>
                Choose a template
              </div>
              <span className="text-[12px] text-custom-blue cursor-pointer font-semibold hover:underline">
                Manage All Templates →
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {templates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedTemplate === t.id
                      ? "border-custom-blue shadow-[0_0_0_2px_rgba(26,60,94,0.14)]"
                      : "border-transparent shadow-sm"
                  }`}
                >
                  <img
                    src={t.image}
                    alt={t.label}
                    className="w-full h-32 rounded-lg object-cover"
                  />

                  <div className="p-2.5 bg-white">
                    <div className="text-[12px] font-semibold text-gray-900">
                      {t.label}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                      {t.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <SectionTitle number="↻" title="Voucher Expiry" />
            <div className="flex flex-wrap gap-5 items-center mb-3">
              <Radio
                checked={expiryType === "never"}
                onChange={() => setExpiryType("never")}
                label="Never expires"
              />
              <Radio
                checked={expiryType === "after"}
                onChange={() => setExpiryType("after")}
                label="After"
              />
              {expiryType === "after" && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={expiryValue}
                    onChange={(e) => setExpiryValue(e.target.value)}
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-[13px] text-gray-900 focus:border-custom-blue outline-none"
                  />
                  <div className="relative">
                    <select
                      value={expiryUnit}
                      onChange={(e) => setExpiryUnit(e.target.value)}
                      className="appearance-none border border-gray-300 rounded pl-2.5 pr-7 py-1 text-[13px] text-gray-900 bg-white cursor-pointer focus:border-custom-blue outline-none"
                    >
                      <option>Months</option>
                      <option>Years</option>
                      <option>Days</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-md p-2.5 text-[12px] text-amber-800 flex items-center gap-2">
              <Info size={14} />
              <p>
                Please check the laws of your country, as some jurisdictions set
                minimum durations for gift vouchers.
              </p>
            </div>
          </SectionCard>

          <SectionCard>
            <SectionTitle number="3" title="Standard Terms & Conditions" />
            <div className="text-[12px] text-gray-500 mb-2 uppercase tracking-wide">
              SELECT TEMPLATE
            </div>
            <div className="relative max-w-[320px]">
              <select
                value={termsTemplate}
                onChange={(e) => setTermsTemplate(e.target.value)}
                className="w-full appearance-none border border-gray-300 rounded pl-3 pr-8 py-2 text-[13px] text-gray-900 bg-white cursor-pointer focus:border-custom-blue outline-none"
              >
                <option>Default </option>
                <option>None</option>
                <option>Custom</option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown size={14} />
              </div>
            </div>
            {termsTemplate === "Custom" && (
              <textarea
                value={termsValue}
                rows={3}
                placeholder=""
                onChange={(e) => setTermsValue(e.target.value)}
                className=" mt-8 w-full appearance-none border border-gray-300 rounded pl-3 pr-8 py-2 text-[13px] text-gray-900 bg-white cursor-pointer focus:border-custom-blue outline-none"
              />
            )}
          </SectionCard>

          <SectionCard>
            <SectionTitle number="4" title="Online Purchase Rules" />
            <div className="text-[12px] text-gray-500 mb-2.5 uppercase tracking-wide">
              ONLINE PURCHASE RULES
            </div>
            <div className="flex flex-col gap-2.5">
              <Checkbox
                checked={cbOnlinePurchase}
                onChange={() => setCbOnlinePurchase(!cbOnlinePurchase)}
                label="Clients amount vouchers can be purchased online — Allow clients to define their own value between your minimum and maximum limits."
              />
              <div className="bg-amber-50 border border-amber-200 rounded-md p-2.5 text-[12px] text-amber-800 flex items-center gap-2">
                <Info size={14} />
                <span>
                  Note: Full online payment must be taken for the purchase of a
                  voucher.
                </span>
              </div>
              <Checkbox
                checked={cbFullPayment}
                onChange={() => setCbFullPayment(!cbFullPayment)}
                label="Full online payment must be taken for the purchase of a voucher."
              />
            </div>
          </SectionCard>

          <SectionCard>
            <div className="flex md:flex-row flex-col gap-2  justify-between items-start mb-4">
              <div>
                <SectionTitle number="5" title="Fixed Amount Vouchers" />
                <div className="text-[12px] text-gray-500">
                  Manage your collection of voucher gift certificates and
                  templates.
                </div>
              </div>
              <button
                className="bg-custom-blue text-white rounded-md px-3.5 py-2.5 text-[14px] font-semibold flex items-center gap-1 hover:bg-opacity-90 transition-all"
                onClick={() => router.push("/SalesTools/AddGiftVouchers")}
              >
                <Plus size={14} /> New Template
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {["NAME", "CODE", "AMOUNT", "ACTIONS"].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vouchers.map((v, i) => (
                    <tr
                      key={i}
                      className={`hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                    >
                      <td className="px-3 py-3 text-gray-900 font-medium">
                        {v?.GiftVoucher_name}
                      </td>
                      <td className="px-3 py-3 text-gray-500 text-[12px]">
                        {v?.sku_handle}
                      </td>
                      <td className="px-3 py-3 text-gray-900 font-bold">
                        {v?.amount ? v?.amount : "N/A"}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1.5">
                          <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100">
                            <Edit size={14} />
                          </button>
                          <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100">
                            <LinkIcon size={14} />
                          </button>
                          <button
                            className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100"
                            onClick={() => {
                              setId(v?._id);
                              setOpen(true);
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* On All Vouchers */}
          <SectionCard>
            <SectionTitle number="6" title="On all vouchers" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visibility Settings */}
              <div>
                <div className="text-[11px] text-gray-500 font-bold mb-2.5 uppercase tracking-widest">
                  VISIBILITY SETTINGS
                </div>
                <p className="text-[12px] text-gray-500 mb-3 leading-relaxed">
                  Customise how your vouchers appear to clients. These settings
                  apply globally across all templates.
                </p>
                <div className="flex flex-col gap-2">
                  <Checkbox
                    checked={cbShowBiz}
                    onChange={() => setCbShowBiz(!cbShowBiz)}
                    label="Show Business name"
                  />
                  <Checkbox
                    checked={cbShowLogo}
                    onChange={() => setCbShowLogo(!cbShowLogo)}
                    label="Show Business logo"
                  />
                  <Checkbox
                    checked={cbShowLinks}
                    onChange={() => setCbShowLinks(!cbShowLinks)}
                    label="Show Links on online booking"
                  />
                </div>
              </div>

              {/* Default Terms */}
              <div>
                <div className="text-[11px] text-gray-500 font-bold mb-2.5 uppercase tracking-widest">
                  DEFAULT TERMS & CONDITIONS
                </div>
                <textarea
                  placeholder="Enter the Terms that will appear on all vouchers..."
                  rows={5}
                  value={defaultTerms}
                  onChange={(e) => setDefaultTerms(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-[12px] text-gray-700 bg-gray-50 outline-none focus:border-custom-blue transition-all"
                />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-200">
              <div className="text-[13px] font-semibold text-gray-900 mb-1">
                Track your own gift voucher codes
              </div>
              <Checkbox
                checked={cbCustomCodes}
                onChange={() => setCbCustomCodes(!cbCustomCodes)}
                label="Enable custom voucher codes — Manually input your physical voucher codes at time of using auto-generated QRs."
              />
            </div>
          </SectionCard>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2.5 pb-10">
            <button className="bg-white text-gray-700 border border-gray-300 rounded-md px-6 py-2 text-[13px] font-semibold hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button className="bg-custom-blue text-white rounded-md px-7 py-2 text-[13px] font-semibold hover:bg-opacity-90 shadow-sm transition-all">
              Save Changes
            </button>
          </div>
        </div>
        <ConfirmModal
          isOpen={open}
          setIsOpen={setOpen}
          title="Delete Staff"
          message="Are you sure you want to delete this staff member?"
          onConfirm={handleDeleteConfirm}
          yesText="Yes, Delete"
          noText="Cancel"
        />
      </div>
    </>
  );
}

export default GiftVouchers;
