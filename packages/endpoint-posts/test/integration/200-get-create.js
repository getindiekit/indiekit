import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-posts GET /posts/create", () => {
  it("Returns create new post page", async () => {
    const response = await request
      .get("/posts/create")
      .set("cookie", testCookie())
      .query({ type: "note" });
    const { document } = new JSDOM(response.text).window;
    const $title = document.querySelector("title");

    assert.ok($title, "title element not found");
    assert.equal(
      $title.textContent,
      "Create a new custom note post type post - Test configuration",
    );
  });

  after(() => server.close());
});
