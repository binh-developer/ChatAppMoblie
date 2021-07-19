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

import {createReminder} from '../../helpers/firebase';
import {formatTime} from '../../utils/timeUtil';
import styles from './styles';

const CreateReminderScreen = ({navigation: {goBack}}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onCreate = () => {
    if (title !== '') {
      //   createReminder();
    }
    return goBack();
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
            <Text style={styles.reminderLogoText}>Create Reminder</Text>
            <TextInput
              placeholder="Title name"
              placeholderColor="#c4c3cb"
              style={styles.reminderFormTextInput}
              values={title}
              onChangeText={text => setTitle(text)}
            />
            <View style={styles.reminderTimeView}>
              <Text>{formatTime(date)}</Text>
              <Icon
                name="time"
                size={20}
                color="tomato"
                onPress={showDatepicker}
                style={{marginHorizontal: 5}}
              />
              <Icon
                name="time-outline"
                size={20}
                color="tomato"
                onPress={showTimepicker}
                style={{marginHorizontal: 5}}
              />
            </View>

            <Button
              buttonStyle={styles.reminderButton}
              title="Create"
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
