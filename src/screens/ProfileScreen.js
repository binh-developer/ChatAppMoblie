import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import {Button} from 'react-native-elements';
import auth from '@react-native-firebase/auth';

const ProfileScreen = ({navigation}) => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <Text>Login</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={[styles.card, styles.profileCard]}>
          <Image
            style={styles.avatar}
            source={{uri: user.photoURL ? user.photoURL : undefined}}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTittle}>Bio</Text>
          <Text>Email: {user.email}</Text>
          <Text>Username: {user.displayName}</Text>
        </View>

        <View style={styles.photosCard}>
          <Text style={styles.cardTittle}>Photos</Text>
          <View style={styles.photosContainer}>
            <Image
              style={styles.photo}
              source={{
                uri: user.photoURL ? user.photoURL : undefined,
              }}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Button
            buttonStyle={{
              backgroundColor: '#3a82f6',
              borderRadius: 5,
              marginHorizontal: 100,
              marginTop: 10,
            }}
            onPress={() => navigation.navigate('Upload')}
            title="Update Avatar"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  cardTittle: {
    color: '#808080',
    fontSize: 15,
    marginBottom: 5,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  profileCard: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: 10,
    fontSize: 22,
    color: '#808080',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 'auto',
  },
  photosCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
  },
  photo: {
    width: 113,
    height: 113,
    marginTop: 5,
    marginRight: 5,
  },
});
