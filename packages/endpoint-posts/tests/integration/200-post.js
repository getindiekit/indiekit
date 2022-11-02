import process from "node:process";
import test from "ava";
import { JSDOM } from "jsdom";
import supertest from "supertest";
import { setGlobalDispatcher } from "undici";
import { storeAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

setGlobalDispatcher(storeAgent());

test("Returns previously published post", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  await request
    .post("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .send("h=entry")
    .send("name=Foobar");

  // Get post data by parsing list of posts and getting values from link
  const postsResponse = await request.get("/posts");
  const postsDom = new JSDOM(postsResponse.text);
  const postLink = postsDom.window.document.querySelector(".file-list a");
  const postName = postLink.textContent;
  const postId = postLink.href.split("/").pop();

  // Visit post page
  const postResponse = await request.get(`/posts/${postId}`);
  const postDom = new JSDOM(postResponse.text);
  const result = postDom.window.document;

  t.is(
    result.querySelector("title").textContent,
    `${postName} - Test configuration`
  );

  server.close(t);
});
