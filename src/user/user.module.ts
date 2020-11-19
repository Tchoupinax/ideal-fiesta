import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserGateway } from './user.gateway';

@Module({
  providers: [UserGateway, UserService],
  exports: [UserService],
})
export class UserModule {}
