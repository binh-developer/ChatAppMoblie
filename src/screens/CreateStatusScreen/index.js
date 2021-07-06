import React, {useState} from 'react';
import {
  Keyboard,
  View,
  TextInput,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';
import {createTimeline} from '../../helpers/firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

const CreateStatusScreen = ({navigation: {goBack}}) => {
  const [status, setStatus] = useState('');
  const [imageURL, setImageURL] = useState('');

  const onCreate = () => {
    createTimeline({status, imageURL});
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
            <TouchableOpacity style={styles.imageBoxView}>
              <Icon
                name="image-area"
                size={20}
                color="#3a82f6"
                style={{marginHorizontal: 5}}
              />
              <Text>Image</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Your image url is ..."
              placeholderColor="#c4c3cb"
              style={styles.imageFormTextInput}
              values={imageURL}
              onChangeText={text => setImageURL(text)}
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
