const express = require('express');
const {admin} = require('./firebase-config');

const app = express();
const port = 3000;
const db = admin.database();
let userMetadata;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

db.ref('user-metadata').on('value', function (snapshot) {
  userMetadata = snapshot.val();
  pushNotification();
});

function pushNotification() {
  if (userMetadata) {
    db.ref('room-messages').on(
      'child_changed',
      snapshot => {
        let roomId = snapshot.key;

        let {[Object.keys(snapshot.val()).pop()]: lastMessage} = snapshot.val();
        let lastMessageText = lastMessage.messageText;

        Object.keys(userMetadata).forEach(item => {
          if (
            userMetadata[item].deviceId !== undefined &&
            userMetadata[item].rooms[roomId] !== undefined
          ) {
            const registrationToken = userMetadata[item].deviceId;
            admin
              .messaging()
              .sendToDevice(
                [registrationToken], // device fcm tokens...
                {
                  notification: {
                    title: 'MeChat',
                    body: lastMessageText,
                    image:
                      'https://kb.rspca.org.au/wp-content/uploads/2018/11/golder-retriever-puppy.jpeg',
                    sound: 'default',
                  },
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
        });
      },
      errorObject => {
        console.log('The read failed: ' + errorObject.name);
      },
    );
  }
}
app.listen(port, () => {
  console.log('Listening to port: ' + port);
});
