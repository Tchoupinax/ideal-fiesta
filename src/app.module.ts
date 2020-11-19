import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule} from '@nestjs/serve-static';
import { join } from 'path';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { ActivityModule } from './activity/activity.module';
import { MessageGateway } from './message/message.gateway';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist'),
    }),
    RoomModule,
    UserModule,
    ActivityModule,
  ],
 controllers: [AppController],
 providers: [AppService, MessageGateway],
})
export class AppModule {}