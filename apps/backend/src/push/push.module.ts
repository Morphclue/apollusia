import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import {PushController} from './push.controller';
import {PushService} from './push.service';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [PushService],
  controllers: [PushController],
  exports: [PushService],
})
export class PushModule {
}
