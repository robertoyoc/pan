const admin = require("firebase-admin");

//change this to deploy to development
let production = true



let credentialsObj;

if (production) {
	credentialsObj = {
		credential: admin.credential.cert(require("./service_accounts/admin.json")),
		databaseURL: "https://panlavillitamx.firebaseio.com",
		storageBucket: "panlavillitamx.appspot.com",
	}

} else {
	credentialsObj = {
		credential: admin.credential.cert(require("./service_accounts/admin-dev.json")),
		databaseURL: "https://panlavillita-dev.firebaseio.com",
		storageBucket: "panlavillita-dev.appspot.com",
	}

}




admin.initializeApp(credentialsObj);

exports.db = admin.database();
exports.app = admin;
