import {INestApplication} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import * as request from 'supertest';

import {AppController} from '../src/app.controller';
import {AppService} from '../src/app.service';
import {closeMongoConnection, rootMongooseTestModule} from '../src/utils/mongo-util';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
            ],
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!');
    });

    afterAll(async () => {
        await closeMongoConnection();
    });
});
