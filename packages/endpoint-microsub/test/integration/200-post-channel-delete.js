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

describe("endpoint-microsub POST /microsub?action=channels (delete)", () => {
  it("Deletes a channel", async () => {
    const uid = await createChannel("Doomed");

    const response = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({ action: "channels", method: "delete", uid });

    assert.equal(response.status, 200);
    assert.equal(response.body.deleted, uid);
  });

  it("Removes the channel from the channel list", async () => {
    const uid = await createChannel("Doomed too");

    await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({ action: "channels", method: "delete", uid });

    const response = await request
      .get("/microsub?action=channels")
      .set("cookie", cookie);
    const uids = response.body.channels.map((channel) => channel.uid);

    assert.equal(uids.includes(uid), false);
  });

  it("Returns 404 for an unknown channel", async () => {
    const response = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({ action: "channels", method: "delete", uid: "nonexistent" });

    assert.equal(response.status, 404);
    assert.match(response.text, /Channel not found or cannot be deleted/);
  });

  it("Refuses to delete the notifications channel", async () => {
    const response = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({ action: "channels", method: "delete", uid: "notifications" });

    assert.equal(response.status, 404);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
