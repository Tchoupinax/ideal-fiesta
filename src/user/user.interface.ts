import { v4 as uuid } from 'uuid';

export interface User {
  id: uuid;
  nickname: string;
  imageUrl: string;
}