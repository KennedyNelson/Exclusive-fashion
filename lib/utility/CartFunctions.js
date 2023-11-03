import { debounce } from "lodash";
import { signInAnonymous } from "../../store/slices/authSlice";
import { setCartItems } from "../../store/slices/cartSlice";
import { setCookie } from "nookies";
import { Timestamp } from "firebase/firestore";

export const useDebounce = debounce(async (user, items, dispatch) => {
  if (!user) {
    setCookie(null, "anonymousUserFirstItems", JSON.stringify(items));
    await dispatch(signInAnonymous(items));
  } else {
    await dispatch(setCartItems(user.id, items));
  }
}, 1000);

export const addItemToCart = (items, item) => {
  return [...items, item];
};

export const removeItemFromCart = (items, id) => {
  const index = items.findIndex((cartItem) => cartItem.id === id);
  let newCart = [...items];
  if (index >= 0) {
    // The items exist in the cart ... remove it
    newCart.splice(index, 1);
    return newCart;
  } else {
    console.warn(`Can't remove product (id: ${id}) as its not in the cart`);
  }
};
