import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { User } from './user.interface';

@Injectable()
export class UserService {
  private logger: Logger = new Logger('RoomService');
  private users: User[] = [
    { id: '59a024e7-fca1-49df-98d2-74b24fd2cbc2', nickname: 'Tchoupinax', imageUrl: '' },
  ]

  get(userId: uuid): User {
    return this.users.find(user => user.id === userId);
  }

  create(nickname: string): User {
    this.logger.log('create');

    const user: User = {
      id: uuid(),
      nickname,
      imageUrl: `/images/avatar/${Math.floor(Math.random() * 5) + 1}.png`
    };

    this.users.push(user);

    return user;
  }
}
