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
  Button,
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
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {Modalize} from 'react-native-modalize';
import AsyncStorage from '@react-native-community/async-storage';

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
  const [valueTextInput, setValueTextInput] = useState('');
  const renderAnimated = () => {
    return (
      <TouchableOpacity
        onPress={() => checkProbability()}
        style={{paddingBottom: 25, paddingHorizontal: 20, paddingTop: 10}}>
        <Image
          source={require('../../../app/assets/images/ic-poke-ball.png')}
          style={{height: 80, width: 60}}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
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

  const onPressButtonSubmit = async () => {
    let getLocal = await AsyncStorage.getItem('POKEBAG');
    console.log('getLocal', getLocal);
    let dataLocal = [];
    if (getLocal) {
      console.log('1');
      dataLocal = JSON.parse(getLocal);
      console.log('dataLocal 1', dataLocal);
    } else {
      console.log('2');
      dataLocal = [];
    }

    let data = [
      {
        name: params.data.name,
        image: params.data.url,
        id: params.data.id,
        nickName: valueTextInput,
        isDeleted: 'false',
      },
    ];

    dataLocal = [...dataLocal, ...data];
    console.log('dataLocal 2', dataLocal);
    let stringData = JSON.stringify(dataLocal);
    let setLocal = await AsyncStorage.setItem('POKEBAG', stringData);
    let getLocalAfterSet = await AsyncStorage.getItem('POKEBAG');
    console.log(' getLocalAfterSet', getLocalAfterSet);
    onClose();
    navigation.navigate('PokeBag');
  };

  const renderBottomSheet = () => {
    return (
      <Modalize
        withOverlay={true}
        withHandle={true}
        handleStyle={{
          backgroundColor: 'transparent',
        }}
        adjustToContentHeight={true}
        closeOnOverlayTap={true}
        panGestureEnabled={true}
        ref={modalizeRef}
        modalStyle={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          paddingHorizontal: 16,
          backgroundColor: '#E0FFFF',
        }}
        overlayStyle={{
          backgroundColor: '#000000CC',
        }}
        onClose={onClose()}>
        <View style={{paddingVertical: 16}}>
          <Text style={styles.textGotcha}>GOTCHAA!!</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.inputNickNameLabel}>Now Enter Your </Text>
            <Text style={[styles.inputNickNameLabel, {fontWeight: 'bold'}]}>
              {capitalizeText(params.data.name)}
            </Text>
            <Text style={styles.inputNickNameLabel}> Nickname</Text>
          </View>

          <TextInput
            value={valueTextInput}
            placeholder={'Input your pokemon nickname'}
            style={styles.containerTextInput}
            onChangeText={text => {
              setValueTextInput(text);
            }}
          />

          <Button
            style={styles.containerButtonSubmit(valueTextInput)}
            onPress={() => onPressButtonSubmit()}
            disabled={_.size(valueTextInput) > 0 ? false : true}>
            <Text style={styles.textButtonSubmit}>SUBMIT</Text>
          </Button>
        </View>
      </Modalize>
    );
  };

  const modalizeRef = React.createRef(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onClose = () => {
    modalizeRef.current?.close();
  };

  const checkProbability = () => {
    onOpen();
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
      {renderBottomSheet()}
      <View style={styles.containerWrapperPokeBall}>{renderAnimated()}</View>
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
  containerWrapperPokeBall: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  textGotcha: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'left',
  },
  inputNickNameLabel: {
    marginTop: 16,
    fontWeight: '400',
    fontSize: 16,
  },
  textButtonSubmit: {
    color: '#FFF',
    fontWeight: '400',
    fontSize: 16,
  },
  containerButtonSubmit: valueTextInput => [
    {
      backgroundColor: _.size(valueTextInput) > 0 ? '#4169E1' : '#A9A9A9',
      borderRadius: 8,
      marginBottom: 16,
    },
  ],
  containerTextInput: {
    borderWidth: 0.6,
    borderColor: '#000',
    fontSize: 16,
    letterSpacing: 0.15,
    lineHeight: 20,
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 16,
  },
});
