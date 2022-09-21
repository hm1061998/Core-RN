import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import config from './config';
import { StatusBar } from 'react-native';

const AuthStack = createStackNavigator();
function AuthNavigation() {
  // console.log('config', config);
  return (
    <>
      <StatusBar barStyle="light-content" />
      <AuthStack.Navigator
        screenOptions={{
          cardStyle: { backgroundColor: '#fff' },
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        {config.map(item => (
          <AuthStack.Screen
            key={item.name}
            name={item.name}
            component={item.component}
            options={{
              ...item.options,
            }}
          />
        ))}
      </AuthStack.Navigator>
    </>
  );
}

export default React.memo(AuthNavigation);
