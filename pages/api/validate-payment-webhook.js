const crypto = require("crypto");
import * as admin from "firebase-admin";
import { firebaseAdmin } from "../../lib/firebase/firebaseAdmin";
// Secure a connection to Firebase from the backend.
// authenticate the admin. this is backend stuff, the other firebase.js
// was for frontend work this could also be an import:

const storeOrderInDb = async (data) => {
  try {
    await firebaseAdmin
      .firestore()
      .collection("users")
      .doc(data.notes.userId)
      .collection("orders")
      .doc(data.order_id)
      .set(data);
    console.log(`SUCCESS: Order ${data.order_id} has been added to the DB`);

    const productIdsArray = JSON.parse(data.notes.productIds);
    console.log(JSON.parse(data.notes.productIds)[0]);

    let items = await Promise.all(
      productIdsArray.map(async (id) => {
        const item = await firebaseAdmin
          .firestore()
          .collection("products")
          .doc(id)
          .get();
        return item.data();
      })
    );
    console.log(items);
    // const doc = await firebaseAdmin
    //   .firestore()
    //   .collection("products")
    //   .doc(JSON.parse(data.notes.productIds)[0])
    //   .get();
    // console.log(doc.data());

    await firebaseAdmin
      .firestore()
      .collection("users")
      .doc(data.notes.userId)
      .collection("orders")
      .doc(data.order_id)
      .update({
        items: items,
      });
  } catch (err) {
    console.log(`Error while creating document in the DB: ${err.message}`);
  }
};

export default async (req, res) => {
  if (req.method === "POST") {
    const secret = "CtjIqAqBTWrqz7WVcJqNktjc";
    const shasum = crypto.createHmac("sha256", secret);

    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("request is legit");
      if (req.body.event === "payment.captured") {
        // Store the order in DB
        try {
          await storeOrderInDb(req.body.payload.payment.entity);
          res.status(200);
        } catch (err) {
          res.status(400).send(`Webhook Error: ${err.message}`);
        }
      }
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
};
