import { SubscribeMessage, MessageBody, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { RoomService } from 'src/room/room.service';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessageGateway');

  constructor(
    private roomService: RoomService
  ) {}

  @SubscribeMessage('send-message')
  find(@MessageBody() data: any): boolean {
    this.logger.log(`get-room`);

    const message = this.roomService.addMessage(data);

    this.server.emit('broadcast-message', message);

    return true;
  }
}
