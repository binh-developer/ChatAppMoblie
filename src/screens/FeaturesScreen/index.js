import * as React from 'react';
import {View} from 'react-native';
import {useWindowDimensions, Text} from 'react-native';
import {TabBar, TabView, SceneMap} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';

import Calendar from '../../components/Calendar';
import Reminder from '../../components/Reminder';

const renderScene = SceneMap({
  first: Calendar,
  second: Reminder,
});

export default function TabViewExample() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Calendar'},
    {key: 'second', title: 'Reminder'},
  ]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: '#3a82f6'}}
      style={{backgroundColor: '#f2f2f2'}}
      renderLabel={({route, focused, color}) => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* Style Icon */}
          {route.title === 'Reminder' && (
            <Icon
              name={focused ? 'alarm' : 'alarm-outline'}
              color="tomato"
              size={18}
            />
          )}
          {route.title === 'Calendar' && (
            <Icon
              name={focused ? 'calendar' : 'calendar-outline'}
              color="tomato"
              size={18}
            />
          )}
          {/* Style Text */}
          <Text style={{color: 'tomato', marginHorizontal: 10}}>
            {route.title}
          </Text>
        </View>
      )}
    />
  );

  return (
    <>
      <Text
        style={{
          alignSelf: 'center',
          color: '#3a82f6',
          fontWeight: 'bold',
          marginTop: 10,
        }}>
        Group Features
      </Text>
      <TabView
        lazy
        navigationState={{index, routes}}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </>
  );
}
