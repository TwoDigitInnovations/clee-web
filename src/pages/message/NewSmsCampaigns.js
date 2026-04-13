import DashboardHeader from "@/components/DashboardHeader";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Api } from "@/services/service";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Users,
  Calendar,
  MessageSquare,
  Send,
  X,
  Info,
  Star,
  ArrowRight,
  ArrowLeft,
  Filter,
  AlertCircle,
  Loader2,
} from "lucide-react";

const MOCK_CLIENTS = [
  {
    id: 1,
    name: "Ashley Giles",
    nextAppt: null,
    vip: true,
    dob: null,
    mobile: "+61432008780",
  },
  {
    id: 2,
    name: "Chelsea Lowell",
    nextAppt: null,
    vip: true,
    dob: null,
    mobile: "+61423202997",
  },
  {
    id: 3,
    name: "Katie Larman",
    nextAppt: null,
    vip: true,
    dob: null,
    mobile: "+61402284304",
  },
  {
    id: 4,
    name: "Lamia Dahee",
    nextAppt: null,
    vip: true,
    dob: null,
    mobile: "+61414706030",
  },
  {
    id: 5,
    name: "Mariam Khaled",
    nextAppt: null,
    vip: true,
    dob: null,
    mobile: "+61414860741",
  },
  {
    id: 6,
    name: "Mariana Roul",
    nextAppt: null,
    vip: true,
    dob: null,
    mobile: "+61410367622",
  },
  {
    id: 7,
    name: "Molly Hanson",
    nextAppt: null,
    vip: true,
    dob: null,
    mobile: "+61434512792",
  },
  {
    id: 8,
    name: "Nada Soliman",
    nextAppt: "04 Apr 2026",
    vip: true,
    dob: null,
    mobile: "+61415301300",
  },
  {
    id: 9,
    name: "Rayane Tamer",
    nextAppt: null,
    vip: true,
    dob: null,
    mobile: "+61415872990",
  },
  {
    id: 10,
    name: "Sarah Roach",
    nextAppt: null,
    vip: true,
    dob: null,
    mobile: "+61422738949",
  },
  {
    id: 11,
    name: "Zoe Brennan",
    nextAppt: null,
    vip: false,
    dob: null,
    mobile: "+61400123456",
  },
];

const MOCK_CAMPAIGN_COST = 0.12;

const fakeApi = {
  filterClients: async (filters) => {
    await new Promise((r) => setTimeout(r, 600));
    let clients = [...MOCK_CLIENTS];
    if (filters.vipOnly) clients = clients.filter((c) => c.vip);
    return { status: true, data: clients };
  },
  sendCampaign: async (payload) => {
    await new Promise((r) => setTimeout(r, 1200));
    return { status: true, message: "Campaign sent successfully!" };
  },
};

const STEPS = [
  { label: "Filter clients", icon: Filter },
  { label: "Review clients", icon: Users },
  { label: "Write message", icon: MessageSquare },
  { label: "Review campaign", icon: Send },
];

function StepIndicator({ current }) {
  return (
    <div className="w-full mb-6">
      <div className="md:w-full w-[350px] flex items-center gap-6 border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-hide px-2">
        {STEPS.map((step, idx) => {
          const active = idx === current;
          const done = idx < current;

          return (
            <div key={idx} className="flex items-center gap-2">
              <div
                className={`w-5 mb-2 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                  active || done
                    ? "bg-custom-blue text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {idx + 1}
              </div>

              <span
                className={`text-sm font-medium pb-2 ${
                  active || done
                    ? "text-custom-blue border-b-2 border-custom-blue "
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* <div className="relative mt-2 h-[2px] bg-gray-200">
        <div
          className="absolute top-0 left-0 h-[2px] bg-custom-blue transition-all duration-300"
          style={{ width: `${(current / (STEPS.length - 1)) * 100}%` }}
        />
      </div> */}
    </div>
  );
}

function StepFilterClients({
  filters,
  setFilters,
  estimatedCount,
  onNext,
  onCancel,
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-custom-blue mb-1">
        Filter clients to send campaign to
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Note: Appointment attributes will search across appointments up to 2
        years ago.
      </p>

      <div className="flex grid md:grid-cols-3 grid-cols-1  gap-6">
        <div className="md:col-span-2 flex-1 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-custom-blue" />
              <span className="font-semibold text-gray-800">
                General Attributes
              </span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={filters.vipOnly}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, vipOnly: e.target.checked }))
                }
                className="w-4 h-4 accent-custom-blue"
              />
              <span className="text-sm text-gray-700">VIP Clients</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.hasBirthday}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, hasBirthday: e.target.checked }))
                }
                className="w-4 h-4 accent-custom-blue"
              />
              <span className="text-sm text-gray-700 mr-2">
                Has a birthday in:
              </span>
              <select
                disabled={!filters.hasBirthday}
                value={filters.birthdayMonth}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, birthdayMonth: e.target.value }))
                }
                className="text-sm border text-black border-gray-300 rounded-md px-2 py-1 disabled:opacity-40"
              >
                <option value="">Select month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} className="text-custom-blue" />
              <span className="font-semibold text-gray-800">
                Appointment Filter
              </span>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
              With appointments in date range:
            </p>
            <select
              value={filters.dateRange}
              onChange={(e) =>
                setFilters((f) => ({ ...f, dateRange: e.target.value }))
              }
              className="text-sm border text-black border-gray-300 rounded-md px-3 py-2 mb-4 w-48"
            >
              <option>Any date</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
              With appointments containing:
            </p>
            <div className="flex gap-2">
              {[
                "Selected locations",
                "Selected staff",
                "Selected services",
              ].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-custom-blue"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Exclusion Rules */}
          <div className="bg-white rounded-xl border-l-4 border-l-orange-400 border border-gray-200 p-5">
            <span className="font-semibold text-gray-800 block mb-3">
              Exclusion Rules
            </span>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.noFutureBookings}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    noFutureBookings: e.target.checked,
                  }))
                }
                className="w-4 h-4 accent-custom-blue mt-0.5"
              />
              <div>
                <span className="text-sm text-gray-700">
                  Has no future bookings
                </span>
                <p className="text-xs text-orange-500 mt-0.5">
                  This filter requires a past date range to be selected above to
                  effectively identify lapsed clients.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="bg-[#fff8f5] border border-orange-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                <Users size={14} className="text-orange-500" />
              </div>
              <span className="font-semibold text-gray-800 text-sm">
                Audience Summary
              </span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Estimated Clients</span>
              <span className="text-2xl font-bold text-gray-900">
                {estimatedCount.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
              <div
                className="h-2 bg-custom-blue rounded-full"
                style={{ width: `${Math.min(100, estimatedCount / 20)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 italic mb-3">
              "Filters are applied in real-time. This number updates as you
              change your criteria."
            </p>
            <div className="flex items-center gap-1 text-xs text-custom-blue">
              <Info size={12} />
              <span>
                SMS credits required: ~
                {(estimatedCount * MOCK_CAMPAIGN_COST).toFixed(1)}k
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-1">Pro Tip</p>
            <p className="text-xs text-gray-500">
              Targeting clients who haven't visited in 6 months with a small
              discount code is one of the most effective ways to boost
              retention.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-4 mt-8 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
        >
          <X size={14} /> Cancel Campaign
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-custom-blue text-white text-sm font-semibold hover:bg-custom-blue/90 transition"
        >
          Review clients <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

function StepReviewClients({ clients, onNext, onBack }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(clients.length / pageSize);
  const paged = clients.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">
        Number of recipients: {clients.length}
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        If you just updated any clients, go back to the previous step and rerun
        the filters.
      </p>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {[
                "Name",
                "Next appt. date",
                "VIP",
                "Date of birth",
                "Mobile number",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((c, i) => (
              <tr
                key={c.id}
                className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${i % 2 === 1 ? "bg-gray-50/50" : ""}`}
              >
                <td className="px-4 py-3">
                  <button className="text-custom-blue hover:underline font-medium">
                    {c.name}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-600">{c.nextAppt || "-"}</td>
                <td className="px-4 py-3">
                  {c.vip && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Star size={10} fill="currentColor" /> Y
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{c.dob || "-"}</td>
                <td className="px-4 py-3 font-mono text-gray-700 text-xs">
                  {c.mobile}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-gray-500">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-custom-blue text-white text-sm font-semibold hover:bg-custom-blue/90 transition"
        >
          Write message <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

function StepWriteMessage({
  message,
  setMessage,
  recipientCount,
  onNext,
  onBack,
}) {
  const MAX_CHARS = 437;
  const charCount = message.length;
  const isValid = message.trim().length > 0;

  return (
    <div>
      <div className="flex grid md:grid-cols-2 grid-cols-1 gap-8 min-h-[450px]">
        <div className="md:w-[400px] flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            Writing a message to {recipientCount} clients:
          </h2>
          <ul className="space-y-2">
            {[
              "Include your business name so your clients know who the SMS is from.",
              "Placeholders (used in Clee's automated messages) are not supported in SMS campaign messages.",
              "Messages are charged depending on the length of the message.",
            ].map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-custom-blue mt-2 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              Your message
            </span>
            <span
              className={`text-xs ${charCount > MAX_CHARS * 0.9 ? "text-red-500" : "text-gray-400"}`}
            >
              {charCount}/{MAX_CHARS}
            </span>
          </div>
          <textarea
            value={message}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS)
                setMessage(e.target.value);
            }}
            placeholder="Enter message here"
            rows={5}
            className="w-full text-black border border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
          />
          <p className="text-xs text-gray-400 text-right mb-4">
            $0.12 per message
          </p>

          {/* Preview */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Preview</p>
            <div className="bg-[#4a5568] text-white rounded-2xl rounded-bl-none px-4 py-3 max-w-xs text-sm leading-relaxed">
              {message ? <span>{message} </span> : null}
              <span className="text-gray-300 text-xs">
                Reply STOP to opt-out
              </span>
            </div>
          </div>
        </div>
      </div>

      {!isValid && (
        <div className="flex items-center gap-2 mt-4 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
          <AlertCircle size={16} />
          Please enter a message before proceeding.
        </div>
      )}

      <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-custom-blue text-white text-sm font-semibold hover:bg-custom-blue/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Review campaign <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

function StepReviewCampaign({ message, clients, onSend, onBack, sending }) {
  const cost = (clients.length * MOCK_CAMPAIGN_COST).toFixed(2);

  return (
    <div>
      <div className="flex grid md:grid-cols-2 grid-cols-1 gap-8 min-h-[450px]">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Review your campaign
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Once you <span className="font-semibold">send your campaign</span>,
            you'll be charged immediately and your SMS campaign will be sent.
          </p>
          <p className="text-sm text-gray-500">
            Note: Any messages that fail to send (i.e no longer valid SMS
            numbers) will be credited back to your SMS balance.
          </p>
        </div>

        <div className="w-90 flex-shrink-0">
          {/* SMS bubble */}
          <div className="bg-[#4a5568] text-white rounded-2xl rounded-bl-none px-5 py-4 text-sm leading-relaxed mb-4">
            {message}{" "}
            <span className="text-gray-300 text-xs">Reply STOP to opt-out</span>
          </div>

          <div className="border-t border-gray-200 pt-3 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Message cost</span>
              <span className="text-gray-800">
                ${MOCK_CAMPAIGN_COST} x {clients.length} recipients
              </span>
            </div>
            <div className="text-black flex justify-between text-sm font-bold border-t border-gray-200 pt-2">
              <span>Total campaign cost</span>
              <span>${cost}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
        <button
          onClick={onBack}
          disabled={sending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-40"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={onSend}
          disabled={sending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-custom-blue text-white text-sm font-semibold hover:bg-custom-blue/90 transition disabled:opacity-70"
        >
          {sending ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Sending...
            </>
          ) : (
            <>
              <Send size={14} /> Send campaign
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function SuccessScreen({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[650px] text-center">
      <div className="w-40 h-40 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <CheckCircle2 size={80} className="text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Campaign Sent!</h2>
      <p className="text-gray-500 mb-8">
        Your SMS campaign has been sent successfully to all recipients.
      </p>
      <button
        onClick={onReset}
        className="px-6 py-2.5 rounded-lg bg-custom-blue text-white text-sm font-semibold hover:bg-custom-blue/90 transition"
      >
        Start New Campaign
      </button>
    </div>
  );
}

export default function NewSmsCampaigns(props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [message, setMessage] = useState("");

  const [filters, setFilters] = useState({
    vipOnly: false,
    hasBirthday: false,
    birthdayMonth: "",
    dateRange: "Any date",
    noFutureBookings: false,
  });

  const estimatedCount = filters.vipOnly
    ? MOCK_CLIENTS.filter((c) => c.vip).length
    : MOCK_CLIENTS.length;

  const handleReviewClients = async () => {
    setLoadingClients(true);
    props?.loader?.(true);
    try {
      const res = await fakeApi.filterClients(filters);
      setClients(res.data);
      setStep(1);
    } catch {
      props?.toaster?.("Failed to load clients", "error");
    } finally {
      setLoadingClients(false);
      props?.loader?.(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    props?.loader?.(true);
    try {
      await fakeApi.sendCampaign({ message, clients });
      props?.toaster?.("Campaign sent successfully!", "success");
      setSuccess(true);
    } catch {
      props?.toaster?.("Failed to send campaign.", "error");
    } finally {
      setSending(false);
      props?.loader?.(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setSuccess(false);
    setMessage("");
    setFilters({
      vipOnly: false,
      hasBirthday: false,
      birthdayMonth: "",
      dateRange: "Any date",
      noFutureBookings: false,
    });
    setClients([]);
  };

  return (
    <>
      <DashboardHeader title="New SMS Campaigns" />

      <div className="min-h-screen bg-[#f0f1f5]">
        <div className="max-w-7xl mx-auto">
          <div className=" shadow-sm border border-gray-200 md:p-6 p-3">
            {success ? (
              <SuccessScreen onReset={handleReset} />
            ) : (
              <>
                <div className="mb-2">
                  <StepIndicator current={step} />
                </div>

                {step === 0 && (
                  <StepFilterClients
                    filters={filters}
                    setFilters={setFilters}
                    estimatedCount={estimatedCount}
                    onNext={handleReviewClients}
                    onCancel={() => router.back()}
                  />
                )}
                {step === 1 && (
                  <StepReviewClients
                    clients={clients}
                    onNext={() => setStep(2)}
                    onBack={() => setStep(0)}
                  />
                )}
                {step === 2 && (
                  <StepWriteMessage
                    message={message}
                    setMessage={setMessage}
                    recipientCount={clients.length}
                    onNext={() => setStep(3)}
                    onBack={() => setStep(1)}
                  />
                )}
                {step === 3 && (
                  <StepReviewCampaign
                    message={message}
                    clients={clients}
                    onSend={handleSend}
                    onBack={() => setStep(2)}
                    sending={sending}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
