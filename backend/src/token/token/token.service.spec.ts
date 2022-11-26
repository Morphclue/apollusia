import {Test, TestingModule} from '@nestjs/testing';
import {MongooseModule} from '@nestjs/mongoose';

import {TokenService} from './token.service';
import {closeMongoConnection, rootMongooseTestModule} from '../../utils/mongo-util';
import {Poll, PollSchema} from '../../schema';

describe('TokenService', () => {
    let service: TokenService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([{name: Poll.name, schema: PollSchema}]),
            ],
            providers: [TokenService],
        }).compile();

        service = module.get<TokenService>(TokenService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    afterAll(async () => {
        await closeMongoConnection();
    });
});
