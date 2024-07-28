import {PollEvent, PollEventSchema} from '@apollusia/types';
import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {PollEventController} from './poll-event.controller';
import {PollEventService} from './poll-event.service';
import {MailModule} from '../mail/mail.module';
import {PollModule} from '../poll/poll.module';
import {PushModule} from '../push/push.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: PollEvent.name, schema: PollEventSchema},
    ]),
    MailModule,
    PushModule,
    PollModule,
  ],
  providers: [PollEventService],
  exports: [PollEventService],
  controllers: [PollEventController],
})
export class PollEventModule {
}
