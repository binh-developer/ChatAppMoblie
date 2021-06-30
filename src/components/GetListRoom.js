import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

import {formatDateFull} from '../utils/timeUtil';
import {uppercaseFirstLetter} from '../utils/stringUtil';

import {
  getUserProfile,
  checkUserSeenMessage,
  signUserToRoom,
  getRoomMetadata,
  getUserMetadata,
  getRoomUser,
} from '../helpers/firebase';

const GetListRoom = props => {
  const [roomMetadata, setRoomMetadata] = useState({});
  const [userJoinRoom, setUserJoinRoom] = useState({});
  const [roomUsers, setRoomUsers] = useState({});

  useEffect(() => {
    let mounted = true;

    const ListRoom = getRoomMetadata()
      .limitToLast(10)
      .on('value', snapshot => {
        if (snapshot !== undefined) {
          if (mounted) {
            setRoomMetadata(snapshot.val());
          }
        }
      });

    const ListRoomUserJoined = getUserMetadata()
      .child('rooms')
      .on('value', snapshot => {
        if (snapshot !== undefined) {
          if (mounted) {
            setUserJoinRoom(snapshot.val());
          }
        }
      });
    const UnreadRoom = getRoomUser()
      .limitToLast(10)
      .on('value', snapshot => {
        if (snapshot !== undefined) {
          if (mounted) {
            setRoomUsers(snapshot.val());
          }
        }
      });

    return ListRoom, ListRoomUserJoined, UnreadRoom, () => (mounted = false);
  }, []);

  const userId = getUserProfile()?.uid;
  const navigation = useNavigation();

  const enterRoom = (id, room) => {
    checkUserSeenMessage(id, userId);
    navigation.navigate('Chat', {
      id,
      roomData: room,
    });
  };

  const joinListRoom = roomId => {
    signUserToRoom(roomId);
  };

  return (
    <View style={styles.container}>
      {/* Search Room and Add Room */}
      <View style={styles.formContent}>
        <View style={styles.inputContainer}>
          <Icon
            style={{paddingLeft: 15}}
            name="search"
            size={20}
            color="#989898"
          />

          <TextInput
            placeholder="Search"
            placeholderTextColor="#989898"
            onChangeText={text => {
              if (text.length <= 0) {
                getRoomMetadata()
                  .limitToLast(10)
                  .once('value', snapshot => {
                    if (snapshot !== undefined) {
                      setRoomMetadata(snapshot.val());
                    }
                  });
              } else
                getRoomMetadata()
                  .orderByChild('roomName')
                  .equalTo(text.toLowerCase())
                  .once('value')
                  .then(snapshot => {
                    if (snapshot.exists()) {
                      setRoomMetadata(snapshot.val());
                    }
                  });
            }}
            style={styles.inputs}
          />
        </View>
      </View>

      {/* Total Room */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 2,
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            color: '#989898',
          }}>
          Room Available ({Object.keys(roomMetadata).length})
        </Text>
      </View>

      <FlatList
        style={styles.roomListView}
        enableEmptySections={true}
        data={Object.keys(roomMetadata)}
        extraData={Object.keys(roomMetadata)}
        keyExtractor={(item, index) => item}
        renderItem={({item}) => (
          <View style={styles.roomBoxView}>
            <TouchableOpacity
              onPress={() => {
                enterRoom(item, roomMetadata[item]);
                joinListRoom(item);
              }}>
              <View style={styles.roomAvatarView}>
                <View style={styles.roomAvatarContainer}>
                  {!!roomMetadata[item] &&
                  roomMetadata[item].roomAvatar.length > 0 ? (
                    <Avatar
                      rounded
                      size="medium"
                      activeOpacity={0.7}
                      source={{
                        uri:
                          roomMetadata[item].roomAvatar.length > 0
                            ? roomMetadata[item].roomAvatar
                            : 'https://lh4.googleusercontent.com/-v0soe-ievYE/AAAAAAAAAAI/AAAAAAACyas/yR1_yhwBcBA/photo.jpg?sz=150',
                      }}
                    />
                  ) : (
                    <Icon
                      style={{margin: 15}}
                      name="meeting-room"
                      size={20}
                      color="#fff"
                    />
                  )}
                </View>

                <View
                  style={{
                    flexDirection: 'column',
                    paddingLeft: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Text style={{color: '#3a82f6', fontSize: 16}}>
                      {uppercaseFirstLetter(roomMetadata[item].roomName)}
                    </Text>
                    {/* Check unread */}
                    {!!userJoinRoom &&
                      userJoinRoom[item] !== null &&
                      Object.keys(userJoinRoom).includes(item) &&
                      userJoinRoom[item].join === true &&
                      !!roomUsers &&
                      Object.keys(roomUsers).includes(item) &&
                      Object.keys(roomUsers[item]).includes(userId) &&
                      Object.keys(roomUsers[item][userId]).includes('readed') &&
                      roomUsers[item][userId].readed === false && (
                        <View style={styles.dotView}></View>
                      )}
                  </View>
                  <View style={{flexDirection: 'column'}}>
                    {(!!userJoinRoom &&
                      userJoinRoom[item] !== null &&
                      !Object.keys(userJoinRoom).includes(item)) ||
                    (Object.keys(userJoinRoom).includes(item) &&
                      userJoinRoom[item].join === false) ? (
                      <Text
                        style={{
                          color: '#ff7c4d',
                          fontSize: 14,
                          fontStyle: 'italic',
                          fontWeight: 'bold',
                        }}>
                        Join room
                      </Text>
                    ) : (
                      <View>
                        {!!roomMetadata[item] &&
                          roomMetadata[item].lastMessage !== undefined &&
                          roomMetadata[item].lastMessage !== '' &&
                          roomMetadata[item].lastMessage !== null &&
                          roomMetadata[item].lastMessage.message.length > 0 && (
                            <Text
                              style={{
                                color: 'gray',
                                fontWeight: 'bold',
                              }}>
                              {getUserProfile()?.uid ===
                              roomMetadata[item].lastMessage.userId
                                ? 'You: '
                                : roomMetadata[item].lastMessage.userName +
                                  ': '}

                              {roomMetadata[item].lastMessage.message}
                            </Text>
                          )}
                      </View>
                    )}

                    {roomMetadata[item].createdByUserId ===
                      getUserProfile()?.uid && (
                      <Text
                        style={{
                          color: 'gray',
                        }}>
                        Created at{' '}
                        {formatDateFull(roomMetadata[item].createdAt)}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default GetListRoom;

const styles = StyleSheet.create({
  roomListView: {
    backgroundColor: '#e8e8e8',
    margin: 10,
    borderRadius: 20,
  },
  roomBoxView: {
    padding: 5,
    flexDirection: 'column',
  },
  roomAvatarView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomAvatarContainer: {
    backgroundColor: '#68a0cf',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    margin: 5,
  },
  dotView: {
    marginTop: 8,
    marginHorizontal: 10,
    height: 10,
    width: 10,
    backgroundColor: '#ff7c4d',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  formContent: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  inputContainer: {
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    margin: 10,
    marginBottom: 0,
  },
  inputs: {
    height: 45,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  createRoomView: {
    margin: 16,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
