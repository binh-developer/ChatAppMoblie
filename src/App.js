import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {LogBox} from 'react-native';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import ListRoomScreen from './screens/ListRoomScreen';
import CreateRoom from './screens/CreateRoom';
import UploadScreen from './screens/UploadAvatarScreen';

// import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

// Ignore Yellow Warning
LogBox.ignoreLogs(['Setting a timer']);

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

requestUserPermission();

// // Must be outside of any component LifeCycle (such as `componentDidMount`).
// PushNotification.configure({
//   // (optional) Called when Token is generated (iOS and Android)
//   onRegister: function (token) {
//     console.log('TOKEN:', token);
//   },

//   // (required) Called when a remote is received or opened, or local notification is opened
//   onNotification: function (notification) {
//     console.log('NOTIFICATION:', notification);

//     // process the notification

//     // (required) Called when a remote is received or opened, or local notification is opened
//     notification.finish(PushNotificationIOS.FetchResult.NoData);
//   },

//   // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
//   onAction: function (notification) {
//     console.log('ACTION:', notification.action);
//     console.log('NOTIFICATION:', notification);
//     // process the action
//   },

//   // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
//   onRegistrationError: function (err) {
//     console.error(err.message, err);
//   },

//   // IOS ONLY (optional): default: all - Permissions to register.
//   permissions: {
//     alert: true,
//     badge: true,
//     sound: true,
//   },

//   // Should the initial notification be popped automatically
//   // default: true
//   popInitialNotification: true,

//   /**
//    * (optional) default: true
//    * - Specified if permissions (ios) and token (android and ios) will requested or not,
//    * - if not, you must call PushNotificationsHandler.requestPermissions() later
//    * - if you are not using remote notification or do not have Firebase installed, use this:
//    *     requestPermissions: Platform.OS === 'ios'
//    */
//   requestPermissions: true,
// });

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{headerShown: false}}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{
            headerTitle: 'MeChat',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#3a82f6',
            },
          }}
          name="Register"
          component={RegisterScreen}
        />
        <Stack.Screen
          options={{
            headerTitle: 'MeChat',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#3a82f6',
            },
          }}
          name="ListRoom"
          component={ListRoomScreen}
        />
        <Stack.Screen
          options={{
            headerTitle: 'Create Room',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#3a82f6',
            },
          }}
          name="CreateRoom"
          component={CreateRoom}
        />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen
          options={{
            headerTitle: 'MeChat',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#3a82f6',
            },
          }}
          name="Profile"
          component={ProfileScreen}
        />
        <Stack.Screen
          options={{
            headerTitle: 'Upload',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#3a82f6',
            },
          }}
          name="Upload"
          component={UploadScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}