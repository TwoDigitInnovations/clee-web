import React, { useEffect, useState } from "react";
import { Check, X, ChevronDown, Info } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaff } from "@/redux/actions/staffActions";

const StaffRoster = () => {

  const days = [
    { date: "19", day: "THU" },
    { date: "20", day: "FRI" },
    { date: "21", day: "SAT" },
    { date: "22", day: "SUN" },
    { date: "23", day: "MON" },
    { date: "24", day: "TUE" },
    { date: "25", day: "WED" },
    { date: "26", day: "THU" },
    { date: "27", day: "FRI" },
  ];

  const { staff, loading } = useSelector((state) => state.staff);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStaff());
  }, []);

  return (
    <>
      <DashboardHeader title="Administration" />
      <div className="min-h-screen bg-[#f8f9fa] pb-20 font-sans">
        <div className="max-w-7xl mx-auto md:p-6 p-4">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#1a3a6b]">
                Staff Roster
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage weekly shifts and personnel availability
              </p>
            </div>
            <button className="bg-custom-blue text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-[#0a3d75] transition-all">
              Save roster
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-custom-blue uppercase tracking-wider">
                Staff Member
              </label>
              <div className="relative min-w-[180px]">
                <select className="w-full appearance-none bg-gray-50 border-none p-2.5 rounded-lg text-sm text-gray-700 outline-none pr-10">
                  <option>All Staff</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-custom-blue uppercase tracking-wider">
                Month
              </label>
              <div className="relative min-w-[140px]">
                <select className="w-full appearance-none bg-gray-50 border-none p-2.5 rounded-lg text-sm text-gray-700 outline-none pr-10">
                  <option>March</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-custom-blue uppercase tracking-wider">
                Year
              </label>
              <div className="relative min-w-[100px]">
                <select className="w-full appearance-none bg-gray-50 border-none p-2.5 rounded-lg text-sm text-gray-700 outline-none pr-10">
                  <option>2026</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            <button className="bg-custom-blue text-white px-8 py-2.5 rounded-lg text-sm font-bold">
              Go
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto mb-6">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="text-left p-4 text-[11px] font-bold text-blue-900 uppercase border-b border-gray-100 w-48">
                    Team Member
                  </th>
                  {days.map((d, i) => (
                    <th
                      key={i}
                      className="p-4 border-b border-gray-100 text-center"
                    >
                      <div className="text-lg font-bold text-blue-900 leading-none">
                        {d.date}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 mt-1">
                        {d.day}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staff.map((member, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-50 last:border-none"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${member?.color}`}
                        >
                          {member?._id}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {member?.name}
                        </span>
                      </div>
                    </td>
                    {member?.shifts?.map((shift, sIdx) => (
                      <td key={sIdx} className="p-2 text-center">
                        {shift === "off" ? (
                          <div className="flex justify-center">
                            <X className="text-gray-200 w-4 h-4" />
                          </div>
                        ) : (
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold cursor-pointer transition-all ${sIdx === 2 ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-gray-100 text-gray-600"}`}
                          >
                            {shift}
                            <Check className="w-3 h-3 text-gray-400" />
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[#f0f4f8] p-4 rounded-xl mb-8 flex flex-wrap gap-8">
            <div className="flex items-center gap-2 text-xs font-medium text-blue-900">
              <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                <Check size={12} className="text-gray-400" />
              </div>{" "}
              Working
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-blue-900">
              <div className="w-5 h-5 bg-white rounded flex items-center justify-center border border-gray-200">
                <X size={12} className="text-gray-300" />
              </div>{" "}
              Not working
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-blue-900">
              <div className="w-5 h-5 bg-gray-200 rounded border border-gray-300"></div>{" "}
              Normal working hours
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-blue-900">
              <div className="w-5 h-5 bg-blue-50 rounded border border-blue-200"></div>{" "}
              Modified date
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-blue-900">
              <div className="w-5 h-5 bg-[#1a3a6b] rounded"></div>
              <div>
                <p>Business closed</p>
                <button className="text-[10px] text-blue-600 font-bold hover:underline">
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Staffing Insight Box */}
          <div className="bg-[#eff6ff] rounded-xl border-l-4 border-blue-600 p-8 mb-8">
            <h3 className="text-blue-900 font-bold text-md mb-2">
              Staffing Insight:
            </h3>
            <p className="text-custom-blue/80 text-sm leading-relaxed max-w-4xl">
              Scheduling efficiency for March is currently at 84%. There is a
              potential coverage gap on Saturday, March 21st during peak hours
              (1pm - 4pm). Consider adjusting the afternoon shift for Elena
              Rossi or Marcus Chen to ensure seamless guest experience.
            </p>
          </div>

          <div className="flex justify-end">
            <button className="bg-custom-blue text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0a3d75]">
              Save roster
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffRoster;
