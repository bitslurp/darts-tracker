import React, { FunctionComponent } from 'react';
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateMatchScreen from './src/components/screens/create-match-screen';
import MainMenuScreen from './src/components/screens/main-menu-screen';
import DartsMatchesScreen from './src/components/screens/darts-matches-screen';
import DartsMatchScreen from './src/components/screens/n01-match-screen';
import PlayerSelectionScreen from './src/components/screens/player-selection-screen';

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
            name="DartsMatchesScreen"
            component={DartsMatchesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateMatchScreen"
            component={CreateMatchScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PlayerSelectionScreen"
            component={PlayerSelectionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DartsMatch"
            component={DartsMatchScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};
