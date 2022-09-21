import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import BottomTabNavigation from './bottomTab';
import config from './config';
import { useLayoutContext } from '~/layouts/ControlProvider';

const Stack = createStackNavigator();

export default function MainRoute() {
  const { warehouseId } = useLayoutContext();
  // console.log({ warehouseId });
  return (
    <>
      <Stack.Navigator
        initialRouteName={warehouseId ? 'Main' : undefined}
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        {config.map(item => (
          <Stack.Screen
            key={item.name}
            name={item.name}
            component={item.component}
            options={item.options}
          />
        ))}
        <Stack.Screen name="Main" component={BottomTabNavigation} />
      </Stack.Navigator>
    </>
  );
}
