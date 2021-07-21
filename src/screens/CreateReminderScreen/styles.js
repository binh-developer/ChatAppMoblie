import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  containerView: {
    flex: 1,
  },
  reminderScreenContainer: {
    flex: 1,
  },
  reminderLogoText: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  reminderFormView: {
    flex: 1,
  },
  reminderFormTextInput: {
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

  reminderTimeView: {
    margin: 5,
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  reminderSetTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reminderButton: {
    backgroundColor: '#3a82f6',
    borderRadius: 30,
    height: 45,
    marginHorizontal: 100,
    marginTop: 10,
  },
  reminderText: {
    color: '#3a82f6',
    fontWeight: 'bold',
    marginLeft: 20,
  },

  searchContainer: {
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  searchInput: {
    height: 45,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
});
