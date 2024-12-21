import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const { client, mongoServer, mongoUri } = await testDatabase();
const server = await testServer({
  application: { mongodbUrl: mongoUri },
  plugins: ["@indiekit/endpoint-json-feed"],
});
const request = supertest.agent(server);

describe("endpoint-json-feed GET /feed.json", () => {
  it("Returns JSON Feed", async () => {
    const result = await request.get("/feed.json");

    assert.equal(result.status, 200);
    assert.equal(result.type, "application/feed+json");
    assert.equal(result.body.title, "Test configuration");
    assert.deepEqual(result.body.items, []);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
