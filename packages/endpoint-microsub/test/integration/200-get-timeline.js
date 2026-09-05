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

// Indiekit uses ‘indiekit’ as its default database, not ‘test’
const database = client.db("indiekit");

const fixture = {};

describe("endpoint-microsub GET /microsub?action=timeline", () => {
  before(async () => {
    const created = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({ action: "channels", name: "Tech News" });

    fixture.channelUid = created.body.uid;

    const channel = await database
      .collection("microsub_channels")
      .findOne({ uid: fixture.channelUid });

    await database.collection("microsub_items").insertMany(
      Array.from({ length: 3 }, (_, index) => ({
        channelId: channel._id,
        type: "entry",
        uid: `item-${index}`,
        url: `https://website.example/${index}`,
        name: `Item ${index}`,
        published: new Date(Date.UTC(2026, 0, index + 1)),
        readBy: [],
      })),
    );
  });

  it("Returns timeline items newest first", async () => {
    const response = await request
      .get(`/microsub?action=timeline&channel=${fixture.channelUid}`)
      .set("cookie", cookie);

    assert.equal(response.status, 200);
    assert.deepEqual(
      response.body.items.map((item) => item.name),
      ["Item 2", "Item 1", "Item 0"],
    );
  });

  it("Returns items in jf2 format", async () => {
    const response = await request
      .get(`/microsub?action=timeline&channel=${fixture.channelUid}`)
      .set("cookie", cookie);
    const [item] = response.body.items;

    assert.equal(item.type, "entry");
    assert.equal(item.url, "https://website.example/2");
    assert.equal(item._is_read, false);
  });

  it("Applies the limit parameter and returns paging cursors", async () => {
    const response = await request
      .get(`/microsub?action=timeline&channel=${fixture.channelUid}&limit=2`)
      .set("cookie", cookie);

    assert.equal(response.body.items.length, 2);
    assert.ok(response.body.paging.after);
  });

  it("Returns 400 when channel is missing", async () => {
    const response = await request
      .get("/microsub?action=timeline")
      .set("cookie", cookie);

    assert.equal(response.status, 400);
    assert.match(response.text, /Missing required parameter: channel/);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
