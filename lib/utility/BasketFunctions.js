import { debounce } from "lodash";
import { signInAnonymous } from "../../store/slices/authSlice";
import { setBasketItems } from "../../store/slices/basketSlice";
import { setCookie } from "nookies";
import { Timestamp } from "firebase/firestore";

export const useDebounce = debounce(async (user, items, dispatch) => {
  if (!user) {
    setCookie(null, "anonymousUserFirstItems", JSON.stringify(items));
    await dispatch(signInAnonymous(items));
  } else {
    await dispatch(setBasketItems(user.id, items));
  }
}, 1000);

export const addItemToBasket = (items, item) => {
  return [...items, item];
};

export const removeItemFromBasket = (items, id) => {
  const index = items.findIndex((basketItem) => basketItem.id === id);
  let newBasket = [...items];
  if (index >= 0) {
    // The items exist in the basket ... remove it
    newBasket.splice(index, 1);
    return newBasket;
  } else {
    console.warn(`Can't remove product (id: ${id}) as its not in the basket`);
  }
};
