import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { ClipboardList, Info, Copy, ChevronDown } from 'lucide-react';

function Waitlist() {
  const [isWaitlistEnabled, setIsWaitlistEnabled] = useState(true);
  const waitlistLink = "https://bookings.getclee.com/cheboclinic/waitlist/join";

  return (
    <>
      <DashboardHeader title="Your Business" />

      <div className="min-h-screen bg-[#f0f2f5] text-slate-800 px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header Section - Sticky on mobile can be helpful */}
          <div className="flex flex-row justify-between items-center mb-4">
            <h1 className="text-lg md:text-xl font-semibold text-[#1a365d]">Waitlist</h1>
            <button className="bg-[#1a4a8d] hover:bg-[#153e77] text-white px-6 md:px-8 py-2 rounded-md font-medium transition-colors text-sm md:text-base">
              Save
            </button>
          </div>

          {/* Banner Card - Responsive Flex */}
          <div className="bg-[#e8edf5] border border-blue-100 rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm shrink-0">
              <ClipboardList className="w-10 h-10 md:w-12 md:h-12 text-[#1a4a8d]" strokeWidth={1.5} />
            </div>
            <div className="space-y-3">
              <h2 className="text-base md:text-md font-bold text-[#1a365d]">
                Activate an online waitlist and grasp more opportunities
              </h2>
              <p className="text-slate-600 max-w-2xl text-xs md:text-sm leading-relaxed">
                Automatically collect a list of waiting clients ready to fill any cancellations and say goodbye to gaps in your calendar for good.
              </p>
              <button className="mt-2 bg-white border border-slate-200 text-slate-700 px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm w-full md:w-auto">
                Learn more
              </button>
            </div>
          </div>

          {/* Online Waitlist Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base md:text-lg text-slate-700">Online waitlist</h3>
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-slate-100">
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  checked={isWaitlistEnabled}
                  onChange={() => setIsWaitlistEnabled(!isWaitlistEnabled)}
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-[#1a4a8d] focus:ring-[#1a4a8d]"
                />
                <div className="space-y-1">
                  <label className="font-bold text-sm md:text-base text-slate-800">
                    Clients can add themselves to the waitlist via online booking
                  </label>
                  <p className="text-xs md:text-sm text-slate-500">
                    "Join our waitlist" button will be shown on the online booking page.
                  </p>
                </div>
              </div>

              {/* Share Link Box - Adjusted margins for mobile */}
              <div className="mt-6 md:ml-8 bg-[#f4f6f8] border-l-4 border-[#1a4a8d] rounded-r-lg p-4 md:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 md:w-5 md:h-5 text-[#1a4a8d]" />
                  <span className="font-semibold text-xs md:text-sm text-slate-700">Share your online waitlist link</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 bg-slate-200/60 border border-slate-200 rounded px-3 py-2 text-xs md:text-sm text-slate-600 truncate">
                    {waitlistLink}
                  </div>
                  <button className="flex items-center justify-center gap-2 border border-slate-300 bg-white px-4 py-2 rounded text-sm font-bold text-[#1a4a8d] hover:bg-slate-50 transition-colors active:scale-95">
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
                <p className="mt-3 text-[10px] md:text-xs text-slate-500 italic">
                  You can also customise booking links to share on your website and emails.
                </p>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base md:text-lg text-slate-700">Settings</h3>
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-slate-300 text-[#1a4a8d] focus:ring-[#1a4a8d]"
                />
                <span className="font-bold text-sm md:text-base text-slate-800">Auto archive entries after</span>
              </div>
              
              <div className="relative w-full sm:w-auto">
                <select className="appearance-none w-full bg-[#e2e8f0] border-none rounded px-4 py-2 pr-10 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer">
                  <option>8 weeks</option>
                  <option>4 weeks</option>
                  <option>12 weeks</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Waitlist;