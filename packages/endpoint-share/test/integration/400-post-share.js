import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import { JSDOM } from "jsdom";
import supertest from "supertest";

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
    const { document } = new JSDOM(response.text).window;
    const $p = document.querySelector(`notification-banner[type="error"] p`);

    assert.equal(response.status, 400);
    assert.ok($p, "p element not found");
    assert.match($p.textContent, /\bNo bearer token provided by request\b/g);
  });

  after(() => server.close());
});
