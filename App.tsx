/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


import React, { FunctionComponent } from 'react';
import {
  StatusBar,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from './src/config/common';

const App: FunctionComponent = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>

        <StatusBar backgroundColor={COLORS.BLACK} barStyle={'dark-content'} />
        <NavigationContainer>

          <RootStack />
          {/* <Drawernavigator /> */}
        </NavigationContainer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
