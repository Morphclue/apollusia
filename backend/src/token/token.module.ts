import {Module} from '@nestjs/common';

import {TokenService} from './token/token.service';
import {TokenController} from './token/token.controller';

@Module({
    providers: [TokenService],
    controllers: [TokenController],
})
export class TokenModule {
}
