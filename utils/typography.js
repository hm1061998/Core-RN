import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLOR } from '~/utils/Values';

export const typography = () => {
  // console.log('run');
  const getStyle = originStyles => {
    const _originalStyle = StyleSheet.flatten(originStyles || {});
    return [styles, _originalStyle];
  };

  const oldTextRender = Text.render;
  Text.render = function (...args) {
    const origin = oldTextRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: getStyle(origin.props.style),
      allowFontScaling: false,
      adjustsFontSizeToFit: false,
    });
  };
};

const styles = StyleSheet.create({
  defaultText: {
    fontSize: 14,
    color: COLOR.BLACK,
  },
});
