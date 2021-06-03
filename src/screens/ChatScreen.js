import moment from 'moment';
import React, {useLayoutEffect, useState, useCallback} from 'react';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
} from 'react-native-gifted-chat';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const ChatScreen = ({route, navigation}) => {
  const [messages, setMessages] = useState([]);

  const {id, roomData} = route.params;

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

    const deleteRoom = roomId => {
      if (auth()?.currentUser?.uid === roomId) {
        database()
          .ref('room-metadata' + `/${id}`)
          .remove();

        database()
          .ref('room-messages' + `/${id}`)
          .remove();
      }

      navigation.goBack();
    };

    const unsubscribe = database()
      .ref('room-messages/' + id)
      .limitToLast(100)
      .on('value', snapshot => {
        if (snapshot !== undefined) {
          let data = snapshot.val();

          if (mounted && data !== null) {
            setMessages(
              Object.keys(data).map((key, index) => ({
                _id: key,
                user: {
                  _id: data[key].userId,
                  name: data[key].userName,
                },
                text: data[key].messageText,
                createdAt: moment(data[key].createdAt).format('LLLL'),
                image: data[key].imageURL,
              })),
            );
          }
        }
      });
    return unsubscribe, () => (mounted = false);
  }, []);

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
