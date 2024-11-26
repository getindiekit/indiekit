import { getMongodbClient } from "@indiekit/indiekit/lib/mongodb.js";
import { MongoMemoryServer } from "mongodb-memory-server";

export const testDatabase = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  const { client } = await getMongodbClient(mongoUri);
  const database = await client.db();

  return { client, database, mongoServer, mongoUri };
};
