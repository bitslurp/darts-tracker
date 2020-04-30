import React, { FunctionComponent } from 'react';
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateMatchScreen from './src/components/pages/create-match-screen';
import MainMenuScreen from './src/components/pages/main-menu-screen';
import N01Screen from './src/components/pages/n01-screen';
import N01MatchScreen from './src/components/pages/n01-match-screen';

const Stack = createStackNavigator();
export const App: FunctionComponent = () => {
  return (
    <PaperProvider theme={DarkTheme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={MainMenuScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateMatchScreen"
            component={CreateMatchScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="N01Screen"
            component={N01Screen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="N01MatchScreen"
            component={N01MatchScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};
