import {MongoMemoryServer} from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

export = async function globalSetup() {
  // it's needed in global space, because we don't want to create a new instance every test-suite
  const instance = await MongoMemoryServer.create();
  (global as any).__MONGOINSTANCE = instance;
  process.env.MONGO_URI = instance.getUri();

  // The following is to make sure the database is clean before an test starts
  /*
  await mongoose.connect(process.env.MONGO_URI);
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
  */
};
