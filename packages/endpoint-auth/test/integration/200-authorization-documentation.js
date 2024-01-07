import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth GET /auth", () => {
  it("Returns service documentation if no authorization query", async () => {
    const response = await request.get("/auth");
    const dom = new JSDOM(response.text);
    const result = dom.window.document.querySelector("title").textContent;

    assert.equal(result, "Using this IndieAuth endpoint - Test configuration");
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
