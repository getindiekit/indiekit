import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { mockAgent } from "@indiekit-test/mock-agent";
import { postData } from "@indiekit-test/post-data";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

await mockAgent("endpoint-posts");
const { client, mongoServer, mongoUri } = await testDatabase();
const server = await testServer({
  application: {
    micropubEndpoint: "https://micropub-endpoint.example",
    mongodbUrl: mongoUri,
  },
});
const request = supertest.agent(server);

const { insertedId } = await client
  .db("indiekit")
  .collection("posts")
  .insertOne({
    ...postData,
    properties: { ...postData.properties, url: "https://website.example/401" },
  });
const uid = insertedId.toString();

describe("endpoint-posts POST /posts/:uid/delete", () => {
  it("Returns 401 error deleting post", async () => {
    const response = await request
      .post(`/posts/${uid}/delete`)
      .set("cookie", testCookie())
      .send({ url: "https://website.example/401" });
    const dom = new JSDOM(response.text);
    const result = dom.window.document.querySelector(
      `notification-banner[type="error"] p`,
    ).textContent;

    assert.equal(response.status, 401);
    assert.match(result, /Unauthorized/);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
