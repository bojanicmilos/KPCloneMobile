import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useState, useEffect} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
import {database} from '../database/database';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import storage from '@react-native-firebase/storage';
import IsNumber from './helperComponents/IsNumber';

const DodajOglas = ({navigation}) => {
  const [sendState, setState] = useState({
    naslov: '',
    opis: '',
    cena: '',
    kategorijaId: '',
  });
  const [allValid, setAllValid] = useState(false);

  const [kategorije, setKategorije] = useState([]);
  const [slike, setSlika] = useState([]);

  useEffect(() => {
    getKategorije();
  }, []);

  useEffect(() => {
    validacija();
  }, [
    sendState.naslov,
    sendState.opis,
    sendState.cena,
    sendState.kategorijaId,
  ]);

  const validacija = () => {
    if (sendState.naslov === '') {
      setAllValid(false);
      return;
    }

    if (sendState.cena === '' || !IsNumber(sendState.cena)) {
      setAllValid(false);
      return;
    }

    if (sendState.kategorijaId === '') {
      setAllValid(false);
      return;
    }

    if (sendState.opis === '') {
      setAllValid(false);
      return;
    }

    if (slike.length < 1) {
      setAllValid(false);
      return;
    }

    setAllValid(true);
  };

  const getKategorije = async () => {
    const kategorije = await database.ref('kategorije').once('value');
    const data = kategorije.val();
    const values = Object.entries(data);
    console.log(values);
    setKategorije(values);
  };

  const handleOnPress = async () => {
    if (!allValid) {
      ToastAndroid.show('Pogresno popunjeni podaci', ToastAndroid.LONG);
      return;
    }

    const userId = await AsyncStorage.getItem('id');

    const oglasRef = database.ref('oglasi').push();

    Promise.all([
      oglasRef.set({
        naslov: sendState.naslov,
        opis: sendState.opis,
        datum: moment().format(),
        cena: +sendState.cena,
        kategorijaId: sendState.kategorijaId,
        korisnikId: userId,
      }),
      ...slike.map(async (slika, index) => {
        const imgRef = storage().ref(`${oglasRef.key}/slika${index + 1}.jpg`);
        const result = await imgRef.putFile(slika.path);
        return result;
      }),
    ]).then(() => {
      setState({
        naslov: '',
        opis: '',
        cena: '',
        kategorijaId: '',
      });
      setSlika([]);
      ToastAndroid.show('Oglas uspesno upisan', ToastAndroid.LONG);
    });
  };

  const dodajSlike = async () => {
    const images = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      multiple: true,
    });
    if (images.length > 8) {
      ToastAndroid.show(
        'Mozete uneti najvise 8 slika !',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    } else {
      setSlika(images);
    }
  };

  return (
    <ScrollView>
      <TextInput
        value={sendState.naslov}
        placeholder={'Naslov oglasa'}
        onChangeText={value => setState(prev => ({...prev, naslov: value}))}
        style={styles.input}
      />
      <TextInput
        value={sendState.cena}
        placeholder={'Cena'}
        onChangeText={value => setState(prev => ({...prev, cena: value}))}
        style={styles.input}
      />
      <TextInput
        value={sendState.opis}
        multiline
        numberOfLines={10}
        placeholder={'Opis'}
        onChangeText={value => setState(prev => ({...prev, opis: value}))}
        style={[styles.input, styles.text]}
      />
      <View style={styles.dodajSliku}>
        <Text>Dodaj slike: </Text>
        <TouchableOpacity
          style={{width: 30, borderRadius: 10}}
          onPress={dodajSlike}>
          <Image
            style={{height: 30, width: 30}}
            source={require('./assets/kisspng-computer-icons-clip-art-add-button-5b4c75511c61b3.6026306715317374251163.png')}></Image>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Prikazi slike', {slike: slike});
          }}>
          <View style={styles.imgs}>
            {slike.length !== 0 &&
              slike.map((slika, index) => {
                return (
                  <Image
                    key={index}
                    style={{
                      borderRadius: 5,
                      height: 120,
                      width: 75,
                      marginLeft: 4,
                      marginTop: 4,
                    }}
                    source={{uri: slika.path}}></Image>
                );
              })}
          </View>
        </TouchableOpacity>
      </View>
      <Picker
        selectedValue={sendState.kategorijaId}
        mode="dropdown"
        style={{height: 50, width: 150}}
        onValueChange={(itemValue, itemIndex) =>
          setState(prev => ({...prev, kategorijaId: itemValue}))
        }>
        <Picker.Item label={`Odaberite opciju`} value="" />
        {kategorije.map(kategorija => {
          return (
            <Picker.Item
              key={kategorija[0]}
              label={kategorija[1]}
              value={kategorija[0]}
            />
          );
        })}
      </Picker>

      <View style={allValid ? styles.dugme : styles.dugmeRestrikcija}>
        <TouchableOpacity onPress={handleOnPress}>
          <Text style={styles.dugmeText}>Postavi oglas</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  text: {
    textAlignVertical: 'top',
  },
  imgs: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  dodajSliku: {
    marginLeft: 12,
  },
  dugme: {
    marginLeft: 12,
    borderRadius: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    width: 100,
    backgroundColor: '#429ef5',
  },
  dugmeRestrikcija: {
    marginLeft: 12,
    borderRadius: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    width: 100,
    backgroundColor: '#429ef5',
    opacity: 0.5,
  },
  dugmeText: {
    color: 'white',
    textTransform: 'uppercase',
  },
});

export default DodajOglas;
