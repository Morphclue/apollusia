import {MongooseModule} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';

import {Poll, PollSchema} from '../../schema';
import {closeMongoConnection, rootMongooseTestModule} from '../../utils/mongo-util';
import {TokenService} from './token.service';

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

    it('should generate a token', async () => {
        const token = await service.generateToken();
        expect(token).toBeDefined();
    });

    it('should regenerate a token', async () => {
        const token = await service.generateToken();
        const newToken = await service.regenerateToken(token.token);
        expect(newToken).toBeDefined();
    });

    afterAll(async () => {
        await closeMongoConnection();
    });
});
