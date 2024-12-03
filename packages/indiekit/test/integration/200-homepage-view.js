import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /", () => {
  it("Homepage redirects to status page", async () => {
    const response = await request
      .get("/")
      .auth(testToken(), { type: "bearer" });
    const dom = new JSDOM(response.text);
    const result = dom.window.document;

    assert.equal(
      result.querySelector("title").textContent,
      "Welcome! - Test configuration",
    );
  });

  after(() => server.close());
});
