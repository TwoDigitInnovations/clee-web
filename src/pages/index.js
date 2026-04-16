import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Target,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  ChevronDown,
  Ellipsis,
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import StaffDashboard from "@/components/satafDashboard";
import TargetsDashboard from "@/components/TargetDashboard";
import ActvityDashboard from "@/components/ActvityDashboard";
import isAuth from "@/components/isAuth";
import { fetchStaff } from "@/redux/actions/staffActions";
import { useDispatch, useSelector } from "react-redux";

const TABS = ["Business", "Staff", "Targets", "Activity"];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CURRENT_WEEK = [28, 42, 35, 55, 48, 30, 20];
const TARGET_WEEK = [32, 38, 40, 50, 52, 35, 25];
const MAX_VAL = Math.max(...CURRENT_WEEK, ...TARGET_WEEK);

const STATS = [
  {
    label: "Sales Volume",
    value: "$45,280",
    change: "↑ +8.4% from last month",
    trend: "up",
    icon: <TrendingUp size={15} />,
    iconColor: "bg-green-100 text-green-600",
  },
  {
    label: "Reductions",
    value: "-12.5%",
    valueColor: "text-red-600",
    change: "↓ -2.1% efficiency loss",
    trend: "down",
    icon: <TrendingDown size={15} />,
    iconColor: "bg-red-100 text-red-600",
  },
  {
    label: "Net Revenue",
    value: "$39,620",
    change: "↑ +5.2% overall growth",
    trend: "up",
    icon: <Target size={15} />,
    iconColor: "bg-blue-100 text-blue-700",
  },
];

const TRANSACTIONS = [
  {
    initials: "JD",
    name: "John Doe",
    date: "Oct 24, 2023",
    amount: "$1,250.00",
    status: "COMPLETED",
    avatarBg: "bg-[#EC5B1333]",
  },
  {
    initials: "AS",
    name: "Alice Smith",
    date: "Oct 23, 2023",
    amount: "$840.00",
    status: "PENDING",
    avatarBg: "bg-gray-100",
  },
  {
    initials: "RJ",
    name: "Robert Johnson",
    date: "Oct 23, 2023",
    amount: "$2,100.00",
    status: "COMPLETED",
    avatarBg: "bg-[#EC5B1333]",
  },
];

function BarChart() {
  const W = 460,
    H = 240,
    barW = 28,
    gap = 8;
  const groupW = (W - (WEEK_DAYS.length - 1) * gap) / WEEK_DAYS.length;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-52"
      preserveAspectRatio="none"
    >
      {WEEK_DAYS.map((day, i) => {
        const x = i * (groupW + gap);
        const cH = (CURRENT_WEEK[i] / MAX_VAL) * (H - 20);
        const tH = (TARGET_WEEK[i] / MAX_VAL) * (H - 20);
        const today = day === "Sun";

        return (
          <g key={day}>
            F
            <rect
              x={x + groupW / 2 - barW / 2 + barW / 2 + 2}
              y={H - tH}
              width={barW / 2 - 1}
              height={tH}
              rx="5"
              fill={today ? "#bfdbfe" : "#e0e7ff"}
            />
            <rect
              x={x + groupW / 2 - barW / 2}
              y={H - cH}
              width={barW / 2 - 1}
              height={cH}
              rx="5"
              fill={today ? "#1a56db" : "#93c5fd"}
            />
            {/* Day label */}
            <text
              x={x + groupW / 2}
              y={H}
              textAnchor="middle"
              fontSize="11"
              fill={today ? "#1a56db" : "#94a3b8"}
              fontWeight={today ? "700" : "500"}
            >
              {day}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function StatCard({
  label,
  value,
  valueColor = "text-slate-900",
  change,
  trend,
  icon,
  iconColor,
}) {
  return (
    <div className="relative bg-white rounded-[12px] px-5 py-5 shadow-sm overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-custom-blue rounded-t-2xl" />

      <div className="flex items-center justify-between mb-2">
        <span className="text-[14px] font-medium text-slate-400">{label}</span>
        <span
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconColor}`}
        >
          {icon}
        </span>
      </div>

      <p
        className={`font-extrabold text-[28px] leading-none mb-1.5 ${valueColor}`}
      >
        {value}
      </p>

      <p
        className={`text-xs font-semibold ${trend === "up" ? "text-green-600" : "text-red-600"}`}
      >
        {change}
      </p>
    </div>
  );
}

function SideCard({ label, icon, iconBg, value, sub }) {
  return (
    <div className="bg-white rounded-2xl px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
          {label}
        </span>
        <span className="text-slate-400 cursor-pointer text-lg leading-none">
          <Ellipsis />
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
        <div>
          <p className="font-extrabold text-[26px] leading-none text-slate-900">
            {value}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
        </div>
      </div>
    </div>
  );
}

function RetentionCard({ value = 88.4, goal = 80 }) {
  return (
    <div className="bg-white rounded-2xl px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
          Retention
        </span>
        <span className="text-slate-400 cursor-pointer text-lg leading-none">
          <Ellipsis />
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#EC5B13] rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-slate-400">Goal: {goal}%</span>
        <span className="font-extrabold text-lg text-blue-600">{value}%</span>
      </div>
    </div>
  );
}

function TxRow({ initials, name, date, amount, status, avatarBg }) {
  const isCompleted = status === "COMPLETED";
  return (
    <tr>
      <td className="py-3 border-b border-slate-50">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-black text-xs font-bold flex-shrink-0 ${avatarBg}`}
          >
            {initials}
          </div>
          <span className="text-sm font-semibold text-slate-900">{name}</span>
        </div>
      </td>
      {/* Date */}
      <td className="py-3 border-b border-slate-50">
        <span className="text-xs text-slate-400">{date}</span>
      </td>
      {/* Amount */}
      <td className="py-3 border-b border-slate-50">
        <span className="text-sm font-bold text-slate-900">{amount}</span>
      </td>
      {/* Status */}
      <td className="py-3 border-b border-slate-50">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide
          ${isCompleted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
        >
          {status}
        </span>
      </td>
      {/* More */}
      <td className="py-3 border-b border-slate-50">
        <MoreVertical size={16} className="text-slate-300 cursor-pointer" />
      </td>
    </tr>
  );
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState("Business");
  const [chartToggle, setChartToggle] = useState("Days");
  const dispatch = useDispatch();
  const [staffOpen, setStaffOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState([]);
  const [viewType, setViewType] = useState("week");

  const { staff } = useSelector((state) => state.staff || { staff: [] });

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  const toggleStaff = (member) => {
    const exists = selectedStaff.find((s) => s._id === member._id);

    if (exists) {
      setSelectedStaff((prev) => prev.filter((s) => s._id !== member._id));
    } else {
      setSelectedStaff((prev) => [...prev, member]);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setStaffOpen(false);
      setViewOpen(false);
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <DashboardHeader
        title="Dashboard Overview"
        subtitle="Welcome back, here's your salon's status today."
      />

      <div className="md:w-full w-[400px] min-h-screen bg-custom-gray p-3 md:p-6 text-slate-800 ">
        <div className="flex md:flex-row flex-col md:items-center gap-3 justify-between mb-6">
          <div className="flex bg-white rounded-xl gap-0 shadow-sm flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-8 py-2.5 border-l   text-sm font-medium transition-all duration-150
                ${
                  activeTab === tab
                    ? "bg-custom-blue text-white rounded-lg font-semibold shadow-md"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-2.5 relative">
            {/* STAFF DROPDOWN */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setStaffOpen(!staffOpen);
                  setViewOpen(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-[1.5px] bg-custom-blue text-white text-sm font-semibold"
              >
                {selectedStaff.length > 0
                  ? `${selectedStaff.length} Selected`
                  : "All Staff"}
                <ChevronDown size={15} />
              </button>

              {staffOpen && (
                <div className="absolute mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-auto">
                  {/* All option */}
                  <div
                    onClick={() => setSelectedStaff([])}
                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    All Staff
                  </div>

                  {staff.map((member) => {
                    const isSelected = selectedStaff.some(
                      (s) => s._id === member._id,
                    );

                    return (
                      <div
                        key={member._id}
                        onClick={() => toggleStaff(member)}
                        className={`px-3 py-2 text-sm flex justify-between items-center cursor-pointer hover:bg-gray-100 ${
                          isSelected ? "bg-blue-50 text-blue-700" : ""
                        }`}
                      >
                        {member.fullname}
                        {isSelected && "✔"}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* VIEW DROPDOWN */}
            <div className="relative">
              <button
                onClick={(e) => {
                   e.stopPropagation();
                  setViewOpen(!viewOpen);
                  setStaffOpen(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-custom-blue text-white text-sm font-semibold"
              >
                {viewType === "week" ? "View Week" : "View Month"}
                <ChevronDown size={15} />
              </button>

              {viewOpen && (
                <div className="absolute mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <div
                    onClick={() => {
                      setViewType("week");
                      setViewOpen(false);
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                      viewType === "week" ? "bg-blue-50 text-blue-700" : ""
                    }`}
                  >
                    Weekly View
                  </div>

                  <div
                    onClick={() => {
                      setViewType("month");
                      setViewOpen(false);
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                      viewType === "month" ? "bg-blue-50 text-blue-700" : ""
                    }`}
                  >
                    Monthly View
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-5 bg-white py-2 rounded-[12px]">
          <button className="p-1.5 rounded-full text-custom-blue hover:bg-blue-100 hover:text-blue-700 transition">
            <ChevronLeft size={20} className="font-bold" />
          </button>
          <span className="text-[14px] font-bold tracking-widest uppercase text-custom-blue">
            This Week
          </span>
          <button className="p-1.5 rounded-full text-custom-blue hover:bg-blue-100 hover:text-blue-700 transition">
            <ChevronRight size={20} className="font-bold" />
          </button>
        </div>

        {activeTab === "Business" && (
          <>
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mb-5">
              {STATS.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>

            <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mb-5">
              <div className="bg-white col-span-2 rounded-2xl px-5 py-5 shadow-sm">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900">
                      Weekly Activity
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Activity across all departments
                    </p>
                  </div>
                  {/* Days / Weeks toggle */}
                  <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
                    {["Days", "Weeks"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setChartToggle(t)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all
                    ${chartToggle === t ? "bg-custom-blue text-white" : "text-slate-500"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bar chart */}
                <div className="mt-4">
                  <BarChart />
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 border-t pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span className="w-2 h-2 rounded-full bg-blue-300 inline-block" />
                    Current Week
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span className="w-2 h-2 rounded-full bg-indigo-100 inline-block" />
                    Target
                  </div>
                  <span className="ml-auto text-xs font-bold text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full">
                    +14% improvement
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3.5">
                <SideCard
                  label="Appointments"
                  icon={<Calendar size={20} />}
                  iconBg="bg-blue-100 text-blue-700"
                  value="24"
                  sub="Scheduled Today"
                />
                <SideCard
                  label="Active Clients"
                  icon={<Users size={20} />}
                  iconBg="bg-violet-100 text-violet-700"
                  value="1,450"
                  sub={
                    <>
                      <span className="text-green-600 font-semibold">+12</span>{" "}
                      this week
                    </>
                  }
                />
                <RetentionCard value={88.4} goal={80} />
              </div>
            </div>

            <div className="bg-white rounded-2xl px-5 py-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-bold text-slate-900">
                  Recent Customer Transactions
                </h3>
                <span className="text-sm font-semibold text-blue-700 cursor-pointer">
                  View All
                </span>
              </div>

              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["Customer", "Date", "Amount", "Status", ""].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[11px] font-bold tracking-widest uppercase text-slate-400 py-2.5 px-4 border-b-[1.5px] bg-gray-100 border-slate-100"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TRANSACTIONS.map((tx) => (
                    <TxRow key={tx.name} {...tx} />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "Staff" && <StaffDashboard />}
        {activeTab === "Targets" && <TargetsDashboard />}
        {activeTab === "Activity" && <ActvityDashboard />}
      </div>
    </>
  );
}

export default isAuth(Dashboard);
