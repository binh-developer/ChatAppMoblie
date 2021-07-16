import React, {useState} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';

const Reminder = () => {
  const [listData, setListData] = useState([
    {
      id: 1,
      reminderTitle: 'You',
      color: '#FF4500',
      image: 'https://img.icons8.com/color/70/000000/name.png',
      createdAt: new Date().getTime(),
    },
    {
      id: 2,
      reminderTitle: 'Home',
      color: '#87CEEB',
      image: 'https://img.icons8.com/office/70/000000/home-page.png',
      createdAt: new Date().getTime(),
    },
    {
      id: 3,
      reminderTitle: 'Love',
      color: '#4682B4',
      image: 'https://img.icons8.com/color/70/000000/two-hearts.png',
      createdAt: new Date().getTime(),
    },
    {
      id: 4,
      reminderTitle: 'Family',
      color: '#6A5ACD',
      image: 'https://img.icons8.com/color/70/000000/family.png',
      createdAt: new Date().getTime(),
    },
    {
      id: 5,
      reminderTitle: 'Friends',
      color: '#FF69B4',
      image: 'https://img.icons8.com/color/70/000000/groups.png',
      createdAt: new Date().getTime(),
    },

    {
      id: 6,
      reminderTitle: 'Friends',
      color: '#FF69B4',
      image: 'https://img.icons8.com/color/70/000000/groups.png',
      createdAt: new Date().getTime(),
    },
    {
      id: 7,
      reminderTitle: 'Friends',
      color: '#FF69B4',
      image: 'https://img.icons8.com/color/70/000000/groups.png',
      createdAt: new Date().getTime(),
    },
    {
      id: 8,
      reminderTitle: 'Friends',
      color: '#FF69B4',
      image: 'https://img.icons8.com/color/70/000000/groups.png',
      createdAt: new Date().getTime(),
    },
    {
      id: 9,
      reminderTitle: 'Friends',
      color: '#FF69B4',
      image: 'https://img.icons8.com/color/70/000000/groups.png',
      createdAt: new Date().getTime(),
    },
    {
      id: 10,
      reminderTitle: 'Friends',
      color: '#FF69B4',
      image: 'https://img.icons8.com/color/70/000000/groups.png',
      createdAt: new Date().getTime(),
    },
  ]);

  return (
    <View style={{flex: 1}}>
      <View style={styles.createContainer}>
        <Text>Set up reminder for yourself</Text>
        <TouchableOpacity onPress={() => console.log('click reminder')}>
          <Text
            style={{
              color: '#3a82f6',
              fontSize: 16,
              fontWeight: 'bold',
              margin: 10,
            }}>
            Create
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        enableEmptySections={true}
        style={styles.list}
        data={listData}
        horizontal={false}
        keyExtractor={item => {
          return item.id;
        }}
        renderItem={({item}) => {
          return (
            <View style={styles.listContainer}>
              <TouchableOpacity
                style={styles.touchableOpacityStyle}
                onPress={() => {
                  console.log(item.id);
                }}>
                <Text style={styles.reminderTitle}>{item.reminderTitle}</Text>
                <Text style={styles.reminderTitle}>{item.createdAt}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Reminder;

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
    // padding: 10,
    margin: 10,
    marginTop: 0,
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    marginHorizontal: 10,
  },

  touchableOpacityStyle: {
    flexDirection: 'row',
    backgroundColor: '#80d6ff',
    alignItems: 'center',
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
  },
  cardImage: {
    height: 30,
    width: 30,
  },
  reminderTitle: {
    fontSize: 18,
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 20,
  },
});
