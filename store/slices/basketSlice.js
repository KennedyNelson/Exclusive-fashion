import { createSlice } from "@reduxjs/toolkit";
import { getBasket, setBasket } from "../../lib/firebase/db";
import {
  addItemToBasket,
  removeItemFromBasket,
} from "../../lib/utility/BasketFunctions";

const initialState = {
  items: [],
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setbasket: (state, action) => {
      state.items = action.payload;
    },
    addToBasket: (state, action) => {
      state.items = addItemToBasket(state.items, action.payload);
    },
    removeFromBasket: (state, action) => {
      state.items = removeItemFromBasket(state.items, action.payload.id);
    },
  },
});

export const { setbasket, addToBasket, removeFromBasket } = basketSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.basket.items;
export const selectTotal = (state) =>
  state.basket.items.reduce((total, item) => total + item.price, 0);

export default basketSlice.reducer;

// Async Actions
export const setBasketItems = (id, items) => async () => {
  try {
    await setBasket(id, items);
  } catch (error) {
    console.log(error.message);
    // dispatch(setError(error.message));
  }
};

// export const getBasketItems = (id) => async (dispatch) => {
//   try {
//     const items = await getBasket(id, dispatch);
//     dispatch(setbasket(items));
//   } catch (error) {
//     console.log(error.message);
//     // dispatch(setError(error.message));
//   }
// };
