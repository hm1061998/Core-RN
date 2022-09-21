import { Dimensions, StatusBar, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export const isIphoneXorAbove = () => {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896)
  );
};

export const isAndroid = () => {
  return Platform.OS === 'android';
};

export const SIZES = {
  WIDTH_WINDOW: Dimensions.get('window').width,
  HEIGHT_WINDOW: Dimensions.get('window').height,
  HEIGHT_SCREEN: Dimensions.get('screen').height,
  HEIGHT_STATUSBAR:
    Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight,
  HEIGHT_PADDINGTOP:
    Platform.OS === 'ios'
      ? getStatusBarHeight() * 1.3
      : StatusBar.currentHeight * 1.3,
  HEIGHT_SOFTMENUBAR:
    Dimensions.get('screen').height === Dimensions.get('window').height
      ? 0
      : Dimensions.get('screen').height -
        Dimensions.get('window').height -
        StatusBar.currentHeight,
  TABBAR_HEIGHT: isIphoneXorAbove() ? 60 : 50,
};
