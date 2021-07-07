import React, {useState} from 'react';
import {
  Keyboard,
  View,
  Image,
  TextInput,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {Button} from 'react-native-elements';
import {
  createTimeline,
  updateImageTimeline,
  getUserProfile,
} from '../../helpers/firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

const CreateStatusScreen = ({navigation}) => {
  const [status, setStatus] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [image, setImage] = useState(null);

  const onCreate = () => {
    if (imageURL === '') {
      createTimeline({status, imageURL: ''});
      navigation.goBack();
    }
  };

  const selectImage = () => {
    const options = {
      maxWidth: 1000,
      maxHeight: 1000,
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.assets[0].uri};
        setImage(source);
      }
    });
  };

  const uploadImage = async () => {
    const {uri} = image;
    const filename = `timeline/${getUserProfile()?.uid}/${uri.substring(
      uri.lastIndexOf('/') + 1,
    )}`;
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    try {
      let urlImage = await updateImageTimeline(filename, uploadUri);
      if (urlImage.length > 0) {
        createTimeline({status, imageURL: urlImage});
      }
    } catch (e) {
      console.error(e);
    }
    setImage(null);
    setStatus('');
    setImageURL('');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="height">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
          <View style={styles.statusScreenContainer}>
            <View style={styles.statusFormView}>
              <TextInput
                placeholder="How are you today?"
                placeholderColor="#c4c3cb"
                multiline={true}
                clearButtonMode="while-editing"
                numberOfLines={10}
                maxLength={1000}
                style={styles.statusFormTextInput}
                values={status}
                onChangeText={text => setStatus(text)}
              />
              <TouchableOpacity
                style={styles.imageBoxView}
                onPress={selectImage}>
                <Icon
                  name="image-area"
                  size={20}
                  color="#3a82f6"
                  style={{marginHorizontal: 5}}
                />
                {image !== null ? (
                  <Text
                    numberOfLines={1}
                    style={{
                      width: 200,
                      color: 'gray',
                      fontWeight: 'bold',
                    }}>
                    {image.uri.split('\\').pop().split('/').pop()}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: 'gray',
                    }}>
                    Image
                  </Text>
                )}
                {image !== null ? (
                  <Icon
                    name="close-thick"
                    size={18}
                    color="tomato"
                    onPress={() => setImage(null)}
                  />
                ) : null}
              </TouchableOpacity>

              {image !== null ? (
                <Image source={{uri: image.uri}} style={styles.imageView} />
              ) : null}

              <Button
                buttonStyle={styles.statusButton}
                title="Post"
                onPress={() => {
                  if (image != null) {
                    uploadImage();
                  } else {
                    onCreate();
                  }
                }}
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CreateStatusScreen;
