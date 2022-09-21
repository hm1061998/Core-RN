/* eslint-disable react-native/no-inline-styles */
import React, { forwardRef } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from '~/components/BasesComponents/Icon';
import { COLOR } from '~/utils/Values';
import { ScaledSheet } from 'react-native-size-matters';

const Index = ({ onChangeText, value, disabled }, ref) => {
  return (
    <View style={[styles.numeicInput]}>
      <TextInput
        editable={!disabled}
        keyboardType="numeric"
        selectTextOnFocus={true}
        selectionColor={COLOR.READDING_MODE}
        style={styles.input}
        maxLength={3}
        value={value}
        onChangeText={text => onChangeText?.(text)}
      />
      <TouchableOpacity
        style={[styles.btn, { borderRightWidth: 1 }]}
        onPress={() => {
          if (value <= 1) {
            return;
          }

          onChangeText?.(`${Number(value) - 1}`);
        }}>
        <Icon type="AntDesign" name="minus" size={15} color="#8A8A8A" />
      </TouchableOpacity>
      <TouchableOpacity
        disabled={disabled}
        style={[styles.btn, { borderLeftWidth: 1 }]}
        onPress={() => onChangeText?.(`${Number(value) + 1}`)}>
        <Icon type="AntDesign" name="plus" size={15} color="#8A8A8A" />
      </TouchableOpacity>
    </View>
  );
};

const styles = ScaledSheet.create({
  numeicInput: {
    flexDirection: 'row',
    borderRadius: 4,
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: '25@vs',
    color: '#000',
  },
  btn: {
    width: '45@s',
    height: '25@vs',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#D9D9D9',
  },
});

export default forwardRef(Index);
