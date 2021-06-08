const express = require('express');
const {admin} = require('./firebase-config');

const app = express();
const port = 3000;
const db = admin.database();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

function pushNotification() {
  db.ref('room-messages').on(
    'child_changed',
    snapshot => {
      let roomId = snapshot.key;

      let {[Object.keys(snapshot.val()).pop()]: lastMessage} = snapshot.val();
      let lastMessageText = lastMessage;
      console.log(lastMessageText);

      db.ref('user-metadata').once('value', function (snapshot) {
        let userMetadata = snapshot.val();
        Object.keys(userMetadata).forEach(item => {
          if (
            userMetadata[item].deviceId !== undefined &&
            userMetadata[item].rooms[roomId] !== undefined
          ) {
            const registrationToken = userMetadata[item].deviceId;
            console.log(registrationToken);
            if (registrationToken.length > 0) {
              admin
                .messaging()
                .sendToDevice(
                  [registrationToken], // device fcm tokens...
                  {
                    notification: {
                      title: 'MeChat',
                      body:
                        lastMessageText.userName +
                        ': ' +
                        lastMessageText.messageText +
                        lastMessageText.imageURL,
                      sound: 'default',
                    },
                    data: {},
                  },
                  {
                    // Required for background/quit data-only messages on iOS
                    contentAvailable: true,
                    // Required for background/quit data-only messages on Android
                    priority: 'high',
                  },
                )
                .then(response => {
                  console.log('Notification sent successfully');
                })
                .catch(error => {
                  console.log(error);
                });
            }
          }
        });
      });
    },
    errorObject => {
      console.log('The read failed: ' + errorObject.name);
    },
  );
  return;
}

pushNotification();

app.listen(port, () => {
  console.log('Listening to port: ' + port);
});
