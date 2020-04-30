import DartsGame, { DartsGameModel } from './DartsGame';
import { List, ObjectSchema } from 'realm';
import { Player } from './Player';
import DartsGameSet, { DartsGameSetModel, DartsSetStats } from './Set';
import { BoardPosition } from './Throw';
import { last, compose } from 'ramda';

interface DartsMatchScore {
  player: Player;
  setsWon: number;
  oneEighties: number;
  oneFourties: number;
  tons: number;
  oneDartAvg: number;
  threeDartAvg: number;
  throws: number;
  total: number;
}

export interface DartsMatchModel {
  createdAt: string;
  startingTotal: number;
  setsToWin: number;
  legsToWin: number;
  sets: List<DartsGameSetModel>;
  players: List<Player>;
  startingPlayerIndex: number;
  dartsMatchScores: List<DartsMatchScore> | DartsMatchScore[];
}

// Realm Schemas //

export const DartsMatchSchema: ObjectSchema = {
  name: 'DartsMatch',
  properties: {
    createdAt: 'date',
    startingTotal: 'int',
    setsToWin: 'int',
    legsToWin: 'int',
    sets: 'DartsGameSet[]',
    players: 'Player[]',
    startingPlayerIndex: 'int',
    dartsMatchScores: 'DartsMatchScore[]',
  },
};

export const DartsMatchScoreSchema: ObjectSchema = {
  name: 'DartsMatchScore',
  properties: {
    player: 'Player',
    setsWon: 'int',
    oneEighties: 'int',
    oneFourties: 'int',
    tons: 'int',
    oneDartAvg: 'float',
    threeDartAvg: 'float',
    throws: 'int',
    total: 'int',
  },
};

const addGameToCurrentSet = (dartsMatch: DartsMatchModel): void => {
  const playerCount = dartsMatch.players.length; // 2
  const currentSetIndex = dartsMatch.sets.length - 1;
  const setStartingPlayerIndex =
    (currentSetIndex + dartsMatch.startingPlayerIndex) % playerCount;
  const set = activeSet(dartsMatch);
  const legStartingPlayerIndex =
    (setStartingPlayerIndex + set.legs.length) % playerCount;

  const game = DartsGame.createDartsGame(
    dartsMatch.players,
    legStartingPlayerIndex,
  );
  set.legs.push(game);
};

const activeSet = (dartsMatch: DartsMatchModel): DartsGameSetModel =>
  last(dartsMatch.sets);

const addSet = (dartsMatch: DartsMatchModel): void => {
  dartsMatch.sets.push(DartsGameSet.getSet(dartsMatch.legsToWin));
  addGameToCurrentSet(dartsMatch);
};

const activeGame: (match: DartsMatchModel) => DartsGameModel = compose(
  DartsGameSet.activeLeg,
  activeSet,
);

const activePlayerName: (dartsMatch: DartsMatchModel) => string = compose(
  DartsGame.activePlayerName,
  activeGame,
);

const activePlayerScore: (dartsMatch: DartsMatchModel) => number = compose(
  DartsGame.activePlayerScore,
  activeGame,
);

const activePlayerOutstandingScore = compose(
  DartsGame.outstandingScore,
  activeGame,
);

const createDartsMatch = (
  players: Player[],
  setsToWin: number,
  legsToWin: number,
): DartsMatchModel => {
  const dartsMatch: DartsMatchModel = {
    startingTotal: 501,
    setsToWin,
    legsToWin,
    sets: [] as any,
    startingPlayerIndex: 0,
    players: players as any,
    createdAt: new Date().toISOString(),
    dartsMatchScores: [] as any,
  };

  addSet(dartsMatch);
  setDartsMatchScores(dartsMatch);

  return dartsMatch;
};

const isSetsEmpty = (dartsMatch: DartsMatchModel) =>
  dartsMatch.sets.length === 0;

const setDartsMatchScores = (dartsMatch: DartsMatchModel) => {
  dartsMatch.sets.forEach(set =>
    DartsGameSet.addSetStats(set, dartsMatch.legsToWin, dartsMatch.players),
  );

  const matchStatistics = dartsMatch.players.map(player => {
    const matchStats = dartsMatch.sets.reduce<DartsMatchScore>(
      (stats, set) => {
        const setStats = set.setStats.find(
          st => st.player.name === player.name,
        );
        sumStats(stats, setStats);
        return stats;
      },
      {
        player,
        setsWon: 0,
        oneEighties: 0,
        oneFourties: 0,
        tons: 0,
        oneDartAvg: 0,
        threeDartAvg: 0,
        throws: 0,
        total: 0,
      },
    );
    if (matchStats.throws > 0) {
      matchStats.oneDartAvg = matchStats.total / matchStats.throws;
    } else {
      matchStats.oneDartAvg = 0;
    }

    matchStats.threeDartAvg = matchStats.oneDartAvg * 3;

    return matchStats;
  });

  dartsMatch.dartsMatchScores = matchStatistics;
};

const sumStats = (match: DartsMatchScore, set: DartsSetStats): void => {
  ['total', 'throws', 'oneEighties', 'oneFourties', 'tons'].forEach(
    key => (match[key] = match[key] + set[key]),
  );

  if (set.hasPlayerWon) {
    match.setsWon += 1;
  }
};

const isMatchComplete = (dartsMatch: DartsMatchModel) =>
  dartsMatch.dartsMatchScores.some(
    score => score.setsWon === dartsMatch.setsToWin,
  );

export default {
  createDartsMatch,
  nextGo(dartsMatch: DartsMatchModel, go: BoardPosition) {
    if (isSetsEmpty(dartsMatch)) {
      addSet(dartsMatch);
    } else if (isMatchComplete(dartsMatch)) {
      return;
    }

    const game = activeGame(dartsMatch);
    DartsGame.nextThrow(game, go);

    setDartsMatchScores(dartsMatch);

    const activeSet = last(dartsMatch.sets);

    if (isMatchComplete(dartsMatch)) {
      return;
    } else if (DartsGameSet.isSetComplete(activeSet)) {
      addSet(dartsMatch);
    } else if (game.gameCompleted) {
      addGameToCurrentSet(dartsMatch);
    }
  },
  activeSetStats: (dartsMatch: DartsMatchModel) => activeSet(dartsMatch),
  activePlayerName,
  activePlayerScore,
  winnerName: (dartsMatch: DartsMatchModel) => {
    const winningStats = dartsMatch.dartsMatchScores.find(
      match => match.setsWon === dartsMatch.setsToWin,
    );

    if (winningStats) {
      return winningStats.player.name;
    }

    return '';
  },
  activePlayerOutstandingScore,
  activeSetNo: (dartsMatch: DartsMatchModel) => dartsMatch.sets.length,
  activeSetLegNo: (dartsMatch: DartsMatchModel) =>
    activeSet(dartsMatch).legs.length,
};
