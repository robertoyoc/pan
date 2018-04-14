const functions = require('firebase-functions');

const admin = require('firebase-admin');
const config = functions.config();
const db = require('./config/admin').db;


// Users DB Triggers
exports.addUserToDatabase = functions.auth.user().onCreate(function(event) {
  const user = event.data;
  const accountRef = db.ref('/accounts').child(user.uid);

  // let accountObj = { _members: {} };

  // accountObj['_members'][user.uid] = true;
  return accountRef.update({
    perfil: 'cliente'
  });
});

exports.removeUserFromDatabase = functions.auth.user().onDelete(function(event) {
  console.log('removeUserFromDatabase');

  var uid = event.data.uid;
  return admin.database().ref("/accounts/" + uid).remove();
});
