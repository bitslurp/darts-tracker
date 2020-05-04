import React, { FunctionComponent, useEffect, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { GeneralScreenTemplate } from './templates/general-screen-template';
import DartsMatchRepo from '../../repo/DartsMatchRepo';
import DartsMatch, { DartsMatchModel } from '../../data/DartsMatch';
import { Collection } from 'realm';
import { Text, List } from 'react-native-paper';
import { View } from 'react-native';

const DartsMatchListItem: FunctionComponent<{
  dartsMatch: DartsMatchModel;
  onPress(): void;
}> = ({ dartsMatch, onPress }) => {
  const title = DartsMatch.playerNames(dartsMatch).join(' vs ');
  const description = DartsMatch.matchDescription(dartsMatch);
  return (
    <List.Item
      left={props => <List.Icon {...props} icon="bullseye-arrow" />}
      title={title}
      description={description}
      onPress={onPress}
      right={props => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <List.Icon {...props} icon="trophy" />
          <Text {...props}>None</Text>
        </View>
      )}
    />
  );
};

interface N01ScreenProps {
  navigation: NavigationProp<any>;
}

const DartsMatchesScreen: FunctionComponent<N01ScreenProps> = ({
  navigation,
}) => {
  const [matches, setMatches] = useState(([] as any) as Collection<
    DartsMatchModel
  >);

  useEffect(() => {
    const { data, complete } = DartsMatchRepo.findMatchesByMonth(4, 2020);
    data.subscribe(matches => {
      setMatches(matches);
    });
    return complete;
  }, []);
  return (
    <GeneralScreenTemplate
      navigation={navigation}
      title="Darts Games"
      backButton={true}
      onCreate={() => navigation.navigate('CreateMatchScreen')}>
      {matches.map(match => (
        <DartsMatchListItem
          key={match.id}
          dartsMatch={match}
          onPress={() =>
            navigation.navigate({
              name: 'DartsMatch',
              params: { matchId: match.id },
            })
          }
        />
      ))}
    </GeneralScreenTemplate>
  );
};

export default DartsMatchesScreen;
