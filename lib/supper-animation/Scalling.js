import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { startLoopAnimation, interpolation } from './utils';
import PropTypes from 'prop-types';

const Index = ({ children, duration, delay, startSize, endSize }) => {
  const anim = useRef(new Animated.Value(0));
  useEffect(() => {
    startLoopAnimation(anim.current, duration, delay);
  }, [delay, duration]);

  const _interpolation = interpolation(anim.current, [startSize, endSize]);
  return (
    <Animated.View
      style={{ alignSelf: 'center', transform: [{ scale: _interpolation }] }}
    >
      {children ? children : <View style={styles.defaultView} />}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  defaultView: {
    width: 50,
    height: 50,
    backgroundColor: 'gray',
  },
});

Index.defaultProps = {
  duration: 100,
  delay: 800,
  startSize: 1,
  endSize: 1.5,
};

Index.propTypes = {
  duration: PropTypes.number,
  delay: PropTypes.number,
  startSize: PropTypes.number,
  endSize: PropTypes.number,
};
export default React.memo(Index);
