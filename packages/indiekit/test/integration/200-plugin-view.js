import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /plugins/endpoint-micropub", () => {
  it("Returns installed plug-in detail page", async () => {
    const response = await request
      .get("/plugins/@indiekit-endpoint-micropub")
      .auth(testToken(), { type: "bearer" });
    const { document } = new JSDOM(response.text).window;
    const $title = document.querySelector("title");

    assert.ok($title, "title element not found");
    assert.equal($title.textContent, "Micropub endpoint - Test configuration");
  });

  after(() => server.close());
});
