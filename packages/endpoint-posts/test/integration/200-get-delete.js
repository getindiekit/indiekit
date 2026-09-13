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
    properties: {
      ...postData.properties,
      name: "Foobar",
      url: "https://website.example/foobar",
    },
  });
const uid = insertedId.toString();

describe("endpoint-posts GET /posts/:uid/delete", () => {
  it("Gets delete confirmation page", async () => {
    const response = await request
      .get(`/posts/${uid}/delete`)
      .set("cookie", testCookie());
    const dom = new JSDOM(response.text);
    const result = dom.window.document.querySelector("title").textContent;

    assert.equal(
      result,
      "Are you sure you want to delete this post? - Test configuration",
    );
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
