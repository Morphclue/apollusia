import {MongooseModule} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';

import {MailModule} from '../../mail/mail.module';
import {Participant, ParticipantSchema, Poll, PollEvent, PollEventSchema, PollSchema} from '../../schema';
import {rootMongooseTestModule} from '../../utils/mongo-util';
import {PollController} from './poll.controller';
import {PollService} from './poll.service';

describe('PollController', () => {
    let controller: PollController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    {name: Poll.name, schema: PollSchema},
                    {name: PollEvent.name, schema: PollEventSchema},
                    {name: Participant.name, schema: ParticipantSchema},
                ]),
                MailModule,
            ],
            controllers: [PollController],
            providers: [PollService],
        }).compile();

        controller = module.get<PollController>(PollController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
