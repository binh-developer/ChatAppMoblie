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

import {useMutation} from '@apollo/client';
import {UPDATE_REMINDER} from '../../helpers/graphql';
import {formatTime, formatDate} from '../../utils/timeUtil';
import styles from './styles';

const UpdateReminderScreen = ({navigation, route}) => {
  const {id, reminderData} = route.params;
  const [title, setTitle] = useState(reminderData.title);
  const [date, setDate] = useState(new Date(reminderData.reminderTime));
  const [mode, setMode] = useState('');
  const [show, setShow] = useState(false);

  const [updateReminder, {data}] = useMutation(UPDATE_REMINDER);

  const onUpdate = () => {
    if (title !== '' && date > new Date()) {
      var a = new Date(date);
      a = a.setSeconds(0);

      updateReminder({
        variables: {
          reminderId: id,
          title,
          reminderTime: new Date(a).getTime(),
        },
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
            <Text style={styles.reminderLogoText}>
              Update {reminderData.roomName}
            </Text>
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
              onPress={onUpdate}
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

export default UpdateReminderScreen;
