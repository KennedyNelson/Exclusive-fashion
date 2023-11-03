import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";

// The Global Store
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    userAuth: authReducer,
  },
});
