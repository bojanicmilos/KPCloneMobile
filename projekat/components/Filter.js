import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const Filter = ({navigation}) => {
  return (
    <View style={styles.dugme}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Filter parametri');
        }}>
        <Text style={styles.dugmeText}>Filteri</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dugmeText: {
    color: 'white',
    textTransform: 'uppercase',
  },
  dugme: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 100,
    backgroundColor: '#429ef5',
    borderRadius: 5,
    marginTop: 20,
    marginLeft: 20,
  },
});
export default Filter;
