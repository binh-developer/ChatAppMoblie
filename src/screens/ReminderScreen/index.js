import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getReminders, deleteReminder} from '../../helpers/firebase';
import {formatDateFull} from '../../utils/timeUtil';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ReminderScreen() {
  const navigation = useNavigation();
  const [listData, setListData] = useState('');

  useEffect(() => {
    let mounted = true;

    const ListReminders = getReminders()
      .orderByChild('reminderTime')
      .on('value', snapshot => {
        if (snapshot !== undefined) {
          if (mounted) {
            // Sort based on reminderTime created time
            if (snapshot.val() !== undefined && snapshot.val() !== null) {
              const sortable = Object.fromEntries(
                Object.entries(snapshot.val()).sort(
                  ([, a], [, b]) => a.reminderTime - b.reminderTime,
                ),
              );

              Object.keys(snapshot.val()).forEach(async key => {
                if (snapshot.val()[key].reminderTime < new Date()) {
                  await deleteReminder(key);
                }
              });
              setListData(sortable);
            } else setListData('');
          }
        }
      });

    return ListReminders, () => (mounted = false);
  }, []);

  const createReminder = () => {
    navigation.navigate('CreateReminder');
  };

  const removeReminder = id => {
    Alert.alert('Delete Reminder', '', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deleteReminder(id)},
    ]);
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

      <FlatList
        enableEmptySections={true}
        style={styles.list}
        data={Object.keys(listData)}
        horizontal={false}
        keyExtractor={(item, index) => item}
        renderItem={({item}) => {
          return (
            <View style={styles.listContainer}>
              <View style={styles.touchableOpacityStyle}>
                <View>
                  <Text style={styles.reminderTitle}>
                    {listData[item].title}
                  </Text>
                  <Text style={styles.reminderTitle}>
                    Room: {listData[item].roomName}
                  </Text>

                  <Text style={styles.reminderTitle}>
                    {formatDateFull(listData[item].reminderTime)}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    name="pencil"
                    size={20}
                    color="tomato"
                    style={{marginHorizontal: 5}}
                    onPress={() =>
                      navigation.navigate('UpdateReminder', {
                        id: item,
                        reminderData: {
                          reminderTime: listData[item].reminderTime,
                          title: listData[item].title,
                        },
                      })
                    }
                  />
                  <Icon
                    name="trash"
                    size={20}
                    color="tomato"
                    style={{marginHorizontal: 5}}
                    onPress={() => removeReminder(item)}
                  />
                </View>
              </View>
            </View>
          );
        }}
      />
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
