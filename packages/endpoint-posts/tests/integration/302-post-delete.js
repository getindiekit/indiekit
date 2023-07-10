import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-micropub");

test("Deletes post and redirects to posts page", async (t) => {
  // Create post
  const server = await testServer();
  const request = supertest.agent(server);
  await request
    .post("/micropub")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .send("h=entry")
    .send("name=Foobar");

  // Get post data by parsing list of posts and getting values from link
  const postsResponse = await request.get("/posts");
  const postsDom = new JSDOM(postsResponse.text);
  const postLink = postsDom.window.document.querySelector(".card a");
  const postId = postLink.href.split("/").pop();

  // Delete post
  const result = await request.post(`/posts/${postId}/delete`);

  t.is(result.status, 302);
  t.regex(result.text, /Found. Redirecting to \/posts\?success/);

  server.close(t);
});
