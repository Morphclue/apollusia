import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {Poll, PollSchema} from './schema/poll.schema';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.DB_URL),
        MongooseModule.forFeature([{name: Poll.name, schema: PollSchema}]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
