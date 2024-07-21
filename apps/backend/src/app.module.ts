import {AuthModule} from '@mean-stream/nestx/auth';
import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {environment} from './environment';
import {ImprintModule} from './imprint/imprint.module';
import {MailModule} from './mail/mail.module';
import {PollModule} from './poll/poll.module';
import {PushModule} from './push/push.module';
import {StatisticsModule} from './statistics/statistics.module';
import {TokenModule} from './token/token.module';
import {OptionalAuthGuard} from './auth/optional-auth.guard';

@Module({
  imports: [
    MongooseModule.forRoot(environment.mongo.uri),
    AuthModule.forRoot(environment.auth),
    PollModule,
    TokenModule,
    StatisticsModule,
    MailModule,
    PushModule,
    ImprintModule,
  ],
  providers: [OptionalAuthGuard],
})
export class AppModule {
}
