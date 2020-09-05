import mongodb from 'mongodb';

export const mongodbConfig = async mongodbUrl => {
  if (mongodbUrl) {
    const {MongoClient} = mongodb;
    const client = new MongoClient(mongodbUrl, {
      useUnifiedTopology: true
    });
    await client.connect();
    const database = client.db('indiekit');
    return database;
  }
};
