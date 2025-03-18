import {PollLog, PollLogSchema} from '@apollusia/types';
import {forwardRef, Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {PollLogController} from './poll-log.controller';
import {PollLogService} from './poll-log.service';
import {PollModule} from '../poll/poll.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: PollLog.name, schema: PollLogSchema},
    ]),
    forwardRef(() => PollModule),
  ],
  providers: [PollLogService],
  exports: [PollLogService],
  controllers: [PollLogController],
})
export class PollLogModule {
}
