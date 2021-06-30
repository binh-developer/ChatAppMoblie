import React from 'react';
import {StyleSheet, Button, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const BlogBox = () => {
  const navigation = useNavigation();
  const toBlogScreen = () => {
    navigation.navigate('Blog');
  };
  return (
    <View style={styles.blogContainer}>
      <Button
        icon={
          <Icon
            name="blogger"
            size={20}
            color="#3a82f6"
            style={{marginRight: 5}}
          />
        }
        titleStyle={{
          color: '#3a82f6',
          fontSize: 15,
        }}
        buttonStyle={{
          backgroundColor: '#DBE0FE',
          borderRadius: 30,
          paddingHorizontal: 10,
        }}
        title="Blog"
        onPress={toBlogScreen}
      />
    </View>
  );
};

export default BlogBox;

const styles = StyleSheet.create({
  blogContainer: {
    backgroundColor: '#e8e8e8',
    margin: 10,
    borderRadius: 20,
  },
  textStyle: {color: '#3a82f6', margin: 10, fontSize: 16},
  iconView: {backgroundColor: '#FFFF33', borderRadius: 20, margin: 5},
});
