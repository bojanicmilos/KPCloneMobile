import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useState, useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';
import {database} from '../database/database';
import storage from '@react-native-firebase/storage';
import moment from 'moment';
import {ToastAndroid} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import IsNumber from './helperComponents/IsNumber';

const UpdateOglas = ({route, navigation}) => {
  const [oglas, setOglas] = useState(route.params.oglas);
  const {oglasId} = route.params;
  const [slike, setSlike] = useState(route.params.slike);

  const [allValid, setAllValid] = useState(true);
  const [kategorije, setKategorije] = useState([]);

  useEffect(() => {
    getKategorije();
    getSlike();
  }, []);

  useEffect(() => {
    validacija();
  }, [oglas.naslov, oglas.opis, oglas.cena, oglas.kategorijaId]);

  const validacija = () => {
    if (oglas.naslov === '') {
      setAllValid(false);
      return;
    }

    if (oglas.cena === '' || !IsNumber(oglas.cena.toString())) {
      setAllValid(false);
      return;
    }

    if (oglas.kategorijaId === '') {
      setAllValid(false);
      return;
    }

    if (oglas.opis === '') {
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

  const getSlike = async () => {
    console.log(oglasId);
    const slikeRefs = await storage().ref(`${oglasId}`).listAll();
    const urls = await Promise.all(
      slikeRefs.items.map(ref => ref.getDownloadURL()),
    );
    setSlike(urls);
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
      setSlike(images);
    }
  };

  const handleOnPress = () => {
    if (!allValid) {
      ToastAndroid.show('Pogresno popunjeni podaci', ToastAndroid.LONG);
      return;
    }

    const oglasRef = database.ref(`oglasi/${oglasId}`);

    if (slike[0].path) {
      const files = storage().ref(`${oglasId}`);

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

      Promise.all([
        oglasRef.update({
          naslov: oglas.naslov,
          opis: oglas.opis,
          datum: moment().format(),
          cena: +oglas.cena,
          kategorijaId: oglas.kategorijaId,
        }),
        ...slike.map(async (slika, index) => {
          const imgRef = storage().ref(`${oglasRef.key}/slika${index + 1}.jpg`);
          const result = await imgRef.putFile(slika.path);
          return result;
        }),
      ])
        .then(() => {
          ToastAndroid.show('Oglas uspesno azuriran', ToastAndroid.LONG);
        })
        .catch(error => {
          console.log(error, 'GRESKA');
        });
    } else {
      Promise.all([
        oglasRef.update({
          naslov: oglas.naslov,
          opis: oglas.opis,
          datum: moment().format(),
          cena: +oglas.cena,
          kategorijaId: oglas.kategorijaId,
        }),
      ])
        .then(() => {
          ToastAndroid.show('Oglas uspesno azuriran', ToastAndroid.LONG);
        })
        .catch(error => {
          console.log(error, 'GRESKA');
        });
    }
  };

  return (
    <ScrollView>
      <TextInput
        value={oglas.naslov}
        placeholder={'Naslov oglasa'}
        onChangeText={value => setOglas(prev => ({...prev, naslov: value}))}
        style={styles.input}
      />
      <TextInput
        value={oglas.cena.toString()}
        placeholder={'Cena'}
        onChangeText={value => setOglas(prev => ({...prev, cena: value}))}
        style={styles.input}
      />
      <TextInput
        value={oglas.opis}
        multiline
        numberOfLines={10}
        placeholder={'Opis'}
        onChangeText={value => setOglas(prev => ({...prev, opis: value}))}
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
                    source={{uri: slika.path || slika}}></Image>
                );
              })}
          </View>
        </TouchableOpacity>
      </View>
      <Picker
        selectedValue={oglas.kategorijaId}
        mode="dropdown"
        style={{height: 50, width: 150}}
        onValueChange={(itemValue, itemIndex) =>
          setOglas(prev => ({...prev, kategorijaId: itemValue}))
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
          <Text style={styles.dugmeText}>Azuriraj oglas</Text>
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

export default UpdateOglas;
