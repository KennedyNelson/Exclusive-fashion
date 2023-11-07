import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  categoryProducts: [],
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setproducts: (state, action) => {
      state.products = action.payload;
      state.categoryProducts = action.payload;
    },
    // addtoproducts: (state, action) => {
    //   state.items = addItemToCart(state.items, action.payload);
    // },
    // removefromproducts: (state, action) => {
    //   state.items = removeItemFromCart(state.items, action.payload.id);
    // },
    setcategoryproducts: (state, action) => {
      if (action.payload === "All") {
        state.categoryProducts = state.products;
      } else {
        state.categoryProducts = state.products.filter(
          (item) => item.category === action.payload
        );
      }
    },
  },
});

export const { setproducts, setcategoryproducts } = productsSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.products.items;
export const selectTotal = (state) =>
  state.products.items.reduce((total, item) => total + item.price, 0);

export default productsSlice.reducer;

// // Async Actions
// export const setProducts = (id, prodcuts) => async (dispatch) => {
//   try {
//     await setProductsInDb(id, prodcuts);
//     dispatch(setproducts(prodcuts));
//   } catch (error) {
//     console.log(error.message);
//     // dispatch(seterror(error.message));
//   }
// };

// export const getCartItems = (id) => async (dispatch) => {
//   try {
//     const items = await getCartFromDb(id, dispatch);
//     dispatch(setcartitems(items));
//   } catch (error) {
//     console.log(error.message);
//     // dispatch(seterror(error.message));
//   }
// };
