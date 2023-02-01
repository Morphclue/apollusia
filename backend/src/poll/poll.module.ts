import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {MailModule} from '../mail/mail.module';
import {PushModule} from '../push/push.module';
import {Participant, ParticipantSchema, Poll, PollEvent, PollEventSchema, PollSchema} from '../schema';
import {PollController} from './poll/poll.controller';
import {PollService} from './poll/poll.service';

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
