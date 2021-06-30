import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const BlogScreen = () => {
  const navigation = useNavigation();
  const [listBlog, setListBlog] = useState([
    {
      id: 1,
      title: 'History Login',
      time: '2018-08-01 12:15 pm',
      image: 'https://via.placeholder.com/400x200/FFB6C1/000000',
      description: 'Your last login is ...',
    },
    {
      id: 2,
      title: 'Weather',
      time: '2018-08-12 12:00 pm',
      image: 'https://via.placeholder.com/400x200/7B68EE/000000',
      description: 'Weather today ...',
    },
    {
      id: 3,
      title: 'Jackpot',
      time: '2017-08-05 12:21 pm',
      image: 'https://via.placeholder.com/400x200/000080/000000',
      description: 'Jackpot today ...',
    },
  ]);

  const goBlogDetailScreen = () => {
    navigation.navigate('BlogDetail');
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={listBlog}
        keyExtractor={item => {
          return item.id;
        }}
        ItemSeparatorComponent={() => {
          return <View style={styles.separator} />;
        }}
        renderItem={post => {
          const item = post.item;
          return (
            <TouchableOpacity onPress={() => goBlogDetailScreen()}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <View style={styles.timeContainer}>
                      <Image
                        style={styles.iconData}
                        source={{
                          uri: 'https://img.icons8.com/color/96/3498db/calendar.png',
                        }}
                      />
                      <Text style={styles.time}>{item.time}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default BlogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 10,
  },
  separator: {},
  /******** card **************/
  card: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardImage: {
    flex: 1,
    height: 150,
    width: null,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  /******** card components **************/
  title: {
    fontSize: 18,
    flex: 1,
  },
  description: {
    fontSize: 15,
    color: '#888',
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
  },
  time: {
    fontSize: 13,
    color: '#808080',
    marginTop: 5,
  },
  icon: {
    width: 25,
    height: 25,
  },
  iconData: {
    width: 15,
    height: 15,
    marginTop: 5,
    marginRight: 5,
  },
  timeContainer: {
    flexDirection: 'row',
  },
});
