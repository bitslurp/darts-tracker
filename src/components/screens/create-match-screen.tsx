import React, { FunctionComponent, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { GeneralScreenTemplate } from './templates/general-screen-template';
import { Text, Button } from 'react-native-paper';
import { range } from 'ramda';
import PickerDialog from '../inputs/picker-dialog';
import DartsMatchRepo from '../../repo/DartsMatchRepo';
import DartsMatch from '../../data/DartsMatch';

interface CreateMatchProps {
  navigation: NavigationProp<any>;
}

const setOptions = range(1, 10).map(val => ({
  value: val.toString(),
  label: val.toString(),
}));

/**
 * A React screen component to configure and create a new Darts Match.
 */
const CreateMatchScreen: FunctionComponent<CreateMatchProps> = ({
  navigation,
}) => {
  const [firstToSet, setFirstToSet] = useState(3);
  const [firstToLeg, setFirstToLeg] = useState(3);
  const [players, setPlayers] = useState([]);
  return (
    <GeneralScreenTemplate
      navigation={navigation}
      title="New Game"
      onCreate={() => {
        DartsMatchRepo.createDartsMatch(
          DartsMatch.createDartsMatch(players, firstToSet, firstToLeg),
        );
        navigation.goBack();
      }}
      backButton={true}>
      <PickerDialog
        label="Sets - First To"
        onDismiss={() => {}}
        onDone={val => setFirstToSet(+val)}
        options={setOptions}
        defaultValue={firstToSet.toString()}
      />

      <PickerDialog
        label="Legs - First To"
        onDismiss={() => {}}
        onDone={val => setFirstToLeg(+val)}
        options={setOptions}
        defaultValue={firstToLeg.toString()}
      />
      <Text>{players.length} </Text>
      <Button
        onPress={() =>
          navigation.navigate({
            name: 'PlayerSelectionScreen',
            params: {
              onSelectPlayers: setPlayers,
            },
          })
        }>
        Add Players
      </Button>
    </GeneralScreenTemplate>
  );
};

export default CreateMatchScreen;
