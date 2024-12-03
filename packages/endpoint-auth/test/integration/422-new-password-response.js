import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { JSDOM } from "jsdom";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth POST /auth/consent", () => {
  it("Returns 422 error missing new password", async () => {
    const response = await request.post("/auth/new-password");
    const dom = new JSDOM(response.text);
    const result = dom.window.document;

    assert.equal(response.status, 422);
    assert.equal(
      result.querySelector("title").textContent,
      "Error: New password - Test configuration",
    );
    assert.equal(
      result.querySelector("#password-error .error-message__text").textContent,
      "Enter a password",
    );
  });

  after(() => server.close());
});
