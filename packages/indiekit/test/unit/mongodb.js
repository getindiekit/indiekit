import { strict as assert } from "node:assert";
import { after, describe, it, mock } from "node:test";

import { MongoMemoryServer } from "mongodb-memory-server";

import { getMongodbClient } from "../../lib/mongodb.js";

const mongod = await MongoMemoryServer.create();

describe("indiekit/lib/mongodb", () => {
  after(() => {
    mongod.stop();
  });

  it("Connects to MongoDB database", async () => {
    const mongodbUrl = mongod.getUri();
    const result = await getMongodbClient(mongodbUrl);

    assert.equal(result.client.s.url, mongodbUrl);

    result.client.close();
  });

  it("Returns error if can’t create a MongoDB client", async () => {
    mock.method(console, "error", () => {});

    await getMongodbClient("https://foo.bar");
    const result = console.error.mock.calls[0].arguments[0];

    assert.equal(
      result,
      `Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"`,
    );
  });

  it("Returns error if can’t connect to MongoDB client", async () => {
    mock.method(console, "error", () => {});

    await getMongodbClient("mongodb://foo:bar@localhost");
    const result = console.error.mock.calls[0].arguments[0];

    assert.equal(result, `Authentication failed.`);
  });
});
