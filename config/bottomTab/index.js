import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import config from './config';
import React from 'react';
import { COLOR } from '~/utils/Values';

const Tab = createBottomTabNavigator();

function BottomTabNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: COLOR.THEME,
        tabBarLabelStyle: { fontFamily: 'Roboto_medium', marginBottom: 5 },
      }}>
      {config.map(item => (
        <Tab.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={{
            ...item.options,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default BottomTabNavigation;
