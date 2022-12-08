import test from "ava";
import { JSDOM } from "jsdom";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

await mockAgent("store");

test("Returns 500 error uploading file", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .post("/posts/new")
    .type("form")
    .set("cookie", [cookie()])
    .send({ content: "Foobar" })
    .send({ slug: "401" });
  const dom = new JSDOM(response.text);
  const result = dom.window.document.querySelector(
    ".notification--error p"
  ).textContent;

  t.is(response.status, 500);
  t.is(result, "Test store: Unauthorized");

  server.close(t);
});
