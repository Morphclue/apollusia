import {MongooseModule} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';

import {MailModule} from '../../mail/mail.module';
import {Participant, ParticipantSchema, Poll, PollEvent, PollEventSchema, PollSchema} from '../../schema';
import {rootMongooseTestModule} from '../../utils/mongo-util';
import {PollService} from './poll.service';

describe('PollService', () => {
    let service: PollService;

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
            providers: [PollService],
        }).compile();

        service = module.get<PollService>(PollService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
