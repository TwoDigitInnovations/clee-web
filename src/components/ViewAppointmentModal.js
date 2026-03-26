"use client";

import { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  RotateCcw,
  FileText,
} from "lucide-react";

export default function ViewAppointmentModal({ onClose, data }) {
  const [activeTab, setActiveTab] = useState("Details");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      
      {/* Modal */}
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            View appointment
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 px-6 pt-4 border-b">
          {["Details", "History"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 pb-2 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? "border-custom-blue text-custom-blue"
                  : "border-transparent text-gray-500"
              }`}
            >
              {tab === "Details" ? (
                <Calendar size={16} />
              ) : (
                <FileText size={16} />
              )}
              {tab} {tab === "History" && "(9)"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          
          {/* ================= DETAILS ================= */}
          {activeTab === "Details" && (
            <div>
              
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800">
                    Appointment details:
                  </h3>
                  <p className="text-sm text-gray-500">
                    {data?.clinic || "Chebo Clinic"}
                  </p>
                </div>

                <span className="bg-green-700 text-white text-xs px-3 py-1 rounded-full">
                  Confirmed
                </span>
              </div>

              {/* Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-6 text-sm font-medium text-gray-600 bg-gray-50 px-4 py-3">
                  <span className="col-span-2">Service</span>
                  <span>Staff member</span>
                  <span>Resource</span>
                  <span>Date/time</span>
                  <span>Duration Price</span>
                </div>

                <div className="grid grid-cols-6 px-4 py-4 text-sm text-gray-700 border-t">
                  <span className="col-span-2">
                    {data?.service || "Service name here"}
                  </span>
                  <span>{data?.staff || "Staff 1"}</span>
                  <span className="italic text-gray-500">No resource</span>
                  <span>
                    13 Apr 2026 <br /> 10:00AM
                  </span>
                  <span>
                    1 hour <br /> $99.00
                  </span>
                </div>

                <div className="text-black flex justify-between px-4 py-3 border-t text-sm font-semibold">
                  <span>Totals</span>
                  <span>1 hour $99.00</span>
                </div>
              </div>

              {/* Customer */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Customer details:
                </h3>

                <p className="text-custom-blue font-medium">
                  EASTOP, KAREN Eastop
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  SMS number: 408295781
                </p>

                <p className="text-sm text-gray-600">
                  Email address: karen.l.eastop@gmail.com
                </p>
              </div>
            </div>
          )}

          {/* ================= HISTORY ================= */}
          {activeTab === "History" && (
            <div className="space-y-4">
              
              {data?.history?.map((item, i) => (
                <div key={i} className="border-b pb-3">
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        item.type === "alert"
                          ? "bg-custom-blue text-white"
                          : "bg-yellow-400 text-black"
                      }`}
                    >
                      {item.type === "alert" ? "Alert" : "Amended"}
                    </span>

                    <span className="text-gray-700 font-medium">
                      {item.date}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {item.message}
                  </p>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <button className="flex items-center gap-2 bg-custom-blue text-white px-5 py-2 rounded-md text-sm font-medium hover:opacity-90">
            <RotateCcw size={16} />
            Book again
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
