import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  titleStyle: {
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3a82f6',
    margin: 5,
  },
  cardTittle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3a82f6',
    marginVertical: 5,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#fbfbfb',
    position: 'absolute',
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
  functionStyle: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
});
