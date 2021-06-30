import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  createRoomView: {
    margin: 16,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  boxBelow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 5,
  },
  buttonContainerView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyleView: {
    backgroundColor: '#DBE0FE',
    borderRadius: 30,
    paddingHorizontal: 10,
  },
  titleStyleView: {
    color: '#3a82f6',
    fontSize: 15,
  },
});
