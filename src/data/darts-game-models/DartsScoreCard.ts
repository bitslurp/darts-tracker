import {Player} from '../Player';
import {Turn} from './Turn';
import {ObjectSchema, List} from 'realm';

export type DartsScoreCard = {
  player: Player;
  remainingScore: number;
  turns: List<Turn>;
};

export const DartsScoreCardSchema: ObjectSchema = {
  name: 'DartsScoreCard',
  properties: {
    player: 'Player',
    remainingScore: 'int',
    turns: 'Turn[]',
  },
};
