import React from 'react';
import {
  DrawerItem,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import FireBaseUtil from './utils/FirebaseUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawerContent = props => {
  return (
    <DrawerContentScrollView
      contentContainerStyle={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
      {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        style={{flex: 1, justifyContent: 'flex-end'}}
        label="Odjavi se"
        onPress={() => {
          FireBaseUtil.signOut().then(() => {
            AsyncStorage.removeItem('id');
          });
        }}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
