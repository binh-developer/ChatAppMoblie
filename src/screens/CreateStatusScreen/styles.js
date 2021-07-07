import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  containerView: {
    flex: 1,
  },
  statusScreenContainer: {
    flex: 1,
  },
  statusLogoText: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusFormView: {
    flex: 1,
  },
  statusFormTextInput: {
    height: 150,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    margin: 10,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  statusButton: {
    backgroundColor: '#3a82f6',
    borderRadius: 30,
    height: 45,
    marginHorizontal: 50,
    margin: 10,
  },
  imageBoxView: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  imageView: {
    flex: 1,
    height: 300,
    width: null,
    margin: 10,
    borderColor: '#f2f2f2',
    borderWidth: 1,
    borderRadius: 10,
  },
});
