import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { startLoopAnimation, interpolation } from './utils';
import PropTypes from 'prop-types';

const Index = ({ children, duration, delay, startDeg, endDeg }) => {
  const anim = useRef(new Animated.Value(0));

  useEffect(() => {
    startLoopAnimation(anim.current, duration, delay);
  }, [delay, duration]);

  const rotation = interpolation(anim.current, [startDeg, endDeg]);

  return (
    <Animated.View
      style={{
        alignSelf: 'center',
        transform: [{ rotate: rotation }],
      }}>
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
  startDeg: '-10deg',
  endDeg: '10deg',
};

Index.propTypes = {
  duration: PropTypes.number,
  delay: PropTypes.number,
  startDeg: PropTypes.string,
  endDeg: PropTypes.string,
};
export default React.memo(Index);
