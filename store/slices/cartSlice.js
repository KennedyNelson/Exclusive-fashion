import { createSlice } from "@reduxjs/toolkit";
import { setCartInDb } from "../../lib/firebase/db";
import {
  addItemToCart,
  removeItemFromCart,
} from "../../lib/utility/CartFunctions";

const initialState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setcartitems: (state, action) => {
      state.items = action.payload;
    },
    addtocart: (state, action) => {
      state.items = addItemToCart(state.items, action.payload);
    },
    removefromcart: (state, action) => {
      state.items = removeItemFromCart(state.items, action.payload.id);
    },
  },
});

export const { setcartitems, addtocart, removefromcart } = cartSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.cart.items;
export const selectTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price, 0);

export default cartSlice.reducer;

// Async Actions
export const setCartItems = (id, items) => async (dispatch) => {
  try {
    await setCartInDb(id, items);
    dispatch(setcartitems(items));
  } catch (error) {
    console.log(error.message);
    // dispatch(seterror(error.message));
  }
};

// export const getCartItems = (id) => async (dispatch) => {
//   try {
//     const items = await getCartFromDb(id, dispatch);
//     dispatch(setcartitems(items));
//   } catch (error) {
//     console.log(error.message);
//     // dispatch(seterror(error.message));
//   }
// };
