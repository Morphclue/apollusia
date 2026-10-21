import {MongoMemoryServer} from 'mongodb-memory-server';

export default async function globalSetup() {
  const instance = await MongoMemoryServer.create();
  process.env.MONGO_URI = instance.getUri();
  process.env.KEYCLOAK_CLIENT_SECRET ||= 'test-client-secret';
  process.env.AUTH_PUBLIC_KEY ||= 'test-public-key';

  return async () => {
    await instance.stop();
  };
}
