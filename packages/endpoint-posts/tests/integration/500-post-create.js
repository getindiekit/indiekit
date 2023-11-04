import test from "ava";
import { JSDOM } from "jsdom";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

await mockAgent("endpoint-micropub");

test("Returns 500 error creating post", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .post("/posts/create")
    .type("form")
    .set("cookie", [testCookie()])
    .send({ type: "entry" })
    .send({ content: "Foobar" })
    .send({ published: "2023-08-28T12:30" })
    .send({ slug: "401" });
  const dom = new JSDOM(response.text);
  const result = dom.window.document.querySelector(
    `notification-banner[type="error"] p`,
  ).textContent;

  t.is(response.status, 500);
  t.regex(result, /\bTest store: Unauthorized\b/g);

  server.close(t);
});
