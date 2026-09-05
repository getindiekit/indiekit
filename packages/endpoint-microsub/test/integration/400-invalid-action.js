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
const cookie = testCookie();

describe("endpoint-microsub invalid action", () => {
  it("Returns 400 for an unsupported GET action", async () => {
    const response = await request
      .get("/microsub?action=bogus")
      .set("cookie", cookie);

    assert.equal(response.status, 400);
    assert.match(response.text, /Invalid action/);
  });

  it("Returns 400 for an unsupported POST action", async () => {
    const response = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({ action: "bogus" });

    assert.equal(response.status, 400);
    assert.match(response.text, /Invalid action/);
  });

  it("Returns 400 when POST has no action", async () => {
    const response = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({ name: "Tech News" });

    assert.equal(response.status, 400);
    assert.match(response.text, /Missing required parameter: action/);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
