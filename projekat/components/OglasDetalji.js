import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const OglasDetalji = ({route, navigation}) => {
  const {oglas, slike, oglasId, korisnik} = route.params;
  console.log(slike, 'SLIKE');

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
      style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Prikazi slike', {slike: slike});
        }}>
        <Image source={{uri: slike[0]}} style={styles.slika}></Image>
      </TouchableOpacity>
      <Text style={styles.naslov}>{oglas.naslov}</Text>
      <Text style={styles.cenaLabel}>{oglas.cena},00 din</Text>
      <Text style={styles.opis}>{oglas.opis}</Text>
      <Text style={styles.imePrezime}>
        {korisnik.ime} {korisnik.prezime}
      </Text>
      <Text style={styles.telefon}>{korisnik.brojTelefona}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 30,
    marginLeft: 29,
    marginRight: 29,
  },
  slika: {
    height: 300,
    width: 300,
    borderRadius: 10,
  },
  naslov: {
    color: '#2596be',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 20,
    marginTop: 10,
  },
  cenaLabel: {
    marginTop: 8,
    fontSize: 20,
    color: '#bf3e22',
  },
  cena: {
    fontWeight: 'bold',
  },
  opis: {
    textAlign: 'justify',
    fontSize: 18,
    marginTop: 8,
  },
  imePrezime: {
    color: '#2596be',
    fontSize: 18,
  },
  telefon: {
    color: '#2596be',
    fontSize: 18,
  },
});

export default OglasDetalji;
