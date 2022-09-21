import React, { useMemo, useEffect } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import COLOR from '~/utils/color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const ScrollTop = ({
  scrollRef,
  showScrollTop,
  isSectionList,
  bottomOffset,
}) => {
  const anim = useMemo(() => new Animated.Value(0), []);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.spring(anim, {
      toValue: showScrollTop ? 1 : 0,
      speed: 50,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showScrollTop]);

  return (
    <AnimatedTouchableOpacity
      disabled={!showScrollTop}
      activeOpacity={0.7}
      onPress={() => {
        if (isSectionList) {
          scrollRef.current?.scrollToLocation({
            itemIndex: 0,
            sectionIndex: 0,
            viewPosition: 0.5,
          });
        } else {
          scrollRef.current?.scrollToOffset({ offset: 0, animated: true });
        }
      }}
      style={{
        position: 'absolute',
        bottom: bottomOffset || 50,
        right: 24,
        zIndex: 10,
        transform: [{ scale: anim }],
        opacity: anim,
      }}>
      <AntDesign name="upcircle" size={28} color={COLOR.view_more} />
    </AnimatedTouchableOpacity>
  );
};

export default React.memo(ScrollTop);
