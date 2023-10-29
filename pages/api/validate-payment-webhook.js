const crypto = require("crypto");
import * as admin from "firebase-admin";
import { firebaseAdmin } from "../../lib/firebase/firebaseAdmin";
// Secure a connection to Firebase from the backend.
// authenticate the admin. this is backend stuff, the other firebase.js
// was for frontend work this could also be an import:

const fulfillOrder = async (data) => {
  return firebaseAdmin
    .firestore()
    .collection("users")
    .doc(data.notes.userId)
    .collection("orders")
    .doc(data.order_id)
    .set(data)
    .then(() => {
      console.log(`SUCCESS: Order ${data.order_id} has been added to the DB`);
      res.status(200);
    })
    .catch((err) =>
      res
        .status(400)
        .send(`Error while creating document in the DB: ${err.message}`)
    );
};

export default async (req, res) => {
  if (req.method === "POST") {
    const secret = "CtjIqAqBTWrqz7WVcJqNktjc";
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("request is legit");
      console.log(req.body.payload.payment.entity);
      if (req.body.event === "payment.captured") {
        // Fulfill the order...
        return fulfillOrder(req.body.payload.payment.entity)
          .then(() => res.status(200))
          .catch((err) =>
            res.status(400).send(`Webhook Error: ${err.message}`)
          );
      }
    }
    res.json({ status: "ok" });
  }
};
