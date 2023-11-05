import React from "react";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase";
import shortid from "shortid";

function pushdatatodb() {
  const pushData = async () => {
    const batch = writeBatch(db);
    const products = await fetch("https://fakestoreapi.com/products").then(
      (res) => res.json()
    );
    products.forEach((product) => {
      const docRef = doc(db, "products", product.title.substring(0, 2));
      batch.set(docRef, product);
    });
    await batch.commit();
  };
  return (
    <button onClick={pushData} className=" button">
      Add to Cart
    </button>
  );
}

export default pushdatatodb;
