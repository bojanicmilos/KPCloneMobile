import 'react-native-gesture-handler';
import React from 'react';
import LoginProvider from './components/utils/LoginProvider';
import AppStack from './components/AppStack';

const App = () => {
  return (
    <LoginProvider>
      <AppStack />
    </LoginProvider>
  );
};

export default App;
