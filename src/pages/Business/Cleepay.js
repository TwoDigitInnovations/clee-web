"use client";
import DashboardHeader from "@/components/DashboardHeader";
import { Api } from "@/services/service";
import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Calendar,
  FileText,
  MapPin,
  Zap,
  HelpCircle,
  Monitor,
  Smartphone,
  Globe,
  AlertTriangle,
  Wifi,
  BarChart2,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none shrink-0 ${
        checked ? "bg-custom-blue" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between border-2 border-custom-blue rounded-xl px-4 py-2.5 bg-white text-sm text-slate-700 focus:outline-none"
      >
        <span className={value ? "text-custom-blue" : "text-slate-400"}>
          {value || placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden mt-1">
          <div
            className="px-4 py-2.5 text-sm text-slate-400 bg-gray-50 cursor-pointer hover:bg-gray-100"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            {placeholder}
          </div>
          {options.map((o) => (
            <div
              key={o}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              className="px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 cursor-pointer border-t border-gray-100"
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function SCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export default function Cleepay(props) {
  const router = useRouter();

  const [cards, setCards] = useState([
    {
      id: 1,
      name: "front desk",
      type: "Touch screen",
      sn: "WSC513207011377",
      locationId: 1,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [locationExpanded, setLocationExpanded] = useState(true);
  const [unpairModal, setUnpairModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [newReaderType, setNewReaderType] = useState("");
  const [newReaderLocation, setNewReaderLocation] = useState("");
  const [tipsEnabled, setTipsEnabled] = useState(true);
  const [surchargeEnabled, setSurchargeEnabled] = useState(false);
  const [surchargeMethod, setSurchargeMethod] = useState("fixed");
  const [surchargePercent, setSurchargePercent] = useState("1.5");
  const [locations, setLocations] = useState([]);

  const dummyLocations = [
    {
      id: 1,
      name: "Chebo Clinic",
      address: "59 Montgomery Street Kogarah, Sydney",
    },
  ];

  const fetchLocations = async () => {
    try {
      props.loader(true);
      const res = await Api("get", `location/getAll`, "", router);
      props.loader(false);
      if (res?.status === true) {
        setLocations(res.data.data || [dummyLocations]);
      }
    } catch (err) {
      props.loader(false);
      props.toaster({ type: "error", message: "Failed to fetch locations" });
    }
  };

  const fetchCards = async () => {
    try {
      setLoading(true);
      const res = await Api("get", "Cards/getAll", "", null);
      setLoading(false);
      if (res?.status === true && res.data?.data?.length > 0)
        setCards(res.data.data);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
    fetchLocations();
  }, []);

  const handleUnpair = () => {
    if (!cardToDelete) return;
    props?.loader?.(true);
    Api("delete", `Cards/delete/${cardToDelete}`, "", router)
      .then((res) => {
        props?.loader?.(false);
        if (res?.status === true) {
          props?.toaster?.({
            type: "success",
            message: "Terminal unpaired successfully",
          });
          setCards((prev) => prev.filter((c) => c.id !== cardToDelete));
          setUnpairModal(false);
          setCardToDelete(null);
        }
      })
      .catch(() => props?.loader?.(false));
  };

  /* ── API: Add Card Reader ── */
  const handleAddReader = () => {
    if (!newReaderType || !newReaderLocation) return;
    props?.loader?.(true);
    Api(
      "post",
      "Cards/pair",
      { type: newReaderType, location: newReaderLocation },
      router,
    )
      .then((res) => {
        props?.loader?.(false);
        if (res?.status === true) {
          props?.toaster?.({
            type: "success",
            message: "Card reader added successfully",
          });
          setAddModal(false);
          setNewReaderType("");
          setNewReaderLocation("");
          fetchCards();
        }
      })
      .catch(() => props?.loader?.(false));
  };

  /* ── API: Save Settings ── */
  const handleSaveSettings = () => {
    props?.loader?.(true);
    Api(
      "post",
      "payments/save",
      { tipsEnabled, surchargeEnabled, surchargeMethod, surchargePercent },
      router,
    )
      .then((res) => {
        props?.loader?.(false);
        if (res?.status === true)
          props?.toaster?.({ type: "success", message: "Saved successfully" });
      })
      .catch(() => props?.loader?.(false));
  };

  const cardName =
    cards.find((c) => c.id === cardToDelete)?.name || "this terminal";

  return (
    <>
      <DashboardHeader title="Your Business" />

      <Modal open={unpairModal} onClose={() => setUnpairModal(false)}>
        <h2 className="text-lg font-bold text-custom-blue mb-3">
          Unpair this terminal?
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          You will no longer be able to take payments with{" "}
          <strong>{cardName}</strong>. You can re-pair the terminal to your
          preferred location by selecting 'Pair terminal'.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleUnpair}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            Unpair terminal
          </button>
          <button
            onClick={() => setUnpairModal(false)}
            className="text-sm text-slate-600 hover:text-custom-blue font-medium px-3 py-2.5"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Modal open={addModal} onClose={() => setAddModal(false)}>
        <h2 className="text-lg font-bold text-custom-blue mb-5">
          Add card reader
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Select card reader type
            </p>
            <CustomSelect
              value={newReaderType}
              onChange={setNewReaderType}
              placeholder="Card reader type"
              options={["Touchscreen terminal", "Mini terminal"]}
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Select location
            </p>
            <CustomSelect
              value={newReaderLocation}
              onChange={setNewReaderLocation}
              placeholder="Location name"
              options={locations.map((l) => l.location_name)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleAddReader}
            disabled={!newReaderType || !newReaderLocation}
            className="bg-custom-blue hover:opacity-90 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            Add card reader
          </button>
          <button
            onClick={() => setAddModal(false)}
            className="text-sm text-slate-600 hover:text-custom-blue font-medium px-3 py-2.5"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <div className="min-h-screen bg-custom-gray text-custom-blue px-4 md:px-6 py-4 md:py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-custom-blue">Clee Pay</h1>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-[#0F172A] text-white md:p-6 p-4 flex items-center justify-between">
          <div className="relative z-10 max-w-lg">
            <h2 className="text-lg font-bold mb-1">
              Order a Clee payment terminal
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Take payments in person with our fully integrated, sleek payment
              terminal. No setup fees, no monthly costs.
            </p>
            <button className="bg-white text-custom-blue text-sm font-bold px-5 py-2.5 rounded-[4px] hover:bg-gray-100 transition">
              Order now
            </button>
          </div>

          <div className="hidden md:flex items-center justify-center  rounded-xl shrink-0">
            <img
              src="/images/terminal.png"
              className="w-full h-full text-slate-400"
            />
          </div>
        </div>

        <SCard>
          <div className="flex md:flex-row flex-col gap-2 md:items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-custom-blue">
                Card reader management
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your paired physical terminals and hand-held readers.
              </p>
            </div>
            <button
              onClick={() => setAddModal(true)}
              className="flex w-fit items-center gap-1.5 bg-[#E1E3E4] text-black text-sm font-semibold px-4 py-2.5 rounded-[4px] hover:opacity-90 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Pair card reader
            </button>
          </div>

          {locations.map((loc) => {
            const locCards = cards.filter((c) => c.locationId === loc._id);
            return (
              <div
                key={loc.id}
                className="mx-4 my-4 bg-gray-50 rounded-xl border border-gray-100"
              >
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer"
                  onClick={() => setLocationExpanded(!locationExpanded)}
                >
                  <div>
                    <p className="font-bold text-custom-blue text-sm">
                      {loc.location_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {[
                        loc.address?.apartment,
                        loc.address?.street,
                        loc.address?.suburb,
                        loc.address?.city,
                        loc.address?.state,
                        loc.address?.postal_code,
                      ]
                        .filter(Boolean) // ❗ empty values hata dega
                        .join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gray-200 text-slate-600 text-xs font-bold flex items-center justify-center">
                      {locCards.length}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${locationExpanded ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                {locationExpanded && (
                  <div className="mx-3 mb-3 bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="font-semibold text-slate-700 text-sm">
                        Card readers
                      </p>
                    </div>
                    {locCards.length === 0 ? (
                      <div className="flex flex-col items-center py-10 text-center px-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Wifi className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="font-semibold text-slate-700 text-sm">
                          No card readers found
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Pair a card reader to start accepting in-person
                          payments with automatic reconciliation.
                        </p>
                      </div>
                    ) : (
                      locCards.map((card) => (
                        <div
                          key={card.id}
                          className="flex items-center justify-between px-4 py-3 border-t border-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <CreditCard className="w-4 h-4 text-slate-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-custom-blue text-sm">
                                {card.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {card.type} (SN: {card.sn})
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setCardToDelete(card.id);
                              setUnpairModal(true);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold transition"
                          >
                            Unpair
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </SCard>

        <SCard>
          <div className="px-5 pt-5 pb-3 border-b border-gray-100">
            <h2 className="font-bold text-custom-blue">Online payments</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure how your business appears on customer bank statements
              and payout timing.
            </p>
          </div>

          {[
            {
              icon: Calendar,
              label: "Payout schedule",
              value: "Daily (2 business day delay)",
            },
            {
              icon: FileText,
              label: "Bank statement descriptor",
              value: "AMETRINE• STUDIO PAYMENTS",
            },
            {
              icon: MapPin,
              label: "Billing address requirements",
              value: "Zip/Postal code verification enabled",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-custom-blue" />
                </div>
                <div>
                  <p className="font-semibold text-custom-blue text-sm">
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500">{item.value}</p>
                </div>
              </div>
              <button className="text-custom-blue text-sm font-semibold hover:underline">
                Edit
              </button>
            </div>
          ))}
        </SCard>

        {/* Quick Links Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SCard className="flex items-center gap-3 px-5 py-4">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-custom-blue" />
            </div>
            <div>
              <p className="font-semibold text-custom-blue text-sm">
                Instant Payouts
              </p>
              <p className="text-xs text-slate-500">
                Need your funds faster? Check eligibility for instant transfers.
              </p>
            </div>
          </SCard>
          <SCard className="flex items-center gap-3 px-5 py-4">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4 text-custom-blue" />
            </div>
            <div>
              <p className="font-semibold text-custom-blue text-sm">
                Help Center
              </p>
              <p className="text-xs text-slate-500">
                Read our guides on managing terminals and payments.
              </p>
            </div>
          </SCard>
        </div>

        {/* Stripe + Online Payments Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SCard className="px-5 py-4">
            <p className="font-bold text-custom-blue text-sm mb-1">
              Stripe Account
            </p>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Your account is connected and active. Manage your bank details,
              payouts, and identity verification directly in the Stripe
              dashboard.
            </p>
            <button className="flex items-center gap-1.5 text-custom-blue text-sm font-semibold hover:underline">
              <ExternalLink className="w-3.5 h-3.5" /> View Stripe account
              details
            </button>
          </SCard>
          <SCard className="px-5 py-4">
            <p className="font-bold text-custom-blue text-sm mb-1">
              Online Payments
            </p>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Configure how customers pay for bookings online, including
              deposits and card capture requirements.
            </p>
            <button
              className="flex items-center gap-1.5 text-custom-blue text-sm font-semibold hover:underline"
              onClick={() => router.push("/Business/Onlinepayments")}
            >
              Online payment settings <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </SCard>
        </div>

        {/* Tips */}
        <SCard className="px-5 py-5">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="font-bold text-custom-blue">Tips</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Allow customers to add a gratuity to their payment.
              </p>
            </div>
            <Toggle checked={tipsEnabled} onChange={setTipsEnabled} />
          </div>
          {tipsEnabled && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "OPTION 1", val: "10%" },
                { label: "OPTION 2", val: "15%" },
                { label: "OPTION 3", val: "20%" },
              ].map((opt) => (
                <div
                  key={opt.label}
                  className="bg-gray-50 border border-gray-100 rounded-xl py-3 text-center"
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {opt.label}
                  </p>
                  <p className="text-lg font-extrabold text-custom-blue mt-0.5">
                    {opt.val}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SCard>

        {/* Fees */}
        <SCard className="px-5 py-5">
          <p className="font-bold text-custom-blue mb-1">Fees</p>
          <p className="text-xs text-slate-500 mb-4">
            Transparent pricing for every transaction type.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* In-person */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-3.5 h-3.5 text-custom-blue" />
                </div>
                <div>
                  <p className="font-semibold text-custom-blue text-sm">
                    In-person payments
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Via Payment Reader
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Transaction fee</span>
                  <span className="font-bold text-custom-blue">
                    1.6% + $0.10
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Card present</span>
                  <span className="font-bold text-green-600">Included</span>
                </div>
              </div>
            </div>
            {/* Online */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-3.5 h-3.5 text-custom-blue" />
                </div>
                <div>
                  <p className="font-semibold text-custom-blue text-sm">
                    Online & Cardless
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Web & Stored Cards
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Transaction fee</span>
                  <span className="font-bold text-custom-blue">
                    2.7% + $0.30
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">International cards</span>
                  <span className="font-bold text-custom-blue">
                    +1.0% additional
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SCard>

        {/* Surcharge Fees */}
        <SCard className="px-5 py-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="font-bold text-custom-blue">Surcharge fees</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Pass transaction costs directly to the customer.
              </p>
            </div>
            <Toggle checked={surchargeEnabled} onChange={setSurchargeEnabled} />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Surcharge Method
              </p>
              <div className="grid grid-cols-2 rounded-xl overflow-hidden border border-gray-200">
                <button
                  onClick={() => setSurchargeMethod("fixed")}
                  className={`py-2.5 text-sm font-semibold transition ${
                    surchargeMethod === "fixed"
                      ? "bg-custom-blue text-white"
                      : "bg-white text-slate-500 hover:bg-gray-50"
                  }`}
                >
                  Fixed Percentage
                </button>
                <button
                  onClick={() => setSurchargeMethod("exact")}
                  className={`py-2.5 text-sm font-semibold transition border-l border-gray-200 ${
                    surchargeMethod === "exact"
                      ? "bg-custom-blue text-white"
                      : "bg-white text-slate-500 hover:bg-gray-50"
                  }`}
                >
                  Exact Cost (varies)
                </button>
              </div>
            </div>

            {surchargeMethod === "fixed" && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Percentage to Charge
                </p>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden w-32 focus-within:border-custom-blue transition">
                  <input
                    type="number"
                    value={surchargePercent}
                    onChange={(e) => setSurchargePercent(e.target.value)}
                    className="flex-1 px-3 py-2.5 text-sm text-custom-blue outline-none bg-white"
                  />
                  <span className="px-3 py-2.5 bg-gray-50 text-slate-500 text-sm border-l border-gray-200">
                    %
                  </span>
                </div>
              </div>
            )}
          </div>
        </SCard>

        {/* More Info */}
        <SCard>
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-custom-blue" />
              <p className="font-bold text-custom-blue text-sm">More info</p>
            </div>
          </div>
          {[
            {
              label: "CleePay transaction report",
              icon: BarChart2,
              external: false,
              link: "/Business/CleePay/Transactionreport",
            },
            {
              label: "CleePay balance summary",
              icon: FileText,
              external: false,
              link: "/Business/CleePay/Balancesummary",
            },
            {
              label: "CleePay help guide",
              icon: BookOpen,
              external: true,
              link: "https://docs.cleepay.com/getting-started/overview",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition group"
              onClick={() => {
                if (item.external) window.open(item.link, "_blank");
                else router.push(item.link);
              }}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-slate-400 group-hover:text-custom-blue transition" />
                <p className="text-sm text-slate-700">{item.label}</p>
              </div>
              {item.external ? (
                <ExternalLink className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </div>
          ))}
        </SCard>

        {/* Account Management */}
        <SCard className="px-5 py-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Account Management
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-3">
            Once deactivated, you will no longer be able to process online
            payments through CleePay. This action is reversible but requires
            re-authentication.
          </p>
          <button className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-semibold transition">
            <AlertTriangle className="w-4 h-4" /> Deactivate CleePay account
          </button>
        </SCard>

        {/* Save Button */}
        <div className="flex justify-end pb-4">
          <button
            onClick={handleSaveSettings}
            className="bg-custom-blue text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}
