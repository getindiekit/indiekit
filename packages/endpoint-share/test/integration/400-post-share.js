import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-share POST /share", () => {
  it("Returns 400 error publishing post", async () => {
    const response = await request
      .post("/share")
      .auth(testToken(), { type: "bearer" })
      .send("name=Foobar")
      .send("content=Test+of+sharing+a+bookmark")
      .send("bookmark-of=https://example.website");
    const dom = new JSDOM(response.text);
    const result = dom.window.document;

    assert.equal(response.status, 400);
    assert.match(
      result.querySelector(`notification-banner[type="error"] p`).textContent,
      /\bNo bearer token provided by request\b/g,
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
