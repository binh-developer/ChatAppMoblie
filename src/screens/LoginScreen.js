import React, {useState, useEffect} from 'react';
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

import {registerTokenDevice, updateJoinRoom} from '../helpers/firebase';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        // Signed in
        registerTokenDevice();
        updateJoinRoom();
        navigation.replace('ListRoom');
      })
      .catch(error => {
        alert(error.message);
      });
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(function (user) {
      if (user) {
        registerTokenDevice();
        updateJoinRoom();
        navigation.replace('ListRoom');
      } else {
        navigation.canGoBack() && navigation.popToTop();
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="height">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <Text style={styles.logoText}>MeChat</Text>
            <Text style={styles.subLogoText}>A new era of messaging</Text>
            <TextInput
              placeholder="Username"
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
              values={email}
              onChangeText={text => setEmail(text)}
            />
            <TextInput
              placeholder="Password"
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
              secureTextEntry={true}
              values={password}
              onChangeText={text => setPassword(text)}
            />
            <Button
              buttonStyle={styles.loginButton}
              onPress={signIn}
              title="Login"
            />
            <Button
              buttonStyle={{
                ...styles.loginButton,
                backgroundColor: '#f8f8f8',
              }}
              titleStyle={{
                color: 'gray',
              }}
              onPress={() => navigation.navigate('Register')}
              title="Register"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
  },
  loginScreenContainer: {
    flex: 1,
  },
  logoText: {
    color: '#3a82f6',
    fontSize: 35,
    fontWeight: 'bold',
    marginTop: 150,
    textAlign: 'center',
  },
  subLogoText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 30,
  },
  loginFormView: {
    flex: 1,
  },
  loginFormTextInput: {
    height: 43,
    fontFamily: 'default',
    fontSize: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: '#3a82f6',
    borderRadius: 30,
    height: 45,
    marginHorizontal: 100,
    marginTop: 10,
  },
});
