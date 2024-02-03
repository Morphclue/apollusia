import {MongooseModule, MongooseModuleOptions} from '@nestjs/mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {disconnect} from 'mongoose';

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
  await disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
