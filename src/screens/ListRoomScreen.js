import React, {useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Avatar, Button} from 'react-native-elements';
import {formatDateFull} from '../utils/timeUtil';
import PopupMenu from '../components/PopupMenu';

import {
  getRoomMetadata,
  getUserMetadata,
  getRoomUser,
  getUserProfile,
  signUserToRoom,
  checkUserSeenMessage,
} from '../helpers/firebase';

export default function ListRoomScreen({navigation, route}) {
  const [roomMetadata, setRoomMetadata] = useState({});
  const [userJoinRoom, setUserJoinRoom] = useState({});
  const [roomUsers, setRoomUsers] = useState({});
  let userId = getUserProfile()?.uid;

  useLayoutEffect(() => {
    let loading = true;
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={getProfile}>
          <View
            style={{
              margin: 10,
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 50,
              justifyContent: 'center',
            }}>
            <Avatar
              rounded
              size="small"
              activeOpacity={0.7}
              source={{
                uri:
                  getUserProfile()?.photoURL.length > 0
                    ? getUserProfile()?.photoURL
                    : 'https://lh4.googleusercontent.com/-v0soe-ievYE/AAAAAAAAAAI/AAAAAAACyas/yR1_yhwBcBA/photo.jpg?sz=150',
              }}
            />
          </View>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <PopupMenu
          menuText="Menu"
          menuStyle={{marginRight: 2}}
          textStyle={{color: 'black'}}
          navigation={navigation}
          route={route}
          isIcon={true}
        />
      ),
    });

    const ListRoom = getRoomMetadata()
      .limitToLast(10)
      .on('value', snapshot => {
        if (snapshot !== undefined) {
          if (loading) {
            setRoomMetadata(snapshot.val());
          }
        }
      });

    const ListRoomUserJoined = getUserMetadata()
      .child('rooms')
      .on('value', snapshot => {
        if (snapshot !== undefined) {
          if (loading) {
            setUserJoinRoom(snapshot.val());
          }
        }
      });
    const UnreadRoom = getRoomUser()
      .limitToLast(10)
      .on('value', snapshot => {
        if (snapshot !== undefined) {
          if (loading) {
            setRoomUsers(snapshot.val());
          }
        }
      });

    return ListRoom, ListRoomUserJoined, UnreadRoom, () => (loading = false);
  }, []);

  const getProfile = () => {
    navigation.navigate('Profile');
  };

  const createRoom = () => {
    navigation.navigate('CreateRoom');
  };

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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 2,
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            margin: 5,
            fontSize: 15,
            color: '#3a82f6',
          }}>
          Room Available
        </Text>

        <Text
          style={{
            fontWeight: 'normal',
            color: '#1D4ED8',
            paddingLeft: 6,
            width: 20,
            height: 20,
            backgroundColor: '#DBEAFE',
            borderRadius: 10,
          }}>
          {Object.keys(roomMetadata).length}
        </Text>
      </View>

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
                getRoomMetadata().once('value', snapshot => {
                  if (snapshot !== undefined) {
                    setRoomMetadata(snapshot.val());
                  }
                });
              } else
                getRoomMetadata()
                  .orderByChild('roomName')
                  .equalTo(text)
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

        {/* Add New Room */}
        <View style={styles.createRoomView}>
          <Button
            icon={{
              name: 'add',
              size: 15,
              color: '#3a82f6',
            }}
            buttonStyle={{
              backgroundColor: '#DBEAFE',
              borderRadius: 30,
              width: 40,
              height: 40,
            }}
            onPress={createRoom}
          />
        </View>
      </View>
      {/* List Room */}
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
                    <Text
                      style={{
                        color: '#fff',
                        textAlign: 'center',
                        padding: 12,
                        width: 45,
                        height: 45,
                      }}>
                      {roomMetadata[item].roomName.charAt(0).toUpperCase()}
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: 'column',
                    paddingLeft: 10,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: '#3a82f6', fontSize: 16}}>
                      Room:{' '}
                      {roomMetadata[item].roomName.charAt(0).toUpperCase() +
                        roomMetadata[item].roomName.slice(1)}
                    </Text>
                    {/* Check unread */}
                    {!!roomUsers &&
                      !!userJoinRoom &&
                      Object.keys(roomUsers).includes(item) &&
                      userJoinRoom[item] !== null &&
                      Object.keys(roomUsers[item]).includes(userId) &&
                      Object.keys(roomUsers[item][userId]).includes('readed') &&
                      roomUsers[item][userId].readed === false && (
                        <View style={styles.dotView}></View>
                      )}
                  </View>
                  <View style={{flexDirection: 'column'}}>
                    {!!roomMetadata[item] &&
                      roomMetadata[item].lastMessage !== undefined &&
                      roomMetadata[item].lastMessage.message.length > 0 && (
                        <Text
                          style={{
                            color: 'gray',
                            fontWeight: 'bold',
                          }}>
                          {getUserProfile()?.uid ===
                          roomMetadata[item].lastMessage.userId
                            ? 'You: '
                            : roomMetadata[item].lastMessage.userName + ': '}

                          {roomMetadata[item].lastMessage.message}
                        </Text>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  formContent: {
    flexDirection: 'row',
    marginTop: 5,
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    margin: 10,
    marginTop: 0,
  },
  inputs: {
    height: 45,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  createRoomView: {
    marginRight: 10,
    marginTop: 2,
  },
  roomListView: {
    padding: 10,
    backgroundColor: '#F9FAFB',
  },
  roomBoxView: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#E5E7EB',
    flexDirection: 'column',
    borderRadius: 5,
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
});
