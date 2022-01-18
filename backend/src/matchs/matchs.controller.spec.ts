import { Test, TestingModule } from '@nestjs/testing';
import { MatchsController } from './matchs.controller';

describe('MatchsController', () => {
  let controller: MatchsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchsController],
    }).compile();

    controller = module.get<MatchsController>(MatchsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
