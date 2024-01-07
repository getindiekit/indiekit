import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-posts GET /posts/new", () => {
  it("Returns create new post page", async () => {
    const response = await request
      .get("/posts/new")
      .set("cookie", testCookie());
    const dom = new JSDOM(response.text);
    const result = dom.window.document.querySelector("title").textContent;

    assert.equal(
      result,
      "What type of post do you want to create? - Test configuration",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
