import React from 'react';
import OglasiStack from './OglasiStack';
import DodajOglasStack from './DodajOglasStack';
import VasiOglasiStack from './VasiOglasiStack';
import {useContext} from 'react';
import {LoginContext} from './utils/LoginProvider';
import Loading from './Loading';
import LoginScreen from './LoginScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

const AppStack = () => {
  const {user, isLoading} = useContext(LoginContext);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : user ? (
        <NavigationContainer>
          <Drawer.Navigator
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={{swipeEdgeWidth: 100}}>
            <Drawer.Screen name="Oglasi" component={OglasiStack} />
            <Drawer.Screen name="Dodaj Oglas" component={DodajOglasStack} />
            <Drawer.Screen name="Vasi Oglasi" component={VasiOglasiStack} />
          </Drawer.Navigator>
        </NavigationContainer>
      ) : (
        <LoginScreen />
      )}
    </>
  );
};

export default AppStack;
