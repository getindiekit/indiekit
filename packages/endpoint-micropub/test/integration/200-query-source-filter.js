import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

await mockAgent("endpoint-micropub");
const { client, mongoServer, mongoUri } = await testDatabase();
const server = await testServer({
  application: { mongodbUrl: mongoUri },
});
const request = supertest.agent(server);

const query = (parameters) =>
  request
    .get("/micropub")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .query({ q: "source", ...parameters });

describe("endpoint-micropub GET /micropub?q=source&filter=*&category=*", () => {
  before(async () => {
    // Two notes with content and one with a name only; the test
    // configuration has no article post type, so no post may carry both
    for (const post of [
      "h=entry&name=Cheese+sandwich&category=food",
      "h=entry&content=Bicycle+ride+at+dawn&category=cycling",
      "h=entry&content=Building+for+the+web&category=food",
    ]) {
      const created = await request
        .post("/micropub")
        .auth(testToken(), { type: "bearer" })
        .set("accept", "application/json")
        .send(post);
      assert.ok(created.status < 300, `seed failed: ${created.text}`);
    }
  });

  it("Filters posts by text in the name or content", async () => {
    const byName = await query({ filter: "cheese" });
    const byContent = await query({ filter: "WEB" });

    assert.equal(byName.body.items.length, 1);
    assert.equal(byName.body.items[0].properties.name[0], "Cheese sandwich");
    assert.equal(byContent.body.items.length, 1);
    assert.match(
      JSON.stringify(byContent.body.items[0].properties.content),
      /web/,
    );
  });

  it("Filters posts by category", async () => {
    const result = await query({ category: "food" });

    assert.equal(result.body.items.length, 2);
  });

  it("Combines filters and keeps paging", async () => {
    const page = await query({ category: "food", limit: 1 });
    const next = await query({
      category: "food",
      limit: 1,
      after: page.body.paging.after,
    });

    assert.equal(page.body.items.length, 1);
    assert.equal(next.body.items.length, 1);
    assert.notEqual(
      page.body.items[0].properties.url[0],
      next.body.items[0].properties.url[0],
    );
    assert.equal(next.body.paging.after, undefined);
  });

  it("Returns nothing when no post matches", async () => {
    const result = await query({ filter: "sandwich", category: "cycling" });

    assert.deepEqual(result.body.items, []);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
