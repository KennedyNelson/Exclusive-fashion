import { createSlice } from "@reduxjs/toolkit";
import {
  googleSignIn,
  emailRegister,
  emailSignIn,
  logOut,
  //   resetPassword,
  //   rememberMeEmailSignIn,
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
    setUser: (state, action) => {
      (state.user = action.payload), (state.authenticated = true);
    },
    signout: (state) => {
      (state.user = null), (state.authenticated = false);
    },
    setLoadingUser: (state, action) => {
      state.loadingUser = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
  },
});

export const { setUser, signout, setLoadingUser, setError, setSuccess } =
  slice.actions;

export default slice.reducer;

// Async Actions
export const getUserById = (id) => async (dispatch) => {
  try {
    const user = await getUserFromDb(id);
    console.log(user.exists);
    if (user.exists) {
      const userData = user.data();
      dispatch(setUser(userData));
    }
  } catch (error) {
    console.log(error.message);
    dispatch(setError(error.message));
  }
};

export const signinWithGoogle = () => async (dispatch) => {
  try {
    await googleSignIn(dispatch);
  } catch (error) {
    console.log(error.message);
    dispatch(setError(error.message));
  }
};

export const registerWithEmail = (values) => async (dispatch) => {
  try {
    await emailRegister(values, dispatch);
  } catch (error) {
    console.log(error.message);
    dispatch(setError(error.message));
  }
};

export const signinWithEmail = (email, password) => async (dispatch) => {
  try {
    await emailSignIn(email, password);
  } catch (error) {
    console.log(error.message);
    dispatch(setError(error.message));
  }
};

// export const rememberMeSignInWithEmail =
//   (email, password) => async (dispatch) => {
//     try {
//       await rememberMeEmailSignIn(email, password);
//     } catch (error) {
//       console.log(error.message);
//       dispatch(setError(error.message));
//     }
//   };

// export const sendResetPasswordMail = (email) => async (dispatch) => {
//   try {
//     await resetPassword(email);
//   } catch (error) {
//     console.log(error.message);
//     dispatch(setError(error.message));
//   }
// };

export const signOut = () => async (dispatch) => {
  try {
    await logOut();
    dispatch(signout());
  } catch (error) {
    console.log(error.message);
    dispatch(setError(error.message));
  }
};
