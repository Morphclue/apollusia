import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PollModule} from './poll/poll.module';
import {TokenModule} from './token/token.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/nest'),
        PollModule,
        TokenModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
