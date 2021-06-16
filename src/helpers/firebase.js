import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';

const ROOM_MESSAGES_COLLECTIONS = 'room-messages';
const ROOM_METADATA_COLLECTIONS = 'room-metadata';
const ROOM_USERS_COLLECTIONS = 'room-users';
const USER_METADATA_COLLECTIONS = 'user-metadata';
// USER
export function createUserAccount(email, password, username) {
  return auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Signed in
      var user = userCredential.user;
      user
        .updateProfile({
          displayName: username,
          photoURL:
            'https://lh4.googleusercontent.com/-v0soe-ievYE/AAAAAAAAAAI/AAAAAAACyas/yR1_yhwBcBA/photo.jpg?sz=150',
        })
        .then(function () {})
        .catch(function (error) {
          // An error happened.
        });
      // ...
    })
    .catch(error => {
      var errorMessage = error.message;
      alert(errorMessage);
      // ..
    });
}

export function logOut() {
  return auth().signOut();
}

export function getUserProfile() {
  return auth()?.currentUser;
}

export function updateAvatar(filename, uploadUri) {
  const task = storage().ref(filename).putFile(uploadUri);
  // set progress state
  task.on(
    'state_changed',
    snapshot => {},
    error => {
      console.log(error.message, 'Error From Upload');
    },
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      task.snapshot.ref.getDownloadURL().then(downloadURL => {
        auth()
          ?.currentUser.updateProfile({
            photoURL: downloadURL
              ? downloadURL
              : 'https://lh4.googleusercontent.com/-v0soe-ievYE/AAAAAAAAAAI/AAAAAAACyas/yR1_yhwBcBA/photo.jpg?sz=150',
          })
          .then(function () {})
          .catch(function (error) {
            // An error happened.
          });
      });
    },
  );
}

export function registerTokenDevice() {
  messaging()
    .getToken()
    .then(currentToken => {
      if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // Store device token
        database()
          .ref(USER_METADATA_COLLECTIONS)
          .child(auth()?.currentUser.uid)
          .child('deviceId')
          .set(currentToken);
      } else {
        // Show permission request UI
        console.log(
          'No registration token available. Request permission to generate one.',
        );
        // ...
      }
    })
    .catch(err => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });
}

export async function updateLeaveRoom() {
  var objectKey = [];
  // await database()
  //   .ref(USER_METADATA_COLLECTIONS)
  //   .child(auth()?.currentUser?.uid)
  //   .update({deviceId: ''});

  await database()
    .ref(USER_METADATA_COLLECTIONS)
    .child(auth()?.currentUser?.uid)
    .child('rooms')
    .once('value')
    .then(snapshot => {
      if (snapshot.val() !== null) {
        Object.keys(snapshot.val()).forEach(key => objectKey.push(key));
      }
    });

  if (objectKey !== []) {
    objectKey.forEach(key => {
      database()
        .ref(USER_METADATA_COLLECTIONS)
        .child(auth()?.currentUser?.uid)
        .child('rooms')
        .child(key)
        .update({join: false});
    });
  }
  return true;
}

export async function updateJoinRoom() {
  var objectKey = [];
  await database()
    .ref(USER_METADATA_COLLECTIONS)
    .child(auth()?.currentUser?.uid)
    .child('rooms')
    .once('value')
    .then(snapshot => {
      if (snapshot.val() !== null) {
        Object.keys(snapshot.val()).forEach(key => objectKey.push(key));
      }
    });

  if (objectKey !== []) {
    objectKey.forEach(key => {
      database()
        .ref(USER_METADATA_COLLECTIONS)
        .child(auth()?.currentUser?.uid)
        .child('rooms')
        .child(key)
        .update({join: true});
    });
  }
  return true;
}

// ROOM
export function createRoom(roomName) {
  return database().ref(ROOM_METADATA_COLLECTIONS).push({
    roomName,
    roomType: 'public',
    createdAt: database.ServerValue.TIMESTAMP,
    createdByUserId: auth()?.currentUser?.uid,
    lastMessageText: '',
    roomAvatar: '',
  });
}

export function getRoomMetadata() {
  return database().ref(ROOM_METADATA_COLLECTIONS);
}

export function getUserMetadata() {
  return database()
    .ref(USER_METADATA_COLLECTIONS)
    .child(auth()?.currentUser?.uid);
}

export function getRoomUser() {
  return database().ref(ROOM_USERS_COLLECTIONS);
}

export function signUserToRoom(roomId) {
  return database()
    .ref(
      USER_METADATA_COLLECTIONS +
        `/${auth()?.currentUser?.uid}/rooms/${roomId}`,
    )
    .set({
      join: true,
    });
}

export function unsignedUserToRoom(roomId) {
  return database()
    .ref(
      USER_METADATA_COLLECTIONS +
        `/${auth()?.currentUser?.uid}/rooms/${roomId}`,
    )
    .set({
      join: false,
    });
}

/**
 * Delete Room by roomId
 * @param {string} roomId
 * @param {string} userId
 */
export function deleteRoomById(roomId, userId) {
  if (auth()?.currentUser?.uid === userId) {
    database()
      .ref(ROOM_METADATA_COLLECTIONS + `/${roomId}`)
      .remove();

    database()
      .ref(ROOM_MESSAGES_COLLECTIONS + `/${roomId}`)
      .remove();

    database()
      .ref(ROOM_USERS_COLLECTIONS + `/${roomId}`)
      .remove();

    database()
      .ref(USER_METADATA_COLLECTIONS + `/${userId}/rooms/${roomId}`)
      .remove();
  }
}

/**
 * Get Message From specific Room by RoomId
 * @param {string} roomId
 * @returns
 */
export function getMessageRoomById(roomId) {
  return database()
    .ref(ROOM_MESSAGES_COLLECTIONS + `/${roomId}`)
    .limitToLast(40);
}

// MESSAGE
export function checkUnSeenToAllUsers(roomId) {
  return database()
    .ref(ROOM_USERS_COLLECTIONS + `/${roomId}`)
    .once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        for (const [key] of Object.entries(snapshot.val())) {
          if (key !== auth()?.currentUser?.uid) {
            database()
              .ref(ROOM_USERS_COLLECTIONS + `/${roomId}/${key}`)
              .update({readed: false});
          }
        }
      } else {
        console.log('No data available');
      }
    })
    .catch(error => {
      console.error(error);
    });
}

export function checkUserSeenMessage(roomId, userId) {
  return database()
    .ref(ROOM_USERS_COLLECTIONS)
    .child(roomId)
    .child(userId)
    .update({readed: true})
    .catch(error => {
      console.error(error);
    });
}

export async function sendMessageToRoom(roomId, message) {
  const timestamp = database.ServerValue.TIMESTAMP;

  await database()
    .ref(ROOM_METADATA_COLLECTIONS + `/${roomId}`)
    .update({
      lastMessage: {
        createdAt: timestamp,
        message: message.messageText.length > 0 ? message.messageText : 'image',
        userName: auth()?.currentUser?.displayName,
        userId: auth()?.currentUser?.uid,
      },
    });

  return database()
    .ref(ROOM_MESSAGES_COLLECTIONS + `/${roomId}`)
    .push({
      userId: auth()?.currentUser?.uid,
      userName: auth()?.currentUser?.displayName,
      createdAt: timestamp,
      ...message,
    });
}

export function sendImageMessage(filename, uploadUri, roomId) {
  const task = storage().ref(filename).putFile(uploadUri);
  // set progress state
  task.on(
    'state_changed',
    snapshot => {},
    error => {
      console.log(error.message, 'Error From Upload');
    },
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      task.snapshot.ref.getDownloadURL().then(downloadURL => {
        sendMessageToRoom(roomId, {
          imageURL: downloadURL,
          messageText: '',
        });

        checkUnSeenToAllUsers(roomId);
      });
    },
  );
}
