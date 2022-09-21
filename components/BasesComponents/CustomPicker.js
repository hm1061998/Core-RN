import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import tw from '~/lib/tailwind';
import Text from '~/utils/StyledText';
import { Picker } from 'react-native-wheel-pick';

const CustomPicker = (
  {
    onChange,
    value,
    containerStyle,
    textStyle,
    data,
    placeholder,
    disabled,
    ...orderProps
  },
  ref,
) => {
  const [visible, setVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [anim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (!visible) {
      setCurrentValue(value);
    }
  }, [value, visible]);

  const tooglePicker = type => {
    Animated.timing(anim, {
      toValue: type === 'show' ? 1 : 0,
      useNativeDriver: true,
      duration: 100,
    }).start(() => {
      if (type === 'hide') {
        setVisible(false);
      }
    });
  };

  const label = useMemo(() => {
    const text = data?.find(item => item?.value === value);

    return text?.label || null;
  }, [data, value]);

  // console.log({ data });

  return (
    <TouchableOpacity
      {...orderProps}
      disabled={disabled}
      onPress={() => setVisible(true)}
      style={containerStyle}>
      <Text style={textStyle}>{label || placeholder}</Text>
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
              style={tw.style('absolute-fill bg-BLACK', {
                opacity: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                  extrapolate: 'clamp',
                }),
              })}
            />
          </TouchableWithoutFeedback>
          <Animated.View
            style={tw.style('w-full items-center bg-WHITE rounded-t-xl', {
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [500, 0],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            })}>
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
            <Picker
              style={tw`h-[225px] w-full bg-WHITE `}
              selectedValue={currentValue}
              pickerData={data || []}
              onValueChange={value => {
                // console.log(value);
                setCurrentValue(value);
              }}
            />
          </Animated.View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

export default React.forwardRef(CustomPicker);
