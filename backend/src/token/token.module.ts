import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {Poll, PollSchema} from '../schema';
import {TokenController} from './token/token.controller';
import {TokenService} from './token/token.service';

@Module({
    imports: [MongooseModule.forFeature([
        {name: Poll.name, schema: PollSchema},
    ])],
    providers: [TokenService],
    controllers: [TokenController],
})
export class TokenModule {
}
