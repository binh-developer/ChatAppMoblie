import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  list: {
    marginVertical: 5,
  },
  separator: {
    marginBottom: 5,
  },
  /******* create status *******/
  createStatus: {
    flexDirection: 'row',
    marginTop: 5,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
    borderColor: '#f2f2f2',
    borderWidth: 1,
  },
  cardHeader: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    paddingHorizontal: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardFooter: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderTopColor: '#f2f2f2',
    borderTopWidth: 1,
  },
  cardImage: {
    flex: 1,
    height: 400,
    width: null,
    margin: 5,
    borderColor: '#f2f2f2',
    borderWidth: 1,
    borderRadius: 10,
  },
  /******** card components **************/
  title: {
    fontSize: 15,
    flex: 1,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 15,
    color: '#000',
    marginVertical: 10,
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
  /******** social bar ******************/
  socialBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  socialBarSection: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 20,
  },
  socialBarButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
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
