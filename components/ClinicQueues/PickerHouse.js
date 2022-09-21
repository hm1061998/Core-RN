import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import tw from '~/lib/tailwind';
import Text from '~/utils/StyledText';
import dayjs from 'dayjs';
import Button from '~/components/BasesComponents/Button';
import Icon from '~/components/BasesComponents/Icon';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { SIZES, COLOR } from '~/utils/Values';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';

const PickerHouse = (
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
  const [arr] = useState(new Array(50).fill(0));
  const [isOpented, setIsOpened] = useState(false);
  const anim = useSharedValue(0);

  const tooglePicker = type => {
    const wrapper = () => {
      if (type === 'hide') {
        setVisible(false);
        setIsOpened(false);
      } else if (type === 'show') {
        setIsOpened(true);
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

  // console.log({ value });

  const bgStyleAnimated = useAnimatedStyle(() => {
    const opacity = interpolate(anim.value, [0, 1], [0, 0.5], {
      extrapolate: Extrapolation.CLAMP,
    });
    return {
      opacity,
    };
  });

  const mainStyleAnimated = useAnimatedStyle(() => {
    const translateY = interpolate(
      anim.value,
      [0, 1],
      [SIZES.HEIGHT_WINDOW, 0],
      {
        extrapolate: Extrapolation.CLAMP,
      },
    );
    return {
      transform: [
        {
          translateY,
        },
      ],
    };
  });

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
            {value ? dayjs(value).format('HH:mm') : placeholder}
          </Text>
          {!disabled && (
            <Icon
              type="AntDesign"
              name="clockcircleo"
              size={scale(13)}
              color={COLOR.ROOT_COLOR_SMOOTH}
            />
          )}
        </View>
      </Button>

      <Modal
        animationType="none"
        transparent
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
              tw`w-full items-center bg-WHITE rounded-t-xl h-9/12`,
              mainStyleAnimated,
            ]}>
            <View style={tw`w-full px-5 py-3 `}>
              <Text style={tw`text-center text-[15px] font-medium`}>
                Chọn giờ khám
              </Text>

              <TouchableOpacity
                style={tw`absolute right-5 top-2`}
                onPress={() => tooglePicker('hide')}>
                <Icon type="AntDesign" name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={tw`flex-1 w-full`}>
              <FlashList
                data={isOpented ? arr : []}
                // data={arr}
                contentContainerStyle={tw`pb-30`}
                estimatedItemSize={50}
                numColumns={5}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      onChange?.(
                        dayjs('2022-09-13 08:00').add(index * 10, 'minutes'),
                      );
                      tooglePicker('hide');
                    }}
                    style={tw`h-10 items-center justify-center flex-1 border border-THEME m-2 bg-${
                      index === 6 ? 'THEME' : 'WHITE'
                    } ${index === 6 ? 'border-THEME' : ''}`}>
                    <Text style={tw`text-${index === 6 ? 'WHITE' : 'THEME'}`}>
                      {dayjs('2022-09-13 08:00')
                        .add(index * 10, 'minutes')
                        .format('HH:mm')}
                    </Text>
                    <View style={tw`absolute top-0 right-0 z-2`}>
                      <Icon
                        type="AntDesign"
                        name="checkcircle"
                        size={10}
                        color="#fff"
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

export default React.forwardRef(PickerHouse);
