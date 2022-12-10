import {Entity, Schema} from 'redis-om';
export class User extends Entity {}

export const UserSchema = new Schema(User, {
  address: {type: 'string'},
  name: {type: 'string'},
  secret: {type: 'string'},
  availableSpace: {type: 'number'},
  usedSpace: {type: 'number'},
});

export interface UserInterface {
  address: string;
  name: string;
  secret: string;
  availableSpace: number;
  usedSpace: number;
}
