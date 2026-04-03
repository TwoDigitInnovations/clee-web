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
import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import ViewAppointmentModal from "@/components/ViewAppointmentModal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookings,
  fetchUpcomingBookings,
} from "@/redux/actions/bookingActions";
import {
  fetchWaitlist,
  deleteWaitlist,
} from "@/redux/actions/waitlistActions";
import { Api } from "@/services/service";
import { useRouter } from "next/router";

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

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);
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

function BookingBlock({ booking, pixelsPerHour, onBookingClick }) {
  const top = (booking.startHour - 8) * pixelsPerHour;
  const height = (booking.durationMins / 60) * pixelsPerHour;
  
  const colorMap = {
    Confirmed: "bg-amber-100 border-amber-400 text-amber-900",
    Pending: "bg-blue-100 border-blue-400 text-blue-900",
    Completed: "bg-emerald-100 border-emerald-400 text-emerald-900",
    Cancelled: "bg-red-100 border-red-400 text-red-900",
  };
  
  const color = colorMap[booking.status] || "bg-gray-100 border-gray-400 text-gray-900";
  
  return (
    <div
      className={`absolute left-1 right-1 rounded-lg border-l-4 px-2 py-2 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${color}`}
      style={{ top: top + "px", height: height + "px" }}
      onClick={() => onBookingClick(booking)}
    >
      <p className="text-xs font-semibold leading-tight truncate">
        {booking.service}
      </p>
      <p className="text-xs opacity-70 truncate">
        {booking.customer?.fullname || "Unknown"}
      </p>
    </div>
  );
}
function Calender(props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { bookings, upcomingBookings } = useSelector((state) => state.booking);
  const { waitlist } = useSelector((state) => state.waitlist);

  const [tab, setTab] = useState("upcoming");
  const [view, setView] = useState("Day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [open1, setOpen1] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editWaitlistId, setEditWaitlistId] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    loadStaff();
  }, []);

  useEffect(() => {
    loadBookings();
    loadUpcomingBookings();
    loadWaitlist();
  }, [currentDate]);

  const loadStaff = async () => {
    try {
      const res = await Api("get", "auth/getAllUser?role=staff", "", router);
      if (res?.status && res.data) {
        const staffArray = Array.isArray(res.data) ? res.data : res.data.data || [];
        const staffData = staffArray.map((s) => ({
          id: s._id,
          name: s.fullname,
          avatar: s.image || `https://api.dicebear.com/7.x/micah/svg?seed=${s.fullname}&backgroundColor=b6e3f4`,
        }));
        setStaffList(staffData.length > 0 ? staffData : STAFF);
      } else {
        setStaffList(STAFF);
      }
    } catch (err) {
      console.error("Failed to fetch staff", err);
      setStaffList(STAFF);
    }
  };

  const loadBookings = async () => {
    try {
      props.loader(true);
      await dispatch(fetchBookings(currentDate, router));
      props.loader(false);
    } catch (err) {
      props.loader(false);
      props.toaster({ type: "error", message: "Failed to fetch bookings" });
    }
  };

  const loadUpcomingBookings = async () => {
    try {
      await dispatch(fetchUpcomingBookings(router));
    } catch (err) {
      console.error("Failed to fetch upcoming bookings", err);
    }
  };

  const loadWaitlist = async () => {
    try {
      await dispatch(fetchWaitlist(router));
    } catch (err) {
      console.error("Failed to fetch waitlist", err);
    }
  };

  const handleDeleteWaitlist = async (id) => {
    try {
      props.loader(true);
      const result = await dispatch(deleteWaitlist(id, router));
      if (result.success) {
        props.toaster({ type: "success", message: "Removed from waitlist" });
        await loadWaitlist();
      }
      props.loader(false);
      setOpenMenuId(null);
    } catch (err) {
      props.loader(false);
      props.toaster({ type: "error", message: "Failed to remove from waitlist" });
    }
  };

  const pixelsPerHour = 72;

  function navigate(dir) {
    const d = new Date(currentDate);
    if (view === "Day") d.setDate(d.getDate() + dir);
    else if (view === "Week") d.setDate(d.getDate() + dir * 7);
    else d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  }

  function goToday() {
    setCurrentDate(new Date());
  }

  const isToday = currentDate.toDateString() === new Date().toDateString();

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
                {Array.isArray(upcomingBookings) && upcomingBookings.length > 0 ? (
                  upcomingBookings.map((u) => {
                    const hour = u.startHour;
                    const timeStr =
                      hour === 12
                        ? "12:00 PM"
                        : hour < 12
                          ? `${hour}:00 AM`
                          : `${hour - 12}:00 PM`;
                    
                    return (
                      <div
                        key={u._id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer group transition-colors"
                        onClick={() => {
                          setSelectedBooking(u);
                          setOpen1(true);
                        }}
                      >
                        <Avatar 
                          src={u.customer?.image || `https://api.dicebear.com/7.x/micah/svg?seed=${u.customer?.fullname}&backgroundColor=b6e3f4`} 
                          name={u.customer?.fullname || "Unknown"} 
                          size={10} 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {u.customer?.fullname || "Unknown"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {timeStr} · {u.service}
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
                    );
                  })
                ) : (
                  <div className="px-4 py-8 text-center text-slate-400 text-sm">
                    No upcoming bookings
                  </div>
                )}
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
                  {Array.isArray(waitlist) && waitlist.length > 0 ? (
                    waitlist.map((w) => {
                      const addedTime = new Date(w.createdAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      );

                      return (
                        <div
                          key={w._id}
                          className="bg-slate-50 rounded-2xl p-3 border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {w.customer?.fullname || "Unknown"}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {addedTime} · {w.notes}
                              </p>
                            </div>

                            <div className="relative" ref={menuRef}>
                              <button
                                onClick={() =>
                                  setOpenMenuId(
                                    openMenuId === w._id ? null : w._id
                                  )
                                }
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                              >
                                <EllipsisVertical size={20} />
                              </button>

                              {openMenuId === w._id && (
                                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-50">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenMenuId(null);
                                      setEditWaitlistId(w._id);
                                      setOpen(true);
                                    }}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 rounded-t-xl"
                                  >
                                    <Pencil size={16} />
                                    Edit
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteWaitlist(w._id);
                                    }}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-b-xl"
                                  >
                                    <Trash2 size={16} />
                                    Remove
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <span
                              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                w.urgent
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-50 text-custom-blue"
                              }`}
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
                      );
                    })
                  ) : (
                    <div className="px-4 py-8 text-center text-slate-400 text-sm">
                      No waitlist entries
                    </div>
                  )}
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

              {staffList.map((staff, idx) => {
                const staffBookings = Array.isArray(bookings) 
                  ? bookings.filter((b) => b.staff?._id === staff.id)
                  : [];
                
                return (
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
                    {staffBookings.map((b) => (
                      <BookingBlock
                        key={b._id}
                        booking={b}
                        pixelsPerHour={pixelsPerHour}
                        onBookingClick={(booking) => {
                          setSelectedBooking(booking);
                          setOpen1(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            </div>
          </div>

          {open && (
            <AddWaitlist
              onClose={() => {
                setOpen(false);
                setEditWaitlistId(null);
                loadWaitlist();
              }}
              editId={editWaitlistId}
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

          {open1 && selectedBooking && (
            <ViewAppointmentModal
              data={{
                clinic: "Chebo Clinic",
                status: selectedBooking.status,
                service: selectedBooking.service,
                staff: selectedBooking.staff?.fullname || "Unknown",
                resource: null,
                date: new Date(selectedBooking.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }),
                time: selectedBooking.startHour === 12 
                  ? "12:00PM" 
                  : selectedBooking.startHour < 12 
                    ? `${selectedBooking.startHour}:00AM` 
                    : `${selectedBooking.startHour - 12}:00PM`,
                duration: `${selectedBooking.durationMins} mins`,
                price: selectedBooking.price || 0,
                customer: {
                  name: selectedBooking.customer?.fullname || "Unknown",
                  phone: selectedBooking.customer?.phone || "N/A",
                  email: selectedBooking.customer?.email || "N/A",
                },
                history: [],
              }}
              onClose={() => {
                setOpen1(false);
                setSelectedBooking(null);
              }}
            />
          )}
        </main>
      </div>
    </>
  );
}

export default Calender;
