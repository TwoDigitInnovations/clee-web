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
import templateReducer from "./slices/templateSlice";
import AutomationRulesReducer from "./slices/AutomationRulesSlice";
import servicesReducer from "./slices/servicesSlice";
import vouchersReducer from "./slices/vouchersSlice";
import packagesReducer from "./slices/packagesSlice";
import ClosedDatesReducer from "./slices/closedDataSlice";

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
    template: templateReducer,
    automationRules: AutomationRulesReducer,
    services: servicesReducer,
    vouchers: vouchersReducer,
    packages: packagesReducer,
      closedDates: ClosedDatesReducer,
  },
});
