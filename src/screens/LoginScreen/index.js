import React, {useState, useEffect} from 'react';
import {
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import {Button} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import styles from './styles';
import {registerTokenDevice} from '../../helpers/firebase';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async userCredential => {
        // Signed in

        await database()
          .ref('user-metadata')
          .child(auth().currentUser.uid)
          .update({isSignedIn: true});

        registerTokenDevice();
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
