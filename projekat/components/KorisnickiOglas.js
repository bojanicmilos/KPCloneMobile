import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useState, useEffect} from 'react';
import storage from '@react-native-firebase/storage';
import moment from 'moment';

const KorisnickiOglas = ({oglas, oglasId, obrisiOglas, navigation}) => {
  const isFocused = useIsFocused();

  const [slike, setSlike] = useState([]);

  const priceFormatter = new Intl.NumberFormat('sr-SR', {
    style: 'currency',
    currency: 'DIN',
  });

  let isMounted = false;

  const getSlike = async () => {
    console.log(oglasId);
    const slikeRefs = await storage().ref(`${oglasId}`).listAll();
    const urls = await Promise.all(
      slikeRefs.items.map(ref => ref.getDownloadURL()),
    );
    if (isMounted) {
      setSlike(urls);
    }
  };

  useEffect(() => {
    isMounted = true;
    getSlike();
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const deleteHandler = () => {
    console.log('DELETE HANDLER');
    return Alert.alert(
      'Da li ste sigurni?',
      'Da li ste sigurni da zelite da obrisete oglas?',
      [
        {
          text: 'Da',
          onPress: () => {
            obrisiOglas(oglasId);
          },
        },
        {
          text: 'Ne',
        },
      ],
    );
  };

  const updateHandler = () => {
    navigation.navigate('UpdateOglas', {
      oglasId: oglasId,
      oglas: oglas,
      slike: slike,
    });
  };

  return (
    <View>
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
          <Text style={styles.datum}>{moment(oglas.datum).fromNow()}</Text>
        </View>
        <View style={styles.imgCont}>
          <TouchableOpacity onPress={updateHandler}>
            <Image
              style={{height: 35, width: 55}}
              source={require('./assets/580b57fcd9996e24bc43c44d.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteHandler}>
            <Image
              style={{height: 30, width: 30}}
              source={require('./assets/delete-removebg-preview.png')}
            />
          </TouchableOpacity>
        </View>
        <Image
          style={{height: 15, width: 15}}
          source={require('./assets/Dot-PNG-Free-Download.png')}
        />
      </View>
    </View>
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
  imgCont: {
    height: 90,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cena: {
    fontSize: 18,
    color: '#bf3e22',
  },
  // datum: {

  // }
});

export default KorisnickiOglas;
