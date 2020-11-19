import { Module } from '@nestjs/common';

import { ActivityService } from './activity.service';
import { FibonacciEstimationGateway } from './fibonacci-estimation/fibonacci-estimation.gateway';

@Module({
  providers: [FibonacciEstimationGateway, ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
