import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {PollService} from './poll/poll.service';
import {PollController} from './poll/poll.controller';
import {Participant, ParticipantSchema, Poll, PollEvent, PollEventSchema, PollSchema} from '../schema';
import {MailModule} from '../mail/mail.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Poll.name, schema: PollSchema},
            {name: PollEvent.name, schema: PollEventSchema},
            {name: Participant.name, schema: ParticipantSchema},
        ]),
        MailModule,
    ],
    providers: [PollService],
    controllers: [PollController],
})
export class PollModule {
}
