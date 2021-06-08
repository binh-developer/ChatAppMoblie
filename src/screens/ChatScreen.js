import React, {useLayoutEffect, useState, useCallback} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import {
  Actions,
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

import {sortAsc} from '../utils/arrayUtil';

const ChatScreen = ({route, navigation}) => {
  const [messages, setMessages] = useState([]);
  const {id, roomData} = route.params;
  const roomId = id;

  useLayoutEffect(() => {
    let mounted = true;

    navigation.setOptions({
      headerTitle: roomData.roomName,
      headerTitleStyle: {
        color: '#3385ff',
      },
      headerRight: () => {
        if (auth()?.currentUser?.uid === roomData.createdByUserId) {
          return (
            <TouchableOpacity
              style={{margin: 10}}
              onPress={() => deleteRoom(roomData.createdByUserId)}>
              <Icon name="delete" size={20} color="red" />
            </TouchableOpacity>
          );
        }
      },
    });

    const deleteRoom = userId => {
      if (auth()?.currentUser?.uid === userId) {
        database()
          .ref('room-metadata' + `/${roomId}`)
          .remove();

        database()
          .ref('room-messages' + `/${roomId}`)
          .remove();

        database()
          .ref('room-users' + `/${roomId}`)
          .remove();

        database()
          .ref('user-metadata/' + userId + `/rooms/${roomId}`)
          .remove();
      }

      navigation.goBack();
    };

    const unsubscribe = database()
      .ref('room-messages/' + id)
      .limitToLast(40)
      .on('value', snapshot => {
        if (snapshot !== undefined) {
          let data = snapshot.val();
          if (mounted && data !== null) {
            let rawMessage = Object.keys(data).map((key, index) => ({
              _id: key,
              user: {
                _id: data[key].userId,
                name: data[key].userName,
              },
              text: data[key].messageText,
              createdAt: data[key].createdAt,
              image: data[key].imageURL,
            }));

            setMessages(sortAsc(rawMessage));
          }
        }
      });

    return unsubscribe, () => (mounted = false);
  }, []);

  function checkUnSeen() {
    database()
      .ref(`room-users/${id}`)
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          for (const [key] of Object.entries(snapshot.val())) {
            if (key !== auth()?.currentUser?.uid) {
              database().ref(`room-users/${id}/${key}`).update({readed: false});
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

  // Send Image
  function handlePickImage() {
    ImagePicker.launchImageLibrary(
      {
        maxWidth: 2000,
        maxHeight: 2000,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const uri = response.assets[0].uri;
          const filename =
            auth()?.currentUser.uid +
            '/' +
            uri.substring(uri.lastIndexOf('/') + 1);
          const uploadUri =
            Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

          Alert.alert('Sent Image', 'Confirm ?', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed', response),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => sendImg(filename, uploadUri)},
          ]);

          function sendImg(filename, uploadUri) {
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
                  database()
                    .ref('room-messages/' + id)
                    .push({
                      userId: auth()?.currentUser?.uid,
                      userName: auth()?.currentUser?.displayName,
                      imageURL: downloadURL,
                      createdAt: database.ServerValue.TIMESTAMP,
                      messageText: '',
                    });

                  checkUnSeen();
                });
              },
            );
          }
        }
      },
    );
  }

  // Send Message
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    database()
      .ref('room-messages/' + id)
      .push({
        userId: auth()?.currentUser?.uid,
        userName: auth()?.currentUser?.displayName,
        imageURL: '',
        createdAt: database.ServerValue.TIMESTAMP,
        messageText: messages[0].text,
      });

    // Check all user unread messages
    checkUnSeen();
  }, []);

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#E8E8E8',
          },
          left: {
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#DCDCDC',
          },
        }}
        textStyle={{
          right: {
            color: '#000',
          },
        }}
        timeTextStyle={{
          left: {color: '#A8A8A8'},
          right: {color: '#A8A8A8'},
        }}
        containerStyle={{
          right: {margin: 1},
          left: {margin: 1},
        }}
      />
    );
  }

  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6646ee" />
      </View>
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <Icon name="send" size={22} color="#3399ff" />
        </View>
      </Send>
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    );
  }

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <Icon name="keyboard-arrow-down" size={30} color="#6646ee" />
      </View>
    );
  }

  function renderActions(props) {
    return (
      <Actions
        {...props}
        options={{
          ['Send Image']: handlePickImage,
        }}
        icon={() => <Icon name={'attachment'} size={24} color="#3399ff" />}
      />
    );
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{_id: auth()?.currentUser?.uid}}
      placeholder="Aa"
      alwaysShowSend
      scrollToBottom
      renderBubble={renderBubble}
      renderLoading={renderLoading}
      renderSend={renderSend}
      renderSystemMessage={renderSystemMessage}
      scrollToBottomComponent={scrollToBottomComponent}
      renderSystemMessage={renderSystemMessage}
      renderActions={renderActions}
      listViewProps={{
        style: {
          backgroundColor: '#F5F5F5',
        },
      }}
    />
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendingContainer: {
    padding: 4,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    width: 30,
    height: 30,
    margin: 8,
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
