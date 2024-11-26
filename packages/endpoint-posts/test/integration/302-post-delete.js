import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import { JSDOM } from "jsdom";
import supertest from "supertest";

await mockAgent("endpoint-micropub");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-posts POST /posts/:uid/delete", () => {
  before(async () => {
    await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .send("h=entry")
      .send("name=Foobar");
  });

  it("Deletes post and redirects to posts page", async () => {
    // Get post data by parsing list of posts and getting values from link
    const postsResponse = await request.get("/posts");
    const postsDom = new JSDOM(postsResponse.text);
    const postLink = postsDom.window.document.querySelector(".card a");
    const postId = postLink.href.split("/").pop();

    // Delete post
    const result = await request.post(`/posts/${postId}/delete`);

    assert.equal(result.status, 302);
    assert.match(result.text, /Found. Redirecting to \/posts\?success/);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
