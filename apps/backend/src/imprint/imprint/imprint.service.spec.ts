import {Test, TestingModule} from '@nestjs/testing';

import {ImprintService} from './imprint.service';
import {closeMongoConnection, rootMongooseTestModule} from '../../utils/mongo-util';
import {ImprintModule} from '../imprint.module';

describe('ImprintService', () => {
  let service: ImprintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
          rootMongooseTestModule(),
          ImprintModule
      ]
    }).compile();

    service = module.get<ImprintService>(ImprintService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });
});
