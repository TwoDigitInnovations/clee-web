"use client";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Monitor,
  Zap,
  Paintbrush,
  Globe,
  BookOpen,
} from "lucide-react";
import { fetchLocations } from "@/redux/actions/locationActions";
import { fetchServices } from "@/redux/actions/servicesActions";
import { fetchStaff } from "@/redux/actions/staffActions";
import { useAppDispatch } from "@/redux/hooks";
import { fetchCategories } from "@/redux/actions/categoryActions";
// ─── Replace with real actions ────────────────────────────────────────────────
// import { fetchBookingSettings } from "@/redux/actions/bookingActions";

function Select({
  label,
  options,
  value,
  onChange,
  name,
  labelKey = "name", // 👈 dynamic label key
  valueKey = "_id", // 👈 dynamic value key
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-slate-200 bg-slate-50 rounded-lg px-3 py-2.5 pr-9 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
        >
          <option value="">Select {label}</option>

          {options?.map((o, key) => (
            <option key={key} value={o[valueKey]}>
              {o[labelKey]}
            </option>
          ))}
        </select>

        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>
    </div>
  );
}

function RadioOption({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-1">
      <div
        onClick={onChange}
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
          ${checked ? "border-custom-blue bg-custom-blue" : "border-slate-300 group-hover:border-custom-blue"}`}
      >
        {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1.5 text-xs text-custom-blue hover:underline font-semibold"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied!" : "Copy Code"}
    </button>
  );
}

function CodeBlock({ code, label }) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {label}
        </span>
        <CopyButton text={code} />
      </div>
      <pre className="px-4 py-3 text-xs text-slate-700 bg-white overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap break-all">
        {code}
      </pre>
    </div>
  );
}

function SubTabBar({ tabs, active, onChange }) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-slate-200 w-fit">
      {tabs.map((t, i) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-5 py-2 text-sm font-semibold transition-colors
            ${active === t ? "bg-white text-slate-900 shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}
            ${i > 0 ? "border-l border-slate-200" : ""}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function Section({ number, title, desc, children, noBorder }) {
  return (
    <div
      className={`py-4 md:py-8 ${!noBorder ? "border-b border-slate-200" : ""}`}
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-full flex-shrink-0 mb-4">
          <h2 className="text-xl font-semibold text-slate-800">
            {number && <span className="mr-1.5">{number}.</span>}
            {title}
          </h2>
          {desc && (
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              {desc}
            </p>
          )}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function OnlineBookingsTab() {
  const [location, setLocation] = useState("");
  const [staff, setStaff] = useState("Any available staff");
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");
  const dispatch = useAppDispatch();
  const WIDGET_TABS = ["Book now button", "Book now link", "Booking widget"];
  const [widgetTab, setWidgetTab] = useState("Book now button");
  const router = useRouter();
  const [btnStyle, setBtnStyle] = useState("dark");
  const [linkType, setLinkType] = useState("link");
  const [widgetW, setWidgetW] = useState("480");
  const [widgetH, setWidgetH] = useState("600");

  const baseUrl = "https://bookings.getClee.com/cheboclinic/bb/book";
  const iframeCode = `<iframe src="${baseUrl}" scrolling="no" id="CleeWidget" allow="payment" style="width:${widgetW}px;height:${widgetH}px;border:none"></iframe>`;

  const AllLocation = useSelector((state) => state.location?.locations || []);

  const { services: allServices } = useSelector((state) => state.services);
  const { staff: AllStaff } = useSelector((state) => state.staff);
  const AllCategory = useSelector((state) => state.category?.categories);

  useEffect(() => {
    // dispatch(fetchBookingSettings(router));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchLocations(router));
    dispatch(fetchServices(router));
    dispatch(fetchStaff(router));
    dispatch(fetchCategories(router));
  }, [dispatch]);

  return (
    <div>
      <Section number="1" title="Customise your selection">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Location"
            options={AllLocation}
            value={location}
            onChange={setLocation}
            labelKey="location_name"
            valueKey="_id"
          />
          <Select
            label="Staff"
            options={AllStaff}
            value={staff}
            onChange={setStaff}
            labelKey="fullname"
            valueKey="_id"
          />
          <Select
            label="Category"
            options={AllCategory}
            value={category}
            onChange={setCategory}
            labelKey="name"
            valueKey="_id"
          />
          <Select
            label="Service"
            options={allServices}
            value={service}
            onChange={setService}
            labelKey="name"
            valueKey="_id"
          />
        </div>
      </Section>

      <Section number="2" title="Button, link, or widget">
        <div className="space-y-5 ">
          <SubTabBar
            tabs={WIDGET_TABS}
            active={widgetTab}
            onChange={setWidgetTab}
          />

          {widgetTab === "Book now button" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <RadioOption
                  label="Dark button (recommended for light backgrounds)"
                  checked={btnStyle === "dark"}
                  onChange={() => setBtnStyle("dark")}
                />
                <RadioOption
                  label="Light button (best for dark-themed headers)"
                  checked={btnStyle === "light"}
                  onChange={() => setBtnStyle("light")}
                />
                <RadioOption
                  label="Own button image (upload a custom asset)"
                  checked={btnStyle === "own"}
                  onChange={() => setBtnStyle("own")}
                />
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-1">
                  Embedded Booking Widget
                </h3>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed max-w-lg">
                  Connect your Lumière Salon Pro booking engine directly to your
                  professional website. Our seamless widget ensures a
                  high-conversion experience for your clients without leaving
                  your domain.
                </p>

                <div className="rounded-2xl border border-slate-200 overflow-hidden mb-5">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Live Component Preview
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full tracking-widest">
                      Interactive
                    </span>
                  </div>
                  <div className="h-52 bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-5"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(0deg,transparent,transparent 30px,#000 30px,#000 31px),repeating-linear-gradient(90deg,transparent,transparent 30px,#000 30px,#000 31px)",
                      }}
                    />
                    <p className="text-xs text-slate-400 font-medium z-10">
                      Your Website Header
                    </p>
                    <button
                      className={`z-10 px-8 py-3 rounded-lg text-sm font-bold shadow-md transition-all hover:scale-105
                        ${btnStyle === "dark" ? "bg-custom-blue text-white" : btnStyle === "light" ? "bg-white text-custom-blue border-2 border-custom-blue" : "bg-gradient-to-r from-violet-500 to-indigo-600 text-white"}`}
                    >
                      Book Now
                    </button>
                    <p className="text-[10px] text-slate-400 z-10">
                      Button will inherit your brand primary color
                    </p>
                  </div>
                </div>

                {/* Integration Snippet */}
                <h4 className="text-base font-bold text-slate-800 mb-3">
                  Integration Snippet
                </h4>
                <div className="space-y-3 mb-6">
                  <CodeBlock
                    label="Step 1: Global Script"
                    code={`<script src="https://cdn.lumeresalonpro.com/v2/widget.js" async>\n</script>`}
                  />
                  <CodeBlock
                    label="Step 2: Trigger Element"
                    code={`<div id="lumiere-booking-widget" data-salon-id="LMP-9821-X"></div>`}
                  />
                </div>

                {/* Implementation Guide */}
                <h4 className="text-base font-bold text-slate-800 mb-4">
                  Implementation Guide
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      n: 1,
                      icon: Code2,
                      title: "Embed Script",
                      desc: "Place the global script tag inside the <head> section of your website to pre-load the widget engine.",
                    },
                    {
                      n: 2,
                      icon: Zap,
                      title: "Initialize Widget",
                      desc: "Insert the trigger div wherever you want the 'Book Now' button to appear on your page layout.",
                    },
                    {
                      n: 3,
                      icon: Paintbrush,
                      title: "Custom Styling",
                      desc: "Pass CSS variables through the data-attributes to match the button color with your site's aesthetic.",
                    },
                    {
                      n: 4,
                      icon: Globe,
                      title: "Go Live",
                      desc: "Save your website changes and refresh. Your clients can now book appointments instantly.",
                    },
                  ].map(({ n, icon: Icon, title, desc }) => (
                    <div
                      key={n}
                      className="flex gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/60"
                    >
                      <div className="w-6 h-6 rounded-full bg-custom-blue text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {n}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700 mb-0.5">
                          {title}
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {widgetTab === "Book now link" && (
            <div className="space-y-2">
              <RadioOption
                label="Book now link"
                checked={linkType === "link"}
                onChange={() => setLinkType("link")}
              />
              <RadioOption
                label="Link to open book now window within the page"
                checked={linkType === "inline"}
                onChange={() => setLinkType("inline")}
              />
            </div>
          )}

          {widgetTab === "Booking widget" && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  Select widget size:
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-slate-600">Width</span>
                  <input
                    value={widgetW}
                    onChange={(e) => setWidgetW(e.target.value)}
                    className="w-24 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-slate-50 outline-none focus:border-indigo-400 transition-colors"
                  />
                  <span className="text-sm text-slate-600">
                    pixels and height
                  </span>
                  <input
                    value={widgetH}
                    onChange={(e) => setWidgetH(e.target.value)}
                    className="w-24 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-slate-50 outline-none focus:border-indigo-400 transition-colors"
                  />
                  <span className="text-sm text-slate-600">pixels.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>

      {widgetTab === "Book now link" && (
        <Section number="3" title="The link URL" noBorder>
          <a
            href={baseUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-custom-blue hover:underline flex items-center gap-1.5 font-medium"
          >
            {baseUrl}
            <ExternalLink size={13} />
          </a>
        </Section>
      )}

      {widgetTab === "Booking widget" && (
        <>
          <Section number="3" title="Preview">
            <div
              className="rounded-xl border border-slate-200 overflow-hidden bg-white"
              style={{
                width: `${Math.min(Number(widgetW) || 480, 600)}px`,
                maxWidth: "100%",
              }}
            >
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">
                  Select services
                </span>
                <button className="text-sm text-slate-400 hover:text-slate-700 transition-colors">
                  Log in
                </button>
              </div>
              <div className="px-4 py-3 bg-slate-50 text-xs text-slate-600 border-b border-slate-100 leading-relaxed">
                Book Under New Clients. All procedure bookings include
                complimentary LED. Not suitable for pregnancy/breastfeeding,
                autoimmune conditions, or under 21s.
              </div>
              <div className="px-4 py-3 border border-slate-200 rounded-lg mx-3 my-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Chebo Clinic
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      59 Montgomery Street Kogarah
                      <br />
                      Sydney
                      <br />
                      NSW 2217
                    </p>
                  </div>
                </div>
              </div>
              {[
                "General",
                "New Clients",
                "Existing Clients",
                "Dermaflux from Double Bay Cosmeceuticals",
                "High Frequency Lift",
              ].map((s) => (
                <div
                  key={s}
                  className="flex items-center justify-between px-4 py-3 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm text-teal-600 font-medium">{s}</span>
                  <ChevronDown size={16} className="text-teal-500" />
                </div>
              ))}
              <div className="px-3 py-3">
                <button className="w-full py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-lg transition-colors">
                  Continue
                </button>
              </div>
            </div>
          </Section>

          <Section number="4" title="Code to add to your website" noBorder>
            <p className="text-sm text-slate-500 mb-3">
              Add this snippet where you would like the widget to appear.
            </p>
            <CodeBlock label="Iframe Embed" code={iframeCode} />
          </Section>
        </>
      )}
    </div>
  );
}

function GiftVoucherTab() {
  const VOUCHER_TABS = ["Buy gift voucher button", "Buy gift voucher link"];
  const [voucherTab, setVoucherTab] = useState("Buy gift voucher button");
  const [btnStyle, setBtnStyle] = useState("dark");
  const [linkType, setLinkType] = useState("link");

  const voucherUrl = "https://bookings.getClee.com/cheboclinic/bb/purchase";

  return (
    <div>
      <Section
        number=""
        title="Button or link"
        desc="Choose between a buy gift voucher button, or a link (perfect for emails) that you can embed on your website."
      >
        <div className="space-y-5">
          <SubTabBar
            tabs={VOUCHER_TABS}
            active={voucherTab}
            onChange={setVoucherTab}
          />

          {voucherTab === "Buy gift voucher button" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <RadioOption
                  label="Dark button (recommended for light backgrounds)"
                  checked={btnStyle === "dark"}
                  onChange={() => setBtnStyle("dark")}
                />
                <RadioOption
                  label="Light button (best for dark-themed headers)"
                  checked={btnStyle === "light"}
                  onChange={() => setBtnStyle("light")}
                />
                <RadioOption
                  label="Own button image (upload a custom asset)"
                  checked={btnStyle === "own"}
                  onChange={() => setBtnStyle("own")}
                />
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Button Preview
                  </span>
                </div>
                <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg,transparent,transparent 30px,#000 30px,#000 31px),repeating-linear-gradient(90deg,transparent,transparent 30px,#000 30px,#000 31px)",
                    }}
                  />
                  <button
                    className={`z-10 px-8 py-3 rounded-lg text-sm font-bold shadow-md transition-all hover:scale-105
                      ${btnStyle === "dark" ? "bg-custom-blue text-white" : btnStyle === "light" ? "bg-white text-custom-blue border-2 border-custom-blue" : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"}`}
                  >
                    Buy Gift Voucher
                  </button>
                  <p className="text-[10px] text-slate-400 z-10">
                    Button will inherit your brand primary color
                  </p>
                </div>
              </div>

              <CodeBlock
                label="Embed Code"
                code={`<a href="${voucherUrl}" target="_blank" class="btn-gift-voucher">Buy Gift Voucher</a>`}
              />
            </div>
          )}

          {voucherTab === "Buy gift voucher link" && (
            <div className="space-y-2">
              <RadioOption
                label="Buy gift voucher link"
                checked={linkType === "link"}
                onChange={() => setLinkType("link")}
              />
              <RadioOption
                label="Link to open buy gift voucher window within the page"
                checked={linkType === "inline"}
                onChange={() => setLinkType("inline")}
              />
            </div>
          )}
        </div>
      </Section>

      {voucherTab === "Buy gift voucher link" && (
        <Section title="The link URL" noBorder>
          <a
            href={voucherUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-custom-blue hover:underline flex items-center gap-1.5 font-medium"
          >
            {voucherUrl}
            <ExternalLink size={13} />
          </a>
        </Section>
      )}
    </div>
  );
}

export default function Bookingbuttons() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [mainTab, setMainTab] = useState("Online bookings");

  useEffect(() => {
    // dispatch(fetchBookingSettings(router));
  }, [dispatch]);

  return (
    <>
      <DashboardHeader title="Promote" />
      <div className="min-h-screen bg-[#f3f4f8] md:p-6 p-3 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-custom-blue">
              Build your booking buttons, links, and widgets
            </h1>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              Customize how your clients access your salon services. Choose
              between integrated buttons, direct links, or a full-width booking
              widget for your website.
            </p>
          </div>

          <div className="flex gap-0 border-b border-slate-200 mb-6">
            {["Online bookings", "Purchase gift voucher"].map((t) => (
              <button
                key={t}
                onClick={() => setMainTab(t)}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors
                  ${
                    mainTab === t
                      ? "border-custom-blue text-custom-blue"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 md:px-8">
            {mainTab === "Online bookings" ? (
              <OnlineBookingsTab />
            ) : (
              <GiftVoucherTab />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
