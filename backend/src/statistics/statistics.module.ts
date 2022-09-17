import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {Participant, ParticipantSchema, Poll, PollEvent, PollEventSchema, PollSchema} from '../schema';
import {StatisticsService} from './statistics/statistics.service';
import {StatisticsController} from './statistics/statistics.controller';

@Module({
    imports: [MongooseModule.forFeature([
        {name: Poll.name, schema: PollSchema},
        {name: PollEvent.name, schema: PollEventSchema},
        {name: Participant.name, schema: ParticipantSchema},
    ])],
    providers: [StatisticsService],
    controllers: [StatisticsController],
})
export class StatisticsModule {
}
