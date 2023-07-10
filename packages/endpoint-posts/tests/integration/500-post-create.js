import test from "ava";
import { JSDOM } from "jsdom";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

await mockAgent("endpoint-micropub");

test("Returns 500 error creating post", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .post("/posts/create")
    .type("form")
    .set("cookie", [cookie()])
    .send({ type: "entry" })
    .send({ content: "Foobar" })
    .send({ slug: "401" });
  const dom = new JSDOM(response.text);
  const result = dom.window.document.querySelector(
    ".notification--error p"
  ).textContent;

  t.is(response.status, 500);
  t.regex(result, /\bTest store: Unauthorized\b/g);

  server.close(t);
});
