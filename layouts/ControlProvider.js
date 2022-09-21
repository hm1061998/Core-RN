import * as React from 'react';
import * as Localization from 'expo-localization';
import { useSetupNotifications } from '~/utils/hooks';
import { StatusBar } from 'react-native';
// import RNExitApp from 'react-native-exit-app';

import * as Updates from 'expo-updates';
import * as Font from 'expo-font';
import myFont from '~/utils/font';
import { typography } from '~/utils/typography';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedAppLoader from './AnimatedAppLoader';
import { KEY_LANGUAGE, FACEBOOK_APPID, WAREHOUSEID, PLACEID } from '@env';
import Auth from '~/utils/Auth';
import { COLOR } from '~/utils/Values';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient } from 'react-query';
import * as Notifications from 'expo-notifications';
// import * as Facebook from 'expo-facebook';
import NetInfo from '@react-native-community/netinfo';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { Settings } from 'react-native-fbsdk-next';

const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
dayjs.locale('vi');
Settings.initializeSDK();
Auth.init();
const ControlContext = React.createContext();
export function ControlProvider(props) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { initializing } = useSelector(state => state.control);
  const { isConnected } = NetInfo.useNetInfo();
  const [placeId, setPlaceId] = React.useState(null);
  const [warehouseId, setWarehouseId] = React.useState(null);

  // const pressCallBack = response => {
  //   const paramsNotification = response?.notification?.data;
  //   // setSaveParams(paramsNotification);
  // };

  // const onMessage = () => {
  //   // setHandleNotification(true);
  // };
  // const { expoPushToken, lastNotificationResponse } = useSetupNotifications({
  //   pressCallBack,
  //   onMessage,
  // });

  // console.log('data', data);
  //xử lý nhận thông báo khi ứng dụng ở chế độ nền
  // React.useEffect(() => {
  //   if (
  //     lastNotificationResponse &&
  //     lastNotificationResponse.notification.request.content.data.type &&
  //     lastNotificationResponse.actionIdentifier ===
  //       Notifications.DEFAULT_ACTION_IDENTIFIER
  //   ) {
  //     // setSaveParams(lastNotificationResponse.notification.request.content.data);
  //     // Linking.openURL(lastNotificationResponse.notification.request.content.data.url);
  //   }
  // }, [lastNotificationResponse]);

  React.useEffect(() => {
    dispatch({
      type: 'control/changeConnected',
      payload: isConnected,
    });
  }, [dispatch, isConnected]);

  //kiểm tra version app
  React.useEffect(() => {}, []);

  //xác thực đăng nhập
  React.useEffect(() => {
    const subscription = Auth.onAuthStateChanged(res => {
      // console.log({ res });
      //lưu thông tin user
      dispatch({
        type: 'user/setCurrent',
        payload: res,
      });

      dispatch({
        type: 'control/SET_isAuthenticated',
        payload: !!res?.id,
      });

      if (res?.id) {
        queryClient.clear(); //gọi lại dữ liệu khi chuyển tài khoản
      } else {
        // queryClient.clear();
        setWarehouseId(null);
        AsyncStorage.removeItem(WAREHOUSEID);
      }

      if (initializing) {
        //cài đặt trạng thái ban đầu cho app
        dispatch({
          type: 'control/SET_INIT',
          payload: false,
        });
      }

      // console.log({ res });
    });

    return subscription;
  }, [dispatch, initializing, queryClient]);

  //khi token đăng nhập hết hạn
  React.useEffect(() => {
    const subscription = Auth.onTokenStateChange(res => {
      if (!res?.id) {
        dispatch({
          type: 'control/SET_isAuthenticated',
          payload: false,
        });
        setWarehouseId(null);
        AsyncStorage.removeItem(WAREHOUSEID);
      }
    });
    return subscription;
  }, [dispatch]);

  //chuyển đổi ngôn ngữ
  const setMainLocaleLanguage = _language => {
    dispatch({
      type: 'control/SET_I18N',
      payload: _language,
    });
    AsyncStorage.setItem(KEY_LANGUAGE, _language);
  };

  //kiểm tra cập nhật
  const fetchUpdate = () =>
    new Promise(async resolve => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          // setHasUpdate(true);
        }
      } catch (e) {
        // console.log('e');
      } finally {
        resolve(true);
      }
    });

  //tải font chữ
  const loadFonts = () =>
    new Promise(async resolve => {
      try {
        await Font.loadAsync({ ...Ionicons.font, ...myFont });
      } catch (err) {
        console.log({ err });
      } finally {
        typography();
        resolve(true);
      }
    });

  //lấy dữ liệu ngôn ngữ mặc định
  const getInitialLaguage = async () => {
    const initial = await AsyncStorage.getItem(KEY_LANGUAGE);

    if (initial) {
      setMainLocaleLanguage(initial);
    } else {
      setMainLocaleLanguage(Localization.locale);
    }
  };

  const getInitialWareHouseId = async () => {
    const initial = await AsyncStorage.getItem(WAREHOUSEID);
    setWarehouseId(initial);
  };

  const getInitialPlaceId = async () => {
    const initial = await AsyncStorage.getItem(PLACEID);
    setPlaceId(initial);
  };

  const getInitSetting = async () => {
    await dispatch({
      type: 'control/initApp',
    });

    // await Facebook.initializeAsync({ appId: FACEBOOK_APPID });
  };
  //cấu hình app
  const onInitialize = async () => {
    await Promise.all([
      loadFonts(),
      // fetchUpdate(),
      getInitialLaguage(),
      getInitSetting(),
      getInitialWareHouseId(),
      getInitialPlaceId(),
    ]);
  };
  // console.log(expoPushToken);

  return (
    <ControlContext.Provider
      value={{
        setMainLocaleLanguage,
        warehouseId,
        setWarehouseId,
        placeId,
        setPlaceId,
        // expoPushToken,
      }}>
      <StatusBar
        animated={true}
        backgroundColor={COLOR.TRANSPARENT}
        barStyle={'light-content'}
        showHideTransition={'slide'}
        translucent={true}
      />

      <AnimatedAppLoader
        initializing={initializing}
        image={require('~/assets/logo_f2.png')}
        onInitialize={onInitialize}>
        {props.children}
      </AnimatedAppLoader>
    </ControlContext.Provider>
  );
}

export const useLayoutContext = () => {
  const context = React.useContext(ControlContext);
  if (context === undefined) {
    throw new Error('ControlContext must be within ControlProvider');
  }

  return context;
};
