"use client";
import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "@/redux/actions/userActions";
import { fetchServices } from "@/redux/actions/servicesActions";
// import { saveTemplate }  from "@/redux/actions/templateActions";

import ServiceSelectionSection from "@/components/ServiceSelectionSection";
import MarketingWorkflowSection from "@/components/MarketingWorkflowSection";
import PlanSummaryPanel from "@/components/PlanSummaryPanel";

const DRAFT_MARKETING_STEPS = [
  {
    id: 1,
    icon: "mail",
    title: "Welcome Email",
    trigger: "Trigger: immediately upon plan activation",
    badge: "Instant",
  },
  {
    id: 2,
    icon: "sms",
    title: "Booking Reminder SMS",
    trigger: "Trigger: 3 days after activation if no sessions booked",
    badge: "+3 Days",
  },
  {
    id: 3,
    icon: "phone",
    title: "Care Coordinator Check-In",
    trigger: "Trigger: 7 days post-activation",
    badge: "+7 Days",
  },
];

export default function AddPersonalisedplans() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { users } = useSelector((s) => s.user ?? { users: [] });
  const { services } = useSelector((s) => s.services ?? { services: [] });
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [open, setOpen] = useState(false);
console.log(users);

  const [planName, setPlanName] = useState("");
  const [targetClient, setTargetClient] = useState("");
  const [selectedSvcs, setSelectedSvcs] = useState([
    {
      id: 1,
      icon: "lab",
      name: "Comprehensive Metabolic Panel",
      freq: "Every 2–3 weeks",
      interval: "14 days",
      basePrice: 450,
      commissionPct: 15,
    },
    {
      id: 2,
      icon: "cryo",
      name: "Cryotherapy Session (Full Body)",
      freq: "Twice weekly",
      interval: "3–4 days",
      basePrice: 120,
      commissionPct: 10,
    },
    {
      id: 3,
      icon: "iv",
      name: "Myers' Cocktail IV Infusion",
      freq: "Every 2–3 weeks",
      interval: "21 days",
      basePrice: 225,
      commissionPct: 20,
    },
  ]);
  const [loading, setLoading] = useState(false);

  let role = "user";

  useEffect(() => {
    dispatch(fetchUsers(router,role));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchServices(router));
  }, [dispatch]);

  const totalPlan = selectedSvcs.reduce((s, i) => s + i.basePrice, 0);
  const totalCommission = selectedSvcs.reduce(
    (s, i) => s + (i.basePrice * i.commissionPct) / 100,
    0,
  );
  const taxRate = 0.08;
  const taxBreakdown = totalPlan * taxRate;
  const totalNet = totalPlan - totalCommission - taxBreakdown;

  const handleSubmit = async () => {
    setLoading(true);
    const data = {
      plan_name: planName,
      target_client: targetClient,
      services: selectedSvcs,
      marketing: DRAFT_MARKETING_STEPS,
    };
    try {
      // const res = await dispatch(saveTemplate(null, data, router));
      // if (res?.success) { toaster({ type:"success", message: res.message }); router.push("/sales/personalised-plans"); }
      // else { toaster({ type:"error", message: res.message || "Something went wrong" }); }
      console.log("submit", data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const filteredUsers = users.filter((u) =>
    u.fullname.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-custom-gray min-h-screen">
      <DashboardHeader title="Sales Tools" />

      <div className="md:px-6 px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between mb-6">
          <div>
            <p className="text-xs text-slate-400 mb-1">
              <span className="hover:underline cursor-pointer  ">
                Personalised plan
              </span>
              <span className="mx-1">›</span>
              <span className="text-slate-600">Add new plans</span>
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-custom-blue">
              Personalised plans
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.back()}
              className="px-5 py-2 border border-slate-300 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 bg-custom-blue text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Save
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-slate-800">
                  New Custom Procedure Plan
                </h2>
                <span className="text-[10px] font-bold bg-blue-50 text-custom-blue border border-blue-200 px-2.5 py-1 rounded-full tracking-wider uppercase">
                  Draft Mode
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Plan Name
                  </label>
                  <input
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder="e.g. Executive Wellness Series Q4"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-custom-blue/30 focus:border-custom-blue transition-all"
                  />
                </div>
                <div className="relative">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Target Client
                  </label>

                  <div
                    onClick={() => setOpen(!open)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 flex flex-wrap gap-2 cursor-pointer"
                  >
                    {selectedUsers.length === 0 && (
                      <span className="text-sm text-slate-400">
                        Search clients...
                      </span>
                    )}

                    {selectedUsers.map((user) => (
                      <span
                        key={user._id}
                        className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded flex items-center gap-1"
                      >
                        {user.fullname}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUsers((prev) =>
                              prev.filter((u) => u._id !== user._id),
                            );
                          }}
                          className="text-blue-500 hover:text-red-500"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Dropdown */}
                  {open && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {/* Search */}
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="w-full px-3 text-black py-2 border-b outline-none text-sm"
                      />

                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => {
                          const isSelected = selectedUsers.some(
                            (u) => u._id === user._id,
                          );

                          return (
                            <div
                              key={user.id}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedUsers((prev) =>
                                    prev.filter((u) => u._id !== user._id),
                                  );
                                } else {
                                  setSelectedUsers((prev) => [...prev, user]);
                                }
                              }}
                              className={`px-3 py-2 text-sm text-black cursor-pointer flex justify-between items-center hover:bg-slate-100 ${
                                isSelected ? "bg-blue-50 text-blue-700" : ""
                              }`}
                            >
                              {user.fullname}
                              {isSelected && "✔"}
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-3 text-sm text-slate-400">
                          No users found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <ServiceSelectionSection
              services={selectedSvcs}
              onUpdate={setSelectedSvcs}
              catalog={services}
            />

            <MarketingWorkflowSection steps={DRAFT_MARKETING_STEPS} />
          </div>

          <PlanSummaryPanel
            totalPlan={totalPlan}
            totalCommission={totalCommission}
            servicesCount={selectedSvcs.length}
            marketingSteps={DRAFT_MARKETING_STEPS.length}
            taxBreakdown={taxBreakdown}
            totalNet={totalNet}
            onActivate={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
