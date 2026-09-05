import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

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

const uids = {};

describe("endpoint-microsub POST /microsub?action=channels (order)", () => {
  before(async () => {
    for (const name of ["First", "Second", "Third"]) {
      const response = await request
        .post("/microsub")
        .type("form")
        .set("cookie", cookie)
        .send({ action: "channels", name });

      uids[name] = response.body.uid;
    }
  });

  it("Reorders channels", async () => {
    const response = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({
        action: "channels",
        method: "order",
        "channels[0]": uids.Third,
        "channels[1]": uids.First,
        "channels[2]": uids.Second,
      });

    assert.equal(response.status, 200);
    assert.deepEqual(
      response.body.channels.map((channel) => channel.name),
      ["Third", "First", "Second"],
    );
  });

  it("Persists the new order", async () => {
    const response = await request
      .get("/microsub?action=channels")
      .set("cookie", cookie);

    assert.deepEqual(
      response.body.channels.map((channel) => channel.name),
      ["Third", "First", "Second"],
    );
  });

  it("Returns 400 when no channels are given", async () => {
    const response = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({ action: "channels", method: "order" });

    assert.equal(response.status, 400);
    assert.match(response.text, /Missing channels\[\] parameter/);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
