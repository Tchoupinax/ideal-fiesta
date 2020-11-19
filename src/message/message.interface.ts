import { v4 as uuid } from 'uuid';

export interface Message {
  id: uuid;
  authorId: uuid;
  content: string;
}
