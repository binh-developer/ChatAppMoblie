import React, {useLayoutEffect, useState, useCallback} from 'react';
import {ActivityIndicator, View, Platform, Alert} from 'react-native';
import {
  Actions,
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';
import PopupMenu from '../../components/PopupMenu';
import styles from './styles';
import {sortAsc} from '../../utils/arrayUtil';
import {uppercaseFirstLetter} from '../../utils/stringUtil';
import {
  getUserProfile,
  getMessageRoomById,
  checkUnSeenToAllUsers,
  sendMessageToRoom,
  sendImageMessage,
} from '../../helpers/firebase';

const ChatScreen = ({navigation, route}) => {
  const [messages, setMessages] = useState([]);
  const {id, roomData} = route.params;
  const roomId = id;

  useLayoutEffect(() => {
    let mounted = true;

    navigation.setOptions({
      headerTitle: uppercaseFirstLetter(roomData.roomName),
      headerTitleStyle: {
        color: '#3385ff',
      },
      headerRight: () => (
        <PopupMenu
          menuText="Menu"
          menuStyle={{marginRight: 5}}
          textStyle={{color: 'gray'}}
          navigation={navigation}
          route={route}
          isIcon={true}
        />
      ),
    });

    const unsubscribe = getMessageRoomById(roomId).on('value', snapshot => {
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
            getUserProfile()?.uid +
            `/chat-rooms/${roomId}/` +
            uri.substring(uri.lastIndexOf('/') + 1);
          const uploadUri =
            Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

          Alert.alert('Sent Image', 'Confirm ?', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed', response),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => sendImageMessage(filename, uploadUri, roomId),
            },
          ]);
        }
      },
    );
  }

  // Send Message
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );

    sendMessageToRoom(roomId, {
      imageURL: '',
      messageText: messages[0].text,
    });

    // Check all user unread messages
    checkUnSeenToAllUsers(roomId);
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
      user={{_id: getUserProfile()?.uid}}
      placeholder="Aa"
      alwaysShowSend
      scrollToBottom
      renderBubble={renderBubble}
      renderLoading={() => (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6646ee" />
        </View>
      )}
      renderSend={renderSend}
      renderSystemMessage={renderSystemMessage}
      scrollToBottomComponent={() => (
        <View style={styles.bottomComponentContainer}>
          <Icon name="keyboard-arrow-down" size={30} color="#6646ee" />
        </View>
      )}
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
