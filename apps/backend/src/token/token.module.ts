import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {Participant, ParticipantSchema, Poll, PollSchema} from '@apollusia/types';
import {TokenController} from './token/token.controller';
import {TokenService} from './token/token.service';

@Module({
    imports: [MongooseModule.forFeature([
        {name: Poll.name, schema: PollSchema},
        {name: Participant.name, schema: ParticipantSchema},
    ])],
    providers: [TokenService],
    controllers: [TokenController],
})
export class TokenModule {
}
