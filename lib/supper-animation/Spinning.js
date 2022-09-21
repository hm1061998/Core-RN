import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { startRepeatAnimation, interpolation } from './utils';
import PropTypes from 'prop-types';

const Index = ({ children, duration }) => {
  const anim = useRef(new Animated.Value(0));
  useEffect(() => {
    startRepeatAnimation(anim.current, duration);
  }, [duration]);

  const _interpolation = interpolation(anim.current, ['0deg', '360deg']);
  return (
    <Animated.View
      style={{ alignSelf: 'center', transform: [{ rotate: _interpolation }] }}>
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
  duration: 2000,
};

Index.propTypes = {
  duration: PropTypes.number,
};
export default React.memo(Index);
