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

describe("endpoint-microsub GET /microsub?action=channels", () => {
  before(async () => {
    for (const name of ["Tech News", "Photos"]) {
      await request
        .post("/microsub")
        .type("form")
        .set("cookie", cookie)
        .send({ action: "channels", name });
    }
  });

  it("Returns the list of channels", async () => {
    const response = await request
      .get("/microsub?action=channels")
      .set("cookie", cookie);

    assert.equal(response.status, 200);
    assert.deepEqual(
      response.body.channels.map((channel) => channel.name),
      ["Tech News", "Photos"],
    );
  });

  it("Reports channels with no items as read", async () => {
    const response = await request
      .get("/microsub?action=channels")
      .set("cookie", cookie);

    assert.equal(response.body.channels[0].unread, false);
  });

  it("Returns a UID for each channel", async () => {
    const response = await request
      .get("/microsub?action=channels")
      .set("cookie", cookie);

    for (const channel of response.body.channels) {
      assert.match(channel.uid, /^[a-z0-9]{24}$/);
    }
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
