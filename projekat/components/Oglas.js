import React from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import storage from '@react-native-firebase/storage';
import {useState, useEffect} from 'react';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import {database} from '../database/database';

const Oglas = ({oglasId, oglas, navigation}) => {
  const isFocused = useIsFocused();

  const priceFormatter = new Intl.NumberFormat('sr-SR', {
    style: 'currency',
    currency: 'DIN',
  });

  let isMounted = false;
  const [korisnik, setKorisnik] = useState({});

  const [slike, setSlike] = useState([]);
  const getSlike = async () => {
    const slikeRefs = await storage().ref(`${oglasId}`).listAll();
    const urls = await Promise.all(
      slikeRefs.items.map(ref => ref.getDownloadURL()),
    );
    if (isMounted) {
      setSlike(urls);
    }
  };

  const getKorisnik = async () => {
    const korisnik = await database
      .ref(`users/${oglas.korisnikId}`)
      .orderByValue()
      .once('value');
    const data = korisnik.val();
    if (isMounted) {
      setKorisnik(data);
    }
  };

  useEffect(() => {
    isMounted = true;
    getSlike();
    getKorisnik();

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Oglas Detalji', {
          oglasId: oglasId,
          oglas: oglas,
          slike: slike,
          korisnik: korisnik,
        });
      }}>
      <View style={styles.containerElement}>
        <View>
          <Image style={styles.slika} source={{uri: slike[0]}} />
        </View>
        <View style={styles.containerText}>
          <Text style={styles.naslov}>
            {oglas.naslov.length < 25
              ? oglas.naslov
              : `${oglas.naslov.slice(0, 25)}...`}
          </Text>
          <Text style={styles.cena}>{priceFormatter.format(oglas.cena)}</Text>
          <Text style={styles.grad}>{korisnik.grad}</Text>
          <Text style={styles.datum}>{moment(oglas.datum).fromNow()}</Text>
        </View>
        <Image
          style={{height: 15, width: 15}}
          source={require('./assets/Dot-PNG-Free-Download.png')}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerElement: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#C0C0C0',
  },
  containerText: {
    flex: 1,
    flexDirection: 'column',
  },

  slika: {
    height: 160,
    width: 120,
    borderRadius: 10,
    marginRight: 10,
  },
  naslov: {
    color: '#2596be',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 19,
  },
  grad: {},
  cena: {
    fontSize: 18,
    color: '#bf3e22',
  },
  // datum: {

  // }
});

export default Oglas;
