import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  Header,
  NativeBaseProvider,
  Body,
  Title,
  Center,
} from 'native-base';
import _ from 'lodash';
import CardItemPokemon from '../../components/molecules/CardItemPokemon';
import {getPokemon, getPokemonFetch} from '../../components/utils/network/poke';
import HeaderToolbar from '../../components/molecules/HeaderToolbar';

const Home = ({navigation}) => {
  console.log('Nav', navigation);
  const [dataPokemon, setDataPokemon] = useState([]);
  const [triggerNext, setTriggerNext] = useState(false);
  const [emptyData, setEmptyData] = useState(false);
  useEffect(() => {
    setDataPokemon([]);
    getData();
  }, []);

  useEffect(() => {
    if (triggerNext) {
      setTriggerNext(false);
      getData('next');
    }
  }, [triggerNext]);

  const getData = async value => {
    try {
      let params = {
        limit: 10,
        offset: 20,
      };
      let response = await getPokemonFetch(params);
      console.log('response getPokemon', response);
      setDataPokemon(
        response && response.results && _.size(response.results) > 0
          ? value == 'next'
            ? [...dataPokemon, ...response.results]
            : response.results
          : [],
      );
      if (
        (value == undefined && _.isEmpty(response.results)) ||
        (value == 'next' &&
          _.isEmpty(response.results) &&
          !_.isEmpty(dataPokemon))
      ) {
        setEmptyData(true);
      }
    } catch (error) {
      console.log('error getPokemon', error);
    }
  };

  const renderdata = ({item}) => {
    let id = item.url;
    id = id.replace('https://pokeapi.co/api/v2/pokemon/', '');
    id = id.replace('/', '');
    item.id = id;
    return (
      <View>
        <CardItemPokemon
          name={item.name}
          image={item.url}
          id={id}
          onPress={() => navigation.navigate('DetailPokemon', {data: item})}
        />
      </View>
    );
  };

  const renderBottom = () => {
    return (
      <TouchableOpacity
        onPress={() => setTriggerNext(true)}
        style={styles.containerButtonNext}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>SHOW MORE</Text>
      </TouchableOpacity>
    );
  };

  return (
    <NativeBaseProvider style={{}}>
      <HeaderToolbar title={'List of Pokemon'} />
      <FlatList
        renderItem={renderdata}
        data={dataPokemon}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        style={{
          paddingHorizontal: 16,
          paddingTop: 20,
          marginBottom: 30,
          backgroundColor: '#F9F9F9',
        }}
        ListFooterComponent={!emptyData ? renderBottom : null}
      />
    </NativeBaseProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
  containerEachData: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    width: Dimensions.get('window').width / 2,
    paddingVertical: 12,
    marginBottom: 16,
  },
  containerButtonNext: {
    marginBottom: 25,
    paddingBottom: 16,
    paddingTop: 16,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#FFFF88',
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
