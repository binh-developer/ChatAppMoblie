import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  containerView: {
    flex: 1,
  },
  roomScreenContainer: {
    flex: 1,
  },
  roomLogoText: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 150,
    marginBottom: 20,
    textAlign: 'center',
  },
  roomFormView: {
    flex: 1,
  },
  roomFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    paddingLeft: 20,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  roomButton: {
    backgroundColor: '#3a82f6',
    borderRadius: 30,
    height: 45,
    marginHorizontal: 100,
    marginTop: 10,
  },
});
