import {MongooseModule} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';

import {Poll, PollSchema} from '../../schema';
import {closeMongoConnection, rootMongooseTestModule} from '../../utils/mongo-util';
import {TokenController} from './token.controller';
import {TokenService} from './token.service';

describe('TokenController', () => {
    let controller: TokenController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([{name: Poll.name, schema: PollSchema}]),
            ],
            controllers: [TokenController],
            providers: [TokenService],
        }).compile();

        controller = module.get<TokenController>(TokenController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    afterAll(async () => {
        await closeMongoConnection();
    });
});
