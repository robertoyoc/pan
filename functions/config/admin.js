

const admin = require("firebase-admin");

let credentialsObj;

credentialsObj = {
  credential: admin.credential.cert(require("./service_accounts/admin.json")),
  databaseURL: "https://panlavillitamx.firebaseio.com",
  storageBucket: "panlavillitamx.appspot.com",
}
admin.initializeApp(credentialsObj);

exports.db = admin.database();
exports.app = admin;