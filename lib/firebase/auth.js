import { setUser, setLoadingUser } from "../../store/slices/authSlice";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import firebase, { auth } from ".";
import { getUserFromDb, setUserInDb } from "./db";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
//   createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//   resumes: [],
// };

export const facebookSignIn = async (anonymousStatus, dispatch) => {
  const result = await auth.signInWithPopup(
    new firebase.auth.FacebookAuthProvider()
  );
  return result;
};

export const emailRegister = async (values, anonymousStatus, dispatch) => {
  const { user } = await auth.createUserWithEmailAndPassword(
    values.userEmail,
    values.password
  );
  await user.updateProfile({
    displayName: values.userName,
  });
};

export const emailSignIn = async (email, password) => {
  await auth.signInWithEmailAndPassword(email, password);
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
      console.log(user);
      // alert(user);
      dispatch(setLoadingUser(true));
      if (user) {
        const userData = {
          id: user.uid,
          isAnonymous: user.isAnonymous,
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoUrl: user.photoURL,
          emailVerified: user.emailVerified,
          // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        try {
          const doc = await getUserFromDb(user.uid);
          if (!doc.exists()) {
            console.log("creating a new user document!");
            await setUserInDb(user.uid, userData);
            dispatch(setUser(userData));
            // router.push('/experience');
          } else {
            dispatch(setUser(doc.data()));
            // router.push('/dashboard');
          }

          dispatch(setLoadingUser(false));
        } catch (err) {
          console.log(err);
        }
        // await dispatch(getUserById(user.uid));
      } else {
        dispatch(setLoadingUser(false));

        // router.push('/login');
      }
    });
  }, []);

  return (
    <>
      {/* {loading && <p>Loading...</p>} */}
      {children}
      {/* {!loading && authenticated === false && router.pathname === "/signup" && router.pathname === "/signup" && children} */}
    </>
  );
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
