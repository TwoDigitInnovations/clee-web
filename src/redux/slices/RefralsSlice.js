import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Api } from "@/services/service";

const DUMMY_DATA = {
  stats: {
    totalReferrals: 47,
    newThisMonth: 8,
    convertedBookings: 31,
    conversionRate: 66,
    revenueGenerated: 6820,
    rewardsIssued: 1240,
    pendingPayout: 310,
  },
  referrals: [
    {
      id: 1,
      referredBy: {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        initials: "SJ",
        color: "#6366f1",
      },
      friendReferred: "Emma Williams",
      date: "Oct 12, 2023",
      status: "Rewarded",
      bookingValue: 280.0,
      reward: "$25.00 Credit",
      rewardPending: false,
    },
    {
      id: 2,
      referredBy: {
        name: "Michael Brown",
        email: "m.brown@provider.net",
        initials: "MB",
        color: "#f59e0b",
      },
      friendReferred: "David Miller",
      date: "Oct 10, 2023",
      status: "Booked",
      bookingValue: 150.0,
      reward: "Pending Payout",
      rewardPending: true,
    },
    {
      id: 3,
      referredBy: {
        name: "Lisa Chen",
        email: "lisa_c@gmail.com",
        initials: "LC",
        color: "#10b981",
      },
      friendReferred: "Jessica Lee",
      date: "Oct 08, 2023",
      status: "Pending",
      bookingValue: null,
      reward: "Waiting for booking",
      rewardPending: false,
    },
    {
      id: 4,
      referredBy: {
        name: "Mark Thompson",
        email: "mark.t@email.com",
        initials: "MT",
        color: "#3b82f6",
      },
      friendReferred: "Anna White",
      date: "Oct 05, 2023",
      status: "Rewarded",
      bookingValue: 320.0,
      reward: "$25.00 Credit",
      rewardPending: false,
    },
    {
      id: 5,
      referredBy: {
        name: "Elena Rodriguez",
        email: "elena.r@mail.com",
        initials: "ER",
        color: "#ec4899",
      },
      friendReferred: "Tom Harris",
      date: "Oct 02, 2023",
      status: "Booked",
      bookingValue: 200.0,
      reward: "Pending Payout",
      rewardPending: true,
    },
  ],
  topReferrers: [
    {
      rank: 1,
      name: "Sarah Johnson",
      since: "Member since 2021",
      referrals: 12,
      revenue: 1460,
      avatar: "SJ",
      color: "#6366f1",
    },
    {
      rank: 2,
      name: "Mark Thompson",
      since: "Member since 2022",
      referrals: 9,
      revenue: 980,
      avatar: "MT",
      color: "#3b82f6",
    },
    {
      rank: 3,
      name: "Elena Rodriguez",
      since: "Member since 2023",
      referrals: 7,
      revenue: 720,
      avatar: "ER",
      color: "#ec4899",
    },
  ],
  rewardTiers: [
    {
      rank: "1st",
      label: "$25 credit",
      description: "After first successful referral",
      active: false,
    },
    {
      rank: "3rd",
      label: "$50 credit",
      description: "Milestone reward",
      active: false,
    },
    {
      rank: "5th",
      label: "Free service",
      description: "Special loyalty tier reward",
      active: true,
    },
    {
      rank: null,
      label: "Friend discount",
      description: "Applied to their first booking",
      active: false,
      badge: "10% OFF",
    },
  ],
};

export const fetchReferrals = (router) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await Api("get", "referrals/list", "", router);

    if (res?.success) {
      dispatch(setReferralsData(res.data));
    } else {
      console.warn("Referrals API error, using dummy data");
      dispatch(loadDummyData());
    }
  } catch (error) {
    console.error("Referrals API catch error:", error);
    dispatch(loadDummyData());
  } finally {
    dispatch(setLoading(false));
  }
};

const referralsSlice = createSlice({
  name: "referrals",
  initialState: {
    stats: null,
    referrals: [],
    topReferrers: [],
    rewardTiers: [],
    activeFilter: "All",
    loading: false,
    error: null,
    usingDummyData: false,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setReferralsData(state, action) {
      state.stats = action.payload.stats;
      state.referrals = action.payload.referrals;
      state.topReferrers = action.payload.topReferrers;
      state.rewardTiers = action.payload.rewardTiers;
      state.usingDummyData = false;
      state.error = null;
    },
    setFilter(state, action) {
      state.activeFilter = action.payload;
    },
    loadDummyData(state) {
      state.stats = DUMMY_DATA.stats;
      state.referrals = DUMMY_DATA.referrals;
      state.topReferrers = DUMMY_DATA.topReferrers;
      state.rewardTiers = DUMMY_DATA.rewardTiers;
      state.usingDummyData = true;
      state.error = "API failed – showing demo data";
    },
  },
});

export const { setFilter, loadDummyData, setLoading, setReferralsData } =
  referralsSlice.actions;
export default referralsSlice.reducer;
