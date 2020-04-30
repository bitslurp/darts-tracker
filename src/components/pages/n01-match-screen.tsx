import React, { FunctionComponent } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { GeneralScreenTemplate } from './templates/general-screen-template';

interface N01MatchScreenProps {
  navigation: NavigationProp<any>;
}

const N01MatchScreen: FunctionComponent<N01MatchScreenProps> = ({
  navigation,
}) => {
  return (
    <GeneralScreenTemplate
      navigation={navigation}
      title="Lets Play Darts"
      backButton={true}
      onCreate={() => navigation.navigate('CreateMatchScreen')}
    />
  );
};

export default N01MatchScreen;
