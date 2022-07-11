import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useState, useEffect} from 'react';
import {database} from '../database/database';

const FilterParametri = ({navigation}) => {
  const [kategorije, setKategorije] = useState([]);

  const [filterState, setFilterState] = useState({
    cenaVecaOd: '',
    cenaManjaOd: '',
    kategorijaId: '',
    mesto: '',
  });
  let isMounted = false;
  useEffect(() => {
    isMounted = true;
    if (isMounted) {
      getKategorije();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const getKategorije = async () => {
    const kategorije = await database.ref('kategorije').once('value');
    const data = kategorije.val();
    const values = Object.entries(data);
    if (isMounted) {
      setKategorije(values);
    }
  };

  const checkStateAndNavigate = () => {
    if (
      filterState.cenaManjaOd === '' &&
      filterState.cenaVecaOd === '' &&
      filterState.kategorijaId === '' &&
      filterState.mesto === ''
    ) {
      navigation.navigate('OglasiComp', {filterState: null});
    } else {
      navigation.navigate('OglasiComp', {filterState: filterState});
    }
  };

  const navigateWithoutState = () => {
    navigation.navigate('OglasiComp', {filterState: null});
  };

  return (
    <View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TextInput
          onChangeText={value =>
            setFilterState(prev => ({...prev, cenaVecaOd: value}))
          }
          style={styles.textInput}
          placeholder="Minimalna cena"
        />
        <TextInput
          onChangeText={value =>
            setFilterState(prev => ({...prev, cenaManjaOd: value}))
          }
          style={styles.textInput}
          placeholder="Maksimalna cena"
        />
      </View>
      <TextInput
        onChangeText={value =>
          setFilterState(prev => ({...prev, mesto: value}))
        }
        style={styles.textInput}
        placeholder="Mesto"
      />
      <Picker
        selectedValue={filterState.kategorijaId}
        mode="dropdown"
        style={{height: 50, width: 335, margin: 20}}
        onValueChange={(itemValue, itemIndex) =>
          setFilterState(prev => ({...prev, kategorijaId: itemValue}))
        }>
        <Picker.Item label={`Sve kategorije`} value="" />
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
      <View style={styles.dugmeCont}>
        <View style={styles.dugme}>
          <TouchableOpacity onPress={() => checkStateAndNavigate()}>
            <Text style={styles.dugmeText}>Primeni filtere</Text>
          </TouchableOpacity>
        </View>
        <View style={{...styles.dugme, backgroundColor: '#db3d13'}}>
          <TouchableOpacity onPress={() => navigateWithoutState()}>
            <Text style={styles.dugmeText}>Ponisti filtere</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10,
    margin: 20,
    borderRadius: 5,
  },
  dugme: {
    marginLeft: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    width: 100,
    backgroundColor: '#429ef5',
  },
  dugmeText: {
    color: 'white',
    textTransform: 'uppercase',
  },
  dugmeCont: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default FilterParametri;
