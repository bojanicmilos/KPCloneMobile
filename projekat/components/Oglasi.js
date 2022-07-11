import React from 'react';
import {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View, TextInput} from 'react-native';
import Oglas from './Oglas.js';
import {database} from '../database/database.js';
import moment from 'moment';
import 'moment/locale/sr';
import {useIsFocused} from '@react-navigation/native';
import Filter from './Filter.js';

moment.locale('sr');
const Oglasi = ({navigation, route}) => {
  const [state, setState] = useState([]);
  const [stateFiltered, setStateFiltered] = useState([]);
  const isFocused = useIsFocused();
  const [search, setSearch] = useState('');
  let isMounted = false;

  useEffect(() => {
    isMounted = true;
    if (!route?.params?.filterState) {
      get();
    }
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    isMounted = true;
    if (route?.params?.filterState) {
      getFiltered(route.params.filterState);
    }
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const get = async () => {
    const oglasi = await database.ref('oglasi').orderByValue().once('value');
    const data = oglasi.val();

    if (data === null) {
      if (isMounted) {
        setState([]);
      }
    } else {
      if (isMounted) {
        setState(Object.entries(data));
      }
    }
  };

  const getFiltered = async filterState => {
    const oglasi = await database.ref('oglasi').orderByValue().once('value');

    const data = oglasi.val();

    if (data === null) {
      if (isMounted) {
        setStateFiltered([]);
      }
    } else {
      let dataToFilter = Object.entries(data);

      for (let i = 0; i < dataToFilter.length; i++) {
        const korisnik = await database
          .ref(`users/${dataToFilter[i][1].korisnikId}`)
          .orderByValue()
          .once('value');
        const dataKorisnik = korisnik.val();
        dataToFilter[i][1] = {...dataToFilter[i][1], mesto: dataKorisnik.grad};
      }

      if (filterState.cenaManjaOd) {
        dataToFilter = dataToFilter.filter(
          oglas => parseInt(oglas[1].cena) < parseInt(filterState.cenaManjaOd),
        );
      }

      if (filterState.cenaVecaOd) {
        dataToFilter = dataToFilter.filter(
          oglas => parseInt(oglas[1].cena) > parseInt(filterState.cenaVecaOd),
        );
      }

      if (filterState.kategorijaId) {
        dataToFilter = dataToFilter.filter(
          oglas => oglas[1].kategorijaId === filterState.kategorijaId,
        );
      }

      if (filterState.mesto) {
        dataToFilter = dataToFilter.filter(
          oglas => oglas[1].mesto === filterState.mesto,
        );
      }

      setStateFiltered(dataToFilter);
    }
  };

  return (
    <>
      {route?.params?.filterState ? (
        <View>
          <ScrollView>
            <TextInput
              style={styles.textInput}
              placeholder="Pretrazite"
              value={search}
              onChangeText={value => setSearch(value)}
            />
            <Filter navigation={navigation} />
            {stateFiltered.map(oglas => {
              return (
                <React.Fragment key={oglas[0]}>
                  {oglas[1].naslov
                    .toLowerCase()
                    .includes(search.toLowerCase()) && (
                    <Oglas
                      key={oglas[0]}
                      navigation={navigation}
                      {...{oglasId: oglas[0], oglas: oglas[1]}}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        <View>
          <ScrollView>
            <TextInput
              style={styles.textInput}
              placeholder="Pretrazite"
              value={search}
              onChangeText={value => setSearch(value)}
            />
            <Filter navigation={navigation} />
            {state.map(oglas => {
              return (
                <React.Fragment key={oglas[0]}>
                  {oglas[1].naslov
                    .toLowerCase()
                    .includes(search.toLowerCase()) && (
                    <Oglas
                      key={oglas[0]}
                      navigation={navigation}
                      {...{oglasId: oglas[0], oglas: oglas[1]}}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </ScrollView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 2,
    padding: 20,
    justifyContent: 'space-around',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10,
    margin: 20,
    borderRadius: 5,
  },
});

export default Oglasi;
