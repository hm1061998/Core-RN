import { Animated, Easing } from 'react-native';

export const startLoopAnimation = (animated, duration = 100, delay = 800) => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(animated, {
        toValue: -1, // so i add the delay here
        duration: duration,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(animated, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true,
      }),
      Animated.timing(animated, {
        toValue: -1,
        duration: duration,
        useNativeDriver: true,
      }),
      Animated.timing(animated, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true,
      }),
      Animated.timing(animated, {
        toValue: 0,
        duration: duration,
        useNativeDriver: true,
      }),
    ]),
  ).start();
};

export const startRepeatAnimation = (animated, duration = 2000) => {
  animated.setValue(-1);
  // Will change fadeAnim value to 1 in 5 seconds
  Animated.timing(animated, {
    toValue: 1,
    duration: duration,
    easing: Easing.linear,
    useNativeDriver: true,
  }).start(() => startRepeatAnimation(animated, duration));
};

export const interpolation = (animated, range) => {
  const _interpolation = animated.interpolate({
    inputRange: [-1, 1], // left side to right side
    outputRange: range, // before that we have to check now it's perfect
  });
  return _interpolation;
};
