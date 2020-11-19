import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { UserService } from '../user/user.service';
import { Room } from './room.interface';
import { Message } from '../message/message.interface';

@Injectable()
export class RoomService {
  private logger: Logger = new Logger('RoomService');
  private rooms: Room[] = []

  constructor(
    private userService: UserService
  ) { }

  get(id: uuid): Room {
    this.logger.log('get');

    return this.rooms.find(room => room.id === id);
  }

  findAll(): Room[] {
    this.logger.log('findAll');

    return this.rooms;
  }

  create(data: { name: string, owner: uuid }): Room {
    this.logger.log('create');

    const room: Room = {
      id: uuid(),
      name: data.name,
      members: [this.userService.get(data.owner)],
      messages: [],
    };

    this.rooms.push(room);

    return room;
  }

  join(data: { name: string, userId: uuid }): Room {
    this.logger.log('join');

    const user = this.userService.get(data.userId);
    const room = this.rooms.find(room => room.name === data.name);

    if (user && room) {
      room.members.push(user);
      return room;
    }

    return undefined;
  }

  leave(data: { userId: uuid, roomId: uuid }): boolean {
    this.logger.log('leave');

    try {
      const room = this.get(data.roomId);
      const roomIndex = this.rooms.findIndex(room => room.id === data.roomId);
      const userIndex = room.members.findIndex(user => user.id === data.userId);

      this.rooms[roomIndex].members.splice(userIndex, 1);

      if (this.rooms[roomIndex].members.length === 0) {
        this.rooms.splice(roomIndex, 1);
      }
    } catch (err) {
      this.logger.error(err);
      return false;
    }

    return true;
  }

  delete(name: string): boolean {
    this.logger.log('delete');

    const index = this.rooms.findIndex((r) => r.name === name);
    if (index !== -1) {
      this.rooms.splice(index, 1);
      return true;
    }

    return false;
  }

  addMessage(data: any): Message {
    this.logger.log(`addMessage (${data.roomId} ${data.userId})`);

    const user = this.userService.get(data.userId);
    const room = this.get(data.roomId);

    const message = {
      id: uuid(),
      authorId: data.userId,
      content: data.message.data.text,
    };

    if (user && room) {
      room.messages.push(message);
    }

    return message;
  }
}
