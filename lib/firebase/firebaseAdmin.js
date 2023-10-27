import * as admin from "firebase-admin";

var serviceAccount = require("./firebasePermissions.json");

const firebaseAdmin = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

export { firebaseAdmin };
