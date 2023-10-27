import { db } from ".";
import firebase from ".";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { collection, getDocs, getDoc, doc, setDoc } from "firebase/firestore";

export const getUserFromDb = async (id) => {
  const docRef = doc(db, "users", id);
  const user = await getDoc(docRef);
  return user;
};

export const setUserInDb = async (id, userData) => {
  const usersCollection = collection(db, "users");
  await setDoc(doc(usersCollection, id), userData);
};

// export const addUserResumeIdInDb = async (id, rid) => {
//     await db
//         .collection('users')
//         .doc(id)
//         .update({
//             resumes: firebase.firestore.FieldValue.arrayUnion(rid),
//         });
// };

// export const removeUserResumeIdFromDb = async (id, rid) => {
//     await db
//         .collection('users')
//         .doc(id)
//         .update({
//             resumes: firebase.firestore.FieldValue.arrayRemove(rid),
//         });
// };

// export const getResumesFromDb = async (rids, dispatch) => {
//     rids.forEach(async (rid) => {
//         try {
//             const doc = await db.collection('resumes').doc(rid).get();
//             const resumeId = doc.id;
//             dispatch(addresume({ rid: rid, data: { resumeId, ...doc.data() } }));

//             // resumes.push({ resumeId: doc.id, data: doc.data() });
//         } catch (error) {
//             console.log(error.message);
//         }
//     });
//     // return resumes;
// };

// export const getResumesFromDb = async (id) => {
//     const resume = await db.collection("resumes").doc(id).get();
//     return resume;
// };

// export const getResumeFromDb = async (id) => {
//     const resume = await db.collection('resumes').doc(id).get();
//     return resume;
// };

export const updateParticularResumeFromDb = async (
  collection,
  field,
  value,
  newUserId
) => {
  await db
    .collection(collection)
    .where(field, "==", value)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        await updateResumeInDb(doc.id, {
          ...doc.data(),
          userId: newUserId,
        });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
};

export const convertTofirestoreDate = (date) =>
  firebase.firestore.Timestamp.fromDate(date);
export const convertFromfirestoreDate = (date) => date.toDate();

export const firebaseTimestamp = () =>
  firebase.firestore.FieldValue.serverTimestamp();

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, authenticated } = useSelector((state) => state.userAuth);

  // useEffect(() => {
  //     dispatch(setLoadingResumes(true));
  //     if (authenticated && user && !user.isAnonymous) {
  //         const unsubscribe = db.collection('resumes').onSnapshot(async (snapshot) => {
  //             const resumes = [];
  //             await snapshot.forEach((doc) => {
  //                 if (doc.data().userId === user.id) {
  //                     resumes.push({ resumeId: doc.id, data: doc.data() });
  //                 }
  //             });
  //             dispatch(setresumes(resumes));
  //             dispatch(setLoadingResumes(false));
  //         });
  //         return () => {
  //             unsubscribe();
  //         };
  //     } else {
  //         //router.push("/signup");
  //     }

  //     // }
  // }, [authenticated]);

  return (
    <>
      {/* {loading && <p>Loading...</p>} */}
      {/* {authenticated && user && !user.isAnonymous && children} */}
      {children}
      {/* {!loading && authenticated === false && router.pathname === "/signup" && router.pathname === "/signup" && children} */}
    </>
  );
};

export default PrivateRoute;
