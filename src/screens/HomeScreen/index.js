import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Timeline from '../TimelineScreen';
import Room from '../ListRoomScreen';
import Profile from '../ProfileScreen';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Room') {
            iconName = focused
              ? 'chatbox-ellipses'
              : 'chatbox-ellipses-outline';
          }

          if (route.name === 'Timeline') {
            iconName = focused ? 'time' : 'time-outline';
          }

          if (route.name === 'Profile') {
            iconName = focused ? 'happy' : 'happy-outline';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Room" component={Room} />
      <Tab.Screen name="Timeline" component={Timeline} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default HomeScreen;
