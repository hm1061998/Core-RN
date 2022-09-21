import React, { useEffect, useRef, useState, forwardRef, useMemo } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';

const TextField = props => {
  const {
    placeholder,
    errorText,
    value,
    style,
    onBlur,
    onFocus,
    innerRef,
    enabledAnimated,
    ...restOfProps
  } = props;
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0));

  const handleAmi = isFocused => {
    Animated.timing(focusAnim.current, {
      toValue: isFocused || !!value ? 1 : 0,
      duration: 150,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  };

  let color = isFocused ? '#080F9C' : '#B9C4CA';

  if (errorText) {
    color = '#B00020';
  }

  return (
    <View style={style}>
      <TextInput
        ref={innerRef}
        {...restOfProps}
        style={[
          styles.input,
          {
            borderColor: color,
            borderWidth: isFocused ? 2 : 1,
          },
        ]}
        value={value}
        onBlur={event => {
          if (enabledAnimated) {
            handleAmi(false);
            setIsFocused(false);
          }

          onBlur?.(event);
        }}
        onFocus={event => {
          if (enabledAnimated) {
            handleAmi(true);
            setIsFocused(true);
          }

          onFocus?.(event);
        }}
      />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.labelContainer,
          {
            transform: [
              {
                scale: focusAnim.current?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.75],
                }),
              },
              {
                translateY: focusAnim.current?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [14, -12],
                }),
              },
              {
                translateX: focusAnim.current?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 0],
                }),
              },
            ],
          },
        ]}>
        <Text
          style={[
            styles.label,
            {
              color,
            },
          ]}>
          {placeholder}
          {errorText ? '*' : ''}
        </Text>
      </Animated.View>

      {!!errorText && <Text style={styles.error}>{errorText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 14,
    borderRadius: 4,
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
  },
  labelContainer: {
    position: 'absolute',
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  label: {
    fontFamily: 'Avenir-Heavy',
    fontSize: 16,
  },
  error: {
    marginTop: 4,
    marginLeft: 12,
    fontSize: 12,
    color: '#B00020',
    fontFamily: 'Avenir-Medium',
  },
});

const AnimatedInput = forwardRef((props, ref) => (
  <TextField {...props} innerRef={ref} />
));

export default AnimatedInput;
