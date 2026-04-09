import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import bookingReducer from "./slices/bookingSlice";
import waitlistReducer from "./slices/waitlistSlice";
import staffReducer from "./slices/staffSlice";
import calendarSettingsReducer from "./slices/calendarSettingsSlice";
import supplierReducer from "./slices/supplierSlice";
import stockOrderReducer from "./slices/stockOrderSlice";
import notificationReducer from "./slices/notificationSlice";
import productReducer from "./slices/productSlice";
import serviceReducer from "./slices/serviceSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    booking: bookingReducer,
    waitlist: waitlistReducer,
    staff: staffReducer,
    calendarSettings: calendarSettingsReducer,
    supplier: supplierReducer,
    stockOrder: stockOrderReducer,
    notification: notificationReducer,
    product: productReducer,
    service: serviceReducer,
  },
});
