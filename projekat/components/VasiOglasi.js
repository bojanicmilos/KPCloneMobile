import React from 'react';
import {useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {database} from '../database/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native';
import KorisnickiOglas from './KorisnickiOglas';
import storage from '@react-native-firebase/storage';

const VasiOglasi = ({navigation}) => {
  const [oglasi, setOglasi] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    getOglasiZaKorisnika();
  }, [isFocused]);

  const getOglasiZaKorisnika = async () => {
    const userId = await AsyncStorage.getItem('id');
    console.log(userId, 'KORISNIK ID');
    const oglasi = await database
      .ref('oglasi')
      .orderByChild('korisnikId')
      .equalTo(userId)
      .once('value');
    const data = oglasi.val();
    data === null ? setOglasi([]) : setOglasi(Object.entries(data));
  };

  const obrisiOglas = async id => {
    await database.ref(`oglasi/${id}`).remove();
    await database.ref(`/oglasi/${id}`).set(null);

    const files = storage().ref(`${id}`);
    files
      .listAll()
      .then(dir => {
        dir.items.forEach(fileRef => {
          var dirRef = storage().ref(fileRef.fullPath);
          dirRef.getDownloadURL().then(url => {
            var imgRef = storage().refFromURL(url);
            imgRef
              .delete()
              .then(() => {
                console.log('slika obrisana');
              })
              .catch(error => {
                console.log(error, 'GRESKA');
              });
          });
        });
      })
      .catch(error => {
        console.log(error, 'GRESKA');
      });
    let preostaliOglasi = oglasi.filter(oglas => oglas[0] !== id);
    setOglasi(preostaliOglasi);
  };

  return (
    <ScrollView>
      {oglasi.map(oglas => {
        return (
          <KorisnickiOglas
            navigation={navigation}
            obrisiOglas={obrisiOglas}
            key={oglas[0]}
            {...{oglas: oglas[1], oglasId: oglas[0]}}
          />
        );
      })}
    </ScrollView>
  );
};

export default VasiOglasi;
