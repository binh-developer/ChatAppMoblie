import React, {useEffect, useState} from 'react';
import {
  Alert,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Avatar, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getTimeline,
  deleteStatus,
  getUserProfile,
  likeAndUnlikeStatus,
} from '../../helpers/firebase';
import {formatDateFull} from '../../utils/timeUtil';
import {sortAsc} from '../../utils/arrayUtil';
import styles from './styles';

export default function TimelineScreen({navigation}) {
  let listTimelineRef;
  const [listTimeline, setListTimeline] = useState([]);
  // Default is just 24h ago
  const [createdTime, setCreatedTime] = useState(
    new Date().getTime() - 24 * 60 * 60 * 1000,
  );
  const [limit, setLimit] = useState(100);

  useEffect(() => {
    let mounted = true;

    const timeline = getTimeline()
      .orderByChild('createdAt')
      .limitToLast(limit)
      .startAt(createdTime)
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

  const optionsStatus = statusId => {
    Alert.alert(
      'Option',
      'Choose option below',
      [
        {
          text: 'Delete Status',
          onPress: () => deleteStatus(statusId),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          console.log(
            'This alert was dismissed by tapping outside of the alert dialog.',
          ),
      },
    );
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

  const handleEndReached = () => {
    setCreatedTime(createdTime - 24 * 60 * 60 * 1000 * 3);
    getTimeline()
      .orderByChild('createdAt')
      .limitToLast(limit)
      .startAt(createdTime)
      .on('value', snapshot => {
        if (snapshot !== undefined) {
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
      });
  };

  const handleButtonToTop = async () => {
    listTimelineRef.scrollToOffset({offSet: 0, animated: true});
    setCreatedTime(new Date().getTime() - 24 * 60 * 60 * 1000);
    await getTimeline()
      .orderByChild('createdAt')
      .startAt(createdTime)
      .limitToLast(limit)
      .on('value', snapshot => {
        if (snapshot !== undefined) {
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
      });
  };

  return (
    <View style={styles.container}>
      {/* Create timeline */}

      <View style={styles.createStatus}>
        <View style={{marginHorizontal: 20}}>
          <Avatar
            rounded
            size="small"
            activeOpacity={0.7}
            source={{
              uri:
                getUserProfile()?.photoURL.length > 0
                  ? getUserProfile()?.photoURL
                  : 'https://lh4.googleusercontent.com/-v0soe-ievYE/AAAAAAAAAAI/AAAAAAACyas/yR1_yhwBcBA/photo.jpg?sz=150',
            }}
          />
        </View>
        <TouchableOpacity
          style={{flexDirection: 'column', marginHorizontal: 5}}
          onPress={() => newTimeline()}>
          <Text style={{color: '#808080', fontStyle: 'italic'}}>
            How are you today ?
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Icon name="pencil" size={18} color="#3a82f6" />
            <Text style={{color: '#3a82f6'}}>
              Add status {listTimeline.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* List Status */}
      <FlatList
        style={styles.list}
        data={Object.keys(listTimeline)}
        extraData={Object.keys(listTimeline)}
        keyExtractor={(item, index) => item}
        ItemSeparatorComponent={() => {
          return <View style={styles.separator} />;
        }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.05}
        ref={ref => {
          listTimelineRef = ref;
        }}
        renderItem={({item}) => {
          return (
            <View style={styles.card}>
              {/* Header Bar */}
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.title}>
                    {listTimeline[item].userName}
                  </Text>
                  <Text style={styles.time}>
                    {formatDateFull(listTimeline[item].createdAt)}
                  </Text>
                </View>
                {listTimeline[item].userId === getUserProfile()?.uid && (
                  <Icon
                    name="dots-horizontal"
                    size={20}
                    color="#3a82f6"
                    onPress={() => {
                      optionsStatus(listTimeline[item]._id);
                    }}
                  />
                )}
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.status}>{listTimeline[item].status}</Text>
              </View>

              {/* Image */}
              {listTimeline[item].imageURL !== undefined &&
                listTimeline[item].imageURL !== '' && (
                  <Image
                    style={styles.cardImage}
                    source={{
                      uri: listTimeline[item].imageURL,
                    }}
                  />
                )}

              {/* Footer */}
              <View style={styles.cardFooter}>
                <View style={styles.socialBarContainer}>
                  <View style={styles.socialBarSection}>
                    {!!listTimeline[item].likes ? (
                      <TouchableOpacity
                        onPress={() =>
                          toLikeAndUnlikeStatus(listTimeline[item]._id)
                        }>
                        {checkLiked(listTimeline[item].likes) ? (
                          <View style={styles.socialBarButton}>
                            <Icon name="heart" size={18} color="#f54748" />
                            <Text
                              style={{
                                color: '#f54748',
                                marginHorizontal: 5,
                                fontWeight: 'bold',
                              }}>
                              {Object.keys(listTimeline[item].likes).length}
                            </Text>
                          </View>
                        ) : (
                          <View style={styles.socialBarButton}>
                            <Icon
                              name="heart-outline"
                              size={18}
                              color="#f54748"
                            />
                            <Text
                              style={{
                                color: '#f54748',
                                marginHorizontal: 5,
                              }}>
                              {Object.keys(listTimeline[item].likes).length}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.socialBarButton}
                        onPress={() =>
                          toLikeAndUnlikeStatus(listTimeline[item]._id)
                        }>
                        <Icon name="heart-outline" size={18} color="#f54748" />
                        <Text style={{marginHorizontal: 5, color: '#f54748'}}>
                          0
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
      <Icon
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          backgroundColor: '#bfbfbf',
          borderRadius: 20,
          padding: 10,
          margin: 10,
        }}
        name="arrow-up"
        size={18}
        color="#3a82f6"
        onPress={() => {
          handleButtonToTop();
        }}
      />
    </View>
  );
}
