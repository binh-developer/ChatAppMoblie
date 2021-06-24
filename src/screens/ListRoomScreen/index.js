import React, {useLayoutEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';
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

  return (
    <View style={styles.container}>
      <GetListRoom />

      {/* Add New Room */}
      <View style={styles.createRoomView}>
        <Button
          icon={
            <Icon
              name="create"
              size={20}
              color="#3a82f6"
              style={{marginRight: 5}}
            />
          }
          titleStyle={{
            color: '#3a82f6',
            fontSize: 15,
          }}
          buttonStyle={{
            backgroundColor: '#DBE0FE',
            borderRadius: 30,
            paddingHorizontal: 10,
          }}
          title="Create new room"
          onPress={createRoom}
        />
      </View>
    </View>
  );
}
