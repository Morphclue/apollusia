import {Participant, ParticipantSchema, Poll, PollEvent, PollEventSchema, PollSchema} from '@apollusia/types';
import {forwardRef, Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';


import {PollActionsService} from './poll-actions.service';
import {PollController} from './poll.controller';
import {PollService} from './poll.service';
import {KeycloakModule} from '../auth/keycloak.module';
import {MailModule} from '../mail/mail.module';
import {ParticipantModule} from '../participant/participant.module';
import {PollEventModule} from '../poll-event/poll-event.module';
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
    forwardRef(() => PollEventModule),
    forwardRef(() => ParticipantModule),
    forwardRef(() => PollLogModule),
  ],
  providers: [PollService, PollActionsService],
  exports: [PollService, PollActionsService],
  controllers: [PollController],
})
export class PollModule {
}
