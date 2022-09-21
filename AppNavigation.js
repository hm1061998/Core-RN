/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Linking } from 'react-native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
// import * as Linking from 'expo-linking';
import { useSelector } from 'react-redux';
import RootRoute from '~/config/MainNavigation';
// import RootRoute from '~/config/DrawerNavigation';
import AuthNavigation from '~/config/auth';
import * as Notifications from 'expo-notifications';

const rootStack = createStackNavigator();

const AppNavigation = ({ deepLink }) => {
  const { isAuthenticated } = useSelector(state => state.control);

  const onLayout = () => {
    if (deepLink) {
      Linking.openURL(deepLink);
    }
  };
  // console.log('isFirst', isFirst);

  return (
    <View onLayout={onLayout} style={{ flex: 1 }}>
      <NavigationContainer
        fallback={null}
        linking={{
          config: {
            // Configuration for linking
          },
          async getInitialURL() {
            // First, you may want to do the default deep link handling
            // Check if app was opened from a deep link
            let url = await Linking.getInitialURL();

            if (url != null) {
              return url;
            }

            // Handle URL from expo push notifications
            const response =
              await Notifications.getLastNotificationResponseAsync();
            url = response?.notification.request.content.data.url;

            return url;
          },
          subscribe(listener) {
            const onReceiveURL = ({ url }) => listener(url);

            // Listen to incoming links from deep linking
            const linksubscription = Linking.addEventListener(
              'url',
              onReceiveURL,
            );

            // Listen to expo push notifications
            const subscription =
              Notifications.addNotificationResponseReceivedListener(
                response => {
                  const url = response.notification.request.content.data.url;

                  // Any custom logic to see whether the URL needs to be handled
                  //...

                  // Let React Navigation handle the URL
                  listener(url);
                },
              );

            return () => {
              // Clean up the event listeners
              // Linking.removeEventListener('url', onReceiveURL);
              linksubscription.remove();
              subscription.remove();
            };
          },
        }}>
        <rootStack.Navigator
          screenOptions={{
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS,
          }}>
          {/* <rootStack.Screen name="RootRoute" component={RootRoute} /> */}
          {/* <rootStack.Screen name="AuthRoute" component={AuthNavigation} /> */}
          {isAuthenticated ? (
            <rootStack.Screen name="RootRoute" component={RootRoute} />
          ) : (
            <rootStack.Screen name="AuthRoute" component={AuthNavigation} />
          )}
        </rootStack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default React.memo(AppNavigation);
