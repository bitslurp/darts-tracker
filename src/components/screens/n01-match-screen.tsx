import React, { FunctionComponent, useEffect, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { GeneralScreenTemplate } from './templates/general-screen-template';
import { Text, Card, DarkTheme, Title } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import DartsScoreKeypad from '../inputs/darts-score-keypad';
import DartsMatch, { DartsMatchModel } from '../../data/DartsMatch';
import { Player } from '../../data/Player';
import DartsMatchRepo from '../../repo/DartsMatchRepo';
// TODO: Move DartsPlayerScoreCard to separate file for potential reuse in different game modes
const DartsPlayerScoreCard: FunctionComponent<{
  dartsMatch: DartsMatchModel;
  player: Player;
}> = ({ dartsMatch, player }) => {
  const activeGameStates = DartsMatch.activeGameStatsByPlayer(
    dartsMatch,
    player,
  );
  const matchStats = DartsMatch.matchStatsByPlayer(dartsMatch, player);
  const activeSetStats = DartsMatch.activeSetStats(dartsMatch, player);

  return (
    <Card style={{ flex: 1, padding: 20 }}>
      <Title style={cardStyles.playerName}>{player.name}</Title>
      <Text style={cardStyles.remainingScore}>
        {activeGameStates.remainingScore}
      </Text>
      <View style={cardStyles.matchScoreContainer}>
        <Text>Sets: {matchStats.setsWon} </Text>
        <Text>Legs: {activeSetStats.legsWon}</Text>
      </View>
    </Card>
  );
};

const cardStyles = StyleSheet.create({
  playerName: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  matchScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  remainingScore: {
    backgroundColor: DarkTheme.colors.surface,
    color: DarkTheme.colors.accent,
    marginVertical: 0,
    textAlign: 'center',
    padding: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },
});

interface DartsMatchScreenProps {
  navigation: NavigationProp<any>;
  route: { params: { matchId: string } };
}

const DartsMatchScreen: FunctionComponent<DartsMatchScreenProps> = ({
  navigation,
  route,
}) => {
  const { matchId } = route.params;

  const [dartsMatch, setDartsMatch] = useState(undefined as
    | DartsMatchModel
    | undefined);
  useEffect(() => {
    const { data, complete } = DartsMatchRepo.findById(matchId);

    data.subscribe(match => setDartsMatch(match));
    return complete;
  }, [matchId]);

  if (!dartsMatch) {
    return <View />;
  }

  const activeTurnSummary = DartsMatch.activeTurnSummary(dartsMatch);
  return (
    <GeneralScreenTemplate
      navigation={navigation}
      title="Lets Play Darts"
      backButton={true}>
      <View style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
        {dartsMatch.players.map(player => (
          <View key={player.name} style={{ flex: 1, padding: 2 }}>
            <DartsPlayerScoreCard player={player} dartsMatch={dartsMatch} />
          </View>
        ))}
      </View>
      <View style={style.activeTurnContainer}>
        <Text style={style.activeTurnText}>{activeTurnSummary}</Text>
      </View>
      <DartsScoreKeypad
        onSelect={go => {
          DartsMatchRepo.addGo(dartsMatch, go);
        }}
      />
    </GeneralScreenTemplate>
  );
};

const style = StyleSheet.create({
  activeTurnText: {
    textAlign: 'center',
    fontSize: 20,
  },
  activeTurnContainer: {
    height: 40,
    justifyContent: 'center',
  },
});

export default DartsMatchScreen;
