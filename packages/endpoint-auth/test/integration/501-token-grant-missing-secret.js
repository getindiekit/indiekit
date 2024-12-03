import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth GET /auth", () => {
  it("Returns 501 error granting token missing secret", async () => {
    process.env.SECRET = "";

    const result = await request
      .post("/auth/token")
      .set("accept", "application/json")
      .query({ client_id: "https://client.example" })
      .query({ code: "123456" })
      .query({ code_verifier: "abcdef" })
      .query({ grant_type: "authorization_code" })
      .query({ redirect_uri: "/" });

    assert.equal(result.status, 501);
    assert.equal(result.body.error, "not_implemented");
    assert.equal(result.body.error_description, "Missing `SECRET`");
  });

  after(() => server.close());
});
