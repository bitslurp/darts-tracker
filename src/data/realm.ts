import Realm from 'realm';
import { playerSchema } from './Player';
import { DartsGameSchema } from './DartsGame';
import { DartsScoreCardSchema } from './darts-game-models/DartsScoreCard';
import { ThrowValueSchema } from './darts-game-models/ThrowValue';
import { TurnSchema } from './darts-game-models/Turn';
import { DartsMatchSchema, DartsMatchPlayerStatsSchema } from './DartsMatch';
import { DartsGameSetSchema, DartsSetStatSchema } from './Set';

export const RealmSchema = [
  playerSchema,
  ThrowValueSchema,
  DartsScoreCardSchema,
  DartsGameSchema,
  TurnSchema,
  DartsMatchSchema,
  DartsGameSetSchema,
  DartsSetStatSchema,
  DartsMatchPlayerStatsSchema,
];

export const realm = new Realm({
  schema: RealmSchema,
  deleteRealmIfMigrationNeeded: true,
});

export const getRealmAsync = () =>
  Realm.open({
    schema: RealmSchema,
    deleteRealmIfMigrationNeeded: true,
  });
