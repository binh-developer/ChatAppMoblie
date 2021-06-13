const express = require('express');
const _ = require('lodash');
const {admin} = require('./firebase-config');

const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

let listRoomIds = [];
let listRoomAndTokens = {};

function detechNewMessages() {
  admin
    .database()
    .ref('room-messages')
    .on('child_changed', snapshot => {
      let roomId = snapshot.key;
      // console.log(snapshot.val());
      // console.log(roomId);

      const message = {
        data: {},
        notification: {
          title: 'MeChat',
          body: 'new mess in ' + roomId,
        },
        topic: roomId,
      };

      // Send a message to devices subscribed to the provided topic.
      admin
        .messaging()
        .send(message)
        .then(response => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response);
        })
        .catch(error => {
          console.log('Error sending message:', error);
        });
    });
}

function getListTokenDevices() {
  admin
    .database()
    .ref('room-metadata')
    .on('value', snapshot => {
      // Clear old Array
      listRoomIds = [];
      // Clear topics
      if (listRoomAndTokens !== {}) {
        Object.keys(listRoomAndTokens).forEach(roomKey => {
          // console.log(roomKey);
          console.log(listRoomAndTokens[roomKey]);
          if (!_.isEmpty(listRoomAndTokens[roomKey])) {
            admin
              .messaging()
              .unsubscribeFromTopic(listRoomAndTokens[roomKey], roomKey)
              .then(response => {
                console.log(
                  `Unsubscribed for ${listRoomAndTokens[roomKey].length} in topic [${roomKey}]`,
                  response,
                );
              });
          }
        });
        listRoomAndTokens = {};
      }

      // Get List new Array
      Object.keys(snapshot.val()).forEach(key => {
        listRoomIds.push(key);
      });

      admin
        .database()
        .ref('user-metadata')
        .once('value', snapshot => {
          let userMetadata = snapshot.val();
          listRoomIds.forEach(key => {
            listRoomAndTokens[key] = [];
          });
          console.log(listRoomAndTokens);

          // Loop Get Token from each user
          Object.keys(userMetadata).forEach(key => {
            if (!_.isEmpty(userMetadata[key].deviceId)) {
              if (!_.isEmpty(userMetadata[key].rooms)) {
                Object.keys(userMetadata[key].rooms).forEach(roomKey => {
                  if (userMetadata[key].rooms[roomKey].join === true) {
                    // console.log(roomKey);
                    if (_.includes(listRoomIds, roomKey)) {
                      listRoomAndTokens[roomKey].push(
                        userMetadata[key].deviceId,
                      );
                    }
                  }
                });
              }
            }
          });

          console.log('-');

          Object.keys(listRoomAndTokens).forEach(roomKey => {
            if (!_.isEmpty(listRoomAndTokens[roomKey])) {
              admin
                .messaging()
                .subscribeToTopic(listRoomAndTokens[roomKey], roomKey)
                .then(response => {
                  console.log(
                    `Subscribed for ${listRoomAndTokens[roomKey].length} device(s) in topic [${roomKey}]`,
                    response,
                  );
                });
            }
          });
        });
    });

  detechNewMessages();
}

getListTokenDevices();

app.listen(port, () => {
  console.log('Listening to port: ' + port);
});
