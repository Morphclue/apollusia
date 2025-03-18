import {PollLog, PollLogSchema} from '@apollusia/types';
import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {PollLogController} from './poll-log.controller';
import {PollLogService} from './poll-log.service';
import {PollModule} from '../poll/poll.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: PollLog.name, schema: PollLogSchema},
    ]),
    PollModule,
  ],
  providers: [PollLogService],
  exports: [PollLogService],
  controllers: [PollLogController],
})
export class PollLogModule {
}
