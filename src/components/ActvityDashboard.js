import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  fetchPendingBookings,
  approveBooking,
  declineBooking,
} from "@/redux/actions/bookingActions";

const pendingData = [
  {
    id: 1,
    name: "Amelie S.",
    date: "Sun, 13 Sep 2020",
    assigned: "Sarah Jenkins",
    assignedColor: "#F4A261",
    service: "NEW CLIENTS Choose on the Day Credit",
    icon: "cloud",
  },
  {
    id: 2,
    name: "Marcus Thorne",
    date: "Mon, 14 Sep 2020",
    assigned: "Michael Chen",
    assignedColor: "#CBD5E1",
    service: "Gents Cut & Style",
    icon: "calendar",
  },
];

const CloudIcon = () => (
  <svg
    className="w-5 h-5 text-sky-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
    />
  </svg>
);

const CalendarIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const DotsIcon = () => (
  <svg
    className="w-4 h-4 text-slate-400"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
);

const UserIcon = () => (
  <svg
    className="w-8 h-8 text-slate-300"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const HistoryIcon = () => (
  <svg
    className="w-10 h-10 text-slate-300"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const BirthdayCard = () => (
  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 shadow-sm">
    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-100 px-2 py-0.5 rounded-full mb-2">
      🎂 Birthday Alert
    </span>
    <h2 className="text-lg font-extrabold text-slate-800 leading-tight mb-3">
      HAPPY BIRTHDAY
      <br />
      SARAH!
    </h2>
    
    <div className="w-full h-full rounded-xl  flex items-center justify-center mb-3 overflow-hidden">
    
      <img src="images/ladyprofile.png" className=""/>
    </div>
    <p className="text-xs text-slate-500 leading-relaxed mb-4">
      Wish your client a wonderful day and offer a special birthday treat.
    </p>
    <button className="w-full bg-custom-blue hover:bg-sky-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-95 shadow-md shadow-sky-100">
      Contact Sarah
    </button>
  </div>
);

const NoAppointmentsCard = () => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center mt-3">
    <div className="w-10 h-10 flex items-center justify-center text-slate-300 mb-2">
      <CalendarIcon className="w-8 h-8 text-slate-300" />
    </div>
    <p className="text-sm font-bold text-slate-700">No upcoming appointments</p>
    <p className="text-xs text-slate-400 mt-0.5">for today</p>
    <a
      href="#"
      className="text-xs text-sky-500 hover:text-sky-700 font-semibold mt-3 transition-colors"
    >
      Go to calendar
    </a>
  </div>
);

const PendingCard = ({ item, onApprove, onDecline }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
          <UserIcon />
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">{item.name}</p>
          <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
            <CalendarIcon className="w-3 h-3" />
            <span>{item.date}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {item.icon === "cloud" ? (
          <CloudIcon />
        ) : (
          <CalendarIcon className="w-5 h-5 text-sky-400" />
        )}
        <button className="hover:bg-slate-100 rounded-lg p-1 transition-colors">
          <DotsIcon />
        </button>
      </div>
    </div>

    <div className="mt-3 space-y-1 text-xs">
      <div className="flex items-center gap-2">
        <span className="text-slate-400 w-16 flex-shrink-0">Assigned:</span>
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: item.assignedColor }}
        />
        <span className="text-slate-600 font-medium">{item.assigned}</span>
      </div>
      <div className="flex items-start gap-2">
        <span className="text-slate-400 w-16 flex-shrink-0">Service:</span>
        <span className="text-slate-700 font-semibold leading-tight">
          {item.service}
        </span>
      </div>
    </div>

    <div className="flex gap-2 mt-4">
      <button
        onClick={() => onApprove(item.id)}
        className="flex-1 bg-custom-blue hover:bg-sky-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all active:scale-95 shadow-sm shadow-sky-100"
      >
        Approve
      </button>
      <button
        onClick={() => onDecline(item.id)}
        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2.5 rounded-xl transition-all active:scale-95"
      >
        Decline
      </button>
    </div>
  </div>
);

const RecentActivity = () => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLoaded(true);
    }, 1500);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center h-full justify-center min-h-48">
      {loaded ? (
        <div className="w-full text-left space-y-3">
          {[
            "Client booked online",
            "Invoice approved",
            "Staff shift updated",
          ].map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0"
            >
              <div className="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0" />
              <span className="text-xs text-slate-600">{a}</span>
              <span className="text-[10px] text-slate-300 ml-auto">
                just now
              </span>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-3 opacity-40">
            <HistoryIcon />
          </div>
          <p className="text-sm font-bold text-slate-700">
            No activity recorded
          </p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-[160px]">
            Latest updates and actions will appear here as they happen.
          </p>
          <button
            onClick={handleLoad}
            disabled={loading}
            className="mt-4 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-5 py-2 rounded-xl transition-all active:scale-95"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="w-3 h-3 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              "Load recent activity"
            )}
          </button>
        </>
      )}
    </div>
  );
};

// ─── Section Header ────────────────────────────────────────────────────────────

const SectionHeader = ({ title, badge, action }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
        {title}
      </span>
      {badge !== undefined && (
        <span className="bg-sky-100 text-sky-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
    {action && (
      <a
        href="#"
        className="text-xs text-sky-500 hover:text-sky-700 font-semibold transition-colors"
      >
        {action}
      </a>
    )}
  </div>
);

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function ActvityDashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingBookings();
  }, []);

  const loadPendingBookings = async () => {
    try {
      setLoading(true);
      const result = await dispatch(fetchPendingBookings(router));
      if (result.success) {
        // Transform backend data to match UI format
        const transformedData = result.data.map((booking) => ({
          id: booking._id,
          name: booking.customer?.fullname || "Unknown",
          date: new Date(booking.date).toLocaleDateString("en-US", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          assigned: booking.staff?.fullname || "Unassigned",
          assignedColor: "#F4A261",
          service: booking.service || "Service not specified",
          icon: "calendar",
        }));
        setPending(transformedData);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to load pending bookings", err);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const result = await dispatch(approveBooking(id, router));
      if (result.success) {
        setPending((p) => p.filter((x) => x.id !== id));
      }
    } catch (err) {
      console.error("Failed to approve booking", err);
    }
  };

  const handleDecline = async (id) => {
    try {
      const result = await dispatch(declineBooking(id, router));
      if (result.success) {
        setPending((p) => p.filter((x) => x.id !== id));
      }
    } catch (err) {
      console.error("Failed to decline booking", err);
    }
  };

  return (
<div className="min-h-screen bg-slate-50 ">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
    
    {/* Coming Up */}
    <div className="lg:col-span-3 md:col-span-2 col-span-1">
      <SectionHeader title="Coming Up" />
      <BirthdayCard />
      <NoAppointmentsCard />
    </div>

    {/* Pending */}
    <div className="lg:col-span-5 md:col-span-2 col-span-1">
      <SectionHeader
        title="Pending"
        badge={pending.length}
        action="View all"
      />

      {pending.length === 0 ? (
        loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-blue mb-3"></div>
            <p className="text-sm text-slate-600">Loading pending bookings...</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center">
            <div className="text-2xl sm:text-3xl mb-2">✅</div>
            <p className="text-sm font-bold text-slate-700">
              All caught up!
            </p>
            <p className="text-xs text-slate-400 mt-1">
              No pending approvals right now.
            </p>
          </div>
        )
      ) : (
        <div className="space-y-3">
          {pending.map((item) => (
            <PendingCard
              key={item.id}
              item={item}
              onApprove={handleApprove}
              onDecline={handleDecline}
            />
          ))}
        </div>
      )}
    </div>

    {/* Recent Activity */}
    <div className="lg:col-span-4 md:col-span-2 col-span-1">
      <SectionHeader title="Recent Activity" />
      <RecentActivity />
    </div>

  </div>
</div>

  );
}
