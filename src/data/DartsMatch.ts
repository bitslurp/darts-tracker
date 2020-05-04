import DartsGame, { DartsGameModel } from './DartsGame';
import { List, ObjectSchema } from 'realm';
import { v4 as uuidv4 } from 'uuid';
import { Player } from './Player';
import DartsGameSet, { DartsGameSetModel, DartsSetStats } from './Set';
import { BoardPosition } from './Throw';
import { last, compose } from 'ramda';

export interface DartsMatchPlayerStats {
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
  id: string;
  createdAt: string;
  startingTotal: number;
  setsToWin: number;
  legsToWin: number;
  sets: List<DartsGameSetModel>;
  players: List<Player>;
  startingPlayerIndex: number;
  dartsMatchScores: List<DartsMatchPlayerStats> | DartsMatchPlayerStats[];
}

// Realm Schemas //

export const DartsMatchSchema: ObjectSchema = {
  name: 'DartsMatch',
  primaryKey: 'id',
  properties: {
    id: 'string',
    createdAt: 'date',
    startingTotal: 'int',
    setsToWin: 'int',
    legsToWin: 'int',
    sets: 'DartsGameSet[]',
    players: 'Player[]',
    startingPlayerIndex: 'int',
    dartsMatchScores: 'DartsMatchPlayerStats[]',
  },
};

export const DartsMatchPlayerStatsSchema: ObjectSchema = {
  name: 'DartsMatchPlayerStats',
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
  dartsMatch.sets.push(DartsGameSet.getSet());
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

const activeGameStatsByPlayer = (dartsMatch: DartsMatchModel, player: Player) =>
  DartsGame.getStats(activeGame(dartsMatch), player);

/**
 * @returns the remaining total - taking into account the current go
 */
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
    id: uuidv4(),
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
    const matchStats = dartsMatch.sets.reduce<DartsMatchPlayerStats>(
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

const sumStats = (match: DartsMatchPlayerStats, set: DartsSetStats): void => {
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
  activeSetStats: (dartsMatch: DartsMatchModel, player: Player) =>
    activeSet(dartsMatch).setStats.find(
      stat => stat.player.name === player.name,
    ),

  activePlayerName,
  activePlayerScore,
  activeGameStatsByPlayer,
  matchStatsByPlayer: (dartsMatch: DartsMatchModel, player: Player) =>
    dartsMatch.dartsMatchScores.find(
      stats => stats.player.name === player.name,
    ),
  winnerName: (dartsMatch: DartsMatchModel) => {
    const winningStats = dartsMatch.dartsMatchScores.find(
      match => match.setsWon === dartsMatch.setsToWin,
    );

    if (winningStats) {
      return winningStats.player.name;
    }

    return '';
  },
  players: (dartsMatch: DartsMatchModel) => dartsMatch.players,
  playerNames: (dartsMatch: DartsMatchModel) =>
    dartsMatch.players.map(player => player.name),

  activePlayerOutstandingScore,

  /**
   * @returns The active set number
   */
  activeSetNo: (dartsMatch: DartsMatchModel): number => dartsMatch.sets.length,

  /**
   *
   * @param dartsMatch A DartsMatchModel object
   * @returns A string description of set/leg format for the provided DartsMatchModel argument
   */
  matchDescription(dartsMatch: DartsMatchModel): string {
    const goalPost =
      dartsMatch.setsToWin === 1
        ? `${dartsMatch.legsToWin} legs`
        : `${dartsMatch.setsToWin} sets`;

    return `${dartsMatch.startingTotal} - First to ${goalPost}`;
  },

  /**
   * @returns Number of legs in active set
   */
  activeSetLegNo: (dartsMatch: DartsMatchModel): number =>
    activeSet(dartsMatch).legs.length,

  /**
   * Lists the turns of the active players current go
   * @returns A string representation of the current turn for example: T20, S5
   */
  activeTurnSummary: compose(
    DartsGame.activeTurnSummary,
    activeGame,
  ),
};
