import { setUser, setLoadingUser } from "../../store/slices/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { signInAnonymously } from "firebase/auth";
import { auth } from ".";
import { getUserFromDb, setBasket, setUserInDb } from "./db";
import { Timestamp } from "firebase/firestore";
import nookies, { destroyCookie, parseCookies } from "nookies";
import { setbasket } from "../../store/slices/basketSlice";

export const logInAnonymously = async (items) => {
  const { user } = await signInAnonymously(auth);
  const anonymousUserData = {
    id: user.uid,
    isAnonymous: user.isAnonymous,
    displayName: user.displayName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    photoUrl: user.photoURL,
    createdAt: Timestamp.fromDate(new Date()),
    basketItems: items,
  };
  console.log("creating a new Anonymous User Document");
  await setUserInDb(user.uid, anonymousUserData);
  return anonymousUserData;
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
        const cookies = parseCookies();
        const items = cookies["anonymousUserFirstItems"];
        if (!items) {
          let userData = {
            id: user.uid,
            isAnonymous: user.isAnonymous,
            displayName: user.displayName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            photoUrl: user.photoURL,
            createdAt: Timestamp.fromDate(new Date()),
            basketItems: [],
          };
          console.log(userData);
          try {
            const doc = await getUserFromDb(user.uid);
            if (!doc.exists()) {
              console.log("creating a new user document!");
              await setUserInDb(user.uid, userData);
              userData = { ...userData, createdAt: new Date().toString() };
              dispatch(setUser(userData));
            } else {
              let userData = {
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate().toString(),
              };
              dispatch(setUser(userData));
              dispatch(setbasket(doc.data().basketItems));
            }
          } catch (err) {
            console.log(err);
          }
          destroyCookie(null, "anonymousUserFirstItems");
        }
      } else {
        nookies.set(undefined, "token", "", { path: "/" });
      }
      dispatch(setLoadingUser(false));
    });
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
