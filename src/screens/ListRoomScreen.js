import React, {useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import {Avatar, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
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
            }}>
            <Avatar
              rounded
              size="small"
              source={{
                uri: getUserProfile()?.photoURL
                  ? getUserProfile()?.photoURL
                  : 'https://lh4.googleusercontent.com/-v0soe-ievYE/AAAAAAAAAAI/AAAAAAACyas/yR1_yhwBcBA/photo.jpg?sz=150',
              }}
            />
            <Text style={{margin: 5}}>{getUserProfile()?.displayName}</Text>
          </View>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <PopupMenu
          menutext="Menu"
          menustyle={{marginRight: 5}}
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
        <Text style={styles.rooms}>Room Available</Text>
        <Text
          style={{
            fontWeight: 'normal',
            color: '#1D4ED8',
            padding: 2,
            backgroundColor: '#DBEAFE',
            borderRadius: 4,
          }}>
          {Object.keys(roomMetadata).length}
        </Text>
      </View>

      {/* Search Room and Add Room */}
      <View style={styles.formContent}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Aa"
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
        <View style={styles.saveButton}>
          <Button
            icon={{
              name: 'add',
              size: 15,
              color: '#3a82f6',
            }}
            buttonStyle={{
              backgroundColor: '#DBEAFE',
              borderRadius: 10,
              width: 40,
              height: 40,
            }}
            onPress={createRoom}
          />
        </View>
      </View>
      {/* List Room */}
      <FlatList
        style={styles.roomList}
        enableEmptySections={true}
        data={Object.keys(roomMetadata)}
        extraData={Object.keys(roomMetadata)}
        keyExtractor={(item, index) => item}
        renderItem={({item}) => (
          <View style={styles.roomBox}>
            <TouchableOpacity
              onPress={() => {
                enterRoom(item, roomMetadata[item]);
                joinListRoom(item);
              }}>
              <View style={styles.roomRow}>
                {roomMetadata[item].roomType === 'private' && (
                  <Icon name="lock" size={24} color="#ff1a1a" />
                )}
                {roomMetadata[item].roomType === 'public' && (
                  <Icon name="unlock-alt" size={24} color="#33cc33" />
                )}
                <Text style={{color: 'blue', fontSize: 16, padding: 10}}>
                  {roomMetadata[item].roomName}
                </Text>
                {/* Check unread */}
                {!!roomUsers &&
                  !!userJoinRoom &&
                  Object.keys(roomUsers).includes(item) &&
                  userJoinRoom[item] !== null &&
                  Object.keys(roomUsers[item]).includes(userId) &&
                  Object.keys(roomUsers[item][userId]).includes('readed') &&
                  roomUsers[item][userId].readed === false && (
                    <View
                      style={{
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
                      }}></View>
                  )}
              </View>
              <View style={styles.roomRow}>
                <Text style={{color: 'gray', fontWeight: 'bold'}}>
                  {roomMetadata[item].createdByUserId === getUserProfile()?.uid
                    ? 'You created at ' +
                      formatDateFull(roomMetadata[item].createdAt)
                    : null}
                </Text>
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
    borderRadius: 3,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    margin: 10,
    marginTop: 0,
  },
  rooms: {textAlign: 'center', fontWeight: 'bold', margin: 5, fontSize: 15},
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  saveButton: {
    marginRight: 10,
    marginTop: 2,
  },
  roomList: {
    padding: 10,
    backgroundColor: '#F9FAFB',
  },
  roomBox: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#E5E7EB',
    flexDirection: 'column',
    borderRadius: 5,
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
