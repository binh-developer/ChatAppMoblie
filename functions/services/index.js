const _ = require('lodash');
const winston = require('../config/winston');
const {admin} = require('./setup');

let listRoomIds = [];
let listRoomAndTokens = {};
let time = new Date().toLocaleString('en-US', {
  timeZone: 'Asia/SaiGon',
});

function detectNewMessages() {
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
          // Get Room Info
          admin
            .database()
            .ref('room-metadata/' + roomId)
            .get()
            .then(snapshot => {
              let room = snapshot.val();

              // Config Message
              const message = {
                topic: roomId,
                notification: {
                  title: room.roomName,
                  body:
                    `${lastMessageText.userName}: ` +
                    (lastMessageText.imageURL.length > 0
                      ? 'image'
                      : lastMessageText.messageText),
                },
                android: {
                  // Required for background/quit data-only messages on Android
                  priority: 'high',
                  notification: {
                    title: room.roomName,
                    body:
                      `${lastMessageText.userName}: ` +
                      (lastMessageText.imageURL.length > 0
                        ? 'image'
                        : lastMessageText.messageText),
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
              };

              // Send a message to devices subscribed to the provided topic.
              admin
                .messaging()
                .send(message)
                .then(response => {
                  // Response is a message ID string.
                  console.log('Successfully sent message:', response);
                  winston.info(time + ' Success sending: ' + response);
                })
                .catch(error => {
                  console.log('Error sending message:', error);
                  winston.info(time + ' Error sending: ' + error);
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

          Object.keys(listRoomAndTokens).forEach(roomKey => {
            if (!_.isEmpty(listRoomAndTokens[roomKey])) {
              admin
                .messaging()
                .subscribeToTopic(listRoomAndTokens[roomKey], roomKey)
                .then(response => {
                  winston.info(
                    `${time} Topic: [${roomKey}] Device(s) subscribed: [${listRoomAndTokens[roomKey]}]` +
                      '%o',
                    {...response},
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
                winston.info(
                  `${time} Topic: [${roomKey}] Device(s) unsubscribed: [${userChanged.deviceId}]` +
                    '%o',
                  {...response},
                );
              });
          }
        }
      });
    });

  detectNewMessages();
}

getListTokenDevices();
