import { v4 as uuid } from 'uuid';
import { User } from '../user/user.interface';
import { Message } from '../message/message.interface';
export interface Room {
  id: uuid;
  name: string;
  members: User[];
  messages: Message[];
}
