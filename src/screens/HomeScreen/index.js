import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Timeline from '../TimelineScreen';
import Room from '../ListRoomScreen';
import Profile from '../ProfileScreen';
import Features from '../FeaturesScreen';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Room"
      tabBarOptions={{
        showLabel: true,
        style: {
          height: 60,
          shadowOpacity: 0,
          elevation: 0,
          paddingLeft: 20,
          paddingRight: 20,
        },
      }}>
      <Tab.Screen
        name="Room"
        component={Room}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                backgroundColor: focused ? '#dce2ed' : 'transparent',
                ...styles.viewStyle,
              }}>
              <Icon
                name={focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'}
                size={18}
                color="tomato"
                style={styles.iconStyle}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Timeline"
        component={Timeline}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                backgroundColor: focused ? '#dce2ed' : 'transparent',
                ...styles.viewStyle,
              }}>
              <Icon
                name={focused ? 'time' : 'time-outline'}
                size={18}
                color="tomato"
                style={styles.iconStyle}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                backgroundColor: focused ? '#dce2ed' : 'transparent',
                ...styles.viewStyle,
              }}>
              <Icon
                name={focused ? 'happy' : 'happy-outline'}
                size={18}
                color="tomato"
                style={styles.iconStyle}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Features"
        component={Features}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                backgroundColor: focused ? '#dce2ed' : 'transparent',
                ...styles.viewStyle,
              }}>
              <Icon
                name={focused ? 'apps' : 'apps-outline'}
                size={18}
                color="tomato"
                style={styles.iconStyle}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  viewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  iconStyle: {
    width: 18,
    height: 18,
    marginHorizontal: 10,
    marginVertical: 8,
  },
});
