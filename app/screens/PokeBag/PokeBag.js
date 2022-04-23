import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text, FlatList} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import _, {iteratee} from 'lodash';
import HeaderToolbar from '../../components/molecules/HeaderToolbar';
import AsyncStorage from '@react-native-community/async-storage';
import {ItemClick} from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';
import CardItemPokemon from '../../components/molecules/CardItemPokemon';

const PokeBag = ({navigation}) => {
  const [dataPokeBag, setDataPokeBag] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let dataFromLocal = await AsyncStorage.getItem('POKEBAG');
    dataFromLocal = JSON.parse(dataFromLocal);
    setDataPokeBag(dataFromLocal);
  };

  const renderdata = ({item, index}) => {
    return (
      <View>
        <CardItemPokemon
          name={item.name}
          image={item.image}
          id={item.id}
          enableNickName={true}
          nickName={item.nickName}
          enableDelete={true}
          onPressDelete={() => onCheckDeleteData(item, index)}
        />
      </View>
    );
  };

  const onCheckDeleteData = async (data, index) => {
    let dataFromLocal = await AsyncStorage.getItem('POKEBAG');
    dataFromLocal = JSON.parse(dataFromLocal);

    if (index > -1) {
      dataFromLocal.splice(index, 1);
    }
    setDataPokeBag(dataFromLocal);
    let stringData = JSON.stringify(dataFromLocal);
    let setDataLocal = await AsyncStorage.setItem('POKEBAG', stringData);
  };

  return (
    <NativeBaseProvider style={{}}>
      <HeaderToolbar
        title={'PokeBag Pokemon'}
        onPressBack={() => navigation.goBack()}
      />
      {/* {dataPokeBag.map((item, index) => {
          return (
            <View>
              <Text>DATA POKEMON {index + 1}</Text>
              <Text>Name : {item.name}</Text>
              <Text>NickName : {item.nickName}</Text>
            </View>
          );
        })} */}
      <FlatList
        renderItem={renderdata}
        data={dataPokeBag}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        style={{
          paddingHorizontal: 16,
          paddingTop: 20,
          marginBottom: 30,
          backgroundColor: '#F9F9F9',
        }}
      />
    </NativeBaseProvider>
  );
};

export default PokeBag;

const styles = StyleSheet.create({});
