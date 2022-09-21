import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, StyleSheet, View, Modal } from 'react-native';
import { isAndroid } from '~/utils/Values';
// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function AnimatedAppLoader({
  children,
  image,
  onInitialize,
  initializing,
}) {
  if (initializing) {
    return null;
  }

  return (
    <AnimatedSplashScreen image={image} onInitialize={onInitialize}>
      {children}
    </AnimatedSplashScreen>
  );
}

function AnimatedSplashScreen({ children, image, onInitialize }) {
  const animation = useMemo(() => new Animated.Value(1), []);
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (isAppReady) {
      setTimeout(() => {
        Animated.timing(animation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setAnimationComplete(true));
      }, 100);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAppReady]);

  const onImageLoaded = useCallback(async () => {
    // console.log('run');
    try {
      await onInitialize();
      await SplashScreen.hideAsync();

      // Load stuff
    } catch (e) {
      // handle errors
    } finally {
      setAppReady(true);
    }
  }, [onInitialize]);

  const splash = useMemo(() => {
    const splashObj = Constants.manifest
      ? Constants.manifest
      : Constants.manifest2?.extra?.expoClient;

    // console.log({ splashObj: splashObj?.extra?.expoClient?.splash });
    return (
      <Animated.View
        // pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: splashObj?.splash?.backgroundColor || '#fff',
            opacity: animation,
            zIndex: 10,
          },
        ]}>
        <Animated.Image
          style={{
            width: '100%',
            height: '100%',
            resizeMode: splashObj?.splash?.resizeMode || 'contain',
            transform: [
              {
                scale: animation,
              },
            ],
          }}
          source={image}
          fadeDuration={0}
          onLoadEnd={onImageLoaded}
        />
      </Animated.View>
    );
  }, [onImageLoaded, image, animation]);

  const renderSplash = useMemo(() => {
    // console.log(Constants);
    if (isAndroid()) {
      // console.log('android');
      return (
        <Modal
          visible={!isSplashAnimationComplete}
          transparent
          statusBarTranslucent>
          {splash}
        </Modal>
      );
    } else {
      // console.log('ios');
      return !isSplashAnimationComplete && splash;
    }
  }, [isSplashAnimationComplete, splash]);

  return (
    <View style={{ flex: 1 }}>
      {renderSplash}
      {isAppReady && children}
    </View>
  );
}
