import { initializeApp, getApps } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdJI8QYJGZnyYNOPrgfvFJcKDcrGYJm_Y",
  authDomain: "my-ecomm-app-bb8ea.firebaseapp.com",
  projectId: "my-ecomm-app-bb8ea",
  storageBucket: "my-ecomm-app-bb8ea.appspot.com",
  messagingSenderId: "318217330821",
  appId: "1:318217330821:web:9968f1113b7eacdbe289ec",
};

const firebaseApp = !getApps.length ? initializeApp(firebaseConfig) : getApps();

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

export default firebaseApp;
