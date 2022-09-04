import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {PollService} from './poll/poll.service';
import {PollController} from './poll/poll.controller';
import {Poll, PollSchema} from '../schema/poll.schema';
import {Participant, ParticipantSchema} from '../schema/participant.schema';
import {PollEvent, PollEventSchema} from '../schema/poll-event.schema';

@Module({
    imports: [MongooseModule.forFeature([
        {name: Poll.name, schema: PollSchema},
        {name: PollEvent.name, schema: PollEventSchema},
        {name: Participant.name, schema: ParticipantSchema},
    ])],
    providers: [PollService],
    controllers: [PollController],
})
export class PollModule {
}
