import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import supertest from "supertest";

const { client, mongoServer, mongoUri } = await testDatabase();
const server = await testServer({
  application: { mongodbUrl: mongoUri },
  plugins: ["@indiekit/endpoint-microsub"],
});
const request = supertest.agent(server);

describe("endpoint-microsub GET /microsub", () => {
  it("Returns endpoint information when no action given", async () => {
    const response = await request.get("/microsub").set("cookie", testCookie());

    assert.equal(response.status, 200);
    assert.equal(response.body.type, "microsub");
    assert.deepEqual(response.body.actions, ["channels", "timeline"]);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
