import React, {useState} from 'react';
import {
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import {Button} from 'react-native-elements';
import {createRoom} from '../../helpers/firebase';
import styles from './styles';

const CreateRoomScreen = ({navigation: {goBack}}) => {
  const [room, setRoom] = useState('');

  const onCreate = () => {
    if (room !== '') {
      createRoom(room.replace(/\s/g, '').toLowerCase());
    }
    return goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="height">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.roomScreenContainer}>
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
              onPress={onCreate}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CreateRoomScreen;
