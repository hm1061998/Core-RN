import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

const { height: screenHeight } = Dimensions.get('screen');
export default function KeyboardShift(props) {
  const { children } = props;
  const [shift] = useState(new Animated.Value(0));

  // On mount, add keyboard show and hide listeners
  // On unmount, remove them
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      'keyboardWillShow',
      handleKeyboardWillShow,
    );
    const keyboardWillHide = Keyboard.addListener(
      'keyboardWillHide',
      handleKeyboardWillHide,
    );
    const keyboardDidShow = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardDidShow,
    );
    const keyboardDidHide = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardDidHide,
    );

    const KeyboardWillChange = Keyboard.addListener(
      'keyboardWillChangeFrame',
      handleKeyboardWillChange,
    );
    const KeyboardDidChange = Keyboard.addListener(
      'keyboardWillChangeFrame',
      handleKeyboardDidChange,
    );

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
      keyboardWillShow.remove();
      keyboardWillHide.remove();
      KeyboardWillChange.remove();
      KeyboardDidChange.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyboardWillChange = e => {
    const keyboardHeight = e.endCoordinates.height;
    // console.log('keyboardHeight', keyboardHeight);
  };

  const handleKeyboardDidChange = e => {
    if (Platform.OS === 'android') {
      handleKeyboardWillChange(e);
    }
  };

  const handleKeyboardWillShow = e => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = e.endCoordinates.height;

    const currentlyFocusedInputRef = TextInput.State?.currentlyFocusedInput();
    currentlyFocusedInputRef?.measure((x, y, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = windowHeight - keyboardHeight - (fieldTop + fieldHeight);
      if (gap >= 0) {
        return;
      }
      // console.log('gap', gap);
      Animated.timing(shift, {
        toValue: gap,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleKeyboardWillHide = () => {
    Animated.timing(shift, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleKeyboardDidShow = e => {
    if (Platform.OS === 'android') {
      handleKeyboardWillShow(e);
    }
  };
  const handleKeyboardDidHide = e => {
    if (Platform.OS === 'android') {
      handleKeyboardWillHide(e);
    }
  };

  // Android: we need an animated view since the keyboard style can vary widely
  // And React Native's KeyboardAvoidingView isn't always reliable
  // if (Platform.OS === 'android') {
  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: shift }] }]}>
      {children}
    </Animated.View>
  );
  // }

  // iOS: React Native's KeyboardAvoidingView with header offset and
  // behavior 'padding' works fine on all ios devices (and keyboard types)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const headerHeight = useHeaderHeight();
  // return (
  //   <KeyboardAvoidingView
  //     keyboardVerticalOffset={headerHeight}
  //     style={styles.container}
  //     behavior={'padding'}>
  //     {children}
  //   </KeyboardAvoidingView>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
