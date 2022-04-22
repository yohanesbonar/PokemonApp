import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Easing,
} from 'react-native';
import {
  FavouriteIcon,
  FlatList,
  NativeBaseProvider,
  ScrollView,
} from 'native-base';
import _ from 'lodash';
import HeaderToolbar from '../../components/molecules/HeaderToolbar';
import {capitalizeText} from '../../components/utils/common';
import {
  getAbilityFetch,
  getMovesFetch,
  getTypesFetch,
} from '../../components/utils/network/poke';
import {TouchableOpacity} from 'react-native-gesture-handler';

const DetailPokemon = ({route, navigation}) => {
  console.log('DetailPokemon Nav ', route, navigation);
  const params = route.params;
  console.log('DetailPokemon params ', params);

  const [dataMoves, setDataMoves] = useState([]);
  const [dataAbilities, setDataAbilities] = useState([]);
  const [dataTypes, setDataTypes] = useState([]);

  const [isLoadingM, setIsLoadingM] = useState(true);
  const [isLoadingA, setIsLoadingA] = useState(true);
  const [isLoadingT, setIsLoadingT] = useState(true);

  const [isRefresh, setIsRefresh] = useState(false);

  const renderAnimated = () => {
    return (
      <Animated.View>
        <Image
          source={require('../../../app/assets/images/ic-poke-ball.png')}
          style={{height: 80, width: 60}}
          resizeMode={'contain'}
        />
      </Animated.View>
    );
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      let responseMo = await getMovesFetch(params.data.id);
      let responseAb = await getAbilityFetch(params.data.id);
      let responseTy = await getTypesFetch(params.data.id);
      console.log('response getMovesFetch', responseMo);
      console.log('response getAbilityFetch', responseAb);
      console.log('response getTypesFetch', responseTy);
      if (responseMo && responseMo.results && !_.isEmpty(responseMo.results)) {
        setDataMoves(responseMo.results);
        setIsLoadingM(false);
      }
      if (responseAb && responseAb.results && !_.isEmpty(responseAb.results)) {
        setDataAbilities(responseAb.results);
        setIsLoadingA(false);
      }
      if (responseTy && responseTy.results && !_.isEmpty(responseTy.results)) {
        setDataTypes(responseTy.results);
        setIsLoadingT(false);
      }
    } catch (error) {
      console.log('error getMoves', error);
    }
  };

  useEffect(() => {
    if (isRefresh) {
      setIsRefresh(false);
      getData();
    }
  }, [isRefresh]);

  const renderData = ({item}) => {
    return (
      <View
        style={{
          padding: 6,
          borderColor: '#000',
          borderWidth: 0.2,
          borderRadius: 8,
          marginBottom: 6,
          marginRight: 5,
        }}>
        <Text>{item.name}</Text>
      </View>
    );
  };

  const onRefresh = () => {
    setDataAbilities([]);
    setDataMoves([]);
    setDataTypes([]);
    setIsLoadingA(true);
    setIsLoadingM(true);
    setIsLoadingT(true);
    setIsRefresh(true);
  };

  return (
    <NativeBaseProvider>
      <HeaderToolbar
        title={'Detail of ' + capitalizeText(params.data.name)}
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView
        style={{paddingHorizontal: 16, paddingTop: 20}}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }>
        {/* <Text style={{fontSize: 20, fontWeight: '500'}}>
          {capitalizeText(params.data.name)}
        </Text> */}
        <View style={{alignItems: 'center'}}>
          <Image
            source={{
              uri:
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' +
                params.data.id +
                '.png',
            }}
            style={{height: 170, width: 160}}
            resizeMode="cover"
          />
        </View>
        <View style={styles.containerMovesSection}>
          <Text style={{fontWeight: '800', fontSize: 18, marginBottom: 20}}>
            MOVES
          </Text>
          {isLoadingM ? (
            <ActivityIndicator size={'large'} color="#F8F8" />
          ) : (
            <FlatList
              data={dataMoves}
              renderItem={renderData}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
            />
          )}
        </View>
        <View style={styles.containerMovesSection}>
          <Text style={{fontWeight: '800', fontSize: 18, marginBottom: 20}}>
            TYPE
          </Text>
          {isLoadingT ? (
            <ActivityIndicator size={'large'} color="#F8F8" />
          ) : (
            <FlatList
              data={dataTypes}
              renderItem={renderData}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
            />
          )}
        </View>
        <View style={[styles.containerMovesSection, {marginBottom: 40}]}>
          <Text style={{fontWeight: '800', fontSize: 18, marginBottom: 20}}>
            ABILITY
          </Text>
          {isLoadingA ? (
            <ActivityIndicator size={'large'} color="#F8F8" />
          ) : (
            <FlatList
              data={dataAbilities}
              renderItem={renderData}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
            />
          )}
        </View>
      </ScrollView>
      {/* <TouchableOpacity style={{zIndex: 1, bottom: 40, alignItems: 'center'}}>
        {renderAnimated()}
      </TouchableOpacity> */}
    </NativeBaseProvider>
  );
};

export default DetailPokemon;

const styles = StyleSheet.create({
  containerEachData: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    width: Dimensions.get('window').width / 2,
    paddingVertical: 12,
    marginBottom: 16,
  },
  containerMovesSection: {
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
    padding: 16,
  },
  ball: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'red',
  },
});
