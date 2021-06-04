var admin = require('firebase-admin');

var serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://chat-app-203-default-rtdb.firebaseio.com',
});

module.exports.admin = admin;
