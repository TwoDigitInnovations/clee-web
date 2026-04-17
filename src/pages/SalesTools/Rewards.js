"use client";
import DashboardHeader from "@/components/DashboardHeader";
import React, { useEffect, useState } from "react";
import { Api } from "@/services/service";
import {
  Star,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Info,
  Scissors,
  Package,
  Ban,
  Check,
} from "lucide-react";
import ProductPointsModal from "@/components/ProductPointsModal";
import ServicesPointsModal from "@/components/ServicesPointsModal";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "@/redux/actions/servicesActions";

// ── helpers ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-custom-blue" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${
          checked ? "left-6" : "left-0.5"
        }`}
      />
    </button>
  );
}

function Radio({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
      <div
        onClick={onChange}
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
          checked ? "border-custom-blue" : "border-gray-300"
        }`}
      >
        {checked && <div className="w-2 h-2 rounded-full bg-custom-blue" />}
      </div>
      {label}
    </label>
  );
}

const FORMULA_PRESETS = [
  {
    id: "conservative",
    label: "ConservPtive",
    subtitle: "Recommended for high-volume boutiques",
    targetSpend: "$2,300",
    badge: null,
    perks: ["Tier 1 Rewards", "Standard Benefits"],
    selectedPerk: "Tier 1 Rewards, Averate of 3 visit",
  },
  {
    id: "moderate",
    label: "ModerPte",
    subtitle: "Optimal balance of cost & loyalty",
    targetSpend: "$3,900",
    badge: "BALANCED",
    perks: ["Bronze Status", "Silver Benefits"],
    selectedPerk: "Silver Benefits",
  },
  {
    id: "generous",
    label: "Generous",
    subtitle: "Designed for luxury-tier retention",
    targetSpend: "$6,200",
    badge: null,
    perks: ["Premium Access", "Gold VIP Rewards"],
    selectedPerk: "Gold VIP Rewards",
  },
];

const PRODUCT_OPTIONS = [
  { id: "all", label: "All\nProducts", icon: <Package size={18} /> },
  { id: "selected", label: "Selected", icon: <Check size={18} /> },
  { id: "none", label: "No\nProducts", icon: <Ban size={18} /> },
];
const SERVICE_OPTIONS = [
  { id: "all", label: "All Services", icon: <Scissors size={18} /> },
  { id: "selected", label: "Selected", icon: <Check size={18} /> },
  { id: "none", label: "No Services", icon: <Ban size={18} /> },
];

function Rewards({ loader, toaster }) {
  const [CreateOwnFormula, setCreateOwnFormula] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [productEarning, setProductEarning] = useState("all");
  const [serviceEarning, setServiceEarning] = useState("all");
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [productItems, setProductsItems] = useState([]);
  const [servicesItems, setServicesItems] = useState([]);
  const [editData, setEditData] = useState({});
  const router = useRouter();
  const { services: services } = useSelector((state) => state.services);
  const dispatch = useDispatch();
  
  const handleSubmit = async (items) => {
    setProductsItems(items);
  };
  const handleSubmit1 = async (items) => {
    setServicesItems(items);
  };

  const [formData, setFormData] = useState({
    rewardsActive: false,
    selectedPreset: "moderate",
    spendValue: "100",
    rewardValue: "10",
    productEarning: "all",
    serviceEarning: "all",
    neverExpire: true,
    expiryYears: "1",
    applyExisting: false,
    showToCustomers: true,
  });

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) return;

    if (productEarning === "all") {
      const updated = allProducts?.map((item) => ({
        ...item,
        included: true,
      }));
      setProductsItems(updated);
    }
  }, [allProducts, productEarning]);

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) return;

    if (serviceEarning === "all") {
      const updated = services?.map((item) => ({
        ...item,
        included: true,
      }));

      setServicesItems(updated);
    }
  }, [services, serviceEarning]);

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      setFormData({
        rewardsActive: editData.rewardsActive,
        selectedPreset: editData.selectedPreset,
        customSpend: editData.spendValue,
        customReward: editData.rewardValue,
        neverExpire: editData.neverExpire,
        expiryYears: editData.expiryYears,
        applyExisting: editData.applyExisting,
        showToCustomers: editData.showToCustomers,
      });
    }
  },[editData]);

  const handleSave = async () => {
    try {
      loader?.(true);
      const payload = {
        rewardsActive: formData.rewardsActive,
        selectedPreset: formData.selectedPreset,
        customSpend: formData.spendValue,
        customReward: formData.rewardValue,
        products: productItems,
        services: servicesItems,
        neverExpire: formData.neverExpire,
        expiryYears: formData.expiryYears,
        applyExisting: formData.applyExisting,
        showToCustomers: formData.showToCustomers,
      };

      const res = await Api("post", "rewards/Save", payload, router);
      loader?.(false);
      if (res?.status === true) {
        toaster?.({
          type: "success",
          message: "Rewards settings saved successfully",
        });
      } else {
        toaster?.("error", res?.message || "Something went wrong");
      }
    } catch {
      loader?.(false);
      toaster?.("error", "Server error");
    }
  };

  useEffect(() => {
    dispatch(fetchServices(router));
  }, [dispatch]);

  const fetchRewards = async () => {
    try {
      loader(true);
      const res = await Api("get", "rewards/getAll", "", null);
      loader(false);
      if (res?.status === true) {
        setEditData(res.data.data[0] || []);
      }
    } catch {
      loader(false);
    }
  };

  const fetchProducts = async () => {
    try {
      loader(true);
      const res = await Api("GET", `products`, {}, router);
      loader(false);
      if (res?.status === true) {
        setAllProducts(res.data.data || []);
      }
    } catch {
      loader(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchRewards();
  }, []);

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-24">
      <DashboardHeader title="Sales Tools" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <h1 className="text-2xl font-bold text-custom-blue mb-1">Rewards</h1>
        <p className="text-sm text-gray-500 mb-6">
          Design and manage your luxury loyalty program tiers.
        </p>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2 ">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-custom-blue/10 flex items-center justify-center">
              <Star size={18} className="text-custom-blue" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                Reward your customers
              </p>
              <p className="text-xs text-gray-400">
                Enable automated rewards for every service booked.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold tracking-widest uppercase ${
                formData.rewardsActive ? "text-custom-blue" : "text-gray-400"
              }`}
            >
              {formData.rewardsActive ? "ACTIVE" : "INACTIVE"}
            </span>
            <Toggle
              checked={formData.rewardsActive}
              onChange={() =>
                setFormData((prev) => ({
                  ...prev,
                  rewardsActive: !prev.rewardsActive,
                }))
              }
            />
          </div>
        </div>

        {formData.rewardsActive && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Average Customer Spend
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  $3,120<span className="text-base font-medium">.00</span>
                </p>
                <p className="text-xs text-green-500 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp size={12} /> 12% increase vs last month
                </p>
              </div>
              {/* Active formula */}
              <div className="bg-custom-blue/5 border border-custom-blue/20 rounded-xl p-5 flex flex-col justify-between">
                <p className="text-[11px] font-bold text-custom-blue/60 uppercase tracking-wider mb-2">
                  Active Formula Ratio
                </p>
                <p className="text-2xl font-bold text-custom-blue">
                  $1 spend = 1 point
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <button className="bg-custom-blue text-white text-xs font-bold px-4 py-1.5 rounded-md hover:bg-custom-blue/90 transition-all">
                    Update Formula
                  </button>
                  <span className="text-[11px] text-gray-400">
                    Last modified: Oct 14, 2023
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-base font-bold text-custom-blue">
                  Formula setup
                </h2>
                <div className="flex-1 h-px bg-gray-200" />
                <button
                  onClick={() => setCreateOwnFormula(true)}
                  className="bg-custom-blue px-3 py-2 rounded-lg text-white text-sm"
                >
                  {" "}
                  Create your Own Formula{" "}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {FORMULA_PRESETS?.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        selectedPreset: preset.id
,
                      }))
                    }
                    className={`relative bg-white rounded-xl border-2 cursor-pointer p-4 transition-all ${
                      formData.selectedPreset === preset.id
                        ? "border-custom-blue shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {preset.badge && (
                      <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                        {preset.badge}
                      </span>
                    )}
                    <p className="font-bold text-gray-800 text-sm mb-0.5">
                      {preset.label}
                    </p>
                    <p className="text-[11px] text-gray-400 mb-3">
                      {preset.subtitle}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Target Spend
                    </p>
                    <p className="text-xl font-bold text-gray-800 mb-3">
                      {preset.targetSpend}
                    </p>
                    {preset.perks?.map((perk) => (
                      <div
                        key={perk}
                        className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-2 border font-medium ${
                          perk === preset.selectedPerk
                            ? "bg-custom-blue/10 border-custom-blue text-custom-blue"
                            : "bg-gray-50 border-gray-200 text-gray-500"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            perk === preset.selectedPerk
                              ? "bg-custom-blue"
                              : "bg-gray-300"
                          }`}
                        />
                        {perk}
                        {perk === preset.selectedPerk && (
                          <span className="ml-auto text-[9px] font-black text-custom-blue">
                            SELECTED
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {CreateOwnFormula && (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-base font-bold text-custom-blue">
                    Custom formula
                  </h2>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-5">
                    Create Your Own Formula
                  </p>
                  <div className="flex items-center justify-center gap-3 flex-wrap text-sm text-gray-700 font-medium">
                    <span>Spend $</span>
                    <input
                      type="number"
                      value={formData.spendValue}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          spendValue: e.target.value,
                        }))
                      }
                      className="w-20 text-center bg-gray-100 border-none rounded-lg p-2 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-custom-blue/30"
                    />
                    <span>and receive a $</span>
                    <input
                      type="number"
                      value={formData.rewardValue}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          spendValue: !prev.rewardValue,
                        }))
                      }
                      className="w-20 text-center bg-gray-100 border-none rounded-lg p-2 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-custom-blue/30"
                    />
                    <span>reward.</span>
                  </div>
                  <button className="mt-5 bg-custom-blue text-white text-sm font-bold px-8 py-2 rounded-lg hover:bg-custom-blue/90 transition-all">
                    Select
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
              <button
                onClick={() => setShowAdvanced((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-gray-800 text-sm">
                  Advanced settings
                </span>
                <div className="flex items-center gap-2 text-xs text-custom-blue font-semibold">
                  {showAdvanced ? (
                    <>
                      Hide <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      Show <ChevronDown size={14} />
                    </>
                  )}
                </div>
              </button>

              {showAdvanced && (
                <div className="border-t border-gray-100 px-5 py-6 space-y-8">
                  {/* Collecting Points */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="md:col-span-3">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full border-2 border-custom-blue/30 flex items-center justify-center">
                          <Star size={14} className="text-custom-blue" />
                        </div>
                        <span className="font-bold text-gray-800 text-sm">
                          Collecting Points
                        </span>
                      </div>

                      {/* Products */}
                      <p className="text-[12px] font-semibold text-gray-400 mb-2">
                        Products Earning Points
                      </p>
                      <div className="flex gap-3 mb-5">
                        {PRODUCT_OPTIONS?.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              if (opt.id === "selected") {
                                setOpen(true);
                              }

                              setProductEarning(opt.id);
                            }}
                            className={`flex flex-col  items-center justify-center gap-1.5 w-44 h-28 rounded-xl border-2 text-[12px] font-bold transition-all whitespace-pre-line text-center ${
                              productEarning === opt.id
                                ? "border-custom-blue bg-custom-blue/5 text-custom-blue"
                                : "border-gray-200 text-gray-500 hover:border-gray-300"
                            }`}
                          >
                            {productEarning === opt.id ? (
                              <Check size={16} className="text-custom-blue" />
                            ) : (
                              opt.icon
                            )}
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      {/* Services */}
                      <p className="text-[12px] font-semibold text-gray-400  mb-2">
                        Services Earning Points
                      </p>
                      <div className="flex gap-3">
                        {SERVICE_OPTIONS?.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setServiceEarning(opt.id);
                              if (opt.id === "selected") {
                                setOpen1(true);
                              }
                            }}
                            className={`flex flex-col items-center justify-center gap-1.5 w-44 h-28 rounded-xl border-2 text-[12px] font-bold transition-all text-center ${
                              serviceEarning === opt.id
                                ? "border-custom-blue bg-custom-blue/5 text-custom-blue"
                                : "border-gray-200 text-gray-500 hover:border-gray-300"
                            }`}
                          >
                            {serviceEarning === opt.id ? (
                              <Check size={16} className="text-custom-blue" />
                            ) : (
                              opt.icon
                            )}
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Info cards */}
                    <div className="md:col-span-2 space-y-3">
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Info size={13} className="text-custom-blue" />
                          <p className="text-xs font-bold text-custom-blue">
                            Vouchers & Store Credit
                          </p>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed  w-[80%]">
                          Gift vouchers and store credit are set to
                          automatically collect points for customers when they
                          are applied to a sale transaction.
                        </p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-xl  p-6 space-y-1">
                        <p className="text-sm font-bold text-gray-700 mb-1">
                          Pro Tip
                        </p>
                        <p className="text-[12px] text-gray-500 leading-relaxed w-[80%]">
                          Restricting points to specific premium services can
                          drive higher-value appointment bookings during
                          off-peak hours.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Points Expiry */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full border-2 border-custom-blue/30 flex items-center justify-center text-custom-blue text-xs font-bold">
                        ↻
                      </div>
                      <span className="font-bold text-gray-800 text-sm">
                        Points Expiry
                      </span>
                    </div>

                    <div className="flex gap-6 mb-6">
                      <Radio
                        checked={formData?.neverExpire}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            neverExpire: !prev.neverExpire,
                          }))
                        }
                        label="Never expire"
                      />
                      <Radio
                        checked={!formData.neverExpire}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            neverExpire: !prev.neverExpire,
                          }))
                        }
                        label="Expire after a specific time"
                      />
                    </div>

                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="grid grid-cols-3 bg-gray-50 px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-200">
                        <div>Setting Configuration</div>
                        <div>Preference</div>
                        <div>Visibility</div>
                      </div>

                      <div className="grid grid-cols-3 items-center px-4 py-4 border-b border-gray-100">
                        <div>
                          <p className="text-xs font-bold text-gray-700">
                            Expiry Timeframe
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Duration before unspent points are removed
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={formData.expiryYears}
                            min="1"
                            onChange={() =>
                              setFormData((prev) => ({
                                ...prev,
                                expiryYears: !prev.expiryYears,
                              }))
                            }
                            disabled={formData.neverExpire}
                            className="w-12 text-center bg-gray-100 border border-gray-200 rounded p-1.5 text-sm font-bold text-gray-800 outline-none disabled:opacity-40"
                          />
                          <select
                            disabled={formData.neverExpire}
                            className="bg-gray-100 border-none rounded p-1.5 text-xs font-bold text-gray-700 outline-none disabled:opacity-40"
                          >
                            <option>Years</option>
                            <option>Months</option>
                          </select>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 font-medium">
                            Automatic
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 items-center px-4 py-4 border-b border-gray-100">
                        <div>
                          <p className="text-xs font-bold text-gray-700">
                            Apply to existing points
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Retroactively apply expiry rules to all client
                            balances
                          </p>
                        </div>
                        <div>
                          <Toggle
                            checked={formData.applyExisting}
                            onChange={() =>
                              setFormData((prev) => ({
                                ...prev,
                                applyExisting: !prev.applyExisting,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded uppercase tracking-wider">
                            Destructive
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 items-center px-4 py-4">
                        <div>
                          <p className="text-xs font-bold text-gray-700">
                            Show rewards to customers
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Visible in the customer portal and booking app
                          </p>
                        </div>
                        <div>
                          <Toggle
                            checked={formData.showToCustomers}
                            onChange={() =>
                              setFormData((prev) => ({
                                ...prev,
                                showToCustomers: !prev.showToCustomers,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase tracking-wider">
                            Public
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-2.5 rounded-lg bg-custom-blue text-white text-sm font-bold hover:bg-custom-blue/90 transition-all shadow-md"
              >
                Save Change
              </button>
            </div>
          </>
        )}
      </div>
      <ProductPointsModal
        open={open}
        onClose={() => setOpen(false)}
        data={allProducts}
        onSave={handleSubmit}
        items={productItems}
        setItems={setProductsItems}
      />

      <ServicesPointsModal
        open={open1}
        onClose={() => setOpen1(false)}
        data={services}
        onSave={handleSubmit1}
        items={servicesItems}
        setItems={setServicesItems}
      />
    </div>
  );
}

export default Rewards;
