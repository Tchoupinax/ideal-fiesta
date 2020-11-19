import { Test, TestingModule } from '@nestjs/testing';
import { FibonacciEstimationGateway } from './fibonacci-estimation.gateway';

describe('MessageGateway', () => {
  let gateway: FibonacciEstimationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FibonacciEstimationGateway],
    }).compile();

    gateway = module.get<FibonacciEstimationGateway>(FibonacciEstimationGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
