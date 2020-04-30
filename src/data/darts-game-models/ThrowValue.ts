import {BoardPosition} from '../Throw';
import {ObjectSchema} from 'realm';

export type ThrowValue = {
  name: string;
  value: number;
};

export const ThrowValueSchema: ObjectSchema = {
  name: 'ThrowValue',
  properties: {
    name: 'string',
    value: 'int',
  },
};

const throwFromBoardPosition = (boardPosition: BoardPosition): ThrowValue => {
  const t: ThrowValue = {
    name: boardPosition.toValueString(),
    value: boardPosition.value,
  };

  return t;
};

export default {
  throwFromBoardPosition,
};
