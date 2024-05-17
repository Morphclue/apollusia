import {PushConfigDto} from '@apollusia/types';
import {NotFound} from '@mean-stream/nestx';
import {Controller, Get} from '@nestjs/common';

import {PushService} from './push.service';

@Controller('push')
export class PushController {
  constructor(
    private pushService: PushService,
  ) {
  }

  @Get('config')
  @NotFound()
  getConfig(): PushConfigDto | undefined {
    return this.pushService.config;
  }
}
