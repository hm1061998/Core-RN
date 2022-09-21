import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLayoutContext } from '~/layouts/ControlProvider';
import * as THEME from '~/utils/Themes';
import { useSelector } from 'react-redux';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { COLOR, SIZES } from '~/utils/Values';
import { isIphoneXorAbove } from '~/utils/Values/sizes';
import { ScaledSheet, scale } from 'react-native-size-matters';

const BottomTab = ({ state, descriptors, navigation }) => {
  // const { tabBarStyle, theme } = useLayoutContext();
  const { theme } = useSelector(state => state.control);

  const renderRoute = () => {
    return state?.routes?.map((route, index) => {
      const { options } = descriptors[route.key];
      const label =
        options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

      // console.log('options', options);

      const isFocused = state.index === index;

      const onPress = () => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
          // The `merge: true` option makes sure that the params inside the tab screen are preserved
          navigation.navigate({ name: route.name, merge: true });
        }
      };

      const onLongPress = () => {
        navigation.emit({
          type: 'tabLongPress',
          target: route.key,
        });
      };

      const color = isFocused ? COLOR.THEME : COLOR.ROOT_COLOR_CYAN;

      return (
        <TouchableOpacity
          key={route.key}
          accessibilityRole="button"
          accessibilityState={isFocused ? { selected: true } : {}}
          accessibilityLabel={options.tabBarAccessibilityLabel}
          testID={options.tabBarTestID}
          onPress={onPress}
          onLongPress={onLongPress}
          style={styles.item}>
          {!!options?.icon && options.icon({ color, size: scale(23) })}
          <Text style={{ color: color }}>{label}</Text>
        </TouchableOpacity>
      );
    });
  };

  // console.log(theme.HOME);
  return (
    <Animated.View style={[styles.container]}>
      <View style={styles.list}>{renderRoute()}</View>
    </Animated.View>
  );
};

const styles = ScaledSheet.create({
  container: {
    height: SIZES.TABBAR_HEIGHT + scale(14),
    width: '100%',
    backgroundColor: COLOR.WHITE,
    paddingBottom: isIphoneXorAbove() ? scale(10) : 0,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  item: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default BottomTab;
