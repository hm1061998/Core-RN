import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  // Animated,
} from 'react-native';
import tw from '~/lib/tailwind';
import Text from '~/utils/StyledText';
import { DatePicker } from 'react-native-wheel-pick';
import dayjs from 'dayjs';
import Button from '~/components/BasesComponents/Button';
import Icon from '~/components/BasesComponents/Icon';
import { scale } from 'react-native-size-matters';

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';

var localeData = require('dayjs/plugin/localeData');
dayjs.extend(localeData);

const CustomPicker = (
  {
    onChange,
    value,
    style,
    placeholderStyle,
    data,
    placeholder,
    disabled,
    ...orderProps
  },
  ref,
) => {
  const [visible, setVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState(
    new Date(value || undefined),
  );
  // const [anim] = useState(new Animated.Value(0));
  const anim = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      // console.log('run');
      setCurrentValue(value);
    }
  }, [value, visible]);

  // const tooglePicker = type => {
  //   Animated.timing(anim, {
  //     toValue: type === 'show' ? 1 : 0,
  //     useNativeDriver: true,
  //     duration: 100,
  //   }).start(() => {
  //     if (type === 'hide') {
  //       setVisible(false);
  //     }
  //   });
  // };

  const tooglePicker = type => {
    const wrapper = () => {
      if (type === 'hide') {
        setVisible(false);
      }
    };

    anim.value = withTiming(
      type === 'show' ? 1 : 0,
      {
        useNativeDriver: true,
        duration: 100,
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
    const translateY = interpolate(anim.value, [0, 1], [500, 0], {
      extrapolate: Extrapolation.CLAMP,
    });
    return {
      transform: [
        {
          translateY,
        },
      ],
    };
  });

  // console.log({ data });

  return (
    <>
      <Button
        disabled={disabled}
        onPress={() => setVisible(true)}
        style={style}>
        <View
          style={tw`flex-row items-center justify-between flex-1 opacity-${
            disabled ? 50 : 100
          }`}>
          <Text
            style={[placeholderStyle, !value && { opacity: 0.5 }]}
            numberOfLines={1}>
            {value ? dayjs(value).format('DD/MM/YYYY') : placeholder}
          </Text>
          {!disabled && (
            <Icon
              type="AntDesign"
              name="calendar"
              size={scale(18)}
              color={tw.color('ROOT_COLOR_SMOOTH')}
            />
          )}
        </View>
      </Button>

      <Modal
        transparent
        animationType="none"
        statusBarTranslucent
        visible={visible}
        onShow={() => tooglePicker('show')}
        onRequestClose={() => tooglePicker('hide')}>
        <View style={tw`flex-1 justify-end items-center`}>
          <TouchableWithoutFeedback onPress={() => tooglePicker('hide')}>
            <Animated.View
              style={[tw`absolute-fill bg-BLACK`, bgStyleAnimated]}
            />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              tw`w-full items-center bg-WHITE rounded-t-xl`,
              mainStyleAnimated,
            ]}>
            <View style={tw`w-full justify-end px-5 py-3 flex-row`}>
              <TouchableOpacity
                style={tw`mr-5`}
                onPress={() => tooglePicker('hide')}>
                <Text>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onChange?.(currentValue);
                  tooglePicker('hide');
                }}>
                <Text>Đồng ý</Text>
              </TouchableOpacity>
            </View>

            <DatePicker
              style={tw`h-[225px] w-full bg-WHITE px-15`}
              order="D-M-Y"
              locale="vi-VN"
              labelUnit={{ month: dayjs.months(), year: '', date: '' }}
              maximumDate={dayjs().add(50, 'years').toDate()}
              minimumDate={dayjs().subtract(50, 'years').toDate()}
              date={currentValue} // Optional prop - default is Today
              onDateChange={date => {
                setCurrentValue(date);
                // console.log(date);
              }}
            />
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

export default React.forwardRef(CustomPicker);
