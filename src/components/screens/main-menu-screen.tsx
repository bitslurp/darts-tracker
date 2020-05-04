import React, { FunctionComponent } from 'react';
import { Button } from 'react-native-paper';
import { NavigationContext, NavigationProp } from '@react-navigation/native';
import { GeneralScreenTemplate } from './templates/general-screen-template';

interface MenuScreenProps {
  navigation: NavigationProp<any>;
}

const MainMenuScreen: FunctionComponent<MenuScreenProps> = ({ navigation }) => {
  return (
    <GeneralScreenTemplate navigation={navigation} title="Darts Tracker">
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('DartsMatchesScreen')}>
        Play Darts
      </Button>
    </GeneralScreenTemplate>
  );
};

export default MainMenuScreen;
