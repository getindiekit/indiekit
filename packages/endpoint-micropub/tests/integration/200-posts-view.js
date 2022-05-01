import process from "node:process";
import test from "ava";
import nock from "nock";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

test("Views previously uploaded file", async (t) => {
  nock("https://api.github.com")
    .put((uri) => uri.includes("foobar.md"))
    .reply(200);

  // Create post
  const request = await testServer();
  await request
    .post("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("Accept", "application/json")
    .send("h=entry")
    .send("name=Foobar");

  // Get post data by parsing list of posts and getting values from link
  const postsResponse = await request.get("/micropub/posts");
  const postsDom = new JSDOM(postsResponse.text);
  const postLink = postsDom.window.document.querySelector(".file-list a");
  const postName = postLink.textContent;
  const postId = postLink.href.split("/").pop();

  // Visit post page
  const postResponse = await request.get(`/micropub/posts/${postId}`);
  const postDom = new JSDOM(postResponse.text);

  const result = postDom.window.document;

  t.is(
    result.querySelector("title").textContent,
    `${postName} - Test configuration`
  );
});
