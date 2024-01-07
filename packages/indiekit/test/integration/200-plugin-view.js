import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /plugins/endpoint-micropub", () => {
  it("Returns installed plug-in detail page", async () => {
    const response = await request
      .get("/plugins/endpoint-micropub")
      .auth(testToken(), { type: "bearer" });
    const dom = new JSDOM(response.text);
    const result = dom.window.document;

    assert.equal(
      result.querySelector("title").textContent,
      "Micropub endpoint - Test configuration",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
