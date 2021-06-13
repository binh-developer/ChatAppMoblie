import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef, navigate} from './RootNavigation';

import {LogBox} from 'react-native';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import ListRoomScreen from './screens/ListRoomScreen';
import CreateRoom from './screens/CreateRoom';
import UploadScreen from './screens/UploadAvatarScreen';

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

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background!', remoteMessage);
});

const Stack = createStackNavigator();

export default function App() {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.data.roomId,
    );
    navigate('Chat', {
      id: remoteMessage.data.roomId,
      roomData: {
        createdByUserId: remoteMessage.data.createdByUserId,
        roomName: remoteMessage.data.roomName,
      },
    });
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground!', JSON.stringify(remoteMessage));
    });

    messaging().on;

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
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
