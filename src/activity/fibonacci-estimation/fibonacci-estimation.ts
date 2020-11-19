import { Activity, ActivityType } from '../activity';
import { v4 as uuid } from 'uuid';

export interface FibonacciEstimationChoice {
  score: number;
  userId: uuid;
}

export class FibonacciEstimation extends Activity {
  private choices: FibonacciEstimationChoice[] = [];

  constructor(name: string) {
    super(name, ActivityType.FIBONACCI_ESTIMATION);
  }

  list(): FibonacciEstimationChoice[] {
    return this.choices;
  }

  lockChoice({ userId, score }: { userId: uuid, score: number }): boolean {
    this.choices.push({
      userId,
      score,
    });

    return true;
  }

  unlockChoice(userId: uuid): boolean {
    const index = this.choices.findIndex(choice => choice.userId === userId);

    this.choices.splice(index, 1);

    return true;
  }

  reset(): void {
    this.choices = [];
  }
} 
