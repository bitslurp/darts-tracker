import Realm from 'realm';
import { playerSchema } from './Player';
import { DartsGameSchema } from './DartsGame';
import { DartsScoreCardSchema } from './darts-game-models/DartsScoreCard';
import { ThrowValueSchema } from './darts-game-models/ThrowValue';
import { TurnSchema } from './darts-game-models/Turn';
import { DartsMatchSchema, DartsMatchScoreSchema } from './DartsMatch';
import { DartsGameSetSchema, DartsSetStatSchema } from './Set';

export const realm = new Realm({
  schema: [
    playerSchema,
    ThrowValueSchema,
    DartsScoreCardSchema,
    DartsGameSchema,
    TurnSchema,
    DartsMatchSchema,
    DartsGameSetSchema,
    DartsSetStatSchema,
    DartsMatchScoreSchema,
  ],
  deleteRealmIfMigrationNeeded: true,
});
