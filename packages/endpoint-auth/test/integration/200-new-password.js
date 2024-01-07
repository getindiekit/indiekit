import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth GET /auth/new-password", () => {
  it("Returns new password page", async () => {
    const response = await request.get("/auth/new-password");
    const dom = new JSDOM(response.text);
    const result = dom.window.document;

    assert.equal(
      result.querySelector("title").textContent,
      "New password - Test configuration",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
