import { configureStore } from "@reduxjs/toolkit";

import auth from "./Slices/authSlice";
import user from "./Slices/userSlice";

const store = configureStore({
  reducer: {
    auth,
    user,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
