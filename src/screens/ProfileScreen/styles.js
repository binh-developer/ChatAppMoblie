import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  cardTittle: {
    color: '#808080',
    fontSize: 15,
    marginBottom: 5,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  profileCard: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: 10,
    fontSize: 22,
    color: '#808080',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 'auto',
  },
  photosCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
  },
  photo: {
    width: 113,
    height: 113,
    marginTop: 5,
    marginRight: 5,
  },
});
