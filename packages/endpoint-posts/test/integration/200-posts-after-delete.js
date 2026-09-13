import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

// `mockAgent("endpoint-micropub")` only fakes the content store (so `create`
// and `delete` don't need a real Git/file host) and otherwise leaves
// loopback net connect enabled. `/posts` fetches from the real, self-hosted
// Micropub endpoint over that loopback HTTP call, and that's the hop that
// has to reproduce the bug — mocking the Micropub response would just
// describe what we already believe, not prove it.
await mockAgent("endpoint-micropub");
const { client, mongoServer, mongoUri } = await testDatabase();
const server = await testServer({
  application: { mongodbUrl: mongoUri },
});
const request = supertest.agent(server);

describe("endpoint-posts GET /posts (after deleting a post)", () => {
  before(async () => {
    const created = await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .send({
        type: ["h-entry"],
        properties: {
          name: ["Foobar"],
          category: ["test1", "test2"],
        },
      });

    await request.post("/micropub").auth(testToken(), { type: "bearer" }).send({
      action: "delete",
      url: created.header.location,
    });
  });

  it("Still lists posts once one of them has been deleted", async () => {
    const result = await request.get("/posts");

    assert.equal(result.status, 200);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
