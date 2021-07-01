import React from 'react';
import {Text, View, Image, ScrollView} from 'react-native';

import {logOut, getUserProfile} from '../../helpers/firebase';
import styles from './styles';

const ProfileScreen = ({navigation}) => {
  const toLogout = () => {
    logOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch(err => {});
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.titleStyle}>Profile</Text>
        {!!getUserProfile() && (
          <View style={[styles.card, styles.profileCard]}>
            <Image
              style={styles.avatar}
              source={{
                uri: getUserProfile()?.photoURL
                  ? getUserProfile()?.photoURL
                  : undefined,
              }}
            />
          </View>
        )}

        {!!getUserProfile() && (
          <View style={styles.card}>
            <Text style={styles.cardTittle}>Bio</Text>
            <Text>Email: {getUserProfile()?.email}</Text>
            <Text>Username: {getUserProfile()?.displayName}</Text>
          </View>
        )}
        <View style={styles.functionStyle}>
          <Text style={styles.cardTittle}>Setting</Text>
          <Text
            style={{
              color: '#3a82f6',
              marginVertical: 10,
            }}
            onPress={() => navigation.navigate('Upload')}>
            Update Avatar
          </Text>
          <Text
            style={{
              color: 'tomato',
              marginVertical: 10,
            }}
            onPress={() => toLogout()}
            title="">
            Logout
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
