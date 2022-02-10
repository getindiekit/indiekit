import test from "ava";
import "dotenv/config.js"; // eslint-disable-line import/no-unassigned-import
import { MongoMemoryServer } from "mongodb-memory-server";
import { getMongodbConfig } from "../../lib/mongodb.js";

test.beforeEach(async (t) => {
  const mongod = await MongoMemoryServer.create();
  const mongodbUrl = mongod.getUri();

  t.context = {
    url: mongodbUrl,
  };
});

test("Connects to MongoDB database", async (t) => {
  const result = await getMongodbConfig(t.context.url);

  t.is(result.s.namespace.db, "indiekit");
});

test("Returns false if can’t connect to a MongoDB database", async (t) => {
  const result = await getMongodbConfig("https://foo.bar");

  t.false(result);
});
