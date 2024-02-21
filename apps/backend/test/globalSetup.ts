import {MongoMemoryServer} from 'mongodb-memory-server';

export = async function globalSetup() {
  // it's needed in global space, because we don't want to create a new instance every test-suite
  const instance = await MongoMemoryServer.create();
  (global as any).__MONGOINSTANCE = instance;
  process.env.MONGO_URI = instance.getUri();
};
