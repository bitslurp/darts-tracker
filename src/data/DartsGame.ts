import { ObjectSchema, List, ObjectClass } from 'realm';
import { Player } from './Player';
import { BoardPosition } from './Throw';
import {
  noScore,
  addTurn,
  hasMaxThrows,
  Turn,
  turnTotal,
} from './darts-game-models/Turn';
import { DartsScoreCard } from './darts-game-models/DartsScoreCard';

export const DartsGameSchema: ObjectSchema = {
  name: 'DartsGame',
  properties: {
    startingTotal: 'int',
    scoreCards: 'DartsScoreCard[]',
    gameCompleted: 'bool',
    activeScoreCardIndex: 'int',
    currentTurn: 'Turn',
  },
};

export type DartsGameModel = {
  startingTotal: number;
  // As any for List initialisation in Realm
  scoreCards: List<DartsScoreCard>;
  gameCompleted;
  activeScoreCardIndex: number;
  currentTurn: Turn;
};

export interface DartsGamePlayerStats {
  total: number;
  throws: number;
  oneEighties: number;
  oneFourties: number;
  tons: number;
  oneDartAvg: number;
  threeDartAvg: number;
  remainingScore: number;
  playerName: string;
  hasPlayerWon: boolean;
}

const activeScoreCard = (dartsGame: DartsGameModel): DartsScoreCard =>
  dartsGame.scoreCards[dartsGame.activeScoreCardIndex];

const scoreIsBust = (
  nextScore: number,
  positionHit: BoardPosition,
): boolean => {
  if (nextScore == 1 || nextScore < 0) return true;

  if (nextScore === 0) {
    return !scoreIsReduced(nextScore, positionHit);
  }

  return false;
};

const scoreIsReduced = (
  nextScore: number,
  positionHit: BoardPosition,
): boolean => {
  if (nextScore !== 0) return false;

  switch (positionHit.kind) {
    case 'bullseye':
      return positionHit.inner;

    case 'number':
      return positionHit.double;

    default:
      return false;
  }
};

const outstandingScore = (dartsGame: DartsGameModel): number => {
  return (
    activeScoreCard(dartsGame).remainingScore - turnTotal(dartsGame.currentTurn)
  );
};

const nextTurn = (dartsGame: DartsGameModel): void => {
  dartsGame.currentTurn = { throws: [] } as any;
  const indexPlus1 = dartsGame.activeScoreCardIndex + 1;
  const nextIndex = dartsGame.scoreCards.length === indexPlus1 ? 0 : indexPlus1;
  dartsGame.activeScoreCardIndex = nextIndex;
};

export default {
  createDartsGame(
    players: Player[] | List<Player>,
    startPlayerIndex: number = 0,
  ): DartsGameModel {
    const startingTotal = 501;
    const scoreCards = [];
    players.forEach(player =>
      scoreCards.push({
        player,
        remainingScore: startingTotal,
        turns: [] as any,
      }),
    );
    return {
      startingTotal: 501,
      scoreCards: scoreCards as any,
      gameCompleted: false,
      activeScoreCardIndex: startPlayerIndex,
      currentTurn: { throws: [] as any },
    };
  },

  nextThrow(dartsGame: DartsGameModel, positionHit: BoardPosition): void {
    addTurn(dartsGame.currentTurn, positionHit);

    const nextScore = outstandingScore(dartsGame);

    const currentScoreCard = activeScoreCard(dartsGame);

    if (scoreIsReduced(nextScore, positionHit)) {
      dartsGame.gameCompleted = true;

      currentScoreCard.turns.push(dartsGame.currentTurn);
      currentScoreCard.remainingScore =
        currentScoreCard.remainingScore - turnTotal(dartsGame.currentTurn);
    } else if (scoreIsBust(nextScore, positionHit)) {
      currentScoreCard.turns.push(noScore());
      nextTurn(dartsGame);
    } else if (hasMaxThrows(dartsGame.currentTurn)) {
      currentScoreCard.turns.push(dartsGame.currentTurn);
      currentScoreCard.remainingScore =
        currentScoreCard.remainingScore - turnTotal(dartsGame.currentTurn);
      nextTurn(dartsGame);
    }
  },

  getStats(dartsGame: DartsGameModel, player: Player): DartsGamePlayerStats {
    const scoreCard = dartsGame.scoreCards.find(
      card => card.player.name === player.name,
    );

    const stats = scoreCard.turns.reduce(
      (stat, turn) => {
        const throws = stat.throws + turn.throws.length;
        const tTotal = turnTotal(turn);
        const total = stat.total + tTotal;
        let { oneEighties, oneFourties, tons } = stat;

        if (tTotal === 180) {
          oneEighties++;
        } else if (tTotal >= 140) {
          oneFourties++;
        } else if (tTotal >= 0) {
          tons++;
        }

        return {
          throws,
          total,
          oneEighties,
          oneFourties,
          tons,
        };
      },
      { throws: 0, total: 0, oneEighties: 0, oneFourties: 0, tons: 0 },
    );

    const oneDartAvg = stats.total / stats.throws;

    return {
      ...stats,
      remainingScore: scoreCard.remainingScore,
      oneDartAvg,
      playerName: scoreCard.player.name,
      threeDartAvg: oneDartAvg * 3,
      hasPlayerWon: scoreCard.remainingScore === 0,
    };
  },

  playerNames(dartsGame: DartsGameModel): string[] {
    return dartsGame.scoreCards.map(card => card.player.name);
  },

  round(dartsGame: DartsGameModel) {
    return dartsGame.scoreCards.reduce(
      (round, scoreCard) => Math.min(round, scoreCard.turns.length + 1),
      dartsGame.scoreCards[0].turns.length + 1,
    );
  },

  outstandingScore,

  activePlayerName(dartsGame: DartsGameModel): string {
    return activeScoreCard(dartsGame).player.name;
  },

  activePlayerScore(dartsGame: DartsGameModel): number {
    return activeScoreCard(dartsGame).remainingScore;
  },
};
