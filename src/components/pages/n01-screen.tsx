import React, { FunctionComponent } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { GeneralScreenTemplate } from './templates/general-screen-template';

interface N01ScreenProps {
  navigation: NavigationProp<any>;
}

const N01Screen: FunctionComponent<N01ScreenProps> = ({ navigation }) => {
  return (
    <GeneralScreenTemplate
      navigation={navigation}
      title="Darts Games"
      backButton={true}
      onCreate={() => navigation.navigate('CreateMatchScreen')}
    />
  );
};

export default N01Screen;
