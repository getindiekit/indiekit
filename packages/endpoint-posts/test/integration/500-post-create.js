import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import { JSDOM } from "jsdom";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

await mockAgent("endpoint-micropub");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-posts POST /posts/create", () => {
  it("Returns 500 error creating post", async () => {
    const response = await request
      .post("/posts/create")
      .type("form")
      .set("cookie", testCookie())
      .send({ type: "entry" })
      .send({ content: "Foobar" })
      .send({ published: "2023-08-28T12:30" })
      .send({ slug: "401" });
    const dom = new JSDOM(response.text);
    const result = dom.window.document.querySelector(
      `notification-banner[type="error"] p`,
    ).textContent;

    assert.equal(response.status, 500);
    assert.match(result, /\bTest store: Unauthorized\b/g);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
