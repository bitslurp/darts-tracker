import Realm, { UpdateMode } from 'realm';
import { playerSchema } from './Player';
import { ThrowValueSchema } from './darts-game-models/ThrowValue';
import { DartsScoreCardSchema } from './darts-game-models/DartsScoreCard';
import { DartsGameSchema } from './DartsGame';
import { TurnSchema } from './darts-game-models/Turn';
import DartsMatch, {
  DartsMatchSchema,
  DartsMatchScoreSchema,
  DartsMatchModel,
} from './DartsMatch';
import { DartsGameSetSchema, DartsSetStatSchema } from './Set';
import { playerA, playerB } from './__fixtures__/Player';
import { BullseyeTarget } from './Throw';

describe('DartsMatch Model - Integration', () => {
  let realm: Realm;

  beforeEach(() => {
    realm = new Realm({
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
      inMemory: true,
    });
  });

  afterEach(done => {
    realm.write(() => {
      realm.deleteAll();
      done();
    });
  });

  it('should create game', done => {
    realm.write(() => {
      realm.create(
        'DartsMatch',
        DartsMatch.createDartsMatch([playerA, playerB], 2, 2),
        Realm.UpdateMode.All,
      );

      const matches = realm.objects<DartsMatchModel>('DartsMatch');

      expect(matches.length).toBe(1);
      const match = matches[0];
      expect(match.dartsMatchScores.length).toBe(2);
      done();
    });
  });

  it('should persist updates', done => {
    realm.write(() => {
      realm.create(
        'DartsMatch',
        DartsMatch.createDartsMatch([playerA, playerB], 2, 2),
        Realm.UpdateMode.All,
      );

      const matches = realm.objects<DartsMatchModel>('DartsMatch');

      DartsMatch.nextGo(matches[0], BullseyeTarget.inner());
      DartsMatch.nextGo(matches[0], BullseyeTarget.inner());
      DartsMatch.nextGo(matches[0], BullseyeTarget.inner());
      const matches2 = realm.objects<DartsMatchModel>('DartsMatch');
      const match = matches2[0];
      expect(DartsMatch.activePlayerName(match)).toBe('Player B');
      expect(DartsMatch.activeSetStats(match).setStats[0].oneFourties).toBe(1);
      done();
    });
  });
});
