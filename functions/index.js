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

      // get new messages
      let {[Object.keys(snapshot.val()).pop()]: lastMessage} = snapshot.val();
      let lastMessageText = lastMessage;
      console.log(lastMessageText);

      admin
        .database()
        .ref('room-metadata/' + roomId)
        .get()
        .then(snapshot => {
          let room = snapshot.val();

          admin
            .database()
            .ref('room-metadata/' + roomId)
            .get()
            .then(snapshot => {
              let room = snapshot.val();

              const message = {
                notification: {
                  title: room.roomName,
                  body:
                    `${lastMessageText.userName}: ` +
                    (lastMessageText.imageURL.length > 0
                      ? 'image'
                      : lastMessageText.messageText),
                },
                android: {
                  priority: 'high',
                  notification: {
                    sound: 'default',
                    color: '#0066FF',
                  },
                },
                data: {
                  roomId,
                  createdByUserId: room.createdByUserId,
                  roomName: room.roomName,
                },
                apns: {
                  payload: {
                    aps: {
                      alert: {
                        body: 'New gossips',
                      },
                      sound: 'default',
                      badge: 1,
                    },
                  },
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

      // Get List new Array
      Object.keys(snapshot.val()).forEach(key => {
        listRoomIds.push(key);
      });

      admin
        .database()
        .ref('user-metadata')
        .on('value', snapshot => {
          let userMetadata = snapshot.val();
          listRoomIds.forEach(key => {
            listRoomAndTokens[key] = [];
          });

          // Loop Get Token from each user
          Object.keys(userMetadata).forEach(key => {
            if (!_.isEmpty(userMetadata[key].deviceId)) {
              console.log(userMetadata[key].deviceId);
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
                    `Subscribed for ${listRoomAndTokens[roomKey]} device(s) in topic [${roomKey}]`,
                    response,
                  );
                });
            }
          });
        });
    });

  // Unsubscribed when user logout or leave a room
  admin
    .database()
    .ref('user-metadata')
    .on('child_changed', snapshot => {
      let userChanged = snapshot.val();
      Object.keys(userChanged.rooms).forEach(roomKey => {
        if (!_.isEmpty(userChanged.deviceId)) {
          if (
            !_.isEmpty(userChanged.rooms) &&
            userChanged.rooms[roomKey].join === false
          ) {
            console.log(userChanged.rooms[roomKey]);
            admin
              .messaging()
              .unsubscribeFromTopic(userChanged.deviceId, roomKey)
              .then(response => {
                console.log(
                  `Unsubscribed for ${userChanged.deviceId} in topic [${roomKey}]`,
                  response,
                );
              });
          }
        }
      });
    });

  detechNewMessages();
}

getListTokenDevices();

app.listen(port, () => {
  console.log('Listening to port: ' + port);
});
