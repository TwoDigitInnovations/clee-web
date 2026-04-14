"use client";
import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import {
  Calendar,
  Zap,
  CreditCard,
  Link as LinkIcon,
  ChevronDown,
  Plus,
  Sun,
  Moon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
// In actions ko apne actual path se replace karein
// import { fetchWaitlistSettings, saveWaitlistSettings } from '@/redux/actions/waitlistActions';

function Waitlist() {
  const dispatch = useDispatch();
  // const { settings, loading } = useSelector((state) => state.waitlist);

  // States based on UI
  const [selectedDay, setSelectedDay] = useState(15);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);

  useEffect(() => {
    // dispatch(fetchWaitlistSettings());
  }, [dispatch]);

  const days = [
    { name: "MON", date: 14 },
    { name: "TUE", date: 15 },
    { name: "WED", date: 16 },
    { name: "THU", date: 17 },
    { name: "FRI", date: 18 },
    { name: "SAT", date: 19 },
    { name: "SUN", date: 20 },
  ];

  return (
    <>
      <DashboardHeader title="Waitlist Management" />

      <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Top Save Button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-custom-blue">Waitlist</h1>
            <button className="bg-custom-blue hover:bg-custom-blue/90 text-white px-4 md:px-8 py-2 rounded-md font-semibold transition-all">
              Save
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Timeslot Selection */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="bg-blue-50 p-2 rounded-lg text-[#1e40af]">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Timeslot Selection
                      </h2>
                      <p className="text-sm text-gray-500">
                        Define available windows for priority client access.
                      </p>
                    </div>
                  </div>
                  <button className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    Manage Templates
                  </button>
                </div>

                {/* Calendar Strip */}
                <div className="flex justify-between gap-2 mb-8 overflow-x-auto pb-2">
                  {days.map((day) => (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDay(day.date)}
                      className={`flex flex-col items-center min-w-[70px] p-3 rounded-xl transition-all ${
                        selectedDay === day.date
                          ? "bg-custom-blue text-white shadow-lg"
                          : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase mb-1">
                        {day.name}
                      </span>
                      <span className="text-lg font-bold">{day.date}</span>
                    </button>
                  ))}
                </div>

                {/* Slots Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      Morning Slots
                    </h3>
                    {[
                      { time: "09:00 AM — 11:30 AM", checked: true },
                      { time: "11:30 AM — 01:00 PM", checked: true },
                    ].map((slot, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-white shadow-sm hover:border-blue-200"
                      >
                        <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                          <Sun size={16} className="text-blue-400" />{" "}
                          {slot.time}
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={slot.checked}
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      Afternoon Slots
                    </h3>
                    <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-white shadow-sm hover:border-blue-200">
                      <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                        <Moon size={16} className="text-indigo-400" /> 02:00 PM
                        — 04:30 PM
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 flex items-center justify-center gap-2 text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all">
                      <Plus size={18} /> Add Custom Slot
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Notifications */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-6">
                <div className="flex gap-4 mb-6">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <Zap size={24} fill="currentColor" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Notifications
                    </h2>
                    <p className="text-sm text-gray-500">
                      Trigger alerts on open slots.
                    </p>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-6 mb-8">
                  {[
                    {
                      title: "SMS Priority Alerts",
                      desc: "Instant mobile notifications for top 5% of waitlist.",
                      state: smsAlerts,
                      setter: setSmsAlerts,
                    },
                    {
                      title: "Email Confirmations",
                      desc: "Automated enrollment confirmation links.",
                      state: emailAlerts,
                      setter: setEmailAlerts,
                    },
                    {
                      title: "Push Notifications",
                      desc: "Mobile app banners for general availability.",
                      state: pushAlerts,
                      setter: setPushAlerts,
                    },
                  ].map((notif, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-4"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">
                          {notif.title}
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {notif.desc}
                        </p>
                      </div>
                      <button
                        onClick={() => notif.setter(!notif.state)}
                        className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${notif.state ? "bg-blue-900" : "bg-gray-200"}`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notif.state ? "right-1" : "left-1"}`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Audience Preview */}
                <div className="pt-6 border-t border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">
                    Audience Preview
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"
                        />
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-50 text-blue-600 text-[10px] font-bold flex items-center justify-center">
                        +12
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 italic">
                    1,248 clients currently on the alert list.
                  </p>
                </div>
              </div>
            </div>

     
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-8">
                <div className="flex gap-4 mb-8">
                  <div className="bg-custom-blue p-2 rounded-lg text-white">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Payment & Confirmation
                    </h2>
                    <p className="text-sm text-gray-500">
                      Set how you want to collect enrollment fees.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Option 1: Card on File */}
                  <div className="border-2 border-custom-blue rounded-xl p-6 relative bg-blue-50/30">
                    <div className="absolute top-4 right-4 text-custom-blue">
                      <div className="w-5 h-5 rounded-full border-2 border-custom-blue flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-custom-blue rounded-full" />
                      </div>
                    </div>
                    <div className="flex gap-4 mb-6">
                      <div className="w-12 h-12 rounded-lg border border-gray-100 bg-white flex items-center justify-center shadow-sm">
                        <CreditCard className="text-gray-400" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          Charge card on file
                        </h4>
                        <p className="text-xs text-gray-500">
                          Automatically process payment upon slot selection.
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/60 border border-gray-100 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-400 uppercase">
                          Processing Fee
                        </span>
                        <span className="text-gray-800">2.9% + $0.30</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-400 uppercase">
                          Hold Duration
                        </span>
                        <span className="text-gray-800">24 Hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Payment Link */}
                  <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/50">
                    <div className="flex gap-4 mb-6">
                      <div className="w-12 h-12 rounded-lg border border-gray-100 bg-white flex items-center justify-center shadow-sm">
                        <LinkIcon className="text-gray-400" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          Send direct payment link
                        </h4>
                        <p className="text-xs text-gray-500">
                          Allow clients to pay via a secure checkout URL.
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/60 border border-gray-100 rounded-lg p-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest flex items-center gap-1.5">
                        <Zap size={10} className="text-blue-500" /> Payment
                        Methods
                      </p>
                      <div className="flex gap-2">
                        {["Stripe", "Apple Pay", "PayPal"].map((method) => (
                          <span
                            key={method}
                            className="bg-white border border-gray-100 px-3 py-1 rounded text-[10px] font-bold text-gray-500 shadow-sm"
                          >
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button className="px-10 py-2.5 rounded-lg border border-gray-300 font-bold text-gray-600 hover:bg-white transition-all">
              Cancel
            </button>
            <button className="px-10 py-2.5 rounded-lg bg-custom-blue text-white font-bold hover:bg-custom-blue/90 transition-all shadow-lg shadow-blue-100">
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Waitlist;
