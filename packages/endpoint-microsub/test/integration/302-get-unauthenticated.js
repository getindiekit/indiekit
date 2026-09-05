import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const { client, mongoServer, mongoUri } = await testDatabase();
const server = await testServer({
  application: { mongodbUrl: mongoUri },
  plugins: ["@indiekit/endpoint-microsub"],
});
const request = supertest.agent(server);

describe("endpoint-microsub GET /microsub", () => {
  it("Redirects to sign-in when unauthenticated", async () => {
    const response = await request.get("/microsub?action=channels");

    assert.equal(response.status, 302);
  });

  it("Redirects unauthenticated timeline requests", async () => {
    const response = await request.get("/microsub?action=timeline&channel=abc");

    assert.equal(response.status, 302);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
