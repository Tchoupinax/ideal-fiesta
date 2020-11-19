import { v4 as uuid } from 'uuid';

export enum ActivityType {
  FIBONACCI_ESTIMATION = 'FIBONACCI_ESTIMATION',
}

export abstract class Activity  {
  private id: uuid;
  private name: string;
  private type: ActivityType;

  constructor(name: string, type: ActivityType) {
    this.id = uuid();
    this.name = name;
    this.type = type;
  }

  getType() {
    return this.type;
  }

  abstract lockChoice(data: any): boolean; 
  abstract unlockChoice(userId: uuid): boolean;
  abstract list(): any;
  abstract reset(): void;
} 
