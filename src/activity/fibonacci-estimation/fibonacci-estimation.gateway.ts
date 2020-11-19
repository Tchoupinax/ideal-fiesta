import { SubscribeMessage, MessageBody, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ActivityService } from '../activity.service';
import { ActivityType } from '../activity';
import { FibonacciEstimationChoice } from './fibonacci-estimation';
import { v4 as uuid } from 'uuid';

@WebSocketGateway()
export class FibonacciEstimationGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('FibonacciEstimationGateway');

  constructor(
    private activityService: ActivityService,
  ) {
    this.activityService.create('test', ActivityType.FIBONACCI_ESTIMATION);
  }

  @SubscribeMessage('fibonacci-estimation-list-choices')
  listChoices(): FibonacciEstimationChoice[] {
    this.logger.log('list-choices');

    const ac = this.activityService.get(ActivityType.FIBONACCI_ESTIMATION);

    return ac.list();
  }

  @SubscribeMessage('fibonacci-estimation-lock-choice')
  lockChoice(@MessageBody() data: { userId: uuid, score: number }): boolean {
    this.logger.log(`lock-choice (${data.userId})`);

    const ac = this.activityService.get(ActivityType.FIBONACCI_ESTIMATION);
    ac.lockChoice(data);

    this.server.emit('fibonacci-estimation-lock-choice', data);

    return true;
  }

  @SubscribeMessage('fibonacci-estimation-unlock-choice')
  unlockChoice(@MessageBody() data: { userId: uuid }): boolean {
    this.logger.log(`unlock-choice (${data.userId})`);

    const ac = this.activityService.get(ActivityType.FIBONACCI_ESTIMATION);
    ac.unlockChoice(data);

    this.server.emit('fibonacci-estimation-unlock-choice', data);

    return true;
  }

  @SubscribeMessage('fibonacci-estimation-show-results')
  showResults(): boolean {
    this.logger.log(`show-results`);

    this.server.emit('fibonacci-estimation-show-results');

    return false;
  }

  @SubscribeMessage('fibonacci-estimation-reset')
  reset(): boolean {
    this.logger.log(`show-results`);

    const ac = this.activityService.get(ActivityType.FIBONACCI_ESTIMATION);
    ac.reset();

    this.server.emit('fibonacci-estimation-reset');

    return true;
  }
}
