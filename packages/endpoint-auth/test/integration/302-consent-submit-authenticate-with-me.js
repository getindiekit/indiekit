import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { createPasswordHash } from "../../lib/password.js";

await mockAgent("endpoint-auth");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth POST /auth/consent", () => {
  let reference;

  before(async () => {
    process.env.PASSWORD_SECRET = await createPasswordHash("foo");
    const response = await request
      .get("/auth")
      .query({ client_id: "https://auth-endpoint.example" })
      .query({ me: "https://website.example" })
      .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
      .query({ response_type: "code" })
      .query({ state: "12345" });
    reference = response.headers.location.slice(-16);
  });

  it("Returns 302 submitting authenticated user", async () => {
    const result = await request
      .post("/auth/consent")
      .type("form")
      .query({ request_uri: `urn:ietf:params:oauth:request_uri:${reference}` })
      .send({ password: "foo" });

    assert.equal(result.status, 302);
    assert.match(
      result.headers.location,
      /code=(.*)&iss=(.*)&state=(.*)&me=(.*)/,
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
