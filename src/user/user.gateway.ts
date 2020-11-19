import { SubscribeMessage, MessageBody, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.interface';

@WebSocketGateway()
export class UserGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('UserGateway');

  constructor(
    private userService: UserService
  ) {}

  @SubscribeMessage('register')
  register(@MessageBody() nickname: string): User {
    this.logger.log(`register (${nickname})`);

    const user: User = this.userService.create(nickname);

    return user;
  }
}
