import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";
import { JSDOM } from "jsdom";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-micropub");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-posts GET /posts/:uid", () => {
  before(async () => {
    await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .send("h=entry")
      .send("name=Foobar");
  });

  it("Returns published post", async () => {
    // Get post data by parsing list of posts and getting values from link
    const postsResponse = await request.get("/posts");
    const postsDom = new JSDOM(postsResponse.text);
    const postLink = postsDom.window.document.querySelector(".card a");
    const postName = postLink.textContent;
    const postId = postLink.href.split("/").pop();

    // Visit post page
    const postResponse = await request.get(`/posts/${postId}`);
    const postDom = new JSDOM(postResponse.text);
    const result = postDom.window.document;

    assert.equal(
      result.querySelector("title").textContent,
      `${postName} - Test configuration`,
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
