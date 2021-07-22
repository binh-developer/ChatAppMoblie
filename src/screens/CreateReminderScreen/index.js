import React, {useState} from 'react';
import {
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Button} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  createReminder,
  getRoomMetadata,
  getUserProfile,
} from '../../helpers/firebase';
import {formatTime, formatDate} from '../../utils/timeUtil';
import styles from './styles';
import {FlatList} from 'react-native';

const CreateReminderScreen = ({navigation}) => {
  const [selected, setSelected] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomData, setRoomData] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('');
  const [show, setShow] = useState(false);

  const onCreate = () => {
    if (title !== '' && date > new Date()) {
      var a = new Date(date);
      a = a.setSeconds(0);

      createReminder({
        roomName,
        roomId,
        title: title,
        reminderTime: new Date(a).getTime(),
      });
    }
    return navigation.goBack();
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="height">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.reminderScreenContainer}>
          <View style={styles.reminderFormView}>
            <Text style={styles.reminderLogoText}>Set Reminder</Text>
            {/* Pick Room */}
            {selected === false && (
              <View style={styles.searchContainer}>
                <Icon
                  style={{paddingLeft: 15}}
                  name="search"
                  size={20}
                  color="#989898"
                />
                <TextInput
                  defaultValue={title.length > 0 ? title : null}
                  placeholder="Search Room"
                  placeholderColor="#c4c3cb"
                  style={styles.searchInput}
                  values={title}
                  onChangeText={text => {
                    if (text.length <= 0) {
                      setRoomData('');
                    } else {
                      getRoomMetadata()
                        .orderByChild('roomName')
                        .equalTo(text.toLowerCase())
                        .once('value')
                        .then(snapshot => {
                          if (snapshot.exists()) {
                            setRoomData(snapshot.val());
                          }
                        });
                    }
                  }}
                />
              </View>
            )}
            {selected === false && roomData !== '' && roomData !== undefined && (
              <>
                <Text style={{alignSelf: 'center', color: 'gray'}}>
                  Pick a Room
                </Text>
                <FlatList
                  style={{
                    flexGrow: 0,
                    backgroundColor: 'white',
                    marginHorizontal: 15,
                    marginVertical: 5,
                    borderRadius: 20,
                  }}
                  enableEmptySections={true}
                  data={Object.keys(roomData)}
                  extraData={Object.keys(roomData)}
                  keyExtractor={(item, index) => item}
                  renderItem={({item}) => (
                    <View
                      style={{flexDirection: 'row', justifyContent: 'center'}}>
                      <Text
                        style={{
                          color: 'tomato',
                          alignSelf: 'center',
                          padding: 5,
                        }}
                        onPress={() => {
                          setRoomId(item);
                          setRoomName(roomData[item].roomName);
                          setSelected(true);
                        }}>
                        "{roomData[item].roomName}"
                      </Text>
                      <Text
                        style={{
                          color: 'tomato',
                          alignSelf: 'center',
                          padding: 5,
                        }}
                        onPress={() => {
                          setRoomId(item);
                          setRoomName(roomData[item].roomName);
                          setSelected(true);
                        }}>
                        {roomData[item].createdByUserId ===
                        getUserProfile()?.uid
                          ? 'Created by you'
                          : ''}
                      </Text>
                    </View>
                  )}
                />
              </>
            )}

            {selected === true && (
              <View
                style={{
                  backgroundColor: '#E5E7EB',
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 15,
                  marginRight: 15,
                  marginTop: 5,
                  marginBottom: 5,
                }}>
                <Text
                  style={{
                    padding: 10,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center',
                  }}>
                  Room: {roomName}
                </Text>
                <Icon
                  name="close"
                  size={20}
                  color="tomato"
                  onPress={() => {
                    setRoomId('');
                    setRoomName('');
                    setSelected(false);
                  }}
                  style={{marginHorizontal: 20}}
                />
              </View>
            )}

            {/* Set Title */}
            <TextInput
              defaultValue={title.length > 0 ? title : null}
              placeholder="Title name"
              placeholderColor="#c4c3cb"
              style={styles.reminderFormTextInput}
              values={title}
              onChangeText={text => setTitle(text)}
            />
            <View style={styles.reminderTimeView}>
              <View style={styles.reminderSetTime}>
                <Text style={styles.reminderText}>{formatTime(date)}</Text>
                <Icon
                  name="time-outline"
                  size={20}
                  color="tomato"
                  onPress={showTimepicker}
                  style={{marginHorizontal: 20}}
                />
              </View>
              <View style={styles.reminderSetTime}>
                <Text style={styles.reminderText}>{formatDate(date)}</Text>
                <Icon
                  name="calendar-outline"
                  size={20}
                  color="tomato"
                  onPress={showDatepicker}
                  style={{marginHorizontal: 20}}
                />
              </View>
            </View>
            <Button
              buttonStyle={styles.reminderButton}
              title="Set"
              onPress={onCreate}
            />
          </View>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CreateReminderScreen;
