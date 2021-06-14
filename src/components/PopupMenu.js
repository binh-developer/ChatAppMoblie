import React from 'react';
//import react in our code.
import {View, Text, Image, TouchableOpacity} from 'react-native';
//import all the components we are going to use.
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
//import menu and menu item
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  deleteRoomById,
  unsignUserToRoom,
  getUserProfile,
  updateLeaveRoom,
  logOut,
} from '../helpers/firebase';

const PopupMenu = props => {
  let _menu = null;

  return (
    <View style={props.menustyle}>
      <Menu
        ref={ref => (_menu = ref)}
        button={
          props.isIcon ? (
            <TouchableOpacity onPress={() => _menu.show()}>
              <Icon name="dots-vertical" size={30} color="#0066ff" />
            </TouchableOpacity>
          ) : (
            <Text onPress={() => _menu.show()} style={props.textStyle}>
              {props.menutext}
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
                unsignUserToRoom(props.route.params.id);
                props.navigation.goBack();
              }}>
              Leave Room
            </MenuItem>
          </View>
        ) : null}
        <MenuDivider />
        <MenuItem
          style={{
            justifyContent: 'center',
          }}
          onPress={async () => {
            const updateLogout = await updateLeaveRoom();
            if (updateLogout) {
              await logOut()
                .then(() => {
                  props.navigation.replace('Login');
                })
                .catch(err => {});
            }
          }}>
          {/* <Icon name="logout" size={20} color="#ff471a" /> */}
          Logout
        </MenuItem>
      </Menu>
    </View>
  );
};

export default PopupMenu;
