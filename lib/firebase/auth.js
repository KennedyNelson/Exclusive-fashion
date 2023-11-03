import { setuser, setloadinguser } from "../../store/slices/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { signInAnonymously } from "firebase/auth";
import { auth } from ".";
import { getUserFromDb, setCartInDb, setUserInDb } from "./db";
import { Timestamp } from "firebase/firestore";
import nookies, { destroyCookie, parseCookies } from "nookies";
import { setcartitems } from "../../store/slices/cartSlice";

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
    cartItems: items,
  };
  console.log(`creating an anonymous user document for ${user.uid}! `);
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
      dispatch(setloadinguser(true));
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
            cartItems: [],
          };
          console.log(userData);
          try {
            const doc = await getUserFromDb(user.uid);
            if (!doc.exists()) {
              console.log(`creating a new user document for ${user.uid}! `);
              await setUserInDb(user.uid, userData);
              userData = { ...userData, createdAt: new Date().toString() };
              dispatch(setuser(userData));
            } else {
              let userData = {
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate().toString(),
              };
              dispatch(setuser(userData));
              dispatch(setcartitems(doc.data().cartItems));
            }
          } catch (err) {
            console.log(err);
          }
          destroyCookie(null, "anonymousUserFirstItems");
        } else {
          destroyCookie(null, "anonymousUserFirstItems");
        }
      } else {
        nookies.set(undefined, "token", "", { path: "/" });
      }
      dispatch(setloadinguser(false));
    });
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
