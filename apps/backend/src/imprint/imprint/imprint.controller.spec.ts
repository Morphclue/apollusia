import {Test, TestingModule} from '@nestjs/testing';

import {ImprintController} from './imprint.controller';
import {closeMongoConnection, rootMongooseTestModule} from '../../utils/mongo-util';
import {ImprintModule} from '../imprint.module';

describe('ImprintController', () => {
  let controller: ImprintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
          ImprintModule
      ]
    }).compile();

    controller = module.get<ImprintController>(ImprintController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });
});
