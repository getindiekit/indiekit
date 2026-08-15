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

describe("endpoint-microsub POST /microsub?action=channels", () => {
  it("Creates a channel", async () => {
    const response = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({ action: "channels", name: "Tech News" });

    assert.equal(response.status, 201);
    assert.equal(response.body.name, "Tech News");
    assert.match(response.body.uid, /^[a-z0-9]{24}$/);
  });

  it("Returns the created channel in the channel list", async () => {
    const created = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({ action: "channels", name: "Photos" });

    const response = await request
      .get("/microsub?action=channels")
      .set("cookie", cookie);
    const uids = response.body.channels.map((channel) => channel.uid);

    assert.ok(uids.includes(created.body.uid));
  });

  it("Returns 400 when name is missing", async () => {
    const response = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({ action: "channels" });

    assert.equal(response.status, 400);
    assert.match(response.text, /Missing required parameter: name/);
  });

  it("Returns 400 when name exceeds 100 characters", async () => {
    const response = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({ action: "channels", name: "a".repeat(101) });

    assert.equal(response.status, 400);
    assert.match(response.text, /100 characters or less/);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
