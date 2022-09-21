import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import { SCALE } from './animation';
import PropTypes from 'prop-types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Index = ({
  children,
  duration,
  style,
  scaleStyle,
  startSize,
  endSize,
  onPress,
}) => {
  const scaleInAnimated = useRef(new Animated.Value(0));
  const scaleOutAnimated = useRef(new Animated.Value(0));

  const _pressInAnimation = () => {
    if (scaleStyle === 'scaleIn') {
      SCALE.pressInAnimation(scaleInAnimated.current, duration);
    } else if (scaleStyle === 'scaleOut') {
      SCALE.pressInAnimation(scaleOutAnimated.current, duration);
    }
  };

  const _pressOutAnimation = () => {
    if (scaleStyle === 'scaleIn') {
      SCALE.pressOutAnimation(scaleInAnimated.current, duration);
    } else if (scaleStyle === 'scaleOut') {
      SCALE.pressOutAnimation(scaleOutAnimated.current, duration);
    }
  };

  const getStyle = () => {
    let _style;
    let scaleAnimation;
    if (scaleStyle === 'scaleIn') {
      scaleAnimation = scaleInAnimated.current;
    } else if (scaleStyle === 'scaleOut') {
      scaleAnimation = scaleOutAnimated.current;
    }
    if (style && Array.isArray(style)) {
      _style = [
        SCALE.getScaleTransformationStyle(scaleAnimation, startSize, endSize),
        ...style,
      ];
    } else if (style && typeof style === 'object') {
      _style = [
        SCALE.getScaleTransformationStyle(scaleAnimation, startSize, endSize),
        { ...style },
      ];
    } else {
      _style = SCALE.getScaleTransformationStyle(
        scaleAnimation,
        startSize,
        endSize,
      );
    }
    return _style;
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={_pressInAnimation}
      onPressOut={_pressOutAnimation}
      style={getStyle()}>
      {children}
    </AnimatedPressable>
  );
};

Index.defaultProps = {
  duration: 150,
  style: {},
  scaleStyle: 'scaleIn',
  startSize: 1,
  endSize: 0.99,
};

Index.propTypes = {
  duration: PropTypes.number,
  scaleStyle: PropTypes.string,
  startSize: PropTypes.number,
  endSize: PropTypes.number,
  onPress: PropTypes.func,
};
export default Index;
