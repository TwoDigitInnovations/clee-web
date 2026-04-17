"use client";
import React, { useEffect, useState, useRef } from "react";
import { Check, X, ChevronDown, RefreshCw, Edit2 } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaff } from "@/redux/actions/staffActions";
import { useRouter } from "next/navigation";
import { fetchClosedDates } from "@/redux/actions/ClosedDatesActions";

const MONTHS = [
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
];

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i);

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function buildCalendarDays(month, year) {
  const total = getDaysInMonth(month, year);
  return Array.from({ length: total }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return { date: i + 1, day: DAYS_SHORT[d.getDay()] };
  });
}

const SHIFT_BG = "bg-custom-blue";

export default function StaffRoster() {
  const dispatch = useDispatch();
  const { staff: reduxStaff } = useSelector((state) => state.staff);
  const router = useRouter();
  const now = new Date();
  const [selMonth, setSelMonth] = useState(now.getMonth());
  const [selYear, setSelYear] = useState(now.getFullYear());
  const [selStaff, setSelStaff] = useState("all");
  const [rosterData, setRosterData] = useState([]);
  const [calDays, setCalDays] = useState([]);
  const scrollRef = useRef(null);
  const closedDates = useSelector(
    (state) => state.closedDates?.closedDates || [],
  );

  useEffect(() => {
    dispatch(fetchStaff());
    dispatch(fetchClosedDates());
  }, [dispatch]);

  useEffect(() => {
    if (reduxStaff?.length) {
      // Attach shifts array sized to current month if missing
      const days = buildCalendarDays(selMonth, selYear);
      const seeded = reduxStaff.map((m) => ({
        ...m,
        shifts: days.map((d, i) =>
          d.day === "Sun" ? "off" : (m.shifts?.[i] ?? "10am\n3pm"),
        ),
      }));
      setRosterData(seeded);
      setCalDays(days);
    }
  }, [reduxStaff, selMonth, selYear]);

  const handleGo = () => {
    const days = buildCalendarDays(selMonth, selYear);
    setCalDays(days);
    setRosterData((prev) =>
      prev.map((m) => ({
        ...m,
        shifts: days.map((d, i) =>
          d.day === "Sun" ? "off" : (m.shifts?.[i] ?? "10am\n3pm"),
        ),
      })),
    );
  };

  const handleShiftToggle = (mIdx, sIdx) => {
    setRosterData((prev) => {
      const updated = prev.map((m, mi) => {
        if (mi !== mIdx) return m;
        const newShifts = [...m.shifts];
        newShifts[sIdx] = newShifts[sIdx] === "off" ? "10am\n3pm" : "off";
        return { ...m, shifts: newShifts };
      });
      return updated;
    });
  };

  const displayed =
    selStaff === "all"
      ? rosterData
      : rosterData.filter((m) => m.fullname === selStaff);

  // Scroll arrows
  const scrollBy = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollLeft += dir * 200;
  };

  return (
    <>
      <DashboardHeader title="Administration" />
      <div className="min-h-screen bg-[#f8f9fa] pb-20 font-sans">
        <div className="max-w-[1400px] mx-auto md:p-6 p-4">
          {/* Page title */}
          <div className="flex md:flex-row flex-col justify-between gap-2 items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-custom-blue">
                Staff Roster
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage monthly shifts and personnel availability
              </p>
            </div>
            <button className="bg-custom-blue text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-custom-blue transition-all shadow-sm">
              Save roster
            </button>
          </div>

          {/* ── Filters ── */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-5 flex flex-wrap items-end gap-4">
            {/* Staff */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-custom-blue uppercase tracking-widest">
                Staff
              </label>
              <div className="relative">
                <select
                  value={selStaff}
                  onChange={(e) => setSelStaff(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-9 text-sm text-gray-700 outline-none min-w-[160px] focus:border-indigo-400 transition-colors"
                >
                  <option value="all">All Staff</option>
                  {rosterData.map((m, i) => (
                    <option key={i} value={m.fullname}>
                      {m.fullname}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Month */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-custom-blue uppercase tracking-widest">
                Month
              </label>
              <div className="relative">
                <select
                  value={selMonth}
                  onChange={(e) => setSelMonth(Number(e.target.value))}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-9 text-sm text-gray-700 outline-none min-w-[130px] focus:border-indigo-400 transition-colors"
                >
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i}>
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Year */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-custom-blue uppercase tracking-widest">
                Year
              </label>
              <div className="relative">
                <select
                  value={selYear}
                  onChange={(e) => setSelYear(Number(e.target.value))}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-9 text-sm text-gray-700 outline-none min-w-[100px] focus:border-indigo-400 transition-colors"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={handleGo}
              className="flex items-center gap-2 bg-custom-blue text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#3d35a0] transition-all shadow-sm"
            >
              <RefreshCw size={14} />
              Go
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-5 relative">
            <div ref={scrollRef} className="overflow-x-auto">
              <table
                className="border-collapse"
                style={{ minWidth: "max-content", width: "100%" }}
              >
                <thead>
                  <tr>
                    <th className="sticky left-0 z-20 bg-[#eef0f5] text-left px-5 py-4 text-lg font-bold text-custom-blue border-b border-gray-200 min-w-[170px]">
                      {MONTHS[selMonth]} {selYear}
                    </th>
                    {calDays.map((d, i) => (
                      <th
                        key={i}
                        className="px-3 py-2 border-b border-gray-200 text-center bg-[#eef0f5] min-w-[72px]"
                      >
                        <div className="text-sm font-bold text-custom-blue">
                          {d.date}
                        </div>
                        <div className="text-[10px] font-semibold text-gray-400 mt-0.5">
                          {d.day}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {displayed.length === 0 ? (
                    <tr>
                      <td
                        colSpan={calDays.length + 1}
                        className="text-center py-16 text-gray-400 text-sm"
                      >
                        No staff data available.
                      </td>
                    </tr>
                  ) : (
                    displayed.map((member, mIdx) => {
                      const origIdx = rosterData.findIndex(
                        (m) => m.fullname === member.fullname,
                      );
                      return (
                        <tr
                          key={mIdx}
                          className="border-b border-gray-100 last:border-none"
                        >
                          <td className="sticky left-0 z-10 bg-white px-5 py-4 border-r border-gray-100 min-w-[170px]">
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0">
                                {member?.fullname?.charAt(0)?.toUpperCase()}
                              </div>
                              <span className="text-sm font-semibold text-gray-800 leading-tight">
                                {member?.fullname}
                              </span>
                            </div>
                            <button
                              className="text-xs text-custom-blue hover:underline font-medium pl-9"
                              onClick={() =>
                                router.push(
                                  `/Business/AddStaffs?id=${member._id}`,
                                )
                              }
                            >
                              Set normal hours
                            </button>
                          </td>

                          {member?.shifts?.map((shift, sIdx) => (
                            <td key={sIdx} className="p-0.5 text-center">
                              {shift === "off" ? (
                                <div
                                  onClick={() =>
                                    handleShiftToggle(origIdx, sIdx)
                                  }
                                  className="flex items-center justify-center h-[72px] cursor-pointer hover:bg-gray-50 rounded transition-colors"
                                >
                                  <X
                                    className="text-gray-400 w-4 h-4"
                                    strokeWidth={2.5}
                                  />
                                </div>
                              ) : (
                                <div
                                  onClick={() =>
                                    handleShiftToggle(origIdx, sIdx)
                                  }
                                  className={`${SHIFT_BG} rounded cursor-pointer h-[72px] flex flex-col items-center justify-center gap-1 px-2 hover:brightness-110 transition-all`}
                                >
                                  <span className="text-white text-xs font-semibold leading-tight whitespace-pre-line text-center">
                                    {shift}
                                  </span>
                                  <Check
                                    className="text-white w-3.5 h-3.5"
                                    strokeWidth={2.5}
                                  />
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 mb-5">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-3">
              <span className="text-sm font-bold text-gray-700">Key:</span>
              <span className="flex items-center gap-1.5 text-sm text-gray-700">
                <Check className="w-4 h-4 text-gray-700" strokeWidth={2.5} />{" "}
                Working
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-700">
                <X className="w-4 h-4 text-gray-700" strokeWidth={2.5} /> Not
                working
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-6 h-5 rounded bg-custom-blue inline-block" />{" "}
                Normal working hours
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-6 h-5 rounded bg-amber-400 inline-block" />{" "}
                Modified date
              </span>
              <div className="flex flex-wrap gap-2 items-center">
                {closedDates.length > 0 ? (
                  closedDates.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 shadow-sm"
                    >
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>

                      <span className="text-xs font-medium text-red-700">
                        {new Date(item.startDate).toLocaleDateString()} -{" "}
                        {new Date(item.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-sm">Business Closed</span>
                  </div>
                )}
              </div>

              <button
                className="text-sm text-custom-blue font-semibold hover:underline flex items-center gap-1"
                onClick={() => router.push("/administration/ClosedDates")}
              >
                <Edit2 size={16} /> Edit
              </button>
            </div>
          </div>

          <div className="bg-[#eff6ff] rounded-xl border-l-4 border-custom-blue px-6 py-5 mb-6">
            <h3 className="text-custom-blue font-bold text-sm mb-1">
              Staffing Insight:
            </h3>
            <p className="text-custom-blue/80 text-sm leading-relaxed">
              Clicking any shift cell toggles between "Off" and "Working"
              status. Use the filters above to view a specific staff member or
              navigate to a different month.
            </p>
          </div>

          
        </div>
      </div>
    </>
  );
}
