import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

import { signToken } from "../../lib/token.js";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth POST /auth/token", () => {
  // No authorization request precedes this exchange, so the code itself has to
  // carry everything needed to validate it. The response should describe the
  // problem, not fail with an unhandled error.
  it("Returns an error, not 500, with no preceding authorization request", async () => {
    const code = signToken({
      client_id: "https://client.example",
      me: "https://website.example",
      redirect_uri: "https://client.example/redirect",
      scope: "create",
    });
    const result = await request
      .post("/auth/token")
      .set("accept", "application/json")
      .query({ client_id: "https://other-client.example" })
      .query({ code })
      .query({ grant_type: "authorization_code" })
      .query({ redirect_uri: "https://other-client.example/redirect" });

    assert.notEqual(result.status, 500);
    assert.equal(result.body.error, "unauthorized");
  });

  after(() => server.close());
});
