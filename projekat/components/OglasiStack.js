import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Oglasi from './Oglasi';
import Swiper from './helperComponents/Swiper';
import OglasDetalji from './OglasDetalji';
import FilterParametri from './FilterParametri';

const Stack = createStackNavigator();

const OglasiStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="OglasiComp"
        component={Oglasi}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Oglas Detalji"
        component={OglasDetalji}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Filter parametri"
        component={FilterParametri}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Prikazi slike"
        component={Swiper}
      />
    </Stack.Navigator>
  );
};

export default OglasiStack;
