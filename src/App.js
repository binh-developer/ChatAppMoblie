import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {LogBox} from 'react-native';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import ListRoomScreen from './screens/ListRoomScreen';
import CreateRoom from './screens/CreateRoom';

// Ignore Yellow Warning
LogBox.ignoreLogs(['Setting a timer']);

const Stack = createStackNavigator();

export default function App() {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
