import React from 'react';
import {View, StyleSheet, TextInput, Text, Button} from 'react-native';
import {useState} from 'react';
import FireBaseUtil from './utils/FirebaseUtil';
import {database} from '../database/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState();
  const [lozinka, setLozinka] = useState();
  const [ime, setIme] = useState();
  const [prezime, setPrezime] = useState();
  const [brojTelefona, setBrojTelefona] = useState();
  const [grad, setGrad] = useState();

  const [create, setCreate] = useState(false);

  const ulogujSe = () => {
    FireBaseUtil.signIn(email, lozinka)
      .then(res => {
        AsyncStorage.setItem('id', res.user.uid.toString());
      })
      .catch(e => {
        console.log(e);
        alert('Email i lozinka se ne poklapaju.');
      });
  };

  const registrujSe = () => {
    FireBaseUtil.signUp(email, lozinka)
      .then(res => {
        database
          .ref(`users/${res.user.uid}`)
          .set({
            email,
            ime,
            prezime,
            brojTelefona,
            grad,
          })
          .then(() => {
            AsyncStorage.setItem('id', res.user.uid);
          });
      })
      .catch(error => {
        if (error.code === 'auth/weak-password') {
          alert('Lozinka mora imati bar 6 karaktera !');
        } else if (error.code === 'auth/invalid-email') {
          alert('Pogresan email !');
        } else if (error.code === 'auth/email-already-in-use') {
          alert('Email koji ste uneli je vec u upotrebi !');
        } else {
          alert('Greska prilikom registracije !');
        }
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{...styles.textInput, marginTop: 55}}
      />
      <TextInput
        placeholder="Lozinka"
        value={lozinka}
        onChangeText={setLozinka}
        style={styles.textInput}
        secureTextEntry={true}
      />
      {create ? (
        <>
          <TextInput
            placeholder="Ime"
            value={ime}
            onChangeText={setIme}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Prezime"
            value={prezime}
            onChangeText={setPrezime}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Grad"
            value={grad}
            onChangeText={setGrad}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Broj telefona"
            value={brojTelefona}
            onChangeText={setBrojTelefona}
            style={styles.textInput}
          />
          <Button title="Registruj se" onPress={() => registrujSe()} />
          <Text onPress={() => setCreate(false)} style={styles.text}>
            Uloguj se
          </Text>
        </>
      ) : (
        <>
          <Button title="Uloguj se" onPress={() => ulogujSe()} />
          <Text onPress={() => setCreate(true)} style={styles.text}>
            Napravi nalog
          </Text>
        </>
      )}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  text: {
    color: 'blue',
    marginTop: 20,
  },
});
