import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {PollService} from './poll/poll.service';
import {PollController} from './poll/poll.controller';
import {Poll, PollSchema} from '../schema/poll.schema';

@Module({
    imports: [MongooseModule.forFeature([{name: Poll.name, schema: PollSchema}])],
    providers: [PollService],
    controllers: [PollController],
})
export class PollModule {
}
