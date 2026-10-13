import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /plugins", () => {
  it("Returns installed plug-ins page", async () => {
    const response = await request
      .get("/plugins")
      .auth(testToken(), { type: "bearer" });
    const { document } = new JSDOM(response.text).window;
    const $title = document.querySelector("title");

    assert.ok($title, "title element not found");
    assert.equal($title.textContent, "Installed plug-ins - Test configuration");
  });

  after(() => server.close());
});
