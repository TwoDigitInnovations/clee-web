import React, { useState } from "react";
import {
  BarChart2,
  ExternalLink,
  Settings2,
  Ban,
  LineChart,
  Layers,
  Info,
  Rocket,
  CheckCircle2,
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";

const AnalyticsTools = () => {
  const [selectedService, setSelectedService] = useState("none");
  const [confirmationUrl, setConfirmationUrl] = useState("");

  const trackingServices = [
    {
      id: "none",
      title: "None",
      desc: "Default state. No tracking scripts will be loaded.",
      icon: <Ban size={20} />,
    },
    {
      id: "ga",
      title: "Google Analytics",
      desc: "Advanced traffic analysis and user behavior metrics.",
      icon: <LineChart size={20} />,
    },
    {
      id: "gtm",
      title: "Google Tag Manager",
      desc: "Centralized management for multiple tracking pixels.",
      icon: <Layers size={20} />,
    },
  ];

  const handleSave = async () => {
    const data = { selectedService, confirmationUrl };
    // dispatch logic here...
  };
  return (
    <>
      <DashboardHeader title="Promote" />

      <div className="min-h-screen bg-[#f3f4f8] pb-10 font-sans">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto pt-8 px-4 flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1a3a6b]">
              Analytics tools
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Power up your salon insights with premium tracking integrations.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-white text-gray-700 font-medium rounded-lg text-sm border hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button className="px-6 py-2 bg-[#0e4f94] text-white font-medium rounded-lg text-sm hover:bg-[#0a3d75] transition-colors shadow-sm">
              Save
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 space-y-6">
          {/* Section 1: Tracking Services */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex gap-4 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-custom-blue">
                <BarChart2 size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Tracking Services
                </h2>
                <p className="text-sm text-gray-500">
                  Measure visits to your online bookings using either Google
                  Analytics or Google Tag Manager.{" "}
                  <a
                    href="#"
                    className="text-custom-blue font-medium inline-flex items-center gap-1 hover:underline"
                  >
                    Learn more <ExternalLink size={14} />
                  </a>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trackingServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedService === service.id
                      ? "border-custom-blue bg-white"
                      : "border-gray-50 bg-[#f8f9fb] hover:border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`${selectedService === service.id ? "text-custom-blue" : "text-gray-500"}`}
                    >
                      {service.icon}
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedService === service.id
                          ? "border-custom-blue bg-custom-blue"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {selectedService === service.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Custom Confirmation Page */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex gap-4 mb-8">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-custom-blue">
                <Settings2 size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Custom Confirmation Page
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                  Enter the URL of a page on your own website that you would
                  like your clients to be sent to after making an online
                  booking.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Custom Confirmation Page URL
                </label>
                <input
                  type="text"
                  placeholder="https://"
                  className="w-full bg-gray-100 border-none rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  value={confirmationUrl}
                  onChange={(e) => setConfirmationUrl(e.target.value)}
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-custom-blue focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-600 font-medium group-hover:text-gray-800 transition-colors">
                  Skip the Clee booking confirmation page and redirect
                  immediately.
                </span>
              </label>

              {/* Why use custom confirmation? Info Box */}
              <div className="bg-[#f0f7ff] border border-blue-100 rounded-2xl p-6 flex gap-4">
                <div className="bg-[#0e4f94] rounded-full p-1 h-fit mt-0.5">
                  <Info size={14} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">
                    Why use a custom confirmation page?
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    By using your own landing page, you can perfectly measure
                    the ROI of your Facebook Ads, Instagram promotions, and
                    search engine marketing. It keeps your brand experience
                    consistent from booking to completion.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blue Connect & Grow Card */}
            <div className="bg-gradient-to-br from-[#0e4f94] to-[#1a3a6b] rounded-2xl p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-3">Connect and Grow</h2>
                <p className="text-blue-100 text-sm mb-8 leading-relaxed max-w-[280px]">
                  Salon owners who use advanced analytics tools see a{" "}
                  <span className="text-white font-bold text-lg underline decoration-blue-400">
                    24% increase
                  </span>{" "}
                  in repeat bookings through targeted marketing.
                </p>
                <button className="bg-white text-[#0e4f94] px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-lg transition-all">
                  View Analytics Guide
                </button>
              </div>
              {/* Background Decorative Element */}
              <div className="absolute right-[-20px] bottom-[-20px] text-white/10 rotate-12 transition-transform group-hover:scale-110">
                <BarChart2 size={180} />
              </div>
            </div>

            {/* Grey Ready for More Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#0e4f94]">
                <Rocket size={28} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">
                Ready for more?
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[280px] mb-6">
                Our premium concierge service can help you set up complex
                conversion tracking for your atelier.
              </p>
            </div>
          </div>

          {/* Bottom Save/Cancel */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button className="px-6 py-2 bg-white text-gray-700 font-medium rounded-lg text-sm border hover:bg-gray-50">
              Cancel
            </button>
            <button className="px-6 py-2 bg-[#0e4f94] text-white font-medium rounded-lg text-sm hover:bg-[#0a3d75]">
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsTools;
