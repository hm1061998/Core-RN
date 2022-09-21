/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  TouchableOpacity,
  View,
  Platform,
  StyleSheet,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import PropTypes from 'prop-types';
import { COLOR } from '~/utils/Values';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Index = ({ value, onChange, disabled }) => {
  // console.log({ value });
  return (
    <View
      style={[
        styles.container,
        value ? styles.trueBackground : styles.falseBackground,
      ]}>
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          if (onChange) {
            onChange(!value);
          }
          LayoutAnimation.configureNext(
            LayoutAnimation.create(
              100,
              LayoutAnimation.Types.linear,
              LayoutAnimation.Properties.opacity,
            ),
          );
        }}
        activeOpacity={1}
        style={[
          styles.switchContainer,
          {
            alignItems: value ? 'flex-end' : 'flex-start',
          },
        ]}>
        <View style={styles.dot} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 33,
    height: 20,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: '#E9ECF4',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 0.1,
      },
      ios: {
        shadowColor: 'black',
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 0.02,
        shadowRadius: 5,
      },
    }),
  },
  falseBackground: {
    backgroundColor: '#F8F8F8',
  },
  trueBackground: {
    backgroundColor: COLOR.ROOT_COLOR_PINK,
  },
  switchContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: '100%',
    width: '60%',
    borderRadius: 1000,
    borderColor: '#E9ECF4',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowColor: 'black',
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 0.02,
        shadowRadius: 5,
      },
    }),
  },
});

Index.defaultProps = {
  value: false,
};

Index.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.bool,
};

const Element = (props, ref) => {
  return <Index {...props} innerRef={ref} />;
};

export default React.forwardRef(Element);
