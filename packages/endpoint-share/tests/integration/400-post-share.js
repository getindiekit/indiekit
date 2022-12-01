import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

test("Returns 400 error publishing post", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .post("/share")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .send("name=Foobar")
    .send("content=Test+of+sharing+a+bookmark")
    .send("bookmark-of=https://example.website");
  const dom = new JSDOM(response.text);
  const result = dom.window.document;

  t.is(response.status, 400);
  t.is(
    result.querySelector(".notification--error p").textContent,
    "No bearer token provided by request"
  );

  server.close(t);
});
