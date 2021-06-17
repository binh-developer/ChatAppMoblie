import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  containerView: {
    flex: 1,
  },
  loginScreenContainer: {
    flex: 1,
  },
  logoText: {
    color: '#3a82f6',
    fontSize: 35,
    fontWeight: 'bold',
    marginTop: 150,
    textAlign: 'center',
  },
  subLogoText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 30,
  },
  loginFormView: {
    flex: 1,
  },
  loginFormTextInput: {
    height: 43,
    fontFamily: 'default',
    fontSize: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: '#3a82f6',
    borderRadius: 30,
    height: 45,
    marginHorizontal: 100,
    marginTop: 10,
  },
});
