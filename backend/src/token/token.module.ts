import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {TokenService} from './token/token.service';
import {TokenController} from './token/token.controller';
import {Poll, PollSchema} from '../schema';

@Module({
    imports: [MongooseModule.forFeature([
        {name: Poll.name, schema: PollSchema},
    ])],
    providers: [TokenService],
    controllers: [TokenController],
})
export class TokenModule {
}
