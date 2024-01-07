import { strict as assert } from "node:assert";
import { after, describe, it, mock } from "node:test";
import { MongoMemoryServer } from "mongodb-memory-server";
import { getMongodbClient } from "../../lib/mongodb.js";

const mongod = await MongoMemoryServer.create();
const mongodbUrl = mongod.getUri();

describe("indiekit/lib/mongodb", () => {
  after(() => {
    mongod.stop();
  });

  it("Connects to MongoDB database", async () => {
    const result = await getMongodbClient(mongodbUrl);

    assert.equal(result.s.namespace.db, "admin");
  });

  it("Returns false if can’t connect to a MongoDB database", async () => {
    mock.method(console, "warn", () => {});

    await getMongodbClient("https://foo.bar");
    const result = console.warn.mock.calls[0].arguments[0];

    assert.equal(
      result,
      `Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"`,
    );
  });
});
