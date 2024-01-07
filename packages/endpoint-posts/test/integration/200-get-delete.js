import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-micropub");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-posts GET /posts/:uid/delete", () => {
  before(async () => {
    await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .send("h=entry")
      .send("name=Foobar");
  });

  it("Gets delete confirmation page", async () => {
    // Get post data by parsing list of posts and getting values from link
    const postsResponse = await request.get("/posts");
    const postsDom = new JSDOM(postsResponse.text);
    const postLink = postsDom.window.document.querySelector(".card a");
    const postId = postLink.href.split("/").pop();

    // Confirm deletion page
    const response = await request.get(`/posts/${postId}/delete`);
    const dom = new JSDOM(response.text);
    const result = dom.window.document.querySelector("title").textContent;

    assert.equal(
      result,
      "Are you sure you want to delete this post? - Test configuration",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
