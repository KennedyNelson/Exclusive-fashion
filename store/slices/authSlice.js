import { createSlice } from "@reduxjs/toolkit";
import {
  logInAnonymously,
  logOut,
  signInAnonymously,
} from "../../lib/firebase/auth";

import { getUserFromDb } from "../../lib/firebase/db";

const initialState = {
  user: null,
  authenticated: false,
  loadingUser: true,
  error: "",
  success: "",
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setuser: (state, action) => {
      (state.user = action.payload), (state.authenticated = true);
    },
    signout: (state) => {
      (state.user = null), (state.authenticated = false);
    },
    setloadinguser: (state, action) => {
      state.loadingUser = action.payload;
    },
    seterror: (state, action) => {
      state.error = action.payload;
    },
    setsuccess: (state, action) => {
      state.success = action.payload;
    },
  },
});

export const { setuser, signout, setloadinguser, seterror, setsuccess } =
  slice.actions;

export default slice.reducer;

// Async Actions
export const signInAnonymous = (items) => async (dispatch) => {
  try {
    let anonymousUserData = await logInAnonymously(items);
    anonymousUserData = {
      ...anonymousUserData,
      createdAt: new Date().toString(),
    };
    dispatch(setuser(anonymousUserData));
  } catch (error) {
    console.log(error.message);
    dispatch(seterror(error.message));
  }
};

export const signOut = () => async (dispatch) => {
  try {
    await logOut();
    dispatch(signout());
  } catch (error) {
    console.log(error.message);
    dispatch(seterror(error.message));
  }
};

// export const getUserById = (id) => async (dispatch) => {
//   try {
//     const user = await getUserFromDb(id);
//     console.log(user.exists);
//     if (user.exists) {
//       const userData = user.data();
//       dispatch(setuser(userData));
//     }
//   } catch (error) {
//     console.log(error.message);
//     dispatch(seterror(error.message));
//   }
// };
