import React, { useState, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { Fontisto } from '@expo/vector-icons';
import { COLOR } from '~/utils/Values';

const FORMATS = {
  date: 'DD/MM/YYYY',
  datetime: 'DD/MM/YYYY HH:mm:ss',
  time: 'HH:mm:ss',
};
const { height } = Dimensions.get('window');
const DateTimePicker = ({
  value,
  display,
  mode,
  maxDate,
  minDate,
  timeZoneOffsetInMinutes,
  textColor,
  themeVariant,
  locale,
  is24Hour,
  minuteInterval,
  disabled,
  onChangeValue,
  format,
  containerStyle,
  textStyle,
  iconColor,
  iconSize,
  placeholder,
}) => {
  const [date, setDate] = useState(value && dayjs(value).toDate());
  // const [label, setLabel] = useState()
  const [show, setShow] = useState(false);
  const [anim] = useState(new Animated.Value(0));
  const formatValue = format || FORMATS[mode];

  // console.log({ value });
  useEffect(() => {
    if (show) {
      Animated.timing(anim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const onChange = (_event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    // setLabel(dayjs(currentDate).format(formatValue))
    onChangeValue(currentDate);
  };

  const getContainerStyle = () => {
    let _style;
    if (containerStyle && Array.isArray(containerStyle)) {
      _style = [styles.container, ...containerStyle];
    } else if (containerStyle && typeof containerStyle === 'object') {
      _style = [styles.container, { ...containerStyle }];
    } else {
      _style = styles.container;
    }
    return _style;
  };

  const onCloseModal = () => {
    if (!date) {
      const currentDate = new Date();
      setDate(currentDate);
      onChangeValue(currentDate);
    }

    Animated.timing(anim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => setShow(false));
  };

  if (Platform.OS === 'ios') {
    const opacity = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5],
      extrapolate: 'clamp',
    });

    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [height, 0],
      extrapolate: 'clamp',
    });
    return (
      <TouchableWithoutFeedback
        onPress={() => setShow(true)}
        disabled={disabled}>
        <View style={getContainerStyle()}>
          {date ? (
            <Text style={textStyle}>{dayjs(date).format(formatValue)}</Text>
          ) : (
            <Text style={{ opacity: 0.5 }}>{placeholder}</Text>
          )}

          <Fontisto name="date" size={iconSize} color={iconColor} />
          <Modal
            visible={show}
            onRequestClose={onCloseModal}
            animationType="none"
            statusBarTranslucent
            transparent>
            <View style={styles.containerModal}>
              <TouchableWithoutFeedback onPress={onCloseModal}>
                <Animated.View style={[styles.overlay, { opacity: opacity }]} />
              </TouchableWithoutFeedback>

              <Animated.View
                style={[
                  styles.pickerContainer,
                  { transform: [{ translateY }] },
                ]}>
                <View style={styles.bottom}>
                  <TouchableOpacity
                    onPress={onCloseModal}
                    style={[styles.btn, { backgroundColor: COLOR.THEME }]}>
                    <Text style={[styles.textBtn, { color: '#fff' }]}>
                      Xong
                    </Text>
                  </TouchableOpacity>
                </View>
                <RNDateTimePicker
                  testID="dateTimePicker"
                  value={date || dayjs().toDate()}
                  mode={mode}
                  display={display}
                  onChange={onChange}
                  maximumDate={maxDate}
                  minimumDate={minDate}
                  timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
                  textColor={textColor}
                  themeVariant={themeVariant}
                  locale={locale}
                  is24Hour={is24Hour}
                  minuteInterval={minuteInterval}
                />
              </Animated.View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  return (
    <TouchableWithoutFeedback onPress={() => setShow(true)} disabled={disabled}>
      <View style={getContainerStyle()}>
        {date ? (
          <Text style={textStyle}>{dayjs(date).format(formatValue)}</Text>
        ) : (
          <Text style={{ opacity: 0.5 }}>{placeholder}</Text>
        )}

        <Fontisto name="date" size={iconSize} color={iconColor} />

        {show && (
          <RNDateTimePicker
            testID="dateTimePicker"
            value={date || dayjs().toDate()}
            mode={mode}
            display={display}
            onChange={onChange}
            maximumDate={maxDate}
            minimumDate={minDate}
            timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
            textColor={textColor}
            themeVariant={themeVariant}
            locale={locale}
            is24Hour={is24Hour}
            minuteInterval={minuteInterval}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#eee',
  },
  containerModal: {
    flex: 1,
    // paddingTop: 100,
    justifyContent: 'flex-end',
  },
  bottom: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: -20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  btn: {
    borderColor: COLOR.THEME,
    borderRadius: 4,
    borderWidth: 0.7,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
  },
  textBtn: {
    color: '#000',
    fontFamily: 'Roboto',
    fontSize: 15,
  },
  overlay: {
    backgroundColor: '#000',
    ...StyleSheet.absoluteFillObject,
  },
  pickerContainer: {
    // height: 300,
    width: '100%',
    backgroundColor: '#fff',
  },
});

DateTimePicker.defaultProps = {
  mode: 'date',
  onChangeValue: () => true,
  display: 'default',
  disabled: false,
  is24Hour: false,
  iconColor: '#000',
  iconSize: 20,
  locale: 'vi',
};

DateTimePicker.propTypes = {
  mode: PropTypes.oneOf(['date', 'datetime', 'time']),
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(dayjs),
  ]),
  display: Platform.select({
    ios: PropTypes.oneOf(['default', 'spinner', 'compact', 'inline']),
    android: PropTypes.oneOf(['default', 'spinner', 'calendar', 'clock']),
  }),
  maxDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(dayjs),
  ]),
  minDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(dayjs),
  ]),
  timeZoneOffsetInMinutes: PropTypes.number,
  textColor: PropTypes.string,
  themeVariant: PropTypes.oneOf(['light', 'dark']),
  locale: PropTypes.string,
  is24Hour: PropTypes.bool,
  minuteInterval: PropTypes.number,
  disabled: PropTypes.bool,
  onChangeValue: PropTypes.func,
  format: PropTypes.string,
  iconColor: PropTypes.string,
  iconSize: PropTypes.number,
  placeholder: PropTypes.string,
};
export default React.memo(DateTimePicker);
