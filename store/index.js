import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "./slices/basketSlice";
import authReducer from "./slices/authSlice";

// The Global Store
export const store = configureStore({
  reducer: {
    basket: basketReducer,
    userAuth: authReducer,
  },
});
