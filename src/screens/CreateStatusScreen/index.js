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
import {createTimeline} from '../../helpers/firebase';
import styles from './styles';

const CreateStatusScreen = ({navigation: {goBack}}) => {
  const [status, setStatus] = useState('');

  const onCreate = () => {
    createTimeline({status});
    goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="height">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.statusScreenContainer}>
          <View style={styles.statusFormView}>
            <TextInput
              placeholder="How are you today?"
              placeholderColor="#c4c3cb"
              multiline={true}
              numberOfLines={10}
              maxLength={1000}
              style={styles.statusFormTextInput}
              values={status}
              onChangeText={text => setStatus(text)}
            />
            <Button
              buttonStyle={styles.statusButton}
              title="Post"
              onPress={onCreate}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CreateStatusScreen;
