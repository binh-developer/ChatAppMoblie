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
import {createUserAccount} from '../helpers/firebase';

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

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
  },
  registerScreenContainer: {
    flex: 1,
  },
  logoText: {
    color: 'gray',
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 40,
    textAlign: 'center',
  },
  registerFormView: {
    flex: 1,
  },
  registerFormTextInput: {
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
  },
  registerButton: {
    backgroundColor: '#3a82f6',
    borderRadius: 5,
    height: 45,
    marginHorizontal: 100,
    marginTop: 40,
  },
});
