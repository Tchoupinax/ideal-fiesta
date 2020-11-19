import { Injectable, Logger } from '@nestjs/common';
import { Activity, ActivityType } from './activity';
import { FibonacciEstimation } from './fibonacci-estimation/fibonacci-estimation';

@Injectable()
export class ActivityService {
  private logger: Logger = new Logger('RoomService');
  private activites: Activity[] = []

  get(type: ActivityType): Activity {
    return this.activites.find(a => a.getType() === type);
  }

  create(name: string, type: ActivityType): Activity {
    let activity;

    switch (type) {
      case ActivityType.FIBONACCI_ESTIMATION:
        activity = new FibonacciEstimation(name);
        break;
    }
    
    this.activites.push(activity);

    return activity;
  }
}
