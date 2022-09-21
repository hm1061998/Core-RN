/* eslint-disable react-native/no-inline-styles */
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  Easing,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { COLOR } from '~/utils/Values';

const DEFAULT_SHEET_HEIGHT = 300;
const Index = (
  {
    children,
    sheetHeight,
    duration = 200,
    bottomSheetStyle,
    containerStyle,
    handleClose,
  },
  ref,
) => {
  const [visible, setVisible] = useState(false);
  const anim = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true);
    },
    close: () => {
      onClose();
    },
  }));

  const onShow = () => {
    anim.value = withTiming(1, {
      duration: duration,
      easing: Easing.out(Easing.exp),
    });
  };

  const wrapper = finished => {
    if (finished) {
      setVisible(false);
      handleClose?.();
    }
  };

  const onClose = () => {
    anim.value = withTiming(
      0,
      {
        duration: duration,
        easing: Easing.out(Easing.exp),
      },
      finished => {
        runOnJS(wrapper)(finished);
      },
    );
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            anim.value,
            [0, 1],
            [sheetHeight + 100 || DEFAULT_SHEET_HEIGHT, 0],
            Extrapolate.CLAMP,
          ),
        },
      ],
      height: sheetHeight || DEFAULT_SHEET_HEIGHT,
    };
  });

  const overlayStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: COLOR.BLACK,
      opacity: interpolate(anim.value, [0, 1], [0, 0.5], Extrapolate.CLAMP),
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
    };
  });

  return (
    <Modal
      visible={visible}
      animationType="none"
      statusBarTranslucent
      transparent
      onRequestClose={() => {
        setVisible(false);
      }}
      onShow={() => {
        onShow();
      }}>
      <View style={[styles.container, containerStyle]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={overlayStyles} />
        </TouchableWithoutFeedback>
        <Animated.View style={[animatedStyles, bottomSheetStyle]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default forwardRef(Index);
