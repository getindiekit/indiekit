import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { JSDOM } from "jsdom";
import supertest from "supertest";

await mockAgent("endpoint-auth");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth POST /auth/token", () => {
  let reference;

  before(async () => {
    const response = await request
      .get("/auth")
      .query({ client_id: "https://auth-endpoint.example" })
      .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
      .query({ response_type: "code" })
      .query({ state: "12345" });
    reference = response.headers.location.split(":").at(-1);
  });

  it("Returns 422 error missing password", async () => {
    const response = await request
      .post("/auth/consent")
      .type("form")
      .query({ request_uri: `urn:ietf:params:oauth:request_uri:${reference}` })
      .send({ password: "foo" });
    const { document } = new JSDOM(response.text).window;
    const $title = document.querySelector("title");
    const $passwordError = document.querySelector(
      "#password-error .error-message__text",
    );

    assert.equal(response.status, 422);
    assert.ok($title, "title element not found");
    assert.equal($title.textContent, "Error: Sign in - Test configuration");
    assert.ok($passwordError, "#password-error  element not found");
    assert.equal($passwordError.textContent, "Enter a valid password");
  });

  after(() => server.close());
});
