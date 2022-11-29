import {Test, TestingModule} from '@nestjs/testing';
import {closeMongoConnection, rootMongooseTestModule} from '../../utils/mongo-util';
import {TokenController} from './token.controller';
import {TokenModule} from '../token.module';

describe('TokenController', () => {
    let controller: TokenController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                TokenModule,
            ],
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
