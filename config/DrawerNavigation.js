import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigation from './bottomTab';
import config from './config';

const Drawer = createDrawerNavigator();

export default function MainRoute() {
  return (
    <Drawer.Navigator useLegacyImplementation>
      {/* <Drawer.Screen name="Main" component={BottomTabNavigation} /> */}
      {config.map(item => (
        <Drawer.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={item.options}
        />
      ))}
    </Drawer.Navigator>
  );
}
