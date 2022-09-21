import React, {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useEffect,
} from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

let timer = null;
const Index = (_props, ref) => {
  const anim = useRef(new Animated.Value(0));
  const [toastMessage, setToastMessage] = useState('');
  const [typeMessage, setTypeMessage] = useState('warning');
  useImperativeHandle(ref, () => ({
    show: ({ message, timeout, type }) => {
      onShow(timeout);
      setToastMessage(message);
      setTypeMessage(type || 'warning');
    },
  }));

  useEffect(() => {
    if (_props.onLayout) {
      _props.onLayout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onShow = timing => {
    if (timer) {
      clearTimeout(timer);
    }
    Animated.spring(anim.current, {
      toValue: 1,
      speed: 50,
      useNativeDriver: true,
    }).start(() => {
      timer = setTimeout(() => {
        onHide();
      }, timing || 1000);
    });
  };

  const onHide = () => {
    Animated.timing(anim.current, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };

  const renderIcon = useMemo(() => {
    if (typeMessage === 'warning') {
      return (
        <MaterialCommunityIcons name="alert-circle" size={24} color="#fff" />
      );
    } else if (typeMessage === 'success') {
      return <AntDesign name="checkcircle" size={24} color="#fff" />;
    }
    return null;
  }, [typeMessage]);
  return (
    <View style={styles.toastAlert} pointerEvents="none">
      <Animated.View
        style={[
          styles.toastAlertBox,
          { transform: [{ scale: anim.current }] },
        ]}>
        {renderIcon}
        <Text style={styles.toastAlertTitle}>{toastMessage}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  toastAlert: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
  },
  toastAlertBox: {
    minWidth: '50%',
    maxWidth: '95%',
    minHeight: 60,
    backgroundColor: '#0000009e',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  toastAlertTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Roboto',
    marginTop: 5,
  },
});

export default forwardRef(Index);
