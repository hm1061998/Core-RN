import {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar, AppState, Platform, BackHandler } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { onlineManager, useQueryClient } from 'react-query';
import * as Notifications from 'expo-notifications';
import notifee, { EventType, AndroidStyle } from '@notifee/react-native';
import { EXPO_SLUG } from '@env';

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function useTimeout(callback, delay) {
  const timeoutRef = useRef(null);

  useEffect(() => {
    const tick = () => callback();
    if (typeof delay === 'number') {
      timeoutRef.current = setTimeout(tick, delay);
      return () => clearTimeout(timeoutRef.current);
    }
  }, [delay, callback]);
  return timeoutRef;
}

export const usePrevious = value => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export const useUpdateLayoutEffect = (effect, dependencies = []) => {
  const isInitialMount = useRef(true);
  useLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export const usePermission = () => {
  const { currentUser } = useSelector(state => state.users);
  const [permission, setPermission] = useState('block');
  useLayoutEffect(() => {
    switch (currentUser?.userGroupsId) {
      case '1':
        setPermission('isAdmin');
        break;
      case '10':
        setPermission('isAdmin');
        break;
      case '11':
        setPermission('isAdmin');
        break;
      case '12':
        setPermission('isAdmin');
        break;
      case '13':
        setPermission('isAdmin');
        break;
      case '14':
        setPermission('isAdmin');
        break;
      case '3':
        setPermission('isShipper');
        break;
      case '4':
        setPermission('isShipper');
        break;
      case '2':
        setPermission('isCustomer');
        break;

      default:
        setPermission('block');
        break;
    }
  }, [currentUser]);
  return permission;
};

export const useIsPermission = type => {
  // const { roles } = useSelector(state => state.root);
  const { currentUser } = useSelector(state => state.users);
  const [permission, setPermission] = useState(false);

  useLayoutEffect(() => {
    let _permissions;
    switch (type) {
      case 'admin':
        _permissions =
          currentUser?.userGroupsId === '1' ||
          currentUser?.userGroupsId === '10' ||
          currentUser?.userGroupsId === '11' ||
          currentUser?.userGroupsId === '12' ||
          currentUser?.userGroupsId === '13' ||
          currentUser?.userGroupsId === '14';
        setPermission(_permissions);
        break;
      case 'shipper':
        _permissions =
          currentUser?.userGroupsId === '3' ||
          currentUser?.userGroupsId === '4';
        setPermission(_permissions);
        break;
      case 'customer':
        _permissions = currentUser?.userGroupsId === '2';
        setPermission(_permissions);
        break;

      default:
        return setPermission(false);
    }
  }, [type, currentUser]);

  // console.log('type:', type, 'permission:', permission);
  return permission;
};

export const useIsSameUser = userId => {
  const { currentUser } = useSelector(state => state.users);
  const [check, setCheck] = useState(false);

  useLayoutEffect(() => {
    const _check = userId?.toString() === currentUser?.id?.toString();
    setCheck(_check);
  }, [currentUser, userId]);
  return check;
};

export function useStatusBar(style, animated = true) {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(style, animated);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
}

export function useAppState(onChange) {
  useEffect(() => {
    const listeners = AppState.addEventListener('change', onChange);
    return () => {
      listeners.remove();
    };
  }, [onChange]);
}

//React-query
export function useOnlineManager() {
  useEffect(() => {
    // React Query already supports on reconnect auto refetch in web browser
    if (Platform.OS !== 'web') {
      return NetInfo.addEventListener(state => {
        onlineManager.setOnline(
          state.isConnected != null &&
            state.isConnected &&
            Boolean(state.isInternetReachable),
        );
      });
    }
  }, []);
}

export function useRefreshByUser(refetch, enabled = true) {
  const [isRefetchingByUser, setIsRefetchingByUser] = useState(false);

  async function refetchByUser() {
    if (enabled) {
      setIsRefetchingByUser(true);

      try {
        await refetch();
      } finally {
        setIsRefetchingByUser(false);
      }
    }
  }

  return {
    isRefetchingByUser,
    refetchByUser,
  };
}

export function useRefreshOnFocus(refetch, enabled = true) {
  const enabledRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (enabledRef.current && enabled) {
        refetch();
      } else {
        enabledRef.current = true;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]),
  );
}

//Notifications
async function allowsNotificationsAsync() {
  const settings = await Notifications.getPermissionsAsync();

  // console.log('allows', settings);
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.EPHEMERAL
  );
}

async function getReqNotificationsAsync() {
  const settings = await Notifications.requestPermissionsAsync();
  // console.log('getPms', settings);
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.EPHEMERAL
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  const checkPms = await allowsNotificationsAsync();
  let finalStatus = checkPms;
  if (!checkPms) {
    const getPms = await getReqNotificationsAsync();
    finalStatus = getPms;
  }
  if (!finalStatus) {
    // alert('Failed to get push token for push notification!');
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    token = (
      await Notifications.getExpoPushTokenAsync({
        experienceId: EXPO_SLUG || '@vgasoft/spa-pharmar',
      })
    ).data;
  }

  console.log(token);
  // alert(token);

  return token;
}

export const useSetupNotifications = ({ pressCallBack, onMessage }) => {
  const notificationListener = useRef();
  const [expoPushToken, setExpoPushToken] = useState('');
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  //đăng ký nhận thông báo
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        // console.log('notification', notification);
        onDisplayNotification(notification);
        onMessage(notification);
      });

    const handlePressNotifi = async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        pressCallBack?.(detail);
        // console.log('press');
        // navigation.navigate('Notification');
      }
    };
    const unsubscribeNotifee = notifee.onForegroundEvent(handlePressNotifi);
    const unsubscribeBackNotifee = notifee.onBackgroundEvent(handlePressNotifi);

    return () => {
      unsubscribeNotifee?.();
      unsubscribeBackNotifee?.();
      Notifications?.removeNotificationSubscription?.(
        notificationListener.current,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onDisplayNotification({ request, date }) {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // console.log({ request });

    const messageId =
      request.trigger?.remoteMessage?.messageId || request.identifier;
    const sentTime = request.trigger?.remoteMessage?.sentTime || date;
    const { title, body, data } = request.content;

    await notifee.displayNotification({
      title: title,
      body: body,
      data: data,
      id: messageId,
      android: {
        channelId,
        timestamp: sentTime,
        showTimestamp: true,
        // style: { type: AndroidStyle.BIGPICTURE, picture: picture },
        // actions: [
        //   {
        //     title: 'Mark as Read',
        //     pressAction: {
        //       id: 'read',
        //     },
        //   },
        // ],
        // smallIcon: 'ic_notification',
      },
      ios: {
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
    });
  }

  return { lastNotificationResponse, expoPushToken };
};

export const useGoBack = (navigation, callback) => {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (callback) {
          callback();
        } else if (navigation.canGoBack()) {
          navigation.goBack();
        }

        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation, callback]),
  );
};
