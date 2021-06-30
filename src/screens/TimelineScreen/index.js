import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {Button} from 'react-native-elements';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          id: 1,
          title: 'User 1',
          time: '2018-08-01 12:15 pm',
          image: 'https://via.placeholder.com/400x200/FFB6C1/000000',
          description: 'I love those day',
        },
        {
          id: 2,
          title: 'Sit amet, consectetuer',
          time: '2018-08-12 12:00 pm',
          image: 'https://via.placeholder.com/400x200/7B68EE/000000',
          description:
            'Lorem  dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula...',
        },
        {
          id: 3,
          title: 'Dipiscing elit. Aenean ',
          time: '2017-08-05 12:21 pm',
          image: 'https://via.placeholder.com/400x200/000080/000000',
          description:
            'Lorem ipsum dolor sit , consectetuer  elit. Aenean commodo ligula...',
        },
      ],
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {/* Create timeline */}

        <View style={styles.createStatus}>
          <Text>How are you today ?</Text>
          <Button
            icon={<Icon name="pencil" size={20} color="#3a82f6" />}
            titleStyle={styles.titleStyleView}
            buttonStyle={styles.buttonStyleView}
            title="Add status"
            onPress={() => console.log('click')}
          />
        </View>

        <FlatList
          style={styles.list}
          data={this.state.data}
          keyExtractor={item => {
            return item.id;
          }}
          ItemSeparatorComponent={() => {
            return <View style={styles.separator} />;
          }}
          renderItem={post => {
            const item = post.item;
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                  </View>
                </View>
                <Image style={styles.cardImage} source={{uri: item.image}} />
                <View style={styles.cardFooter}>
                  <View style={styles.socialBarContainer}>
                    <View style={styles.socialBarSection}>
                      <TouchableOpacity style={styles.socialBarButton}>
                        <Icon
                          name="thumb-up-outline"
                          size={20}
                          color="#3a82f6"
                        />
                        <Text style={styles.socialBarLabel}>78 likes</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.timeContainer}>
                      <Icon name="calendar" size={20} color="#3a82f6" />
                      <Text style={styles.time}>{item.time}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  list: {
    paddingHorizontal: 5,
  },
  separator: {
    // marginTop: 10,
  },
  /******* create status *******/
  createStatus: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyleView: {
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
  },
  titleStyleView: {
    color: '#3a82f6',
    fontSize: 15,
  },
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  cardImage: {
    flex: 1,
    height: 150,
    width: null,
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
    marginHorizontal: 10,
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
    alignItems: 'center',
  },
  /******** social bar ******************/
  socialBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  socialBarSection: {
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  socialBarLabel: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  socialBarButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
