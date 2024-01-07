import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-posts GET /posts/create", () => {
  it("Returns create new post page", async () => {
    const response = await request
      .get("/posts/create")
      .set("cookie", testCookie())
      .query({ type: "note" });
    const dom = new JSDOM(response.text);
    const result = dom.window.document.querySelector("title").textContent;

    assert.equal(
      result,
      "Create a new custom note post type post - Test configuration",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
