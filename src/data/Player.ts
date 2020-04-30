import { ObjectSchema } from 'realm';

export const playerSchema: ObjectSchema = {
  name: 'Player',
  primaryKey: 'name',
  properties: {
    name: 'string',
  },
};

export interface Player {
  name: string;
}
