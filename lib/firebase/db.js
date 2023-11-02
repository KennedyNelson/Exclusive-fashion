import { auth, db } from ".";
import { collection, getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { setbasket } from "../../store/slices/basketSlice";

// User DB calls
export const getUserFromDb = async (id) => {
  const docRef = doc(db, "users", id);
  const user = await getDoc(docRef);
  return user;
};

export const setUserInDb = async (id, userData) => {
  const usersCollection = collection(db, "users");
  await setDoc(doc(usersCollection, id), userData);
};

export const moveAnonymousUserData = async (
  sourceUserId,
  targetUserId,
  dispatch
) => {
  // get the anonymous user's data
  let docRef = doc(db, "users", sourceUserId);
  const sourceUser = await getDoc(docRef);

  // get the target user's data
  docRef = doc(db, "users", targetUserId);
  const targetUser = await getDoc(docRef);

  let newBasketItems = [
    ...sourceUser.data().basketItems,
    ...targetUser.data().basketItems,
  ];

  // Update Redux store with the old + new items
  dispatch(setbasket(newBasketItems));

  // update the target user with the anonymous user's data
  docRef = doc(db, "users", targetUserId);
  await updateDoc(docRef, {
    basketItems: newBasketItems,
  });
};

// Basket DB calls
export const setBasket = async (id, items) => {
  const docRef = doc(db, "users", id);
  await updateDoc(docRef, {
    basketItems: items,
  });
};

// export const getBasket = async (id) => {
//   const docRef = doc(db, "users", id);
//   const items = await getDoc(docRef);
//   return items?.data()?.basketItems;
//   // return items?.data()?.basketItems || [];
// };

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

// export const updateParticularResumeFromDb = async (
//   collection,
//   field,
//   value,
//   newUserId
// ) => {
//   await db
//     .collection(collection)
//     .where(field, "==", value)
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach(async (doc) => {
//         // doc.data() is never undefined for query doc snapshots
//         console.log(doc.id, " => ", doc.data());
//         await updateResumeInDb(doc.id, {
//           ...doc.data(),
//           userId: newUserId,
//         });
//       });
//     })
//     .catch((error) => {
//       console.log("Error getting documents: ", error);
//     });
// };
