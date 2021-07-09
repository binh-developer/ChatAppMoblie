import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef, navigate} from './RootNavigation';

import {LogBox} from 'react-native';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import ListRoomScreen from './screens/ListRoomScreen';
import CreateRoomScreen from './screens/CreateRoomScreen';
import UploadScreen from './screens/UploadAvatarScreen';
import TimelineScreen from './screens/TimelineScreen';
import CreateStatusScreen from './screens/CreateStatusScreen';
import HomeScreen from './screens/HomeScreen';

import messaging from '@react-native-firebase/messaging';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from '@apollo/client';
import {onError} from '@apollo/client/link/error';

const errorLink = onError(({graphqlErrors, networkError}) => {
  if (graphqlErrors) {
    graphqlErrors.map(({message, location, path}) => {
      alert(`Graphql error ${message}`);
    });
  }
});

const link = from([
  errorLink,
  // your localhost ip
  // there will be a error if you use localhost instead localhost ip
  new HttpLink({uri: 'http://192.1.1.1:3000/graphql'}),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

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
  messaging()
    .getToken()
    .then(currentToken => {
      if (currentToken) {
        console.log(currentToken, 'Background');
      }
    });
  console.log(
    'Background!',

    remoteMessage,
  );
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
      messaging()
        .getToken()
        .then(currentToken => {
          if (currentToken) {
            console.log(currentToken, 'Foreground');
          }
        });

      console.log('Foreground!', JSON.stringify(remoteMessage));
    });

    messaging().on;

    return unsubscribe;
  }, []);

  return (
    <ApolloProvider client={client}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen
            options={{headerShown: false}}
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            options={styles.headerCustomStyle}
            name="Register"
            component={RegisterScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            options={styles.headerCustomStyle}
            name="ListRoom"
            component={ListRoomScreen}
          />
          <Stack.Screen
            options={styles.headerCustomStyle}
            name="CreateRoom"
            component={CreateRoomScreen}
          />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen
            options={styles.headerCustomStyle}
            name="Profile"
            component={ProfileScreen}
          />
          <Stack.Screen
            options={styles.headerCustomStyle}
            name="Upload"
            component={UploadScreen}
          />
          <Stack.Screen
            options={styles.headerCustomStyle}
            name="Timeline"
            component={TimelineScreen}
          />
          <Stack.Screen
            options={styles.headerCustomStyle}
            name="Status"
            component={CreateStatusScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}

const styles = {
  headerCustomStyle: {
    headerTitle: 'MeChat',
    headerStyle: {
      backgroundColor: '#F9FAFB',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
      height: 52,
    },
    headerTitleStyle: {
      fontSize: 18,
      fontWeight: '900',
      color: '#3a82f6',
      elevation: 0, // remove shadow on Android
      shadowOpacity: 0, // remove shadow on iOS
    },
  },
};
