import Throw, {ThrowValue} from './ThrowValue';
import {BoardPosition, Miss} from '../Throw';
import {ObjectSchema, List} from 'realm';

const maxThrows = 3;

export type Turn = {
  throws: List<ThrowValue>;
};

export const hasMaxThrows = (turn: Turn) => {
  return turn.throws.length === maxThrows;
};

export const addTurn = (turn: Turn, boardPosition: BoardPosition) => {
  if (!hasMaxThrows(turn)) {
    turn.throws.push(Throw.throwFromBoardPosition(boardPosition));
  }
};

export const turnTotal = (turn: Turn) =>
  turn.throws.reduce((total, next) => total + next.value, 0);

export const TurnSchema: ObjectSchema = {
  name: 'Turn',
  properties: {
    throws: 'ThrowValue[]',
  },
};

export const noScore = () => {
  return {
    throws: [
      Throw.throwFromBoardPosition(new Miss()),
      Throw.throwFromBoardPosition(new Miss()),
      Throw.throwFromBoardPosition(new Miss()),
    ] as any,
  };
};
