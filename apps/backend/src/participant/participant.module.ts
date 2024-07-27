import {Participant, ParticipantSchema} from '@apollusia/types';
import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {ParticipantController} from './participant.controller';
import {ParticipantService} from './participant.service';
import {MailModule} from '../mail/mail.module';
import {PushModule} from '../push/push.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Participant.name, schema: ParticipantSchema},
    ]),
    MailModule,
    PushModule,
  ],
  providers: [ParticipantService],
  exports: [ParticipantService],
  controllers: [ParticipantController],
})
export class ParticipantModule {
}
