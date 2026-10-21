import {MongoMemoryServer} from 'mongodb-memory-server';

export default async function globalSetup() {
  const instance = await MongoMemoryServer.create();
  process.env.MONGO_URI = instance.getUri();

  return async () => {
    await instance.stop();
  };
}
