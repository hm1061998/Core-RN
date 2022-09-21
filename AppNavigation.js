/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { useSelector } from 'react-redux';
import RootRoute from '~/config/MainNavigation';
// import RootRoute from '~/config/DrawerNavigation';
import AuthNavigation from '~/config/auth';

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
      <NavigationContainer fallback={null}>
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
