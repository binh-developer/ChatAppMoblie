import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getTimeline,
  deleteStatus,
  getUserProfile,
  likeAndUnlikeStatus,
} from '../../helpers/firebase';
import {formatDateFull} from '../../utils/timeUtil';
import {sortAsc} from '../../utils/arrayUtil';

export default function TimelineScreen({navigation}) {
  const [listTimeline, setListTimeline] = useState([]);

  useEffect(() => {
    let mounted = true;

    const timeline = getTimeline()
      .limitToLast(100)
      .on('value', snapshot => {
        if (snapshot !== undefined) {
          if (mounted) {
            let data = snapshot.val();
            let rawMessage = Object.keys(data).map((key, index) => ({
              _id: key,
              userId: data[key].userId,
              userName: data[key].userName,
              status: data[key].status,
              imageURL: data[key].imageURL,
              likes: data[key].likes,
              createdAt: data[key].createdAt,
            }));

            setListTimeline(sortAsc(rawMessage));
          }
        }
      });
    return timeline, () => (mounted = false);
  }, []);

  const newTimeline = () => {
    navigation.navigate('Status');
  };

  const toDeleteStatus = statusId => {
    deleteStatus(statusId);
  };

  const toLikeAndUnlikeStatus = async statusId => {
    await likeAndUnlikeStatus(statusId);
  };

  const checkLiked = listLiked => {
    let temp = false;
    Object.keys(listLiked).forEach(key => {
      if (listLiked[key].userId === getUserProfile()?.uid) {
        temp = true;
      }
    });
    if (temp) {
      return true;
    } else return false;
  };

  return (
    <View style={styles.container}>
      {/* Create timeline */}

      <View style={styles.createStatus}>
        <Text style={{color: '#808080', fontStyle: 'italic'}}>
          How are you today ?
        </Text>
        <Button
          icon={<Icon name="pencil" size={20} color="#3a82f6" />}
          titleStyle={styles.titleStyleView}
          buttonStyle={styles.buttonStyleView}
          title="Add status"
          onPress={() => newTimeline()}
        />
      </View>

      <FlatList
        style={styles.list}
        data={Object.keys(listTimeline)}
        extraData={Object.keys(listTimeline)}
        keyExtractor={(item, index) => item}
        ItemSeparatorComponent={() => {
          return <View style={styles.separator} />;
        }}
        renderItem={({item}) => {
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.title}>
                    {listTimeline[item].userName}
                  </Text>
                  <Text style={styles.description}>
                    {listTimeline[item].status}
                  </Text>
                </View>
              </View>
              {listTimeline[item].imageURL !== undefined && (
                <Image
                  style={styles.cardImage}
                  source={{
                    uri: listTimeline[item].imageURL,
                  }}
                />
              )}
              <View style={styles.cardFooter}>
                <View style={styles.socialBarContainer}>
                  <View style={styles.socialBarSection}>
                    <View style={styles.socialBarButton}>
                      {!!listTimeline[item].likes ? (
                        <TouchableOpacity
                          style={{
                            marginVertical: 10,
                          }}
                          onPress={() =>
                            toLikeAndUnlikeStatus(listTimeline[item]._id)
                          }>
                          {checkLiked(listTimeline[item].likes) ? (
                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={{
                                  color: 'blue',
                                  marginHorizontal: 5,
                                }}>
                                {Object.keys(listTimeline[item].likes).length}
                              </Text>
                              <Icon name="thumb-up" size={18} color="#3a82f6" />
                            </View>
                          ) : (
                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={{
                                  color: 'black',
                                  marginHorizontal: 5,
                                }}>
                                {Object.keys(listTimeline[item].likes).length}
                              </Text>
                              <Icon
                                name="thumb-up-outline"
                                size={18}
                                color="#3a82f6"
                              />
                            </View>
                          )}
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            margin: 10,
                          }}
                          onPress={() =>
                            toLikeAndUnlikeStatus(listTimeline[item]._id)
                          }>
                          <Text style={{marginHorizontal: 10}}>0</Text>
                          <Icon
                            name="thumb-up-outline"
                            size={18}
                            color="#3a82f6"
                          />
                        </TouchableOpacity>
                      )}

                      {/* Delete Status */}
                      {listTimeline[item].userId === getUserProfile()?.uid && (
                        <Button
                          icon={
                            <Icon name="delete" size={18} color="#ff3333" />
                          }
                          titleStyle={styles.socialBarTitleStyle}
                          buttonStyle={styles.socialBarButtonStyle}
                          title=""
                          onPress={() => toDeleteStatus(listTimeline[item]._id)}
                        />
                      )}
                    </View>
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={styles.time}>
                      {formatDateFull(listTimeline[item].createdAt)}
                    </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  list: {
    margin: 5,
  },
  separator: {
    margin: 5,
  },
  /******* create status *******/
  createStatus: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ADD8E6',
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
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
  },
  cardHeader: {
    paddingHorizontal: 15,
    paddingVertical: 5,
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
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopColor: 'white',
    borderTopWidth: 1,
  },
  cardImage: {
    flex: 1,
    height: 500,
    width: null,
    margin: 5,
  },
  /******** card components **************/
  title: {
    fontSize: 15,
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
    color: 'black',
    marginHorizontal: 20,
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
  socialBarButtonStyle: {
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  socialBarTitleStyle: {
    color: '#3a82f6',
    fontSize: 15,
    marginHorizontal: 5,
  },
});
