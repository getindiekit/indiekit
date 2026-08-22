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

/**
 * Create a channel via the Microsub API
 * @param {string} name - Channel name
 * @returns {Promise<string>} Created channel UID
 */
async function createChannel(name) {
  const response = await request
    .post("/microsub")
    .type("form")
    .set("cookie", cookie)
    .send({ action: "channels", name });

  return response.body.uid;
}

describe("endpoint-microsub POST /microsub?action=channels (update)", () => {
  it("Renames a channel", async () => {
    const uid = await createChannel("Old name");

    const response = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({ action: "channels", uid, name: "New name" });

    assert.equal(response.status, 200);
    assert.equal(response.body.uid, uid);
    assert.equal(response.body.name, "New name");
  });

  it("Persists the new name", async () => {
    const uid = await createChannel("Before");

    await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({ action: "channels", uid, name: "After" });

    const response = await request
      .get("/microsub?action=channels")
      .set("cookie", cookie);
    const channel = response.body.channels.find((c) => c.uid === uid);

    assert.equal(channel.name, "After");
  });

  it("Returns 404 for an unknown channel", async () => {
    const response = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({ action: "channels", uid: "nonexistent", name: "New name" });

    assert.equal(response.status, 404);
    assert.match(response.text, /Channel not found/);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
