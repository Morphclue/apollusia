import {Participant, ParticipantSchema, Poll, PollEvent, PollEventSchema, PollSchema} from '@apollusia/types';
import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {PollController} from './poll.controller';
import {PollService} from './poll.service';
import {MailModule} from '../mail/mail.module';
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
    ],
    providers: [PollService],
    controllers: [PollController],
})
export class PollModule {
}
