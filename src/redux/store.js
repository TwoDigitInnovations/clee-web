import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import bookingReducer from "./slices/bookingSlice";
import waitlistReducer from "./slices/waitlistSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    booking: bookingReducer,
    waitlist: waitlistReducer,
  },
});
