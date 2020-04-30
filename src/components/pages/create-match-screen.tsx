import React, { FunctionComponent } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { GeneralScreenTemplate } from './templates/general-screen-template';

interface CreateMatchProps {
  navigation: NavigationProp<any>;
}

const CreateMatchScreen: FunctionComponent<CreateMatchProps> = ({
  navigation,
}) => {
  return (
    <GeneralScreenTemplate
      navigation={navigation}
      title="New Game"
      backButton={true}
    />
  );
};

export default CreateMatchScreen;
