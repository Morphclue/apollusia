import {Test, TestingModule} from '@nestjs/testing';
import {beforeEach, describe, expect, it} from 'vitest';

import {MailService} from './mail.service';
import {MailModule} from '../mail.module';

describe(MailService.name, () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailModule],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
