import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {environment} from './environment';
import {PollModule} from './poll/poll.module';
import {TokenModule} from './token/token.module';
import {StatisticsModule} from './statistics/statistics.module';
import { MailModule } from './mail/mail.module';

@Module({
    imports: [
        MongooseModule.forRoot(environment.mongo.uri),
        PollModule,
        TokenModule,
        StatisticsModule,
        MailModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
