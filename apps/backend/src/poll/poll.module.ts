import {Participant, ParticipantSchema, Poll, PollEvent, PollEventSchema, PollSchema} from '@apollusia/types';
import {forwardRef, Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {PollActionsService} from './poll-actions.service';
import {PollController} from './poll.controller';
import {KeycloakModule} from '../auth/keycloak.module';
import {MailModule} from '../mail/mail.module';
import {PollLogModule} from '../poll-log/poll-log.module';
import {PushModule} from '../push/push.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Poll.name, schema: PollSchema},
      {name: PollEvent.name, schema: PollEventSchema},
      {name: Participant.name, schema: ParticipantSchema},
    ]),
    MailModule,
    PushModule,
    KeycloakModule,
    forwardRef(() => PollLogModule),
  ],
  providers: [PollActionsService],
  exports: [PollActionsService],
  controllers: [PollController],
})
export class PollModule {
}
