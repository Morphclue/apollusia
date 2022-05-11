import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {Poll, PollSchema} from './schema/poll.schema';
import { PollModule } from './poll/poll.module';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.DB_URL),
        MongooseModule.forFeature([{name: Poll.name, schema: PollSchema}]),
        PollModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
