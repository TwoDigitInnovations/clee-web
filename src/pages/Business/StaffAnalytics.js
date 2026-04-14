import { DollarSign, Target, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardHeader from "@/components/DashboardHeader";
import { fetchStaff } from "@/redux/actions/staffActions";

import StaffAnalyticsHeader from "@/components/StaffAnalyticsHeader";
import StatsCards from "@/components/StatsCards";
import CommissionTrendsChart from "@/components/CommissionTrendsChart";
import StaffLeaderboard from "@/components/StaffLeaderboard";
import { AchievementSpotlight, AnnualTargetProgress, LiveActivity } from "@/components/AchievementSpotlight";
// import AnnualTargetProgress from "@/components/AnnualTargetProgress";

const MOCK_STATS = {
  totalCommissions: 412850,
  commissionChange: -12.4,
  avgCommission: 4582,
  avgChange: -3.1,
  topTeam: { name: "Asset Management", initials: "AM", target: 114 },
  incentivePayouts: 18200,
  bonusCount: 14,
};

const MOCK_LEADERBOARD = [
  {
    rank: 1,
    name: "Elena Rodriguez",
    role: "Senior Portfolio Manager",
    achievements: ["star", "bolt"],
    commission: 84200,
    convRate: 18.4,
    trend: "up",
    avatar: null,
  },
  {
    rank: 2,
    name: "Julian Vance",
    role: "Wealth Consultant",
    achievements: ["star"],
    commission: 72150,
    convRate: 16.2,
    trend: "up",
    avatar: null,
  },
  {
    rank: 3,
    name: "Sarah Chen",
    role: "Investment Analyst",
    achievements: ["bolt"],
    commission: 68900,
    convRate: 15.8,
    trend: "down",
    avatar: null,
  },
];

const MOCK_SPOTLIGHT = {
  name: "Marcus Lee",
  title: "Staff of the Month — September",
  bonus: 2500,
  leads: 124,
  avatar: null,
};

const MOCK_ACTIVITY = [
  {
    icon: "dollar",
    text: "David W. closed a high-value commission of $12.4K.",
    time: "2 MINUTES AGO",
  },
  {
    icon: "target",
    text: "Team Alpha exceeded their monthly target by 15%.",
    time: "1 HOUR AGO",
  },
  {
    icon: "user",
    text: "New Recruit Linda Jo joined the Sales Team.",
    time: "4 HOURS AGO",
  },
];

const MOCK_TREND_DATA = [
  { label: "Oct 01", current: 18, prev: 22 },
  { label: "Oct 05", current: 24, prev: 19 },
  { label: "Oct 10", current: 20, prev: 26 },
  { label: "Oct 15", current: 30, prev: 21 },
  { label: "Oct 20", current: 52, prev: 28 },
  { label: "Oct 25", current: 40, prev: 35 },
  { label: "Oct 30", current: 35, prev: 38 },
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function StaffAnalytics() {
  const dispatch = useDispatch();
  const { staff, loading } = useSelector(
    (state) => state.staff ?? { staff: [], loading: false },
  );

  const [activeTab, setActiveTab] = useState("Overview");
  const [dateRange, setDateRange] = useState("Oct 1 – Oct 31, 2023");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  return (
    <div className="bg-[#f8f9fb] min-h-screen">
      <DashboardHeader title="Your Business" />

      <div className="md:px-6 px-4 py-6 max-w-[1400px] mx-auto">
        {/* ── Page Header with tabs ── */}
        <StaffAnalyticsHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="mt-5 grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
          <div className="space-y-5 min-w-0">
            <StatsCards stats={MOCK_STATS} loading={loading} />

            <CommissionTrendsChart data={MOCK_TREND_DATA} />

            <StaffLeaderboard
              data={staff}
              loading={loading}
              searchQuery={searchQuery}
            />
          </div>

      
          <div className="space-y-5">
            <AchievementSpotlight data={MOCK_SPOTLIGHT} />
            <LiveActivity activities={MOCK_ACTIVITY} />
            <AnnualTargetProgress percent={75} reached={3.2} goal={4.0} />
          </div>
        </div>
      </div>
    </div>
  );
}
