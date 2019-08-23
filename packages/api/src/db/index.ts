import db from 'mongoose';

db.Promise = global.Promise;

export async function connect(dbURI: string) {
  const reconnectTries = 30;
  const reconnectInterval = 500;
  const connectTimeoutMS = 1000;
  let error;
  for (let i = 0; i < reconnectTries; i++) {
    try {
      return await db.connect(dbURI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        reconnectTries,
        reconnectInterval,
        connectTimeoutMS,
      });
    } catch (err) {
      await new Promise(resolve => setTimeout(() => resolve(), reconnectInterval));
      error = err;
    }
  }
  throw error;
}

export async function disconnect() {
  await db.disconnect();
}

export const connection = db.connection;
