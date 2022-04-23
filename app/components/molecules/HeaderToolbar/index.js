import React from 'react';
import {SafeAreaView, TouchableOpacity} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {Body, Header, Right, Title, Icon, ArrowBackIcon} from 'native-base';
import _ from 'lodash';

const HeaderToolbar = ({
  title,
  onPressBack,
  leftTitle,
  titleButtonRight,
  onPressButtonRight,
}) => {
  return (
    <SafeAreaView style={{backgroundColor: '#0771CD', zIndex: 1}}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: onPressBack || leftTitle ? 'row' : null,
          paddingBottom: 6,
          paddingHorizontal: leftTitle ? 16 : null,
          justifyContent: titleButtonRight ? 'space-between' : null,
        }}>
        {onPressBack && (
          <TouchableOpacity onPress={onPressBack}>
            <ArrowBackIcon style={styles.containerArrowButtonBack} />
          </TouchableOpacity>
        )}

        <Text style={styles.containerTextTitle}>{title}</Text>
        {onPressButtonRight && (
          <TouchableOpacity onPress={onPressButtonRight}>
            <Text style={styles.buttonRight}>{titleButtonRight}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HeaderToolbar;

const styles = StyleSheet.create({
  containerArrowButtonBack: {
    height: 28,
    width: 28,
    color: '#FFF',
    marginRight: 20,
    marginLeft: 16,
    paddingVertical: 5,
  },
  containerTextTitle: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
    paddingBottom: 10,
    paddingTop: 6,
    textAlignVertical: 'center',
  },
  buttonRight: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
    paddingBottom: 10,
    paddingTop: 6,
    textAlignVertical: 'center',
  },
});
