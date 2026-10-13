import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth GET /auth", () => {
  it("Returns service documentation if no authorization query", async () => {
    const response = await request.get("/auth");
    const { document } = new JSDOM(response.text).window;
    const $title = document.querySelector("title");

    assert.ok($title, "title element not found");
    assert.equal(
      $title.textContent,
      "Using this IndieAuth endpoint - Test configuration",
    );
  });

  after(() => server.close());
});
