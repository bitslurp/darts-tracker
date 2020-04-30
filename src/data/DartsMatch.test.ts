import { playerB, playerA } from './__fixtures__/Player';
import DartsMatch, { DartsMatchModel } from './DartsMatch';
import {
  BoardNumber,
  NumberTarget,
  BoardNumberMultiplier,
  Miss,
} from './Throw';
import { range } from 'ramda';

const treble20 = NumberTarget.of(
  BoardNumber.Twenty,
  BoardNumberMultiplier.Treble,
);

describe('DartsMatch', () => {
  let dartsMatch: DartsMatchModel;
  describe('One Player Game', () => {
    beforeEach(() => {
      dartsMatch = DartsMatch.createDartsMatch([playerA], 2, 3);
    });

    it('should get active player name', () => {
      expect(DartsMatch.activePlayerName(dartsMatch)).toBe('Player A');
    });

    describe('nextGo', () => {
      it('should add next go', () => {
        DartsMatch.nextGo(
          dartsMatch,
          NumberTarget.of(BoardNumber.Twenty, BoardNumberMultiplier.Treble),
        );

        expect(DartsMatch.activePlayerOutstandingScore(dartsMatch)).toBe(441);
      });

      it('should move to next leg', () => {
        takeOutLeg(dartsMatch);
        expect(DartsMatch.activeSetLegNo(dartsMatch)).toBe(2);
      });

      it('should move to 3rd leg', () => {
        takeOutLeg(dartsMatch);
        takeOutLeg(dartsMatch);
        const stats = dartsMatch.dartsMatchScores[0];
        expect(stats.oneEighties).toBe(4); // (LOL)
        expect(stats.oneFourties).toBe(2);
        expect(DartsMatch.activeSetLegNo(dartsMatch)).toBe(3);
      });

      it('should move to 1st leg 2nd set', () => {
        takeOutLegTimes(dartsMatch, 3);
        expect(DartsMatch.activeSetLegNo(dartsMatch)).toBe(1);
        expect(DartsMatch.activeSetNo(dartsMatch)).toBe(2);
        expect(DartsMatch.winnerName(dartsMatch)).toBe('');
      });

      it('should complete the game', () => {
        takeOutLegTimes(dartsMatch, 6);

        expect(DartsMatch.activeSetLegNo(dartsMatch)).toBe(3);
        expect(DartsMatch.activeSetNo(dartsMatch)).toBe(2);
        expect(DartsMatch.winnerName(dartsMatch)).toBe('Player A');
      });
    });
  });

  describe('Twp Player Game', () => {
    beforeEach(() => {
      dartsMatch = DartsMatch.createDartsMatch([playerA, playerB], 2, 2);
    });

    it('should move to next leg and active player should be player B', () => {
      takeOutLeg2PlayerTurnOne(dartsMatch);
      expect(DartsMatch.activeSetLegNo(dartsMatch)).toBe(2);
      expect(DartsMatch.activePlayerName(dartsMatch)).toBe('Player B');
    });

    it('should move to next set and active player should be player B', () => {
      takeOutLeg2PlayerTurnOne(dartsMatch);
      takeOutLeg2PlayerTurnTwo(dartsMatch);
      expect(DartsMatch.activeSetLegNo(dartsMatch)).toBe(1);
      expect(DartsMatch.activeSetNo(dartsMatch)).toBe(2);
      expect(DartsMatch.activePlayerName(dartsMatch)).toBe('Player B');
    });
  });
});

const oneEighty = (dartsMatch: DartsMatchModel) => {
  DartsMatch.nextGo(dartsMatch, treble20);
  DartsMatch.nextGo(dartsMatch, treble20);
  DartsMatch.nextGo(dartsMatch, treble20);
};

const takeOutLeg2PlayerTurnOne = (dartsMatch: DartsMatchModel) => {
  oneEighty(dartsMatch);
  oneEighty(dartsMatch);
  oneEighty(dartsMatch);
  oneEighty(dartsMatch);
  DartsMatch.nextGo(dartsMatch, treble20);
  DartsMatch.nextGo(
    dartsMatch,
    NumberTarget.of(BoardNumber.Nineteen, BoardNumberMultiplier.Treble),
  );

  DartsMatch.nextGo(
    dartsMatch,
    NumberTarget.of(BoardNumber.Twelve, BoardNumberMultiplier.Double),
  );
};

const takeOutLeg2PlayerTurnTwo = (dartsMatch: DartsMatchModel) => {
  oneEighty(dartsMatch);
  oneEighty(dartsMatch);
  oneEighty(dartsMatch);
  oneEighty(dartsMatch);
  DartsMatch.nextGo(dartsMatch, treble20);
  DartsMatch.nextGo(
    dartsMatch,
    NumberTarget.of(BoardNumber.Nineteen, BoardNumberMultiplier.Treble),
  );

  DartsMatch.nextGo(dartsMatch, new Miss());
  DartsMatch.nextGo(dartsMatch, treble20);
  DartsMatch.nextGo(
    dartsMatch,
    NumberTarget.of(BoardNumber.Nineteen, BoardNumberMultiplier.Treble),
  );

  DartsMatch.nextGo(
    dartsMatch,
    NumberTarget.of(BoardNumber.Twelve, BoardNumberMultiplier.Double),
  );
};

const takeOutLeg = (dartsMatch: DartsMatchModel) => {
  oneEighty(dartsMatch);
  oneEighty(dartsMatch);
  DartsMatch.nextGo(dartsMatch, treble20);
  DartsMatch.nextGo(
    dartsMatch,
    NumberTarget.of(BoardNumber.Nineteen, BoardNumberMultiplier.Treble),
  );

  DartsMatch.nextGo(
    dartsMatch,
    NumberTarget.of(BoardNumber.Twelve, BoardNumberMultiplier.Double),
  );
};

const takeOutLegTimes = (dartsMatch: DartsMatchModel, times: number) => {
  range(0, times).forEach(() => takeOutLeg(dartsMatch));
};
