import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PollModule} from './poll/poll.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/nest'),
        PollModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
