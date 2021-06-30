import React, {useLayoutEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Avatar, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PopupMenu from '../../components/PopupMenu';
import GetListRoom from '../../components/GetListRoom.js';
import styles from './styles';

import {getUserProfile} from '../../helpers/firebase';

export default function ListRoomScreen({navigation, route}) {
  useLayoutEffect(() => {
    let loading = true;
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={getProfile}>
          <View
            style={{
              margin: 10,
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 50,
              justifyContent: 'center',
            }}>
            <Avatar
              rounded
              size="small"
              activeOpacity={0.7}
              source={{
                uri:
                  getUserProfile()?.photoURL.length > 0
                    ? getUserProfile()?.photoURL
                    : 'https://lh4.googleusercontent.com/-v0soe-ievYE/AAAAAAAAAAI/AAAAAAACyas/yR1_yhwBcBA/photo.jpg?sz=150',
              }}
            />
          </View>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <PopupMenu
          menuText="Menu"
          menuStyle={{marginRight: 2}}
          textStyle={{color: 'black'}}
          navigation={navigation}
          route={route}
          isIcon={true}
        />
      ),
    });

    return () => (loading = false);
  }, []);

  const getProfile = () => {
    navigation.navigate('Profile');
  };

  const createRoom = () => {
    navigation.navigate('CreateRoom');
  };

  const goTimelineScreen = () => {
    navigation.navigate('Timeline');
  };

  return (
    <View style={styles.container}>
      <GetListRoom />

      <View style={styles.boxBelow}>
        {/* Blog Screen */}
        <View style={styles.buttonContainerView}>
          <Button
            icon={<Icon name="timeline" size={20} color="#3a82f6" />}
            titleStyle={styles.titleStyleView}
            buttonStyle={styles.buttonStyleView}
            title=""
            onPress={goTimelineScreen}
          />
          <Text>Timeline</Text>
        </View>
        {/* Add New Room */}
        <View style={styles.buttonContainerView}>
          <Button
            icon={<Icon name="create" size={20} color="#3a82f6" />}
            titleStyle={styles.titleStyleView}
            buttonStyle={styles.buttonStyleView}
            title=""
            onPress={createRoom}
          />
          <Text>New room</Text>
        </View>
      </View>
    </View>
  );
}
