import React from 'react';
import {SafeAreaView, TouchableOpacity} from 'react-native';
import {StyleSheet, Text, View, Dimensions, Image} from 'react-native';
import {Body, Header, Right, Title} from 'native-base';
import _ from 'lodash';

const CardItemPokemon = ({name, image, onPress, id}) => {
  return (
    <TouchableOpacity style={styles.containerEachData} onPress={onPress}>
      <Image
        source={{
          uri:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' +
            id +
            '.png',
        }}
        style={{height: 65, width: 60}}
        resizeMode="contain"
      />
      <Text style={{fontWeight: '600'}}>{name}</Text>
    </TouchableOpacity>
  );
};

export default CardItemPokemon;

const styles = StyleSheet.create({
  containerEachData: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    width: Dimensions.get('window').width / 2 - 20,
    paddingVertical: 12,
    paddingTop: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#0000001F',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
});
