import { Animated } from 'react-native';

export const SCALE = {
  // this defines the terms of our scaling animation.
  getScaleTransformationStyle(animated, startSize = 1, endSize = 0.99) {
    const interpolation = animated.interpolate({
      inputRange: [0, 1],
      outputRange: [startSize, endSize],
    });
    return {
      transform: [{ scale: interpolation }],
    };
  },
  // This defines animation behavior we expext onPressIn
  pressInAnimation(animated, duration = 150) {
    animated.setValue(0);
    Animated.timing(animated, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  },
  // This defines animatiom behavior we expect onPressOut
  pressOutAnimation(animated, duration = 150) {
    animated.setValue(1);
    Animated.timing(animated, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start();
  },
};
