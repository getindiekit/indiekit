import mongodb from 'mongodb';

export const mongodbConfig = (async () => {
  const {MongoClient} = mongodb;
  const client = new MongoClient(process.env.MONGODB_URL, {
    useUnifiedTopology: true
  });
  await client.connect();
  const database = client.db('indiekit');
  return database;
})();
