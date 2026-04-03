import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import bookingReducer from "./slices/bookingSlice";
import waitlistReducer from "./slices/waitlistSlice";
import staffReducer from "./slices/staffSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    booking: bookingReducer,
    waitlist: waitlistReducer,
    staff: staffReducer,
  },
});
