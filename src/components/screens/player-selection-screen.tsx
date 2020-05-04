import React, { FunctionComponent, useEffect, useState } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';

import { GeneralScreenTemplate } from './templates/general-screen-template';
import PlayerRepo from '../../repo/PlayerRepo';
import { Collection } from 'realm';
import { Player } from '../../data/Player';
import { Button, Checkbox, TextInput, List, Title } from 'react-native-paper';
import { View, ScrollView } from 'react-native';
import { values } from 'ramda';

interface PlayerSelectionProps {
  navigation: NavigationProp<any>;
  route: any;
}

const PlayerSelectionScreen: FunctionComponent<PlayerSelectionProps> = ({
  navigation,
  route,
}) => {
  const [players, setPlayers] = useState(([] as any) as Collection<Player>);
  const [selectedPlayerDict, setSelectedPlayer] = useState({} as {
    [name: string]: Player;
  });

  const [newPlayerName, setNewPlayerName] = useState('');
  useEffect(() => {
    const { data, complete } = PlayerRepo.getAll();

    data.subscribe(setPlayers);
    return complete;
  });
  const selectedPlayers = values(selectedPlayerDict).filter(v => v);

  return (
    <GeneralScreenTemplate
      navigation={navigation}
      title="Select Players"
      backButton={true}
      createButtonIcon="check"
      createButtonDisabled={selectedPlayers.length === 0}
      onCreate={() => {
        route.params.onSelectPlayers(selectedPlayers);
        navigation.goBack();
      }}>
      <ScrollView>
        {players.map(player => {
          const updateCheckBox = () => {
            const { name } = player;
            if (selectedPlayerDict[name]) {
              setSelectedPlayer({
                ...selectedPlayerDict,
                [name]: undefined,
              });
            } else {
              setSelectedPlayer({
                ...selectedPlayerDict,
                [name]: player,
              });
            }
          };
          return (
            <List.Item
              key={player.name}
              title={player.name}
              onPress={updateCheckBox}
              left={props => (
                <Checkbox
                  status={
                    !!selectedPlayerDict[player.name] ? 'checked' : 'unchecked'
                  }
                  onPress={updateCheckBox}
                />
              )}
            />
          );
        })}
      </ScrollView>
      <View style={{ paddingBottom: 100 }}>
        <Title>Add New Player</Title>
        <TextInput
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          label="Player Name"
        />
        <Button
          disabled={!newPlayerName}
          onPress={() => {
            PlayerRepo.create(newPlayerName);
            setNewPlayerName('');
          }}>
          Create Player
        </Button>
      </View>
    </GeneralScreenTemplate>
  );
};

export default PlayerSelectionScreen;
