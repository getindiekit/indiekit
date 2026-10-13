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
    const { document } = new JSDOM(response.text).window;
    const $title = document.querySelector("title");
    const $passwordError = document.querySelector(
      "#password-error .error-message__text",
    );

    assert.equal(response.status, 422);
    assert.ok($title, "title element not found");
    assert.equal(
      $title.textContent,
      "Error: New password - Test configuration",
    );
    assert.ok($passwordError, "#password-error element not found");
    assert.equal($passwordError.textContent, "Enter a password");
  });

  after(() => server.close());
});
