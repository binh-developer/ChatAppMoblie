import React, {useState} from 'react';
import {
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import {Button} from 'react-native-elements';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const CreateRoom = ({navigation: {goBack}}) => {
  const [room, setRoom] = useState('');

  const createRoom = () => {
    if (room !== '') {
      setRoom(room.replace(/\s/g, '').toLowerCase());
    }

    database().ref('room-metadata').push({
      roomName: room,
      roomType: 'public',
      createdAt: database.ServerValue.TIMESTAMP,
      createdByUserId: auth()?.currentUser?.uid,
    });

    return goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="height">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.roomnScreenContainer}>
          <View style={styles.roomFormView}>
            <Text style={styles.roomLogoText}>Create Room</Text>
            <TextInput
              placeholder="Room name"
              placeholderColor="#c4c3cb"
              style={styles.roomFormTextInput}
              values={room}
              onChangeText={text => setRoom(text)}
            />
            <Button
              buttonStyle={styles.roomButton}
              title="Create"
              onPress={createRoom}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CreateRoom;

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
  },
  roomnScreenContainer: {
    flex: 1,
  },
  roomLogoText: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 150,
    marginBottom: 20,
    textAlign: 'center',
  },
  roomFormView: {
    flex: 1,
  },
  roomFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  roomButton: {
    backgroundColor: '#3a82f6',
    borderRadius: 5,
    height: 45,
    marginHorizontal: 100,
    marginTop: 10,
  },
});
