import React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {Calendar} from 'react-native-calendars';

const CalendarsScreen = () => {
  const renderCalendarWithWeekNumbers = () => {
    return (
      <View>
        <Calendar
          style={styles.calendar}
          // Specify style for calendar container element. Default = {}
          style={{
            borderColor: 'gray',
            height: 350,
            margin: 10,
            borderRadius: 20,
          }}
          // Specify theme properties to override specific styles for calendar parts. Default = {}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            textSectionTitleDisabledColor: '#d9e1e8',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: 'orange',
            'stylesheet.calendar.header': {
              dayTextAtIndex0: {
                color: '#03dac6',
              },
              dayTextAtIndex6: {
                color: '#03dac6',
              },
              week: {
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            },
            disabledArrowColor: '#d9e1e8',
            monthTextColor: '#03dac6',
            indicatorColor: 'blue',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
        />
      </View>
    );
  };

  const initialNumToRender = 100; // Workaround for Detox 18 migration bug

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      initialNumToRender={initialNumToRender}>
      {renderCalendarWithWeekNumbers()}
    </ScrollView>
  );
};

export default CalendarsScreen;

const styles = StyleSheet.create({
  calendar: {
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center',
  },
  switchText: {
    margin: 10,
    fontSize: 16,
  },
  text: {
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'lightgrey',
    fontSize: 16,
  },
  disabledText: {
    color: 'grey',
  },
  defaultText: {
    color: 'purple',
  },
  customCalendar: {
    height: 250,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  customDay: {
    textAlign: 'center',
  },
  customHeader: {
    backgroundColor: '#FCC',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: -4,
    padding: 8,
  },
});
