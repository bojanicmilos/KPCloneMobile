import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import VasiOglasi from './VasiOglasi';
import UpdateOglas from './UpdateOglas';

const Stack = createStackNavigator();

const VasiOglasiStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="Vasi oglasi comp"
        component={VasiOglasi}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="UpdateOglas"
        component={UpdateOglas}
      />
    </Stack.Navigator>
  );
};

export default VasiOglasiStack;
