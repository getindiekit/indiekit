import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const { client, mongoServer, mongoUri } = await testDatabase();
const server = await testServer({
  application: { mongodbUrl: mongoUri },
});
const request = supertest.agent(server);

// Cursor pagination returns 40 posts by default; the oldest post here is
// the 41st most recent, so it never appears in a `?q=source` listing
const { insertedIds } = await client
  .db("indiekit")
  .collection("posts")
  .insertMany(
    Array.from({ length: 41 }, (_, index) => ({
      path: `post-${index}.md`,
      properties: {
        name: `Post ${index}`,
        "post-status": "published",
        "post-type": "note",
        published: new Date(2020, 0, 1 + index).toISOString(),
        url: `https://website.example/post-${index}`,
      },
    })),
  );
const oldestUid = insertedIds[0].toString();

describe("endpoint-posts GET /posts/:uid", () => {
  it("Returns post that is not among the 40 most recent", async () => {
    const response = await request
      .get(`/posts/${oldestUid}`)
      .set("cookie", testCookie());
    const dom = new JSDOM(response.text);
    const result = dom.window.document.querySelector("title").textContent;

    assert.equal(response.status, 200);
    assert.equal(result, "Post 0 - Test configuration");
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
