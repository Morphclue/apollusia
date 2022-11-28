import {MongooseModule} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';

import {Poll, PollSchema} from '../../schema';
import {closeMongoConnection, rootMongooseTestModule} from '../../utils/mongo-util';
import {TokenService} from './token.service';
import {Model} from 'mongoose';
import {PollStub} from '../../../test/stubs/PollStub';

describe('TokenService', () => {
    let service: TokenService;
    let pollModel: Model<Poll>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([{name: Poll.name, schema: PollSchema}]),
            ],
            providers: [TokenService],
        }).compile();

        pollModel = module.get('PollModel');
        service = module.get<TokenService>(TokenService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should generate a token', async () => {
        const token = await service.generateToken();
        expect(token).toBeDefined();
    });

    it('should regenerate a token', async () => {
        const token = await service.generateToken();
        const newToken = await service.regenerateToken(token.token);
        expect(newToken).toBeDefined();
    });

    it('should regenerate a token for a poll', async () => {
        const pollStub = PollStub();
        await (new pollModel(pollStub)).save();
        const newToken = await service.regenerateToken(pollStub.adminToken);
        const newPoll = await pollModel.findOne({adminToken: newToken.token}).exec();
        expect(newPoll).toBeDefined();
        expect(newPoll.adminToken).not.toEqual(pollStub.adminToken);
    });

    afterAll(async () => {
        await closeMongoConnection();
    });
});
