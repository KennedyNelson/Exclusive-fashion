import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import productsReducer from "./slices/productsSlice";

// The Global Store
export const store = configureStore({
  reducer: {
    userAuth: authReducer,
    products: productsReducer,
    cart: cartReducer,
  },
});
