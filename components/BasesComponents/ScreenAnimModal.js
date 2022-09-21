import React, { forwardRef, useImperativeHandle } from 'react';
import {
  Modal,
  Dimensions,
  // Animated,
} from 'react-native';
import tw from '~/lib/tailwind';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const ScreenAnimModal = ({ visible, onClose, children }, ref) => {
  const anim = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    close: () => {
      tooglePicker('hide');
    },
  }));

  const tooglePicker = type => {
    const wrapper = () => {
      if (type === 'hide') {
        onClose?.();
      }
    };

    anim.value = withTiming(
      type === 'show' ? 1 : 0,
      {
        useNativeDriver: true,
        duration: 300,
      },
      finished => {
        runOnJS(wrapper)(finished);
      },
    );
  };

  const bgStyleAnimated = useAnimatedStyle(() => {
    const opacity = interpolate(anim.value, [0, 1], [0, 0.5], {
      extrapolate: Extrapolation.CLAMP,
    });
    return {
      opacity,
    };
  });

  const mainStyleAnimated = useAnimatedStyle(() => {
    const translateX = interpolate(anim.value, [0, 1], [width, 0], {
      extrapolate: Extrapolation.CLAMP,
    });
    return {
      transform: [
        {
          translateX,
        },
      ],
    };
  });

  return (
    <Modal
      transparent
      visible={visible}
      statusBarTranslucent={true}
      animationType="none"
      onShow={() => tooglePicker('show')}
      onRequestClose={() => tooglePicker('hide')}>
      <Animated.View style={[tw`absolute-fill bg-BLACK`, bgStyleAnimated]} />
      <Animated.View
        style={[tw`flex-1 bg-THEME pt-status-bar`, mainStyleAnimated]}>
        {children}
      </Animated.View>
    </Modal>
  );
};

export default forwardRef(ScreenAnimModal);
