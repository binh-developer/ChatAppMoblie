import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// import {deleteReminder} from '../../helpers/firebase';
import {GET_REMINDER, REMOVE_REMINDER} from '../../helpers/graphql';
import {formatDateFull} from '../../utils/timeUtil';

import {useQuery, useMutation} from '@apollo/client';

export default function ReminderScreen() {
  const navigation = useNavigation();
  const [removeReminder, {data, loading, error, refetch}] =
    useMutation(REMOVE_REMINDER);

  let markThatReloadingOne = true;

  const createReminder = () => {
    navigation.navigate('CreateReminder');
    markThatReloadingOne = false;
  };

  const ReminderListApollo = () => {
    let refreshing = true;
    const isFocused = useIsFocused();
    const {loading, error, data, refetch, networkStatus} = useQuery(
      GET_REMINDER,
      {
        notifyOnNetworkStatusChange: true,
      },
    );

    const onRefresh = () => {
      refetch();
    };

    const deleteReminder = reminderId => {
      removeReminder({variables: {reminderId: reminderId}});
    };

    if (isFocused) {
      if (markThatReloadingOne === false) {
        refetch();
        markThatReloadingOne = true;
      }
    }

    if (networkStatus === 4)
      return <FlatList enableEmptySections={true} style={styles.list} />;
    if (loading) return <Text>Loading</Text>;
    if (error) return <Text>Error!</Text>;
    if (data) refreshing = false;

    return (
      <>
        {refreshing ? <ActivityIndicator /> : null}
        <FlatList
          enableEmptySections={true}
          style={styles.list}
          data={data.reminder}
          horizontal={false}
          keyExtractor={item => item.reminderId}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
              tintColor="red"
              colors={['red', 'green']}
            />
          }
          renderItem={({item}) => {
            return (
              <View style={styles.listContainer}>
                <View style={styles.touchableOpacityStyle}>
                  <View>
                    <Text style={styles.reminderTitle}>{item.title}</Text>
                    <Text style={styles.reminderTitle}>
                      Room: {item.roomName}
                    </Text>

                    <Text style={styles.reminderTitle}>
                      {formatDateFull(item.reminderTime)}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Icon
                      name="pencil"
                      size={20}
                      color="tomato"
                      style={{marginHorizontal: 5}}
                      onPress={() => {
                        navigation.navigate('UpdateReminder', {
                          id: item.reminderId,
                          reminderData: {
                            reminderTime: item.reminderTime,
                            title: item.title,
                            roomName: item.roomName,
                          },
                        });

                        markThatReloadingOne = false;
                      }}
                    />
                    <Icon
                      name="trash"
                      size={20}
                      color="tomato"
                      style={{marginHorizontal: 5}}
                      onPress={async () => {
                        Alert.alert('Delete Reminder', '', [
                          {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                          },
                          {
                            text: 'OK',
                            onPress: () => {
                              deleteReminder(item.reminderId);
                              refetch();
                            },
                          },
                        ]);
                      }}
                    />
                  </View>
                </View>
              </View>
            );
          }}
        />
      </>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.createContainer}>
        <Text>Set your reminder</Text>
        <TouchableOpacity>
          <Text
            style={{
              color: '#3a82f6',
              fontSize: 16,
              fontWeight: 'bold',
              margin: 10,
            }}
            onPress={() => createReminder()}>
            Set
          </Text>
        </TouchableOpacity>
      </View>
      <ReminderListApollo />
    </View>
  );
}

const styles = StyleSheet.create({
  createContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 10,
  },
  list: {
    margin: 10,
    paddingVertical: 2,
    marginTop: 0,
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    margin: 8,
  },

  touchableOpacityStyle: {
    flexDirection: 'row',
    backgroundColor: '#b6ffff',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    padding: 10,
  },
  cardImage: {
    height: 30,
    width: 30,
  },
  reminderTitle: {
    flex: 1,
    color: 'black',
    marginHorizontal: 5,
  },
});
