import { strict as assert } from "node:assert";
import { after, beforeEach, describe, it } from "node:test";

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
const items = database.collection("microsub_items");

const fixture = {};

describe("endpoint-microsub POST /microsub?action=timeline", () => {
  beforeEach(async () => {
    await items.deleteMany({});

    const created = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({ action: "channels", name: "Tech News" });

    fixture.channelUid = created.body.uid;

    const channel = await database
      .collection("microsub_channels")
      .findOne({ uid: fixture.channelUid });

    await items.insertMany(
      Array.from({ length: 3 }, (_, index) => ({
        channelId: channel._id,
        type: "entry",
        uid: `item-${index}`,
        url: `https://website.example/${index}`,
        published: new Date(Date.UTC(2026, 0, index + 1)),
        readBy: [],
      })),
    );
  });

  it("Marks entries as read", async () => {
    const response = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({
        action: "timeline",
        method: "mark_read",
        channel: fixture.channelUid,
        "entry[0]": "item-0",
        "entry[1]": "item-1",
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.result, "ok");
    assert.equal(response.body.updated, 2);
  });

  it("Reflects read state in the timeline", async () => {
    await request.post("/microsub").type("form").set("cookie", cookie).send({
      action: "timeline",
      method: "mark_read",
      channel: fixture.channelUid,
      entry: "item-2",
    });

    const response = await request
      .get(`/microsub?action=timeline&channel=${fixture.channelUid}`)
      .set("cookie", cookie);
    const item = response.body.items.find((index) => index.uid === "item-2");

    assert.equal(item._is_read, true);
  });

  it("Marks entries as unread", async () => {
    await request.post("/microsub").type("form").set("cookie", cookie).send({
      action: "timeline",
      method: "mark_read",
      channel: fixture.channelUid,
      entry: "item-0",
    });

    const response = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({
        action: "timeline",
        method: "mark_unread",
        channel: fixture.channelUid,
        entry: "item-0",
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.updated, 1);
  });

  it("Removes entries", async () => {
    const response = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({
        action: "timeline",
        method: "remove",
        channel: fixture.channelUid,
        entry: "item-0",
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.removed, 1);
    assert.equal(await items.countDocuments({ uid: "item-0" }), 0);
  });

  it("Returns 400 for an unknown method", async () => {
    const response = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({
        action: "timeline",
        method: "bogus",
        channel: fixture.channelUid,
        entry: "item-0",
      });

    assert.equal(response.status, 400);
    assert.match(response.text, /Invalid timeline method/);
  });

  it("Returns 404 for an unknown channel", async () => {
    const response = await request
      .post("/microsub")
      .type("form")
      .set("cookie", cookie)
      .send({
        action: "timeline",
        method: "mark_read",
        channel: "nonexistent",
        entry: "item-0",
      });

    assert.equal(response.status, 404);
    assert.match(response.text, /Channel not found/);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
