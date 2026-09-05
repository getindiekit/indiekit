import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { mockAgent } from "@indiekit-test/mock-agent";
import { postData } from "@indiekit-test/post-data";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
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
  it("Redirects to post page if no delete permissions", async () => {
    const result = await request
      .get(`/posts/${uid}/delete`)
      .set("cookie", testCookie({ scope: "create" }));

    assert.equal(result.status, 302);
    assert.match(result.text, /Found. Redirecting to \/posts\/(.*)/);
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
