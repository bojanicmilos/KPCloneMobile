import React from 'react';
import {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';

export const LoginContext = React.createContext({});

const LoginProvider = props => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const onAuthStateChanged = user => {
    setUser(user);
    setIsLoading(false);
  };

  useEffect(() => {
    const subscribe = auth().onAuthStateChanged(onAuthStateChanged);
    return subscribe;
  }, []);
  return (
    <LoginContext.Provider value={{user, isLoading}}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
