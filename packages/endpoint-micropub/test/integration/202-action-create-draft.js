import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

await mockAgent("endpoint-micropub");
const { client, mongoServer, mongoUri } = await testDatabase();
const server = await testServer({
  application: { mongodbUrl: mongoUri },
});
const request = supertest.agent(server);

describe("endpoint-micropub POST /micropub", () => {
  it("Creates draft post (JSON)", async () => {
    const result = await request
      .post("/micropub")
      .auth(testToken({ scope: "draft" }), { type: "bearer" })
      .send({
        type: ["h-entry"],
        properties: {
          name: ["Foobar"],
          category: ["test1", "test2"],
        },
      });

    assert.equal(result.status, 202);
    assert.match(result.headers.location, /\bfoobar\b/);
    assert.match(result.body.success_description, /\bPost will be created\b/);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
