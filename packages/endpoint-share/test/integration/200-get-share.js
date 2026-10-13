import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-share GET /share", () => {
  it("Returns share page", async () => {
    const response = await request.get("/share").set("cookie", testCookie());
    const { document } = new JSDOM(response.text).window;
    const $title = document.querySelector("title");

    assert.ok($title, "title element not found");
    assert.equal($title.textContent, "Share - Test configuration");
  });

  after(() => server.close());
});
