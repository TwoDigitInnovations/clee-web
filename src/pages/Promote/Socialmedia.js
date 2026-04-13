"use client";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Zap,
  Instagram,
  Facebook,
  ChevronRight,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

function Socialmedia() {
  const dispatch = useDispatch();
  const router = useRouter();


  const integrations = [
    {
      name: "Instagram",
      description: "Connect your salon's business profile",
      icon: <Instagram className="text-pink-600" size={32} />,
      status: "INACTIVE",
    },
    {
      name: "Facebook",
      description: "Enable bookings on your business page",
      icon: <Facebook className="text-blue-600" size={32} />,
      status: "INACTIVE",
    },
  ];

  return (
    <>
      <DashboardHeader title="Promote" />

      <div className="min-h-screen bg-[#f3f4f8] md:p-8 p-4 font-sans">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a6b]">
              Social booking buttons
            </h1>
            <button className="bg-custom-blue hover:bg-[#0d3d73] text-white px-6 py-2.5 rounded-full flex items-center justify-center gap-2 text-sm font-semibold transition-all shadow-md w-fit">
              <Zap size={16} fill="currentColor" />
              Activate social booking buttons
            </button>
          </div>

          {/* Hero Promo Banner */}
          <div className="bg-white rounded-[24px] overflow-hidden relative border border-gray-100 shadow-sm min-h-[220px] flex items-center">
            <div className="p-4 md:p-8  z-10 max-w-2xl">
              <span className="bg-[#dbeafe] text-[#1e40af] text-[10px] font-bold px-2.5 py-1 rounded tracking-wider uppercase">
                New Feature
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] mt-4 leading-tight">
                LET CLIENTS BOOK STRAIGHT FROM YOUR SOCIAL PAGES WITH BOOK NOW
                BUTTONS.
              </h2>
              <p className="text-gray-500 mt-4 text-sm md:text-base font-medium">
                To set up and edit the Book Now buttons, follow the steps for
                each integration below.
                <a href="#" className="text-blue-600 hover:underline ml-1">
                  Learn more about booking buttons on Facebook and Instagram.
                </a>
              </p>
            </div>
         
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#e0e7ff]/40 to-transparent hidden md:block" />
          </div>

        
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">
              Available Integrations
            </h3>

            <div className="grid gap-3">
              {integrations.map((item, index) => (
                <div
                  key={index}
                  className="bg-white md:p-5 p-3 rounded-2xl flex flex-col md:flex-row gap-2 items-center justify-between border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div className="p-1">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {item.name}
                      </h4>
                      <p className="text-gray-400 text-sm font-medium">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1 rounded uppercase tracking-widest">
                      {item.status}
                    </span>
                    <button className="text-custom-blue font-bold text-sm hover:underline flex items-center gap-1">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          
          <div className="grid md:grid-cols-2 gap-6">
       
            <div className="bg-white rounded-[28px] p-4 md:p-8 border border-gray-100 flex items-center justify-between overflow-hidden shadow-sm relative group">
              <div className="space-y-3 z-10">
                <h3 className="text-xl font-extrabold text-gray-900">
                  Boost Visibility
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[200px]">
                  Profiles with Book Now buttons see 3x more appointments.
                </p>
              </div>

              {/* Image Circle Graphic */}
              <div className="relative w-40 h-40 flex-shrink-0">
                <div className="absolute inset-0 bg-gray-200 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400"
                    alt="Salon"
                    className="w-full h-full object-cover grayscale opacity-80"
                  />
                </div>
                <div className="absolute inset-0 bg-[#e0e7ff]/20 rounded-full border-[10px] border-white" />
              </div>
            </div>

            {/* Analytics Ready Card */}
            <div className="bg-[#f0f4ff] rounded-[28px] p-4 md:p-8 border border-blue-50 flex flex-col justify-between shadow-sm group">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-gray-900">
                    Analytics Ready
                  </h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">
                    Track exactly where your clients are coming from in
                    real-time.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-2xl shadow-sm text-gray-300">
                  <TrendingUp size={24} />
                </div>
              </div>

              {/* Bar Chart Visual */}
              <div className="mt-8 flex items-end gap-2 h-16">
                <div className="w-2.5 bg-blue-200 rounded-full h-1/2" />
                <div className="w-2.5 bg-blue-200 rounded-full h-3/4" />
                <div className="w-2.5 bg-blue-200 rounded-full h-1/3" />
                <div className="w-2.5 bg-blue-700 rounded-full h-full shadow-[0_0_10px_rgba(29,78,216,0.3)]" />
                <div className="w-2.5 bg-blue-200 rounded-full h-2/3" />
                <div className="w-2.5 bg-blue-200 rounded-full h-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Socialmedia;
