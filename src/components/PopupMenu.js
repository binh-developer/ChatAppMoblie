import React from 'react';
//import react in our code.
import {View, Text, TouchableOpacity} from 'react-native';
//import all the components we are going to use.
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
//import menu and menu item
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  deleteRoomById,
  unsignedUserToRoom,
  getUserProfile,
  logOut,
} from '../helpers/firebase';

const PopupMenu = props => {
  let _menu = null;

  return (
    <View style={props.menuStyle}>
      <Menu
        ref={ref => (_menu = ref)}
        button={
          props.isIcon ? (
            <TouchableOpacity onPress={() => _menu.show()}>
              <Icon name="dots-vertical" size={30} color="#0066ff" />
            </TouchableOpacity>
          ) : (
            <Text onPress={() => _menu.show()} style={props.textStyle}>
              {props.menuText}
            </Text>
          )
        }>
        {props.route.name === 'Chat' ? (
          <View>
            {getUserProfile()?.uid ===
            props.route.params.roomData.createdByUserId ? (
              <MenuItem
                onPress={() => {
                  deleteRoomById(
                    props.route.params.id,
                    props.route.params.roomData.createdByUserId,
                  );
                  props.navigation.goBack();
                }}>
                Delete Room
              </MenuItem>
            ) : null}
            <MenuItem
              onPress={() => {
                unsignedUserToRoom(props.route.params.id);
                props.navigation.goBack();
              }}>
              Leave Room
            </MenuItem>
          </View>
        ) : null}
        <MenuDivider />
        {props.route.name === 'ListRoom' ? (
          <MenuItem
            style={{
              justifyContent: 'center',
            }}
            onPress={() => {
              logOut()
                .then(() => {
                  props.navigation.replace('Login');
                })
                .catch(err => {});
            }}>
            Logout
          </MenuItem>
        ) : null}
      </Menu>
    </View>
  );
};

export default PopupMenu;
