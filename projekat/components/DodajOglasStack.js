import React from 'react';
import DodajOglas from './DodajOglas';
import Swiper from './helperComponents/Swiper';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const DodajOglasStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="Dodaj oglas comp"
        component={DodajOglas}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Prikazi slike"
        component={Swiper}
      />
    </Stack.Navigator>
  );
};

export default DodajOglasStack;
