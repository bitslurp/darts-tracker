import DartsGame, { DartsGameModel, DartsGameSchema } from './DartsGame';
import { playerB, playerA } from './__fixtures__/Player';
import {
  NumberTarget,
  BoardNumber,
  BoardNumberMultiplier,
  BullseyeTarget,
  Miss,
} from './Throw';
import { playerSchema, Player } from './Player';
import { ThrowValueSchema } from './darts-game-models/ThrowValue';
import { DartsScoreCardSchema } from './darts-game-models/DartsScoreCard';
import { TurnSchema } from './darts-game-models/Turn';
import Realm from 'realm';

describe('DartsGame Model', () => {
  let realm: Realm;

  beforeEach(() => {
    realm = new Realm({
      schema: [
        playerSchema,
        ThrowValueSchema,
        DartsScoreCardSchema,
        DartsGameSchema,
        TurnSchema,
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
  const write = (fn: () => void) => (done: jest.DoneCallback) => {
    realm.write(() => {
      fn();
      done();
    });
  };

  describe('Multi player', () => {
    it(
      'should not be complete',
      write(() => {
        const dartsGame = createGame();
        expect(dartsGame.gameCompleted).toBeFalsy();
      }),
    );

    it(
      'should have correct player names',
      write(() => {
        const dartsGame = createGame();
        expect(DartsGame.playerNames(dartsGame)).toEqual([
          'Player A',
          'Player B',
        ]);
      }),
    );

    it(
      'should switch players',
      write(() => {
        const dartsGame = createGame();
        addGo(dartsGame);
        expect(dartsGame.activeScoreCardIndex).toBe(1);
        expect(DartsGame.activePlayerName(dartsGame)).toBe('Player B');
        expect(DartsGame.activePlayerScore(dartsGame)).toBe(501);
        expect(DartsGame.getStats(dartsGame, playerA).tons).toBe(1);
      }),
    );

    it(
      'should report active player as player A & score 381',
      write(() => {
        const dartsGame = createGame();
        addGo(dartsGame);
        addGo(dartsGame);
        expect(DartsGame.activePlayerName(dartsGame)).toBe('Player A');
        expect(DartsGame.activePlayerScore(dartsGame)).toBe(381);
      }),
    );
    const createGame = (): DartsGameModel => {
      const players = realm.objects<Player>('Player').map(a => a);
      const game = DartsGame.createDartsGame(
        players.length ? players : [playerA, playerB],
      );
      const dartsGame = realm.create<DartsGameModel>(
        'DartsGame',
        game,
        Realm.UpdateMode.All,
      );

      return dartsGame;
    };
  });

  describe('Single player', () => {
    beforeEach(done => {
      realm.write(() => {
        realm.deleteAll();
        done();
      });
    });
    it(
      'should not be complete',
      write(() => {
        const dartsGame = createGame();
        expect(dartsGame.gameCompleted).toBeFalsy();
      }),
    );

    it(
      'should have correct player names',
      write(() => {
        const dartsGame = createGame();
        expect(DartsGame.playerNames(dartsGame)).toEqual(['Player A']);
      }),
    );

    it(
      'should report active player as player A & score 381',
      write(() => {
        const dartsGame = createGame();
        addGo(dartsGame);
        expect(DartsGame.activePlayerName(dartsGame)).toBe('Player A');
        expect(DartsGame.activePlayerScore(dartsGame)).toBe(381);
      }),
    );

    it(
      'should play out game as expected',
      write(() => {
        const dartsGame = createGame();
        addGo(dartsGame);
        expect(DartsGame.activePlayerName(dartsGame)).toBe('Player A');
        expect(DartsGame.activePlayerScore(dartsGame)).toBe(381);
        DartsGame.nextThrow(
          dartsGame,
          NumberTarget.of(BoardNumber.Five, BoardNumberMultiplier.Treble),
        );
        DartsGame.nextThrow(
          dartsGame,
          NumberTarget.of(BoardNumber.Nineteen, BoardNumberMultiplier.Treble),
        );
        DartsGame.nextThrow(
          dartsGame,
          NumberTarget.of(BoardNumber.Seven, BoardNumberMultiplier.Treble),
        );
        // 15 + 57 + 21 = 93
        // 501 - 120 - 93 = 288

        expect(DartsGame.activePlayerName(dartsGame)).toBe('Player A');
        expect(DartsGame.activePlayerScore(dartsGame)).toBe(288);

        DartsGame.nextThrow(dartsGame, BullseyeTarget.outter());
        DartsGame.nextThrow(dartsGame, new Miss());
        DartsGame.nextThrow(dartsGame, BullseyeTarget.inner());
        // 288 - 75 = 213
        expect(DartsGame.activePlayerScore(dartsGame)).toBe(213);

        addOneEighty(dartsGame);
        // 213 - 180  = 33
        expect(DartsGame.activePlayerScore(dartsGame)).toBe(33);
        expect(DartsGame.round(dartsGame)).toBe(5);
        // BUST
        DartsGame.nextThrow(
          dartsGame,
          NumberTarget.of(BoardNumber.One, BoardNumberMultiplier.Treble),
        );
        DartsGame.nextThrow(
          dartsGame,
          NumberTarget.of(BoardNumber.Twenty, BoardNumberMultiplier.Treble),
        );
        expect(DartsGame.round(dartsGame)).toBe(6);
        expect(DartsGame.activePlayerScore(dartsGame)).toBe(33);

        DartsGame.nextThrow(
          dartsGame,
          NumberTarget.of(BoardNumber.One, BoardNumberMultiplier.Single),
        );
        DartsGame.nextThrow(
          dartsGame,
          NumberTarget.of(BoardNumber.Sixteen, BoardNumberMultiplier.Single),
        );
        DartsGame.nextThrow(dartsGame, new Miss());
        expect(DartsGame.round(dartsGame)).toBe(7);
        expect(DartsGame.activePlayerScore(dartsGame)).toBe(16);
        expect(dartsGame.gameCompleted).toBe(false);

        // DartsGame.nextThrow(dartsGame,new Miss());
        DartsGame.nextThrow(
          dartsGame,
          NumberTarget.of(BoardNumber.Eight, BoardNumberMultiplier.Double),
        );
        expect(DartsGame.round(dartsGame)).toBe(8);
        expect(DartsGame.activePlayerScore(dartsGame)).toBe(0);
        expect(dartsGame.gameCompleted).toBe(true);
      }),
    );

    it(
      'should play out a nine darter',
      write(() => {
        const dartsGame = createGame();
        addOneEighty(dartsGame);
        // 501 - 180 = 321
        expect(DartsGame.activePlayerScore(dartsGame)).toBe(321);
        addOneEighty(dartsGame);
        // 501 - 180 = 141
        expect(DartsGame.activePlayerScore(dartsGame)).toBe(141);
        DartsGame.nextThrow(
          dartsGame,
          NumberTarget.of(BoardNumber.Twenty, BoardNumberMultiplier.Treble),
        );
        DartsGame.nextThrow(
          dartsGame,
          NumberTarget.of(BoardNumber.Nineteen, BoardNumberMultiplier.Treble),
        );

        DartsGame.nextThrow(
          dartsGame,
          NumberTarget.of(BoardNumber.Twelve, BoardNumberMultiplier.Double),
        );

        expect(DartsGame.activePlayerScore(dartsGame)).toBe(0);
        expect(dartsGame.gameCompleted).toBe(true);
      }),
    );

    it(
      'should play out a nine darter with bull finish',
      write(() => {
        const dartsGame = createGame();
        addOneEighty(dartsGame);
        // 501 - 180 = 321
        expect(DartsGame.activePlayerScore(dartsGame)).toBe(321);
        DartsGame.nextThrow(
          dartsGame,
          NumberTarget.of(BoardNumber.Twenty, BoardNumberMultiplier.Treble),
        );
        DartsGame.nextThrow(
          dartsGame,
          NumberTarget.of(BoardNumber.Seventeen, BoardNumberMultiplier.Treble),
        );

        DartsGame.nextThrow(
          dartsGame,
          NumberTarget.of(BoardNumber.Twenty, BoardNumberMultiplier.Double),
        );

        expect(DartsGame.activePlayerScore(dartsGame)).toBe(170);
        DartsGame.nextThrow(
          dartsGame,
          NumberTarget.of(BoardNumber.Twenty, BoardNumberMultiplier.Treble),
        );
        DartsGame.nextThrow(
          dartsGame,
          NumberTarget.of(BoardNumber.Twenty, BoardNumberMultiplier.Treble),
        );

        DartsGame.nextThrow(dartsGame, BullseyeTarget.inner());

        expect(DartsGame.activePlayerScore(dartsGame)).toBe(0);
        expect(dartsGame.gameCompleted).toBe(true);
      }),
    );
  });

  const createGame = (): DartsGameModel => {
    const players = realm.objects<Player>('Player').map(a => a);
    const game = DartsGame.createDartsGame(
      players.length ? players : [playerA],
    );
    const dartsGame = realm.create<DartsGameModel>('DartsGame', game);

    return dartsGame;
  };
});

const addGo = (dartsGame: DartsGameModel) => {
  DartsGame.nextThrow(
    dartsGame,
    NumberTarget.of(BoardNumber.Twenty, BoardNumberMultiplier.Single),
  );
  DartsGame.nextThrow(
    dartsGame,
    NumberTarget.of(BoardNumber.Twenty, BoardNumberMultiplier.Treble),
  );
  DartsGame.nextThrow(
    dartsGame,
    NumberTarget.of(BoardNumber.Twenty, BoardNumberMultiplier.Double),
  );
};

const addOneEighty = (dartsGame: DartsGameModel) => {
  DartsGame.nextThrow(
    dartsGame,
    NumberTarget.of(BoardNumber.Twenty, BoardNumberMultiplier.Treble),
  );
  DartsGame.nextThrow(
    dartsGame,
    NumberTarget.of(BoardNumber.Twenty, BoardNumberMultiplier.Treble),
  );
  DartsGame.nextThrow(
    dartsGame,
    NumberTarget.of(BoardNumber.Twenty, BoardNumberMultiplier.Treble),
  );
};
