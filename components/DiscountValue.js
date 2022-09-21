import React, { forwardRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { COLOR, SIZES } from '~/utils/Values';

const DiscountValue = ({ onChange, value, onAffterChange, disabled }, ref) => {
  useEffect(() => {
    onAffterChange?.();
  }, [onAffterChange, value]);

  return (
    <View
      style={[
        styles.row,
        {
          justifyContent: 'flex-end',
          flex: 1,
        },
      ]}>
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={0.7}
        onPress={() => onChange?.('1')}
        style={[
          styles.btnSale,
          value === '1' && styles.btnActive,
          { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
        ]}>
        <Text style={[styles.btnSaleTxt, value === '1' && styles.btnTxtActie]}>
          VND
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={0.7}
        onPress={() => onChange?.('2')}
        style={[
          styles.btnSale,
          value === '2' && styles.btnActive,
          {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
        ]}>
        <Text style={[styles.btnSaleTxt, value === '2' && styles.btnTxtActie]}>
          %
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = ScaledSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  btnSale: {
    width: '45@s',
    height: '25@vs',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
    borderRadius: '4@s',
  },
  btnActive: {
    backgroundColor: COLOR.THEME,
  },
  btnSaleTxt: {
    fontSize: '13@s',
    color: COLOR.BLACK,
    fontFamily: 'Roboto_medium',
  },
  btnTxtActie: {
    color: COLOR.WHITE,
  },
});

export default forwardRef(DiscountValue);
