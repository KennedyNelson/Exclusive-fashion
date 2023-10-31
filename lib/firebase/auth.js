import { setUser, setLoadingUser } from "../../store/slices/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { signInAnonymously } from "firebase/auth";
import { auth } from ".";
import { getUserFromDb, setUserInDb } from "./db";
import { Timestamp } from "firebase/firestore";
import nookies from "nookies";

export const logInAnonymously = async () => {
  const result = await signInAnonymously(auth);
  return result;
};

export const logOut = async () => {
  await auth.signOut();
};

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
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
