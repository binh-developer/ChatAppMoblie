import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';

const ROOM_MESSAGES_COLLECTIONS = 'room-messages';
const ROOM_METADATA_COLLECTIONS = 'room-metadata';
const ROOM_USERS_COLLECTIONS = 'room-users';
const USER_METADATA_COLLECTIONS = 'user-metadata';
const TIMELINE_COLLECTIONS = 'timeline';
const REMINDER_COLLECTIONS = 'reminder';

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

export async function logOut() {
  await database()
    .ref(USER_METADATA_COLLECTIONS)
    .child(auth().currentUser.uid)
    .update({isSignedIn: false});
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

// ROOM
export async function createRoom(roomName) {
  const timestamp = database.ServerValue.TIMESTAMP;

  await database()
    .ref(ROOM_METADATA_COLLECTIONS)
    .push({
      roomName,
      createdAt: timestamp,
      createdByUserId: auth()?.currentUser?.uid,
      lastMessage: {
        createdAt: timestamp,
      },
      roomAvatar: '',
    })
    .then(data => {
      let m = /\/room-metadata\/(.*)/g.exec(data)[1];
      signUserToRoom(m);
    });

  return;
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

export async function unsignedUserToRoom(roomId) {
  await database()
    .ref(ROOM_USERS_COLLECTIONS)
    .child(roomId)
    .child(auth()?.currentUser?.uid)
    .remove();

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

    // Delete storage of Room Id which store file
    const storageRef = storage().ref('chat-rooms/' + roomId);
    storageRef.listAll().then(listResults => {
      const promises = listResults.items.map(item => {
        return item.delete();
      });
      Promise.all(promises);
    });
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

export function createTimeline(data) {
  return database().ref(TIMELINE_COLLECTIONS).push({
    userId: auth()?.currentUser?.uid,
    userName: auth()?.currentUser?.displayName,
    createdAt: database.ServerValue.TIMESTAMP,
    status: data.status,
    imageURL: data.imageURL,
  });
}

export function getTimeline() {
  return database().ref(TIMELINE_COLLECTIONS);
}

export async function deleteStatus(status) {
  const regex = new RegExp(
    `\\/timeline%2F${getUserProfile()?.uid}%2F(.*)\\?`,
    '',
  );
  const str = status.imageURL;

  if (str.length > 0) {
    let m = regex.exec(str)[1];
    await storage().ref(`timeline/${getUserProfile()?.uid}/${m}`).delete();
  }

  return database().ref(TIMELINE_COLLECTIONS).child(status._id).remove();
}

export async function likeAndUnlikeStatus(statusId) {
  const status = await database()
    .ref(TIMELINE_COLLECTIONS)
    .child(statusId)
    .child('likes')
    .orderByChild('userId')
    .equalTo(getUserProfile()?.uid)
    .once('value', snapshot => {
      // If user have not liked yet
      if (snapshot.val() === null) {
        return database()
          .ref(TIMELINE_COLLECTIONS)
          .child(statusId)
          .child('likes')
          .push({userId: auth()?.currentUser?.uid});
      }
      // If user liked, unlike
      else {
        return database()
          .ref(TIMELINE_COLLECTIONS)
          .child(statusId)
          .child('likes')
          .child(Object.keys(snapshot.val())[0])
          .remove();
      }
    });
  return status;
}

export async function updateImageTimeline(filename, uploadUri) {
  const task = await storage().ref(filename).putFile(uploadUri);
  if (task !== undefined) {
    let url = await storage().ref(filename).getDownloadURL();
    return url;
  }
}

export async function createReminder(data) {
  return database().ref(REMINDER_COLLECTIONS).push({
    userId: auth()?.currentUser?.uid,
    title: data.title,
    roomId: data.roomId,
    roomName: data.roomName,
    reminderTime: data.reminderTime,
    createdAt: database.ServerValue.TIMESTAMP,
  });
}

export function getReminders() {
  return database().ref(REMINDER_COLLECTIONS);
}

export function updateReminder(id, data) {
  return database().ref(REMINDER_COLLECTIONS).child(id).update({
    reminderTime: data.reminderTime,
    title: data.title,
  });
}

export function deleteReminder(id) {
  return database().ref(REMINDER_COLLECTIONS).child(id).remove();
}
