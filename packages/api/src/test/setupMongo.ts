import { MongoMemoryServer } from 'mongodb-memory-server';

import { connect, disconnect, connection } from 'src/db';

let mongoServer: MongoMemoryServer;

before(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  await connect(mongoUri);
});

afterEach(done => {
  connection.db.dropDatabase(done);
});

after(async () => {
  await disconnect();
  mongoServer.stop();
});
