import { SubscribeMessage, MessageBody, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { RoomService } from './room.service';
import { Room } from './room.interface';
import { UserService } from '../user/user.service';

@WebSocketGateway()
export class RoomGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('RoomGateway');

  constructor(
    private roomService: RoomService,
    private userService: UserService
  ) { }

  @SubscribeMessage('get-room')
  find(@MessageBody() id: uuid): Room {
    this.logger.log(`get-room`);

    const room = this.roomService.get(id);

    return room;
  }

  @SubscribeMessage('get-all-rooms')
  findAll(): Room[] {
    this.logger.log(`get-all-rooms`);

    return this.roomService.findAll();
  }

  @SubscribeMessage('create-room')
  createRoom(@MessageBody() data: any): uuid {
    this.logger.log(`create-room (${data.name})`);

    const { name, userId } = data;
    const room: Room = this.roomService.create({ name, owner: userId });

    // Update list of rooms for who are listening to
    this.server.emit('get-all-rooms', this.roomService.findAll());

    return room;
  }

  @SubscribeMessage('join-room')
  joinRoom(@MessageBody() data: any): Room {
    this.logger.log(`join-room (${data.name})`);

    const { name, userId } = data;

    const room = this.roomService.join({ name, userId });
    const user = this.userService.get(userId);

    const answer = {
      roomId: room.id,
      user: user,
    };

    this.server.emit('people-joined', answer);
    return room;
  }


  @SubscribeMessage('leave-room')
  leaveRoom(@MessageBody() data: any): boolean {
    this.logger.log(`leave-room`);

    const { roomId, userId } = data;

    this.roomService.leave({ roomId, userId });

    this.server.emit('people-left', data);
    return true;
  }

  @SubscribeMessage('delete-room')
  deleteRoom(@MessageBody() roomName: string): boolean {
    this.logger.log(`delete-room (${roomName})`);

    const deleteAnswer = this.roomService.delete(roomName);

    if (deleteAnswer) {
      // Update list of rooms for who are listening to
      this.server.emit('get-all-rooms', this.roomService.findAll());
    }

    return deleteAnswer;
  }
}
