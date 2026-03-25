import AddCustomer from "@/components/AddCustomer";
import AddWaitlist from "@/components/AddWaitlist";
import DashboardHeader from "@/components/DashboardHeader";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Plus,
  UserCheck,
  UserRoundPlus,
} from "lucide-react";
import React, { useState } from "react";

const STAFF = [
  {
    id: 1,
    name: "Staff 1",
    avatar:
      "https://api.dicebear.com/7.x/micah/svg?seed=staff1&backgroundColor=b6e3f4",
  },
  {
    id: 2,
    name: "Staff 2",
    avatar:
      "https://api.dicebear.com/7.x/micah/svg?seed=staff2&backgroundColor=ffd5dc",
  },
];

const INITIAL_BOOKINGS = [
  {
    id: 1,
    staffId: 1,
    customer: "Jessica Miller",
    service: "Hair Cut & Styling",
    startHour: 10,
    durationMins: 60,
    color: "bg-amber-100 border-amber-400 text-amber-900",
  },
  {
    id: 2,
    staffId: 2,
    customer: "Robert Chen",
    service: "Color Correction",
    startHour: 11,
    durationMins: 60,
    color: "bg-blue-100 border-blue-400 text-blue-900",
  },
  {
    id: 3,
    staffId: 1,
    customer: "Sarah Williams",
    service: "Full Balayage",
    startHour: 13,
    durationMins: 60,
    color: "bg-emerald-100 border-emerald-400 text-emerald-900",
  },
];

const UPCOMING = [
  {
    id: 1,
    name: "Zara Hang",
    time: "10:00 AM",
    service: "Haircut",
    avatar:
      "https://api.dicebear.com/7.x/micah/svg?seed=zara&backgroundColor=ffd5dc",
  },
  {
    id: 2,
    name: "Michaela Swamy",
    time: "11:30 AM",
    service: "Color & Style",
    avatar:
      "https://api.dicebear.com/7.x/micah/svg?seed=michaela&backgroundColor=c0aede",
  },
  {
    id: 3,
    name: "David Chen",
    time: "01:00 PM",
    service: "Beard Trim",
    avatar:
      "https://api.dicebear.com/7.x/micah/svg?seed=david&backgroundColor=b6e3f4",
  },
  {
    id: 4,
    name: "Sarah Jenkins",
    time: "02:30 PM",
    service: "Blowout",
    avatar:
      "https://api.dicebear.com/7.x/micah/svg?seed=sarahj&backgroundColor=d1f4e0",
  },
];

const WAITLIST = [
  {
    id: 1,
    name: "Hannah Broadhurst",
    added: "6:45am",
    notes: "No notes",
    service: "Full Highlights",
    urgent: false,
  },
  {
    id: 2,
    name: "Fairuz Bhuiyan",
    added: "7:15am",
    notes: "Prefers morning",
    service: "Women's Cut",
    urgent: false,
  },
  {
    id: 3,
    name: "Jacqueline Redfern",
    added: "8:00am",
    notes: "Urgent request",
    service: "Balayage",
    urgent: true,
  },
];

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8am to 8pm
const VIEWS = ["Day", "Week", "Month"];

function formatDate(date, view) {
  if (view === "Day")
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  if (view === "Week") {
    const end = new Date(date);
    end.setDate(date.getDate() + 6);
    return `${date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} – ${end.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}`;
  }
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function Avatar({ src, name, size = 8 }) {
  return (
    <img
      src={src}
      alt={name}
      className={`w-${size} h-${size} rounded-full object-cover border-2 border-white shadow-sm`}
    />
  );
}

function BookingBlock({ booking, pixelsPerHour }) {
  const top = (booking.startHour - 8) * pixelsPerHour;
  const height = (booking.durationMins / 60) * pixelsPerHour;
  return (
    <div
      className={`absolute left-1 right-1 rounded-lg border-l-4 px-2 py-2 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${booking.color}`}
      style={{ top: top + "px", height: height + "px" }}
    >
      <p className="text-xs font-semibold leading-tight truncate">
        {booking.service}
      </p>
      <p className="text-xs opacity-70 truncate">{booking.customer}</p>
    </div>
  );
}
function Calender(props) {
  const [tab, setTab] = useState("upcoming");
  const [view, setView] = useState("Day");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 16));
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const pixelsPerHour = 72;

  function navigate(dir) {
    const d = new Date(currentDate);
    if (view === "Day") d.setDate(d.getDate() + dir);
    else if (view === "Week") d.setDate(d.getDate() + dir * 7);
    else d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  }

  function goToday() {
    setCurrentDate(new Date(2026, 2, 16));
  }

  const isToday =
    currentDate.toDateString() === new Date(2026, 2, 16).toDateString();

  return (
    <>
      <DashboardHeader
        title="Calender"
        subtitle="To manage appointments, staff availability, and customer bookings."
      />

      <div className="min-h-screen bg-custom-gray  text-slate-800 flex md:flex-row flex-col items-start justify-start ">
        <aside className="w-full md:w-[300px] md:h-[800px] flex flex-col  bg-white border-r border-slate-100 shadow-sm shrink-0">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                className="bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none w-full"
                placeholder="Find customer"
              />
            </div>
          </div>

          <div className="flex border-b border-slate-100">
            {["upcoming", "waitlist"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${tab === t ? "text-custom-blue border-b-2 border-custom-blue" : "text-slate-500 hover:text-slate-700"}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {tab === "upcoming" ? (
              <div className="divide-y divide-slate-50">
                {UPCOMING.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer group transition-colors"
                  >
                    <Avatar src={u.avatar} name={u.name} size={10} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {u.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {u.time} · {u.service}
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <button
                  className="w-full flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 rounded-xl py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  onClick={() => setOpen(true)}
                >
                  <UserRoundPlus />
                  Add to waitlist
                </button>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Current Waitlist
                  </span>
                  <button className="text-xs text-slate-500 hover:text-slate-700">
                    Sort: Oldest first ▾
                  </button>
                </div>
                <div className="space-y-3">
                  {WAITLIST.map((w) => (
                    <div
                      key={w.id}
                      className="bg-slate-50 rounded-2xl p-3 border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {w.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {w.added} · {w.notes}
                          </p>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 p-0.5">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${w.urgent ? "bg-red-100 text-red-700" : "bg-blue-50 text-custom-blue"}`}
                        >
                          {w.service}
                        </span>
                        <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="flex flex-col overflow-hidden">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 py-3 bg-white border-b border-slate-100 shadow-sm gap-3 sm:gap-6">
           
            <div className="flex items-center justify-between w-full sm:w-auto gap-2">
              {/* Staff Button */}
              <button className="flex items-center gap-2 bg-custom-blue text-white text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl shadow hover:bg-custom-blue/90 transition-colors">
                <UserCheck size={16} />
                <span className="hidden md:inline">All Rostered Staff</span>
                <ChevronDown size={16} />
              </button>

              {/* Right Side (mobile) */}
              <div className="flex items-center gap-2 sm:hidden">
                <button
                  onClick={() => setIsOpen(true)}
                  className="p-2 bg-custom-blue text-white rounded-lg"
                >
                  <Plus size={16} />
                </button>

                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                  <EllipsisVertical size={16} />
                </button>
              </div>
            </div>

            {/* Center Navigation */}
            <div className="flex items-center justify-between sm:justify-center gap-2 w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-xs sm:text-sm font-semibold text-slate-800 whitespace-nowrap">
                {formatDate(currentDate, view)}
              </span>

              <button
                onClick={() => navigate(1)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              >
                <ChevronRight size={16} />
              </button>

              <button
                onClick={goToday}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-lg border ${
                  isToday
                    ? "bg-blue-50 border-blue-200 text-custom-blue"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Today
              </button>
            </div>

            {/* Right Side Desktop */}
            <div className="hidden sm:flex items-center gap-2 ml-auto">
              {/* View Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowViewMenu((v) => !v)}
                  className="flex items-center gap-1.5 border border-slate-200 text-sm font-semibold text-slate-700 px-3 py-2 rounded-xl hover:bg-slate-50"
                >
                  {view}
                  <ChevronDown size={16} />
                </button>

                {showViewMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden min-w-[120px]">
                    {VIEWS.map((v) => (
                      <button
                        key={v}
                        onClick={() => {
                          setView(v);
                          setShowViewMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          view === v
                            ? "bg-blue-50 text-custom-blue"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        {v} view
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Button */}
              <button
                className="flex items-center gap-1.5 bg-custom-blue text-white text-sm font-semibold px-4 py-2 rounded-xl shadow hover:bg-custom-blue/90"
                onClick={() => setIsOpen(true)}
              >
                <Plus size={16} />
                Add Customer
              </button>

              {/* More */}
              <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
                <EllipsisVertical size={16} />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            <div className="flex min-w-max">
              <div className="w-16 shrink-0 pt-14 select-none">
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="flex items-start justify-end pr-3"
                    style={{ height: pixelsPerHour + "px" }}
                  >
                    <span className="text-xs text-slate-400 -mt-2">
                      {h === 12 ? "12pm" : h < 12 ? `${h}am` : `${h - 12}pm`}
                    </span>
                  </div>
                ))}
              </div>

              {STAFF.map((staff, idx) => (
                <div
                  key={staff.id}
                  className="flex-1 min-w-[200px]"
                  style={{
                    borderLeft: idx === 0 ? "1px solid #e2e8f0" : "none",
                  }}
                >
                  <div className="flex flex-col items-center justify-center h-14 border-b border-r border-slate-100 sticky top-0 bg-white z-10 gap-1">
                    <Avatar src={staff.avatar} name={staff.name} size={8} />
                    <span className="text-xs font-semibold text-slate-700">
                      {staff.name}
                    </span>
                  </div>

                  <div
                    className="relative border-r border-slate-100"
                    style={{ height: HOURS.length * pixelsPerHour + "px" }}
                  >
                    {HOURS.map((h) => (
                      <div
                        key={h}
                        className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors cursor-pointer"
                        style={{ height: pixelsPerHour + "px" }}
                      />
                    ))}
                    {INITIAL_BOOKINGS.filter((b) => b.staffId === staff.id).map(
                      (b) => (
                        <BookingBlock
                          key={b.id}
                          booking={b}
                          pixelsPerHour={pixelsPerHour}
                        />
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {open && (
            <AddWaitlist
              onClose={() => setOpen(false)}
              loader={props.loader}
              toaster={props.toaster}
            />
          )}
          {isOpen && (
            <AddCustomer
              onClose={() => setIsOpen(false)}
              loader={props.loader}
              toaster={props.toaster}
              shouldRefresh={false}
            />
          )}
        </main>
      </div>
    </>
  );
}

export default Calender;
