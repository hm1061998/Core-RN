import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import 'expo-dev-client';
import React from 'react';
import { enableScreens } from 'react-native-screens';
import AppNavigation from '~/AppNavigation';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import models from '~/models/index';
import storeDva from '~/utils/storeDva';
import { QueryClient, QueryClientProvider, focusManager } from 'react-query';
import { Platform, LogBox, View } from 'react-native';
import { useAppState, useOnlineManager } from '~/utils/hooks';
import { ControlProvider } from '~/layouts/ControlProvider';
import { RootSiblingParent } from 'react-native-root-siblings';
import { useDeviceContext } from 'twrnc';
import tw from '~/lib/tailwind';
import { MenuProvider } from 'react-native-popup-menu';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

enableScreens(true);
LogBox.ignoreLogs(['Setting a timer', 'Sending', 'Require cycle']);
async function onAppStateChange(status) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      notifyOnChangeProps: 'tracked',
      staleTime: Infinity,
    },
  },
});

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme?.colors,
    primary: tw.color('THEME'),
  },
};

const _store = storeDva(models);
function App() {
  useDeviceContext(tw);
  useOnlineManager();
  useAppState(onAppStateChange);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <Provider store={_store}>
            <RootSiblingParent>
              <MenuProvider>
                <PaperProvider theme={theme}>
                  <ControlProvider>
                    <AppNavigation />
                  </ControlProvider>
                </PaperProvider>
              </MenuProvider>
            </RootSiblingParent>
          </Provider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default App;
