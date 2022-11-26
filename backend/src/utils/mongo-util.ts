import {MongoMemoryServer} from 'mongodb-memory-server';
import {MongooseModule, MongooseModuleOptions} from '@nestjs/mongoose';


let mongoMemoryServer: MongoMemoryServer;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) => MongooseModule.forRootAsync({
    useFactory: async () => {
        mongoMemoryServer = await MongoMemoryServer.create();
        const mongoUri = mongoMemoryServer.getUri();
        return {
            uri: mongoUri,
            ...options,
        };
    },
});

export const closeMongoConnection = async () => {
    if (mongoMemoryServer) await mongoMemoryServer.stop();
};
