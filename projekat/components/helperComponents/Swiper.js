import React from 'react';
import {View, Image, ScrollView, Dimensions, StyleSheet} from 'react-native';

let {width, height} = Dimensions.get('window');
const widthCalc = width * 0.9;
const heightCalc = height * 0.8;

const Swiper = ({route}) => {
  return (
    <View>
      <ScrollView pagingEnabled horizontal>
        {route?.params?.slike.map((slika, index) => {
          return (
            <View key={index} style={styles.element}>
              <Image
                style={styles.img}
                source={{uri: slika.path ? slika.path : slika}}></Image>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  element: {
    width,
    height: height * 0.9,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    borderColor: '#F44336',
    width: widthCalc,
    height: heightCalc,
    resizeMode: 'cover',
    borderRadius: 12,
  },
});

export default Swiper;
