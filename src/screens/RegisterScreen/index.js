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
import {createUserAccount} from '../../helpers/firebase';
import styles from './styles';

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const register = () => {
    createUserAccount(email, password, name);
    navigation.popToTop();
  };

  return (
    <KeyboardAvoidingView style={styles.containerView}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.registerScreenContainer}>
          <View style={styles.registerFormView}>
            <Text style={styles.logoText}>Register</Text>
            <TextInput
              placeholder="Name"
              placeholderColor="#c4c3cb"
              style={styles.registerFormTextInput}
              values={name}
              onChangeText={text => setName(text)}
            />
            <TextInput
              placeholder="Email"
              placeholderColor="#c4c3cb"
              style={styles.registerFormTextInput}
              values={email}
              onChangeText={text => setEmail(text)}
            />
            <TextInput
              placeholder="Password"
              placeholderColor="#c4c3cb"
              style={styles.registerFormTextInput}
              secureTextEntry={true}
              values={password}
              onChangeText={text => setPassword(text)}
            />
            <Button
              buttonStyle={styles.registerButton}
              onPress={register}
              title="Register"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
