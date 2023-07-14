import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

test("Returns create new post page", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .get("/posts/create")
    .set("cookie", [testCookie()])
    .query({ type: "note" });
  const dom = new JSDOM(response.text);
  const result = dom.window.document.querySelector("title").textContent;

  t.is(result, "Create a new custom note post type post - Test configuration");

  server.close(t);
});
