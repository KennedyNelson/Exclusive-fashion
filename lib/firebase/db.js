import { auth, db } from ".";
import {
  collection,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { setcartitems } from "../../store/slices/cartSlice";

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

export const updateUserInDb = async (user) => {
  const docRef = doc(db, "users", user.uid);
  await updateDoc(docRef, {
    phoneNumber: user.phoneNumber,
    isAnonymous: false,
  });
};

export const deleteUserFromDb = async (userId) => {
  await deleteDoc(doc(db, "users", userId));
};

export const moveAnonymousUserDataInDb = async (
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

  let newCartItems = [
    ...sourceUser.data().cartItems,
    ...targetUser.data().cartItems,
  ];

  // Update Redux store with the old + new items
  dispatch(setcartitems(newCartItems));

  // update the target user with the anonymous user's data
  docRef = doc(db, "users", targetUserId);
  await updateDoc(docRef, {
    cartItems: newCartItems,
  });
};

export const addUserAddressInDb = async (userId, address) => {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    address,
  });
};

// Cart DB calls
export const setCartInDb = async (id, items) => {
  const docRef = doc(db, "users", id);
  await updateDoc(docRef, {
    cartItems: items,
  });
};

//  Products DB calls
export const addProductInDb = async (product) => {
  await addDoc(collection(db, "products"), product);
};

export const getProductFromDb = async (id) => {
  const docRef = doc(db, "prodcuts", id);
  const product = await getDoc(docRef);
  return product;
};

// export const getCartFromDb = async (id) => {
//   const docRef = doc(db, "users", id);
//   const items = await getDoc(docRef);
//   return items?.data()?.cartItems;
//   // return items?.data()?.cartItems || [];
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
