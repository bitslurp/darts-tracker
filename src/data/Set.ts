import { ObjectSchema, List } from 'realm';
import DartsGame, { DartsGameModel, DartsGamePlayerStats } from './DartsGame';
import { last } from 'ramda';
import { Player } from './Player';

export interface DartsSetStats {
  player: Player;
  legsWon: number;
  oneEighties: number;
  oneFourties: number;
  tons: number;
  oneDartAvg: number;
  threeDartAvg: number;
  throws: number;
  total: number;
  hasPlayerWon: boolean;
}

export type DartsGameSetModel = {
  legs: List<DartsGameModel>;
  setStats: List<DartsSetStats> | DartsSetStats[];
};

export const DartsGameSetSchema: ObjectSchema = {
  name: 'DartsGameSet',
  properties: {
    legs: 'DartsGame[]',
    setStats: 'DartSetStats[]',
  },
};

export const DartsSetStatSchema: ObjectSchema = {
  name: 'DartSetStats',
  properties: {
    player: 'Player',
    legsWon: 'int',
    oneEighties: 'int',
    oneFourties: 'int',
    tons: 'int',
    oneDartAvg: 'float',
    threeDartAvg: 'float',
    throws: 'int',
    total: 'int',
    hasPlayerWon: 'bool',
  },
};

const sumGameState = (
  current: DartsSetStats,
  next: DartsGamePlayerStats,
): void => {
  ['total', 'throws', 'oneEighties', 'oneFourties', 'tons'].forEach(
    key => (current[key] = current[key] + next[key]),
  );

  if (next.hasPlayerWon) {
    current.legsWon += 1;
  }
};

export default {
  getSet(firstToLegs: number = 3): DartsGameSetModel {
    return {
      legs: [] as any,
      setStats: [] as any,
    };
  },

  activeLeg(set: DartsGameSetModel) {
    return last(set.legs);
  },

  addSetStats(
    set: DartsGameSetModel,
    legsToWin: number,
    players: Player[] | List<Player>,
  ) {
    set.setStats = (players as Player[]).map(player => {
      return set.legs.reduce<DartsSetStats>(
        (acc, game) => {
          const stats = DartsGame.getStats(game, player);
          sumGameState(acc, stats);

          return acc;
        },
        {
          total: 0,
          throws: 0,
          oneEighties: 0,
          oneFourties: 0,
          tons: 0,
          oneDartAvg: 0,
          threeDartAvg: 0,
          legsWon: 0,
          hasPlayerWon: false,
          player,
        },
      );
    });

    set.setStats.forEach(stat => {
      if (stat.legsWon === legsToWin) {
        stat.hasPlayerWon = true;
      }

      stat.oneDartAvg = stat.throws > 0 ? stat.throws / stat.throws : 0;
      stat.threeDartAvg = stat.oneDartAvg * 3;
    });
  },

  isSetComplete(set: DartsGameSetModel) {
    return set.setStats.some(stat => stat.hasPlayerWon);
  },
};
