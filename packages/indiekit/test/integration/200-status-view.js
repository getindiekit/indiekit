import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /status", () => {
  it("Returns status page", async () => {
    const response = await request
      .get("/status")
      .auth(testToken(), { type: "bearer" });
    const dom = new JSDOM(response.text);
    const result = dom.window.document;

    assert.equal(
      result.querySelector("title").textContent,
      "Server status - Test configuration",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
