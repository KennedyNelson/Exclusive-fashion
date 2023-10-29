import { setUser, setLoadingUser } from "../../store/slices/authSlice";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import firebase, { auth, db } from ".";
import { getUserFromDb, setUserInDb } from "./db";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Timestamp, doc, updateDoc } from "firebase/firestore";

import nookies from "nookies";

//Todo What if User Directly Singups? We are not doing setUserInDB?

export const googleSignIn = async (dispatch) => {
  const googleProvider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, googleProvider);
  return result;
};

// const userData = {
//   id: user.uid,
//   isAnonymous: user.isAnonymous,
//   displayName: values.userName,
//   email: user.email,
//   emailVerified: user.emailVerified,
//   phoneNumber: user.phoneNumber,
//   photoUrl: user.photoURL,
//   createdAt: Timestamp.fromDate(new Date()),
// };

export const emailRegister = async (values, dispatch) => {
  const { user } = await createUserWithEmailAndPassword(
    auth,
    values.email,
    values.password
  );
  await updateProfile(user, {
    displayName: values.userName,
  });

  setTimeout(async () => {
    const userData = {
      id: user.uid,
      isAnonymous: user.isAnonymous,
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      photoUrl: user.photoURL,
      emailVerified: user.emailVerified,
      createdAt: Timestamp.fromDate(new Date()),
    };

    dispatch(setUser(userData));
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, {
      displayName: values.userName,
    });
  }, 1500);
};

export const emailSignIn = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const logOut = async () => {
  await auth.signOut();
};

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, authenticated, loadingUser } = useSelector(
    (state) => state.userAuth
  );

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      // console.log(user);
      dispatch(setLoadingUser(true));
      if (user) {
        const token = await user.getIdToken();
        nookies.set(undefined, "token", token, { path: "/" });

        let userData = {
          id: user.uid,
          isAnonymous: user.isAnonymous,
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoUrl: user.photoURL,
          emailVerified: user.emailVerified,
          createdAt: Timestamp.fromDate(new Date()),
        };
        console.log(userData);
        try {
          const doc = await getUserFromDb(user.uid);
          if (!doc.exists()) {
            console.log("creating a new user document!");
            await setUserInDb(user.uid, userData);
            userData = { ...userData, createdAt: new Date() };
            dispatch(setUser(userData));
          } else {
            let userData = {
              ...doc.data(),
              createdAt: doc.data().createdAt.toDate(),
            };
            dispatch(setUser(userData));
          }
          dispatch(setLoadingUser(false));
        } catch (err) {
          console.log(err);
        }
      } else {
        nookies.set(undefined, "token", "", { path: "/" });
        dispatch(setLoadingUser(false));
      }
    });
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;

export const resetPassword = async (email) => {
  await auth.sendPasswordResetEmail(email);
};

export const rememberMeEmailSignIn = async (email, password) => {
  await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
    return auth.signInWithEmailAndPassword(email, password);
  });
};
