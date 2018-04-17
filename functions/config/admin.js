

const admin = require("firebase-admin");

let credentialsObj;

credentialsObj = {
  credential: admin.credential.cert(require("./service_accounts/admin.json")),
  databaseURL: "https://panlavillita-dev.firebaseio.com",
  storageBucket: "panlavillita-dev.appspot.com",
}
admin.initializeApp(credentialsObj);

exports.db = admin.database();
exports.app = admin;